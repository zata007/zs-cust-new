import { Component, OnInit } from '@angular/core';
import { CustomerStateService } from '../customer-state.service';
import { IMenuData, IResponseGetSkuData, IRequestGetSkuData,
   IRequestGetRestaurantData, IResponseGetRestaurantData, IRestaurantData } from 'src/app/shared/models/common-model';
import { DataService } from 'src/app/shared/services/data.service';
import { EListPageViewType, ECustomerServiceType } from 'src/app/shared/constants/constants';
import { CommonService } from 'src/app/shared/services/common.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-pitstop-restaurant',
  templateUrl: './pitstop-restaurant.component.html',
  styleUrls: ['./pitstop-restaurant.component.scss']
})
export class PitstopRestaurantComponent implements OnInit {
  restaurants: IRestaurantData[];
  filteredRestaurants: IRestaurantData[];
  resName: string;
  searchTerms = '';
  selectedTab = 0;
  path = sessionStorage.getItem('path');
  isLoading = true;

  constructor(
    private customerStateService: CustomerStateService,
    private dataService: DataService,
    private commonService: CommonService
  ) { }

  ngOnInit() {
    this.getRestaurants().subscribe(res => {
      this.restaurants = res.data.blData;
      this.filteredRestaurants = this.restaurants;
      this.isLoading = false;
    });
  }

  onSearchKeyUp(searchTerm: string) {
    if (searchTerm.length > 2) {
      // TODO: Find selected tab and filter data
      this.isLoading = true;
      this.filteredRestaurants = this.restaurants.filter(i => i.displayName.toLowerCase().includes(searchTerm.toLowerCase()));
    } else {
      this.resetSearch();
    }
    this.isLoading = false;
  }

  resetSearch() {
    this.filteredRestaurants = this.restaurants;
  }

  getRestaurants(): Observable<IResponseGetRestaurantData>{
    const pitstopData = this.customerStateService.getFromLocation();
    if(this.path === 'customer/delivery') {
      const data: IRequestGetRestaurantData = {
        ...this.commonService.getRequestEssentialParams(),
        pitstopLatitude: pitstopData.lat,
        pitstopLongitude: pitstopData.lng,
        isTakeAway: false,
        isDelivery: true,
        isOrderAhead: false,
      };
      return this.dataService.getRestauratData(data) as any;
    } else if(this.path === 'customer/order-ahead') {
      const data: IRequestGetRestaurantData = {
        ...this.commonService.getRequestEssentialParams(),
        pitstopLatitude: pitstopData.lat,
        pitstopLongitude: pitstopData.lng,
        isTakeAway: false,
        isDelivery: false,
        isOrderAhead: true,
      };
    return this.dataService.getRestauratData(data) as any;
    }
  }

}
