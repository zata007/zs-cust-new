import { Component, OnInit } from '@angular/core';
import { CommonService } from 'src/app/shared/services/common.service';
import { DataService } from 'src/app/shared/services/data.service';
import { IResponsePlatformParams, IResponseLocationServed } from 'src/app/shared/models/common-model';
import { CustomerStateService } from '../customer-state.service';
import { ZATAAKSE_PREF_LANG } from 'src/app/shared/constants/constants';

@Component({
  selector: 'app-customer-layout',
  templateUrl: './customer-layout.component.html',
  styleUrls: ['./customer-layout.component.scss']
})
export class CustomerLayoutComponent implements OnInit {
  constructor(
    private commonService: CommonService,
    private dataService: DataService,
    private customerStateService: CustomerStateService
  ) {}

  ngOnInit() {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        position => {
          const latitude = position.coords.latitude;
          const longitude = position.coords.longitude;
          this.commonService.setUserLocation(latitude, longitude);
          // Get Platform params
          // TODO: GET /params/getPlatformParams
          this.dataService.getPlatformParams({
              ...this.commonService.getRequestEssentialParams()
            }).subscribe((res: IResponsePlatformParams) => {
              // TODO: Save Params
              this.commonService.setPlatformParams(res.data);
            });
          // Get current location's restaurant info.
          this.customerStateService.setFromLocation({ lat: latitude, lng: longitude }, true);
          this.dataService.checkZataakseServiceAvailable({
        fingerprint: this.commonService.fingerPrint,
        lan: localStorage.getItem(ZATAAKSE_PREF_LANG),
        latitude,
        longitude
      })
      .subscribe((res: IResponseLocationServed) => {
        this.customerStateService.setCurrentLocationRestaurantData(res.data.businessLocData);
        if (res.data && res.data.isLocationServed) {
            // TODO: DO Nothing
          } else {
            // TODO: Show popup for no service
          }
        },
        err => {
          // TODO: Handle Error.
        }
      );

        },
        error => {
          // User blocked location
          // LocationPopupComponent
          // console.log(error);
        }
      );
    } else {
      this.dataService.getPlatformParams({
        ...this.commonService.getRequestEssentialParams()
      }).subscribe((res: IResponsePlatformParams) => {
        // TODO: Save Params
        this.commonService.setPlatformParams(res.data);
      });
    }
  }
}
