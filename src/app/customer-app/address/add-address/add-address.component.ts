import { Component, OnInit, ViewChild, ElementRef, NgZone, TemplateRef, OnDestroy } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MapsAPILoader } from '@agm/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { CommonService } from 'src/app/shared/services/common.service';
import { CustomerStateService } from '../../customer-state.service';
import { CustomerService } from '../../customer.service';
import { GeoLocationService } from 'src/app/shared/services/geo-location.service';
import { MatDialog, MatBottomSheet } from '@angular/material';
import { MAP_STYLES } from '../../map-vehicle/map-consts';
import { BottomAddressComponent } from '../bottom-address/bottom-address.component';
import { Marker, IAddressData } from 'src/app/shared/models/common-model';


@Component({
  selector: 'app-add-address',
  templateUrl: './add-address.component.html',
  styleUrls: ['./add-address.component.scss']
})
export class AddAddressComponent implements OnInit, OnDestroy {
  @ViewChild('searchFrom', { static: false }) public searchElementRefFrom: ElementRef;
  @ViewChild('requestSubmit', { static: false }) requestSubmit: TemplateRef<any>;
  // initial center position for the map
  public latitude = 19.125956;
  public longitude = 72.853532;
  selectedLabel = 'A';
  selectedIndex = 0;

  public searchControl: FormControl;
  public zoom: number;
  locationFetched: boolean;

  mapStyles = MAP_STYLES;

  markers: Marker[] = [];
  isSubmitRequestVisible: boolean;
  polylines: Array<{ color: string; path: Array<{ lat: number; lng: string }>; encodedString: string; zIndex: number }> = [];
  bounds: google.maps.LatLngBounds = null;
  map: google.maps.Map;
  lng: number;
  lat: number;
  curLocResDataSubscription: any;
  address: IAddressData = {} as IAddressData;

  // {
  //   x: string;
  //   addType: string;
  //   addLine1: string;
  //   addLine2: string;
  //   city: string;
  //   locality: string;
  //   landmark: string;
  //   state: string;
  //   country: string;
  //   postal: string;
  //   latitude: number;
  //   longitude: number
  // } = null;
  fromLocation: any;

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
    private location: Location,
  ) { }

  ngOnInit() {
    // Patch map data,
    this.customerStateService.locationSelectionCompleted$.subscribe((hasCompleted) => {
      if (hasCompleted) {
        // TODO: DO work once location completed.
        this.bounds = new google.maps.LatLngBounds();
        const selectedLocation = this.customerStateService.selectedLocation;
        const from = new google.maps.LatLng(selectedLocation.from.lat, selectedLocation.from.lng);
        const to = new google.maps.LatLng(selectedLocation.to.lat, selectedLocation.to.lng);
        this.bounds.extend(from);
        this.bounds.extend(to);

        this.map.fitBounds(this.bounds, 160); // # auto-zoom
        this.map.panToBounds(this.bounds); // # auto-center
      }
    });

    this.customerStateService.directionResults$.subscribe((data: google.maps.DirectionsRoute[]) => this.onDirectionResultUpdate(data));

    this.customerStateService.pitstopOnEdge$.subscribe((i) => {
      if (!i.isLocationOnEdge) {
        // Pop from markers list
        const index = this.markers.findIndex(j => j.lat === i.pitstop[0] && j.lng === i.pitstop[1]);
        if (index > -1) {
          this.markers.splice(index, 1);
        }
      }
    });
    this.customerStateService.setCurrentPage('main');
    // set google maps defaults
    this.zoom = 14;

    // create search FormControl
    this.searchControl = new FormControl();

    this.initMapAutocomplete();

    this.curLocResDataSubscription = this.customerStateService.currenLocationRestaurantData$.subscribe(resData => {
      this.markers = [];
      resData.filter(i => i.blPitstops).forEach((i, index) => {
        const cardLocation = {
          lat: i.businessLocationCoord[1],
          lng: i.businessLocationCoord[0],
        };
        this.address.locationLongLat = {
          coordinates: [cardLocation.lat, cardLocation.lng],
          type : ''
        }  ;
        this.markers.push(cardLocation);
      });
    });

  }

  ngOnDestroy() {
    this.curLocResDataSubscription.unsubscribe();
  }

  initMapAutocomplete() {
    // load Places Autocomplete
    this.mapsAPILoader.load().then(() => {
      this.bounds = new google.maps.LatLngBounds();
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRefFrom.nativeElement, {
        types: ['establishment'],
        componentRestrictions: { country: 'ind' },
      });

      autocomplete.addListener('place_changed', () => {
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
          const Wankhede = new google.maps.LatLng(18.938792, 72.825802);

          this.onMapLocationChange();
          this.setFromLatLng({ coords: fromLocation});
        });
      });
    });
  }

  onDirectionResultUpdate(data: google.maps.DirectionsRoute[]) {
    this.customerStateService.setDirectionResults(data);
    this.polylines = this.customerStateService.getPolyLines(data);
  }

  onMapLocationChange() {
    this.markers = [];
  }

  mapReady(map: any) {
    this.map = map;
    this.customerStateService.initState();

    // Create the img to hold the control and call the CenterControl()
    const centerControl = this.CenterControl(map);
    map.controls[google.maps.ControlPosition.RIGHT_BOTTOM].push(centerControl);
    const selectedLocation = this.customerStateService.selectedLocation;
    if (selectedLocation.from.lat || this.customerStateService.hasLocationData()) {
      this.lat = selectedLocation.from.lat;
      this.lng = selectedLocation.from.lng;
      this.getPlaceName(this.lat, this.lng, (result: google.maps.GeocoderResult) => {
        this.patchLocationToInput({ lat: this.lat, lng: this.lng }, this.searchElementRefFrom, result);
      });
    } else {
      const sub = this.geoLocationService.getPosition().subscribe((val) => {
        this.lat = val.coords.latitude;
        this.lng = val.coords.longitude;
        this.getPlaceName(val.coords.latitude, val.coords.longitude, (result: google.maps.GeocoderResult) => {
          this.patchLocationToInput({ lat: val.coords.latitude, lng: val.coords.longitude }, this.searchElementRefFrom, result);
          sub.unsubscribe();
        });
      });
    }
  }

  patchLocationToInput(currentCords: { lat: number, lng: number }, inputToPatch: ElementRef<any>, result: google.maps.GeocoderResult) {
    const bounds = new google.maps.LatLngBounds();
    const currentLocation = new google.maps.LatLng(currentCords.lat, currentCords.lng);
    bounds.extend(currentLocation);
    this.map.panToBounds(bounds); // # auto-center
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
        this.address.formattedAddress = result.formatted_address;
        this.address.locationLongLat = {
          coordinates: [ lat, lng],
          type: 'point'
        };
        if (results != null) {
          for(let i of rsltAdrComponent) {
            switch(i.types[0]) {
              case 'postal_code':
                this.address.pincode = i.long_name;
                break;
              case 'country':
                this.address.country = i.long_name;
                break;
              case 'administrative_area_level_1':
                this.address.state = i.long_name;
                break;
              case 'locality':
                this.address.city = i.long_name;
                break;
              default:
                break;
            }
          }
        } else {
          alert('No address available!');
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
    const controlUI = document.createElement('img');
    controlUI.src = 'assets/icons/location.svg';
    controlUI.width = 40;
    controlUI.style.cursor = 'pointer';
    controlUI.style.marginBottom = '52px';
    controlUI.style.marginRight = '22px';
    controlUI.style.textAlign = 'center';

    controlUI.title = 'Click to recenter the map';

    // Setup the click event listeners: simply set the map to Chicago.
    controlUI.addEventListener('click', () => {
      const currentLocation = new google.maps.LatLng(this.lat, this.lng);

      map.setCenter(currentLocation);
    });

    return controlUI;
  }

  setFromLatLng(event: { coords: { lat: number, lng: number } }) {
    this.fromLocation = {
      lat: event.coords.lat,
      lng: event.coords.lng,
    };

    this.customerStateService.setFromLocation({ ...this.fromLocation }, true);
    this.getPlaceName(event.coords.lat, event.coords.lng, (result) => {
      this.patchLocationToInput({ lat: this.fromLocation.lat, lng: this.fromLocation.lng }, this.searchElementRefFrom, result);
    });
  }

  openBottomSheet(): void {
    this.bottomSheet.open(BottomAddressComponent, {
      data: this.address
    });
  }

  onBackClick() {
    this.location.back();
  }
}
