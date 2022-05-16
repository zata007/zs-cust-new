import { MapsAPILoader } from "@agm/core";
import {
  Component,
  ElementRef,
  NgZone,
  OnDestroy,
  OnInit,
  TemplateRef,
  ViewChild
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { MatBottomSheet, MatDialog } from "@angular/material";
import { Router } from "@angular/router";
import { Marker } from "src/app/shared/models/common-model";
import { CommonService } from "src/app/shared/services/common.service";
import { GeoLocationService } from "src/app/shared/services/geo-location.service";
import { DialogPreOrderComponent } from "src/app/shared/shared-components/dialog-pre-order/dialog-pre-order.component";
import { NotServicebleComponent } from "src/app/shared/shared-components/not-serviceble/not-serviceble.component";
import { DataService } from "../../shared/services/data.service";
import { CustomerStateService } from "../customer-state.service";
import { CustomerService } from "../customer.service";
import { MAP_STYLES } from "./map-consts";

@Component({
  selector: "app-map-vehicle",
  templateUrl: "./map-vehicle.component.html",
  styleUrls: ["./map-vehicle.component.scss"],
})
export class MapVehicleComponent implements OnInit, OnDestroy {
  @ViewChild("searchFrom", { static: false })
  public searchElementRefFrom: ElementRef;
  @ViewChild("searchTo", { static: false })
  public searchElementRefTo: ElementRef;
  @ViewChild("requestSubmit", { static: false })
  requestSubmit: TemplateRef<any>;
  // initial center position for the map
  public latitude = 19.125956;
  public longitude = 72.853532;
  selectedLabel = "A";
  selectedIndex = 0;

  canShowDirection = false;
  canShowPitstops = false;

  public searchControl: FormControl;
  public zoom: number;
  locationFetched: boolean;
  development: boolean = false;

  // TODO: Move this value to const file.
  mapStyles = MAP_STYLES;

  markers: Marker[] = [];
  isSubmitRequestVisible: boolean;
  polylines: Array<{
    color: string;
    path: Array<{ lat: number; lng: string }>;
    encodedString: string;
    zIndex: number;
  }> = [];
  bounds: google.maps.LatLngBounds = null;
  map: google.maps.Map;
  lng: number;
  lat: number;
  curLocResDataSubscription: any;

  constructor(
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private router: Router,
    private commonService: CommonService,
    public customerStateService: CustomerStateService,
    private customerService: CustomerService,
    private geoLocationService: GeoLocationService,
    public dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private dataService: DataService
  ) {}

  ngOnInit() {
    // Patch map data,
    this.customerStateService.locationSelectionCompleted$.subscribe(
      (hasCompleted) => {
        if (hasCompleted) {
          // TODO: DO work once location completed.
          this.bounds = new google.maps.LatLngBounds();
          const selectedLocation = this.customerStateService.selectedLocation;
          const from = new google.maps.LatLng(
            selectedLocation.from.lat,
            selectedLocation.from.lng
          );
          const to = new google.maps.LatLng(
            selectedLocation.to.lat,
            selectedLocation.to.lng
          );
          this.bounds.extend(from);
          this.bounds.extend(to);

          this.map.fitBounds(this.bounds, 160); // # auto-zoom
          this.map.panToBounds(this.bounds); // # auto-center
        }
      }
    );

    this.customerStateService.directionResults$.subscribe(
      (data: google.maps.DirectionsRoute[]) =>
        this.onDirectionResultUpdate(data)
    );

    this.customerStateService.pitstopOnEdge$.subscribe((i) => {
      if (!i.isLocationOnEdge) {
        // Pop from markers list
        const index = this.markers.findIndex((j) => j.id === i.pitstopId);
        if (index > -1) {
          this.markers.splice(index, 1);
          // TODO: Not servicable
          if (this.markers.length === 0) {
            this.canShowPitstops = false;
            this.bottomSheet.open(NotServicebleComponent, {
              data: {
                location: this.searchElementRefFrom.nativeElement.value,
                name: "food joint",
              },
            });
            return;
          }
        }
      }
    });
    this.customerStateService.setCurrentPage("main");
    // set google maps defaults
    this.zoom = 13;

    // create search FormControl
    this.searchControl = new FormControl();

    this.initMapAutocomplete();

    this.curLocResDataSubscription =
      this.customerStateService.currenLocationRestaurantData$.subscribe(
        (resData) => {
          this.markers = [];
          resData
            .filter((i) => i.blPitstops)
            .forEach((i, index) => {
              const cardLocation = {
                lat: i.businessLocationCoord[1],
                lng: i.businessLocationCoord[0],
              };
              this.markers.push(cardLocation);
            });
        }
      );
  }

  ngOnDestroy() {
    if(this.curLocResDataSubscription) this.curLocResDataSubscription.unsubscribe();
  }

  initMapAutocomplete() {
    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.bounds = new google.maps.LatLngBounds();
      const autocomplete = new google.maps.places.Autocomplete(
        this.searchElementRefFrom.nativeElement,
        {
          types: ["establishment"],
          componentRestrictions: { country: "ind" },
        }
      );

      autocomplete.addListener("place_changed", () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.customerService.setSelectedPlace(place, true);
          // set latitude, longitude and zoom

          this.latitude = place.geometry.location.lat();
          this.longitude = place.geometry.location.lng();
          const fromLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          this.map.setCenter(fromLocation);
          this.customerStateService.setFromLocation({ ...fromLocation }, true);
          this.customerService.setLocationData(this.latitude, this.longitude);
          const current = new google.maps.LatLng(this.latitude, this.longitude);
          // TODO: Refactor make generic implementation for finding places near stadium
          // const Wankhede = new google.maps.LatLng(18.938792, 72.825802);
          // if (this.calculateDistance(Wankhede, current) < 2000) {
          //   // TODO: handle stadium logic
          //   this.openDialog();
          // }

          this.onMapLocationChange();
        });
      });
      const autocompleteTo = new google.maps.places.Autocomplete(
        this.searchElementRefTo.nativeElement,
        {
          types: ["establishment"],
          componentRestrictions: { country: "ind" },
        }
      );

      autocompleteTo.addListener("place_changed", () => {
        this.ngZone.run(() => {
          // get the place result
          const place: google.maps.places.PlaceResult =
            autocompleteTo.getPlace();
          // verify result
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }

          this.customerService.setSelectedPlace(place, false);
          const toLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          this.customerStateService.setFromLocation({ ...toLocation }, false);
          this.onMapLocationChange();
        });
      });
    });
  }

  onDirectionResultUpdate(data: google.maps.DirectionsRoute[]) {
    this.customerStateService.setDirectionResults(data);
    this.polylines = this.customerStateService.getPolyLines(data);
    this.canShowDirection = true;
  }

  clickedMarker(label: string, index: number) {
    this.selectedLabel = label;
    this.selectedIndex = index;
  }

  onSlideChange(value: Marker) {
    this.selectedLabel = value.label;
  }

  onMapLocationChange() {
    this.canShowPitstops = false;
    this.canShowDirection = false;
    this.markers = [];
  }

  onRouteSelected(item: any) {
    // Get distance from pitstop
    this.commonService.setDataLoading(true);
    this.customerStateService.calculateDistance((val) => {
      // if more than 100km then not servicable;
      this.commonService.setDataLoading(false);

      if (val < 100000) {
        // TODO: get pitstops
        this.customerService
          .getPitstops({
            ...this.commonService.getRequestEssentialParams(),
            ...this.customerStateService.getLocationData(),
          })
          .subscribe((data: any) => {
            const pitstops: Array<any> = data.data;
            console.log(pitstops);

            // check if pitstop is on the edge.
            // TODO: Remove !
            if (pitstops.length === 0) {
              this.canShowPitstops = false;
              this.bottomSheet.open(NotServicebleComponent, {
                data: {
                  location: this.searchElementRefFrom.nativeElement.value,
                  name: "food joint",
                },
              });
              return;
            }

            this.markers = [];
            pitstops.forEach((i, index) => {
              const pitstopMarker: Marker = {
                lat: i.blPitStopLongLat.coordinates[1],
                lng: i.blPitStopLongLat.coordinates[0],
                pitstop: i.blPitstopName,
                landmark: i.blPitStopLandmark,
                label: index + "",
                id: i._id,
                image: i.blPitStopPic[0].thumbnail,
              };
              this.markers.push(pitstopMarker);
              this.customerStateService.isPitStopOnEdge(
                pitstopMarker.id,
                pitstopMarker.lat,
                pitstopMarker.lng
              );
            });
          });
        // Show pitstops
        this.canShowPitstops = true;
      } else {
        // Show not servicable
        this.canShowPitstops = false;
        // TODO: Show BottomSheet
        this.bottomSheet.open(NotServicebleComponent, {
          data: {
            location: this.searchElementRefFrom.nativeElement.value,
            name: "food joint",
          },
        });
      }
    });
  }

  GotoRoute() {
    this.customerStateService.setCurrentPage("jasj");
  }

  hasLocationData() {
    return !!this.customerStateService.hasLocationData();
  }

  gotoPitstop() {
    const pitStopData = this.markers[this.selectedIndex];
    if (!pitStopData) {
      return;
    }
    this.customerStateService.setCurrentPitstop(pitStopData);
    this.router.navigate(["customer/pitstop-landing"]);
  }

  onPolylineClick(polylineIndex: number) {
    this.polylines.forEach((i, index) => {
      i.color = "#ACACAC";
      i.zIndex = 0;
      if (index === polylineIndex) {
        this.polylines[index].color = "blue";
        this.polylines[index].zIndex = 999;
      }
    });

    // Set selected route to service.
    this.customerStateService.updateSelectedRoute(
      this.polylines[polylineIndex]
    );
  }

  mapReady(map: any) {
    this.map = map;
    this.customerStateService.initState();

    // Create the img to hold the control and call the CenterControl()
    const centerControl = this.CenterControl(map);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControl);
    const selectedLocation = this.customerStateService.selectedLocation;
    if (
      selectedLocation.from.lat ||
      this.customerStateService.hasLocationData()
    ) {
      this.lat = selectedLocation.from.lat;
      this.lng = selectedLocation.from.lng;
      this.getPlaceName(
        this.lat,
        this.lng,
        (result: google.maps.GeocoderResult) => {
          this.patchLocationToInput(
            { lat: this.lat, lng: this.lng },
            this.searchElementRefFrom,
            result
          );
        }
      );
      if (this.customerStateService.hasLocationData()) {
        this.getPlaceName(
          selectedLocation.to.lat,
          selectedLocation.to.lng,
          (result: google.maps.GeocoderResult) => {
            this.patchLocationToInput(
              { lat: selectedLocation.to.lat, lng: selectedLocation.to.lng },
              this.searchElementRefTo,
              result
            );
          }
        );
        this.onRouteSelected(null);
      }
    } else {
      const sub = this.geoLocationService.getPosition().subscribe((val) => {
        this.lat = val.coords.latitude;
        this.lng = val.coords.longitude;
        this.getPlaceName(
          val.coords.latitude,
          val.coords.longitude,
          (result: google.maps.GeocoderResult) => {
            this.patchLocationToInput(
              { lat: val.coords.latitude, lng: val.coords.longitude },
              this.searchElementRefFrom,
              result
            );
            sub.unsubscribe();
          }
        );
      });
    }
  }

  patchLocationToInput(
    currentCords: { lat: number; lng: number },
    inputToPatch: ElementRef<any>,
    result: google.maps.GeocoderResult
  ) {
    const bounds = new google.maps.LatLngBounds();
    const currentLocation = new google.maps.LatLng(
      currentCords.lat,
      currentCords.lng
    );
    bounds.extend(currentLocation);

    this.map.panToBounds(bounds); // # auto-center
    inputToPatch.nativeElement.value = result.formatted_address;
    const latlng = new google.maps.LatLng(currentCords.lat, currentCords.lng);
    // const Wankhede = new google.maps.LatLng(18.938792, 72.825802);
    // if (this.calculateDistance(Wankhede, latlng) < 2000) {
    //   // TODO: handle stadium logic
    //   this.openDialog();
    // }
  }

  /**
   * Get place name by lat and lng
   * @param lat
   * @param lng
   * @param callback returns result as place name
   */
  private getPlaceName(lat, lng, callback: Function) {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(lat, lng);
    const request = { location: latlng };
    geocoder.geocode(request, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        const result = results[0];
        const rsltAdrComponent = result.address_components;
        const resultLength = rsltAdrComponent.length;
        if (result != null) {
          callback(result);
          // this.address = rsltAdrComponent[resultLength - 8].short_name;
        } else {
          callback(result);
          alert("No address available!");
        }
      }
    });
  }

  /**
   * The CenterControl adds a control to the map that recenters the map on
   * Chicago.
   * This constructor takes the control DIV as an argument.
   *
   */
  CenterControl(map: google.maps.Map) {
    // Set CSS for the control border.
    const controlUI = document.createElement("img");
    controlUI.src = "assets/icons/location.svg";
    controlUI.width = 40;
    controlUI.style.cursor = "pointer";
    controlUI.style.marginBottom = "52px";
    controlUI.style.marginRight = "22px";
    controlUI.style.textAlign = "center";

    controlUI.title = "Click to recenter the map";

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener("click", () => {
      const currentLocation = new google.maps.LatLng(this.lat, this.lng);

      map.setCenter(currentLocation);
    });

    return controlUI;
  }

  onOnboardingCompletion() {
    this.searchElementRefFrom.nativeElement.focus();
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogPreOrderComponent, {
      data: null,
    });

    dialogRef.afterClosed().subscribe((result) => {
      // Navigate to page
      if (result) {
        this.router.navigate(["customer/delivery"]);
      }
      console.log("The dialog was closed", result);
    });
  }

  calculateDistance(from: google.maps.LatLng, to: google.maps.LatLng) {
    return google.maps.geometry.spherical.computeDistanceBetween(from, to);
  }

  setFromLatLng(event: { coords: { lat: number; lng: number } }) {
    const fromLocation = {
      lat: event.coords.lat,
      lng: event.coords.lng,
    };
    this.customerStateService.setFromLocation({ ...fromLocation }, true);
    this.getPlaceName(event.coords.lat, event.coords.lng, (result) => {
      this.patchLocationToInput(
        { lat: fromLocation.lat, lng: fromLocation.lng },
        this.searchElementRefFrom,
        result
      );
    });
  }
  setToLatLng(event: { coords: { lat: number; lng: number } }) {
    const toLocation = {
      lat: event.coords.lat,
      lng: event.coords.lng,
    };
    this.customerStateService.setFromLocation({ ...toLocation }, false);
    this.getPlaceName(event.coords.lat, event.coords.lng, (result) => {
      this.patchLocationToInput(
        { lat: toLocation.lat, lng: toLocation.lng },
        this.searchElementRefTo,
        result
      );
    });
  }

  orderEssentials() {
    this.router.navigate(["customer/essentials"]);
  }
}
