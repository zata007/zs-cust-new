import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { OrderService } from '../order.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { BottomAddressComponent } from '../address/bottom-address/bottom-address.component';
import { BottomVehicleComponent } from '../vehicle/bottom-vehicle/bottom-vehicle.component'
import { EListPageViewType } from 'src/app/shared/constants/constants';
import { CustomerStateService } from '../customer-state.service';
import { IMenuData, IRestaurantData } from 'src/app/shared/models/common-model';
import { DataService } from 'src/app/shared/services/data.service';
import { MatSlideToggleChange } from '@angular/material';


@Component({
  selector: 'app-pitstop-view',
  templateUrl: './pitstop-view.component.html',
  styleUrls: ['./pitstop-view.component.scss'],
})
export class PitstopViewComponent implements OnInit {
  isOrdered = false;
  canShowPitstopLanding = false;
  selectedFrom = '';
  selectedTo = '';
  resName = '';
  path = sessionStorage.getItem('path');
  foods: IMenuData[];
  filteredFoods: IMenuData[];
  restaurants: IRestaurantData[];
  filteredRestaurants: IRestaurantData[];
  searchTerms = '';
  selectedTab = 0;
  defaultToggle = false;

  constructor(
    private customerStateService: CustomerStateService,
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private orderService: OrderService,
    private bottomSheet: MatBottomSheet,
    private dataService: DataService
  ) {
    this.customerStateService.currentSkuData$.subscribe(data => {
      this.foods = data.skuData;
      this.resName = data.resName;
      this.filteredFoods = this.foods;
    });
  }

  ngOnInit() {
    const openType = this.route.snapshot.params.openType;
    if (openType) {
      switch (openType) {
        case EListPageViewType.FoodList:
          this.canShowPitstopLanding = true;
          break;
        default:
          this.canShowPitstopLanding = false;
          break;
      }
    }
    this.customerStateService.setCurrentPage('pitstop-view');
    this.initState();
  }

  initState() {
      if (this.customerStateService.currentSkuData) {
      const data = this.customerStateService.currentSkuData;

      this.foods = data.skuData;
      this.resName = data.resName;
      this.filteredFoods = this.foods;
    }
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

  onToggle(event: MatSlideToggleChange) {
    this.defaultToggle = event.checked;
    if (this.defaultToggle) {
      this.filteredFoods = this.foods.filter(i => i.type.toLowerCase()==="v");
    } else if (!this.defaultToggle) {
      this.filteredFoods = this.foods;
    }
  }

  resetSearch() {
    this.filteredFoods = this.foods;
    this.filteredRestaurants = this.restaurants;
  }

  onTabChange() {
    this.onSearchKeyUp(this.searchTerms);
  }

  placeOrder() {
    if (this.path === 'customer/delivery') {
      this.bottomSheet.open(BottomAddressComponent);
    } else if (!this.path || this.path === 'customer/take-away') {
      this.bottomSheet.open(BottomVehicleComponent);
    }
  }

  getTotal() {
    return this.orderService.getTotal();
  }
}
