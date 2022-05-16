import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';
import { Socket } from 'ngx-socket-io';
import { IBusinessLocData, IMenuData, Marker, IRestaurantData, IEssentialProductData } from '../shared/models/common-model';
import { ECustomerServiceType } from '../shared/constants/constants';

class ISelectedPathData {
  from: {
    lat: number;
    lng: number;
  } = { lat: 0, lng: 0 };
  to: {
    lat: number;
    lng: number;
  } = { lat: 0, lng: 0 };
}
enum CustomerPages {
  Main = 'main',
  Pitstop = 'pit-stop',
}
@Injectable({
  providedIn: 'root'
})
export class CustomerStateService {
  currentPitstopData: Marker;
  currentDeliveryLocation: any;
  currentRestaurantData: IRestaurantData = null;
  public currentEssentialServiceData: IEssentialProductData;
  constructor(private socket: Socket) {}
  selectedLocation: ISelectedPathData = {
    from: { lat: 0, lng: 0 },
    to: { lat: 0, lng: 0 },
  };
  polylines = [];
  directionResults: Array<google.maps.DirectionsRoute> = [];
  selectedRoute: google.maps.DirectionsRoute = null;
  currentServiceSelected = ECustomerServiceType.TakeAway as string;

  currentPageSubject = new BehaviorSubject<string>(CustomerPages.Main);
  currentPage$ = this.currentPageSubject.asObservable();

  public currentSkuData: { totalPage: number; itemPerPage: number; currentPage: number; resName: string, skuData: IMenuData[]; } = null;
  currentSkuData$ = new Subject<{ totalPage: number; itemPerPage: number; currentPage: number; resName: string, skuData: IMenuData[]; }>();

  currentLocationRestaurantData = new BehaviorSubject<IBusinessLocData[]>([]);
  currenLocationRestaurantData$ = this.currentLocationRestaurantData.asObservable();

  locationSelectionCompleted$ = new Subject<boolean>();
  directionResults$ = this.socket.fromEvent('getDirectionsResult');
  pitstopOnEdge$ = this.socket.fromEvent<{isLocationOnEdge: boolean, pitstop: number[], pitstopId: string}>('checkLocationOnEdgeResult');
  orderId: string;

  initState() {
    if (this.hasLocationData()) {
      this.getRoutes();
      this.locationSelectionCompleted$.next(true);
    } else {
      this.locationSelectionCompleted$.next(false);
    }

    this.currentLocationRestaurantData.next([...this.currentLocationRestaurantData.value ]);
  }

  updateCurrentService(service: string) {
    this.currentServiceSelected = service;
  }

  setCurrentPage(page: string) {
    this.currentPageSubject.next(page);
  }

  setCurrentLocationRestaurantData(businessLocData: IBusinessLocData[]) {
    this.currentLocationRestaurantData.next(businessLocData);
  }

  setFromLocation(data: { lat: number; lng: number }, isFrom: boolean) {
    if (isFrom) {
      this.selectedLocation.from = { ...data };
    } else {
      this.selectedLocation.to = { ...data };
    }

    // TODO: If location completed send location completed;
    if (this.hasLocationData()) {
      this.getRoutes();
      this.locationSelectionCompleted$.next(true);
    } else {
      this.locationSelectionCompleted$.next(false);
    }
  }

  getFromLocation() {
    return this.selectedLocation.from;
  }

  setDirectionResults(data: Array<google.maps.DirectionsRoute>) {
    this.directionResults = data;
    this.selectedRoute = data[0];
  }

  setSkuData(data: { totalPage: number; itemPerPage: number; currentPage: number; resName: string, skuData: IMenuData[]; }) {
    this.currentSkuData = data;
    this.currentSkuData$.next(data);
  }

  setCurrentPitstop(pitStopData: Marker) {
    this.currentPitstopData = pitStopData;
  }

  getCurrentPitstopData() {
    return this.currentPitstopData;
  }

  private getRoutes() {
    const data = {
      origin: [this.selectedLocation.from.lat, this.selectedLocation.from.lng], // [latitude, longitude]
      destination: [this.selectedLocation.to.lat, this.selectedLocation.to.lng], // [latitude, longitude]
    };
    this.socket.emit('getDirections', JSON.stringify(data));
  }

  isPitStopOnEdge(id: string, lat: number, lng: number) {
    const data = {
      pitstopId: id,
      pitstop: [lng, lat],
      polyline: encodeURI(this.selectedRoute.overview_polyline['points']) ,
      tolerance: 1000,
    };

    this.socket.emit('checkLocationOnEdge', data, (e)=>{
      // console.log(e)
    });
  }

  getPolyLines(data: Array<google.maps.DirectionsRoute>) {
    this.polylines = [];
    data.forEach((i, index) => {
      const encodedString = i.overview_polyline['points'];

      const line = new google.maps.Polyline({
        path: google.maps.geometry.encoding.decodePath(encodedString),
        strokeColor: '#00008B',
        strokeOpacity: 1.0,
        strokeWeight: index > 0 ? 4 : 8,
        zIndex: index,
      });

      const lines = [];
      line.getPath().forEach((pathItem) => {
        lines.push(pathItem.toJSON());
      });

      const route: { color: string; path: Array<{ lat: number; lng: string }>; encodedString: string; zIndex: number } = {
        color: index > 0 ? '#ACACAC' : 'blue',
        encodedString,
        path: lines,
        zIndex: index === 0 ? 999 : 0,
      };

      this.polylines.push(route);
    });

    // TODO: Add logic to save selected route.
    return this.polylines;
  }

  calculateDistance(callBack: Function) {
    const start = new google.maps.LatLng(this.selectedLocation.from.lat, this.selectedLocation.from.lng);
    const end = new google.maps.LatLng(this.selectedLocation.to.lat, this.selectedLocation.to.lng);

    // new google.maps.LatLng(this.selectedPath.to.lat, this.selectedPath.to.lng);
    const request = {
      origin: start,
      destination: end,
      travelMode: google.maps.TravelMode.DRIVING,
    };
    const directionsService = new google.maps.DirectionsService();
    directionsService.route(request, (response, status) => {
      // Empty response as API KEY EXPIRED
      callBack(response.routes[0].legs[0].distance.value);
    });
  }

  updateSelectedRoute(selectedPolyline: { color: string; path: { lat: number; lng: string }[]; encodedString: string }) {
    const selectedRouteIndex = this.directionResults.findIndex((i) => i.overview_polyline['points'] === selectedPolyline.encodedString);
    this.selectedRoute = this.directionResults[selectedRouteIndex];
  }

  getLocationData() {
    return {
      sourcePoint: [this.selectedLocation.from.lng, this.selectedLocation.from.lat],
      destnationPoint: [this.selectedLocation.to.lng, this.selectedLocation.to.lat]
    };
  }

  hasLocationData() {
    return !!(
      this.selectedLocation &&
      this.selectedLocation.from.lat &&
      this.selectedLocation.to.lat &&
      this.selectedLocation.from.lng &&
      this.selectedLocation.to.lng
    );
  }

  setOrderId(id: string) {
    this.orderId = id;
  }

  getOrderId() {
    return this.orderId;
  }
}
