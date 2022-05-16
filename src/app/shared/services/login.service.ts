import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonService } from './common.service';
import { DataService } from './data.service';
import { ILoginData, IMobileLoginData } from '../models/common-model';
import { CookieService } from './cookie.service';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { API_ENDPOINTS } from '../constants/constants';

@Injectable({ providedIn: 'root' })
export class LoginService {
  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    private commonService: CommonService,
    private dataService: DataService
  ) {}

  loginByNumber(phoneNumber: string): Observable<any> {
    const data: ILoginData = {
      mobileNumber: phoneNumber,
      fingurePrint: this.commonService.fingerPrint,
      lanPreference: this.cookieService.getAppLanguage(),
    };
    return this.dataService.loginByNumber(data);
  }
}
