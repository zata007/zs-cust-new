import { Component, OnInit } from '@angular/core';
import { CustomerStateService } from '../customer-state.service';
import { IMenuData, IResponseGetSkuData, IRequestGetSkuData,
   IRequestGetRestaurantData, IResponseGetRestaurantData, IRestaurantData } from 'src/app/shared/models/common-model';
import { DataService } from 'src/app/shared/services/data.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Observable } from 'rxjs';
import { MatSlideToggleChange } from '@angular/material';

@Component({
  selector: 'app-pitstop-landing',
  templateUrl: './pitstop-landing.component.html',
  styleUrls: ['./pitstop-landing.component.scss']
})
export class PitstopLandingComponent implements OnInit {
  foods: IMenuData[];
  filteredFoods: IMenuData[];
  restaurants: IRestaurantData[];
  filteredRestaurants: IRestaurantData[];
  resName: string;
  searchTerms = '';
  selectedTab = 0;
  defaultToggle = false;

  constructor(
    private customerStateService: CustomerStateService,
    private dataService: DataService,
    private commonService: CommonService
    ) {
    // this.customerStateService.currentSkuData$.subscribe(data => {
    //   console.log(data);
    //   this.foods = data.skuData;
    //   this.resName = data.resName;
    // });
   }

  ngOnInit() {
    this.customerStateService.setCurrentPage('pitstop-view');
    this.getFoodList().subscribe(res => {
      this.foods = res.data.skuData;
      this.filteredFoods = this.foods;
    });

    this.getRestaurants().subscribe(res => {
      this.restaurants = res.data.blData;
      this.filteredRestaurants = this.restaurants;
    });
  }

  onSearchKeyUp(searchTerm: string) {
    if (searchTerm.length > 2) {
      // TODO: Find selected tab and filter data
      if (this.selectedTab === 0) {
        this.filteredFoods = this.foods.filter(i => i.skuName.toLowerCase().includes(searchTerm.toLowerCase()));
      } else {
        this.filteredRestaurants = this.restaurants.filter(i => i.displayName.toLowerCase().includes(searchTerm.toLowerCase()));
      }
    } else {
      this.resetSearch();
    }
  }

  resetSearch() {
    this.filteredFoods = this.foods;
    this.filteredRestaurants = this.restaurants;
  }

  onTabChange() {
    this.onSearchKeyUp(this.searchTerms);
  }

  getRestaurants(): Observable<IResponseGetRestaurantData>{
    const pitstopData = this.customerStateService.getCurrentPitstopData();
    const data: IRequestGetRestaurantData = {
      ...this.commonService.getRequestEssentialParams(),
      pitstopLatitude: pitstopData.lat,
      pitstopLongitude: pitstopData.lng,
      isTakeAway: true,
      isDelivery: false,
      isOrderAhead: false,
    };
    return this.dataService.getRestauratData(data) as any;
  }

  getFoodList(): Observable<IResponseGetSkuData> {
    const pitstopData = this.customerStateService.getCurrentPitstopData();
    const data: IRequestGetSkuData = {
      flag: 1,
      pageNum: 1,
      ...this.commonService.getRequestEssentialParams(),
      pitstopLongitude: pitstopData.lng.toString(),
      pitstopLatitude: pitstopData.lat.toString()
    };
    return this.dataService.getSku(data) as any;
  }

  onToggle(event: MatSlideToggleChange) {
    this.defaultToggle = event.checked;
    if (this.defaultToggle) {
      this.filteredFoods = this.foods.filter(i => i.type.toLowerCase()==="v");
    } else if (!this.defaultToggle) {
      this.filteredFoods = this.foods;
    }
  }

}
