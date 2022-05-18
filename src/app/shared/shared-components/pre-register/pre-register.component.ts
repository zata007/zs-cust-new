import { Component, OnInit } from '@angular/core';
import { DataService } from '../../services/data.service';
import { CommonService } from '../../services/common.service';

@Component({
  selector: 'app-pre-register',
  templateUrl: './pre-register.component.html',
  styleUrls: ['./pre-register.component.scss']
})
export class PreRegisterComponent implements OnInit {

  constructor(private dataService: DataService, private commonService: CommonService) { }

  ngOnInit() {
  }

  onSubmit(value: number) {
    // TODO: Send register data.
    const params = this.commonService.getPlatformParams();
    this.dataService.registerLogin({
      ...this.commonService.getRequestEssentialParams(),
      data: {
        indMobileNum: value.toString(),
        indCountryCode: '91',
        pRoleId: params.interfaceData[0].pRoleId,
        pRelationId: params.interfaceData[0].pRelationId,
        pInterface: params.interfaceData[0]._id,
        reqType: 'register'
      }
    }).subscribe(res => {
    });

  }

}
