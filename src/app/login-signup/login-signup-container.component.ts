import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { DataService } from '../shared/services/data.service';
import { CommonService } from '../shared/services/common.service';
import { IResponsePlatformParams, IResponseLocationServed } from '../shared/models/common-model';

@Component({
  template: '<router-outlet></router-outlet>'
})

export class LoginSignupContainerComponent implements OnInit {
  constructor(private translate: TranslateService, private dataService: DataService, private commonService: CommonService) { }

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
              // console.log(res);
            });
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
