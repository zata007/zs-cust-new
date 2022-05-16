import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  NgZone,
  TemplateRef,
} from "@angular/core";
import { FormControl } from "@angular/forms";
import { Location } from "@angular/common";
import { MapsAPILoader } from "@agm/core";
import { Router, NavigationExtras } from "@angular/router";
import { CommonService } from "src/app/shared/services/common.service";
import { CustomerStateService } from "../customer-state.service";
import { CustomerService } from "../customer.service";
import { GeoLocationService } from "src/app/shared/services/geo-location.service";
import { MatDialog, MatBottomSheet, MatSnackBar } from "@angular/material";
import { MAP_STYLES } from "../map-vehicle/map-consts";
import { DialogPreOrderComponent } from "src/app/shared/shared-components/dialog-pre-order/dialog-pre-order.component";
import {
  IRequestGetRestaurantData,
  IResponseGetRestaurantData,
  IProfileData,
  IResponsePlatformParams,
  IResponseLocationServed,
} from "src/app/shared/models/common-model";
import { DataService } from "src/app/shared/services/data.service";
import { ZATAAKSE_PREF_LANG } from "src/app/shared/constants/constants";
import { NotServicebleComponent } from "src/app/shared/shared-components/not-serviceble/not-serviceble.component";
import { TranslateService } from "@ngx-translate/core";

interface Marker {
  lat: number;
  lng: number;
  label?: string;
  draggable?: boolean;
  markerUrl?: string;
}

interface EssentialMarker {
  lat: number;
  lng: number;
  name: string;
  draggable?: boolean;
  id: string;
  photo?: string;
}

@Component({
  selector: "app-essentials",
  templateUrl: "./essentials.component.html",
  styleUrls: [
    "./../map-vehicle/map-vehicle.component.scss",
    "./essentials.component.scss",
  ],
})
export class EssentialsComponent implements OnInit {
  @ViewChild("searchFrom", { static: false })
  public searchElementRefFrom: ElementRef;
  @ViewChild("requestSubmit", { static: false })
  requestSubmit: TemplateRef<any>;
  // initial center position for the map
  selectedLabel = "A";
  selectedEssentialStore = null;

  public searchControl: FormControl;
  public zoom: number;
  locationFetched: boolean;
  latitude: number;
  longitude: number;

  // TODO: Move this value to const file.
  mapStyles = MAP_STYLES;

  markers: EssentialMarker[] = [];
  addressMarkers: Marker[] = [];
  isSubmitRequestVisible: boolean;
  bounds: google.maps.LatLngBounds = null;
  map: google.maps.Map;
  lng: number;
  lat: number;
  curLocResDataSubscription: any;
  previousInfoWindow: any;

  constructor(
    private location: Location,
    private mapsAPILoader: MapsAPILoader,
    private ngZone: NgZone,
    private router: Router,
    private commonService: CommonService,
    public customerStateService: CustomerStateService,
    private customerService: CustomerService,
    private geoLocationService: GeoLocationService,
    public dialog: MatDialog,
    private dataService: DataService,
    private bottomSheet: MatBottomSheet,
    private snackbar: MatSnackBar,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    // Patch map data,
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.commonService.setUserLocation(latitude, longitude);
          // Get Platform params
          // TODO: GET /params/getPlatformParams
          this.dataService
            .getPlatformParams({
              ...this.commonService.getRequestEssentialParams(),
            })
            .subscribe((res: IResponsePlatformParams) => {
              // TODO: Save Params
              this.commonService.setPlatformParams(res.data);
            });
          // Get current location's restaurant info.
          this.customerStateService.setFromLocation(
            { lat: latitude, lng: longitude },
            true
          );
          this.dataService
            .checkZataakseServiceAvailable({
              fingerprint: this.commonService.fingerPrint,
              lan: localStorage.getItem(ZATAAKSE_PREF_LANG),
              latitude,
              longitude,
            })
            .subscribe(
              (res: IResponseLocationServed) => {
                let tempData = res.data.businessLocData.filter((e) =>
                  e.businessLocationCoord.includes(88.386537)
                );
                this.customerStateService.setCurrentLocationRestaurantData(
                  tempData
                );
                if (res.data && res.data.isLocationServed) {
                  this.translateService
                    .get("CLOSE")
                    .subscribe((close: string) => {
                      this.translateService
                        .get("ESSENTIAL_SERVICE.SELECT_STORE")
                        .subscribe((msg: string) => {
                          this.snackbar.open(msg, close, {
                            duration: 5000,
                          });
                        });
                    });
                } else {
                  setTimeout(() => {
                    this.bottomSheet.open(NotServicebleComponent, {
                      data: {
                        location: this.searchElementRefFrom.nativeElement.value,
                        name: "shop",
                      },
                    });
                  }, 2000);
                }
              },
              (err) => {
                // TODO: Handle Error.
              }
            );
        },
        (error) => {
          // User blocked location
          // LocationPopupComponent
          // console.log(error);
        }
      );
    } else {
      this.dataService
        .getPlatformParams({
          ...this.commonService.getRequestEssentialParams(),
        })
        .subscribe((res: IResponsePlatformParams) => {
          // TODO: Save Params
          this.commonService.setPlatformParams(res.data);
        });
    }

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
          this.bounds.extend(from);

          this.map.fitBounds(this.bounds, 160); // # auto-zoom
          this.map.panToBounds(this.bounds); // # auto-center
        }
      }
    );

    this.customerStateService.setCurrentPage("main");
    // set google maps defaults
    this.zoom = 16;

    // create search FormControl
    this.searchControl = new FormControl();

    this.initMapAutocomplete();

    this.curLocResDataSubscription =
      this.customerStateService.currenLocationRestaurantData$.subscribe(
        (resData) => {
          this.markers = [];
          resData
            .filter((i) => i.blOrderAhead)
            .forEach((i) => {
              const cardLocation: EssentialMarker = {
                lat: i.businessLocationCoord[1],
                lng: i.businessLocationCoord[0],
                id: i._id,
                name: i.displayName,
                photo: null,
              };
              // TODO: Don't use null for photo
              this.markers.push(cardLocation);
            });
        }
      );
    this.customerStateService.setCurrentPage("main");
  }

  ngOnDestroy() {
    this.curLocResDataSubscription.unsubscribe();
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

          this.lat = place.geometry.location.lat();
          this.lng = place.geometry.location.lng();
          const fromLocation = {
            lat: place.geometry.location.lat(),
            lng: place.geometry.location.lng(),
          };
          this.map.setCenter(fromLocation);
          this.customerStateService.setFromLocation({ ...fromLocation }, true);
          this.customerService.setLocationData(this.lat, this.lng);
          const current = new google.maps.LatLng(this.lat, this.lng);
          // TODO: Refactor make generic implementation for finding places near stadium
          const Wankhede = new google.maps.LatLng(18.938792, 72.825802);
          if (this.calculateDistance(Wankhede, current) < 2000) {
            // TODO: handle stadium logic
            this.openDialog();
          }

          this.onMapLocationChange();
        });
      });
    });
  }

  clickedMarker(label: string) {
    this.selectedLabel = label;
  }

  clickedOnEssentialWindow(data: EssentialMarker) {
    const navigationExtras: NavigationExtras = {
      queryParams: {
        id: data.id,
        name: data.name,
        lat: data.lat,
        lng: data.lng,
        photo: data.photo,
      },
    };
    this.router.navigate(["customer/essentials/record"], navigationExtras);
  }

  clickedEssentialMarker(id: string, infowindow: any) {
    this.selectedEssentialStore = id;
    if (this.previousInfoWindow) {
      this.previousInfoWindow.close();
    }
    this.previousInfoWindow = infowindow;
  }

  onSlideChange(value: Marker) {
    this.selectedLabel = value.label;
  }

  onMapLocationChange() {
    this.dataService
      .checkZataakseServiceAvailable({
        fingerprint: this.commonService.fingerPrint,
        lan: localStorage.getItem(ZATAAKSE_PREF_LANG),
        latitude: this.lat,
        longitude: this.lng,
      })
      .subscribe(
        (res: IResponseLocationServed) => {
          this.customerStateService.setCurrentLocationRestaurantData(
            res.data.businessLocData
          );
          if (res.data && res.data.isLocationServed) {
            this.translateService.get("CLOSE").subscribe((close: string) => {
              this.translateService
                .get("ESSENTIAL_SERVICE.SELECT_STORE")
                .subscribe((msg: string) => {
                  this.snackbar.open(msg, close, {
                    duration: 5000,
                  });
                });
            });
          } else {
            setTimeout(() => {
              this.bottomSheet.open(NotServicebleComponent, {
                data: {
                  location: this.searchElementRefFrom.nativeElement.value,
                  name: "shop",
                },
              });
            }, 2000);
          }
        },
        (err) => {
          // TODO: Handle Error.
        }
      );
  }

  requestService() {
    // TODO: Uncomment after release this.isSubmitRequestVisible = true;
  }

  submitServiceRequest() {
    this.isSubmitRequestVisible = false;
  }

  GotoRoute() {
    this.customerStateService.setCurrentPage("jasj");
  }

  hasLocationData() {
    return !!this.customerStateService.hasLocationData();
  }

  mapReady(map: any) {
    this.map = map;
    this.customerStateService.initState();

    // Create the img to hold the control and call the CenterControl()
    const centerControl = this.CenterControl(map);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControl);

    const fromLocation = this.customerStateService.getFromLocation();
    if (fromLocation.lat && fromLocation.lng) {
      this.lat = fromLocation.lat;
      this.lng = fromLocation.lng;
      this.getPlaceName(
        fromLocation.lat,
        fromLocation.lng,
        (result: google.maps.GeocoderResult) => {
          if (!this.searchElementRefFrom.nativeElement.value) {
            const bounds = new google.maps.LatLngBounds();
            const currentLocation = new google.maps.LatLng(
              fromLocation.lat,
              fromLocation.lng
            );
            bounds.extend(currentLocation);
            map.setCenter(currentLocation);

            this.map.panToBounds(bounds); // # auto-center
            this.searchElementRefFrom.nativeElement.value =
              result.formatted_address;
            const latlng = new google.maps.LatLng(
              fromLocation.lat,
              fromLocation.lng
            );
            const Wankhede = new google.maps.LatLng(18.938792, 72.825802);
            if (this.calculateDistance(Wankhede, latlng) < 2000) {
              // TODO: handle stadium logic
              this.openDialog();
            }
          }
        }
      );
    } else {
      const sub = this.geoLocationService.getPosition().subscribe((val) => {
        this.lat = val.coords.latitude;
        this.lng = val.coords.longitude;
        this.customerStateService.setFromLocation(
          { lat: val.coords.latitude, lng: val.coords.longitude },
          true
        );
        this.getPlaceName(
          val.coords.latitude,
          val.coords.longitude,
          (result: google.maps.GeocoderResult) => {
            if (!this.searchElementRefFrom.nativeElement.value) {
              const bounds = new google.maps.LatLngBounds();
              const currentLocation = new google.maps.LatLng(
                val.coords.latitude,
                val.coords.longitude
              );
              bounds.extend(currentLocation);

              this.map.panToBounds(bounds); // # auto-center
              this.searchElementRefFrom.nativeElement.value =
                result.formatted_address;
              const latlng = new google.maps.LatLng(
                val.coords.latitude,
                val.coords.longitude
              );
              const Wankhede = new google.maps.LatLng(18.938792, 72.825802);
              if (this.calculateDistance(Wankhede, latlng) < 2000) {
                // TODO: handle stadium logic
                this.openDialog();
              }
            }
            sub.unsubscribe();
          }
        );
      });
    }
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
        this.goToRestaurant();
      }
    });
  }

  calculateDistance(from: google.maps.LatLng, to: google.maps.LatLng) {
    return google.maps.geometry.spherical.computeDistanceBetween(from, to);
  }

  goToRestaurant(): void {
    const data: IRequestGetRestaurantData = {
      ...this.commonService.getRequestEssentialParams(),
      pitstopLatitude: this.lat, // pitStopData.lat,
      pitstopLongitude: this.lng, // pitStopData.lng,
      isTakeAway: false,
      isDelivery: true,
      isOrderAhead: false,
    };
    this.dataService
      .getRestauratData(data)
      .subscribe((res: IResponseGetRestaurantData) => {
        // TODO: Handle no data
        if (res.data && res.data.blData) {
          this.customerStateService.setCurrentPage("pitstop-restaurant");
          this.router.navigate(["customer/pitstop-restaurant"]);
        }
      });
  }

  onRecord() {
    this.router.navigate(["customer/essentials/record"]);
  }

  onBackClick() {
    this.location.back();
  }
}
