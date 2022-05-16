import { Component, OnInit, Inject } from '@angular/core';
import {
  MatBottomSheetRef,
  MatBottomSheet,
  MAT_BOTTOM_SHEET_DATA
} from '@angular/material';
import { IRestaurantData, IPaginationResGetRestaurant, IRequestGetSkuData, IResponseGetSkuData } from 'src/app/shared/models/common-model';
import { ECustomerServiceType, EListPageViewType } from 'src/app/shared/constants/constants';
import { DataService } from 'src/app/shared/services/data.service';
import { CommonService } from 'src/app/shared/services/common.service';
import { Router } from '@angular/router';
import { CustomerStateService } from '../customer-state.service';

@Component({
  selector: 'app-restaurant-list',
  templateUrl: './restaurant-list.component.html',
  styleUrls: ['./restaurant-list.component.scss']
})
export class RestaurantListComponent implements OnInit {
  restaurantLists: IRestaurantData[];
  openedFrom = '';
  constructor(
    private bottomSheetRef: MatBottomSheetRef<RestaurantListComponent>,
    private bottomSheet: MatBottomSheet,
    private dataService: DataService,
    private commonService: CommonService,
    private customerStateService: CustomerStateService,
    private router: Router,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: {data: IPaginationResGetRestaurant, openedFrom: string, pitstopLatLng?: number[]}
  ) {
    this.restaurantLists = data.data.blData;
    this.openedFrom = data.openedFrom;
  }

  ngOnInit() {}

  onRestaurantClick(item: IRestaurantData) {
    // TODO: Goto page.
    // console.log(item, this.openedFrom);
    const data: IRequestGetSkuData = {
      businessLocId: item.businessLocId,
      flag: 1,
      pageNum: 1,
      ...this.commonService.getRequestEssentialParams()
    };
    switch (this.openedFrom) {
      case ECustomerServiceType.TakeAway:
        data.pitstopLatitude = this.data.pitstopLatLng[0].toString();
        data.pitstopLongitude = this.data.pitstopLatLng[1].toString();
        delete data.businessLocId;
        break;
      case ECustomerServiceType.OrderAhead:
      case ECustomerServiceType.Delivery:
        data.flag = 2;
        break;
      default:
        break;
    }

    // console.log(data);
    this.dataService.getSku(data).subscribe((res: IResponseGetSkuData) => {
      // openType = foodList, restaurantList
      // console.log(res);
      if (res.data && res.data.skuData) {
        this.bottomSheetRef.dismiss();
        this.customerStateService.setCurrentPage('pitstop-view');
        this.router.navigate([`customer/pitstop/${EListPageViewType.FoodList}`]).then(r => {
          if (r) {
            const dataToStore = {
              ...res.data,
              resName: item.displayName
            };
            this.customerStateService.setSkuData(dataToStore);
          }
        });
        // Send to menu page.
      }
    });

  }
}
