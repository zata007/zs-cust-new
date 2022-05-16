import { Component, OnInit, Inject, Input } from '@angular/core';
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
  selector: 'restaurants-list',
  templateUrl: './restaurants-list.component.html',
  styleUrls: ['./restaurants-list.component.scss']
})
export class RestaurantsListComponent implements OnInit {
  @Input() restaurantLists: IRestaurantData[];
  openedFrom = '';
  constructor(
    private dataService: DataService,
    private commonService: CommonService,
    private customerStateService: CustomerStateService,
    private router: Router,
    ) { }

  ngOnInit() {}

  onRestaurantClick(item: IRestaurantData) {
    // TODO: Goto page.
    this.customerStateService.currentRestaurantData = item;

    const data: IRequestGetSkuData = {
      businessLocId: item.businessLocId,
      flag: 2,
      pageNum: 1,
      ...this.commonService.getRequestEssentialParams()
    };
    switch (this.openedFrom) {
      case ECustomerServiceType.TakeAway:
        data.pitstopLatitude = item.longLat[1].toString();
        data.pitstopLongitude = item.longLat[0].toString();
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
