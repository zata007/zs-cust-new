import { Component, OnInit } from '@angular/core';
import { CustomerStateService } from '../customer-state.service';
import { MatDialog } from '@angular/material';
import { ECustomerServiceType, ZATAAKSE_SELECTED_SERVICE } from '../../shared/constants/constants';
import { MAP_STYLES } from '../map-vehicle/map-consts';
import { ActivatedRoute, Router } from '@angular/router';
import { Marker } from 'src/app/shared/models/common-model';
import { Socket } from 'ngx-socket-io';

@Component({
  selector: 'app-after-payment',
  templateUrl: './after-payment.component.html',
  styleUrls: ['./after-payment.component.scss']
})
export class AfterPaymentComponent implements OnInit {
  ECustomerServiceType = ECustomerServiceType;
  counterString = '30:00';
  pitstopData: {
    locationData: {from: any, to: any },
    pitstopData: Marker
  };
  deliveryData: {
    locationData: {from: any, to: any },
    address: string
  };

  polylines = [];
  directionResults$;

  fromLocation;
  toLocation;
  selectedService = ECustomerServiceType.Delivery;
  mapStyles = MAP_STYLES;
  timer : any;
  name: string;

  mapForHeader = {
    [ECustomerServiceType.Delivery] : 'Delivery',
    [ECustomerServiceType.OrderAhead] : 'OrderAhead',
    [ECustomerServiceType.TakeAway] : 'TakeAway',

  };

  constructor(
    public customerStateService: CustomerStateService,
    public dialog: MatDialog,
    private router: Router,
    private socket: Socket ) {
      this.socket.fromEvent<any>('getDirectionsResult').subscribe((data) => this.onDirectionResultUpdate(data));
     }

  ngOnInit() {
    if (localStorage.getItem(ZATAAKSE_SELECTED_SERVICE)) {
      const storedData = JSON.parse(localStorage.getItem(ZATAAKSE_SELECTED_SERVICE));
      this.selectedService = storedData.serviceType;
      switch (this.selectedService) {
        case ECustomerServiceType.TakeAway:
          this.pitstopData = storedData.data;
          break;
        case ECustomerServiceType.Delivery:
          this.deliveryData = storedData.data;
          break;
          case ECustomerServiceType.TakeAway:
            this.name = JSON.parse(localStorage.getItem(ZATAAKSE_SELECTED_SERVICE)).data.name;
            break;
        default:
          break;
      }
      this.handleMapViewData();
    }
  }

  initializeCounterTiming() {
    let countdown = 30 * 60 * 1000;
    setInterval(() => {
      countdown -= 1000;
      const min = Math.floor(countdown / (60 * 1000));
      const sec = Math.floor((countdown - (min * 60 * 1000)) / 1000);

      if (countdown <= 0) {
        this.counterString = '00:00';
      } else {
        this.counterString =  min + ':' + sec;
      }
    }, 1000);
  }

  handleMapViewData() {
    switch (this.selectedService) {
      case ECustomerServiceType.TakeAway:
        this.fromLocation = this.pitstopData.locationData.from;
        this.toLocation = this.pitstopData.locationData.to;
        this.getRoutes(this.fromLocation, this.toLocation);
        break;
      case ECustomerServiceType.Delivery:
        this.fromLocation = this.deliveryData.locationData.from;
        this.toLocation = this.deliveryData.locationData.to;
        this.getRoutes(this.fromLocation, this.toLocation);
        this.initializeCounterTiming();
        break;
      case ECustomerServiceType.OrderAhead:
        // this.fromLocation = this.pitstopData.locationData.from;
        // this.toLocation = this.pitstopData.locationData.to;
        // this.getRoutes(this.fromLocation, this.toLocation);
        this.name = JSON.parse(localStorage.getItem(ZATAAKSE_SELECTED_SERVICE)).data.name;
        break;
      default:
        break;
    }
  }

  mapReady(evt:any) {
  }

  private getRoutes(from, to) {
    const data = {
      origin: [from.lat, from.lng], // [latitude, longitude]
      destination: [to.lat, to.lng], // [latitude, longitude]
    };
    this.socket.emit('getDirections', JSON.stringify(data));
  }

  onDirectionResultUpdate(data: google.maps.DirectionsRoute[]) {
    this.polylines = this.customerStateService.getPolyLines(data);
  }

  onBackClick() {
    this.router.navigate(['customer']);
  }

  navigateToPitstop() {
    const latLng = `${this.pitstopData.pitstopData.lat},${this.pitstopData.pitstopData.lng}`;
    window.open(`https://www.google.com/maps/dir/?api=1&destination=${encodeURI(latLng)}&travelmode=driving`);
  }

  navigateToCustomer() {
    this.router.navigate(['customer']);
  }

}
