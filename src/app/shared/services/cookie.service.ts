import { Injectable } from '@angular/core';
import { IUserDetails } from '../models/common-model';
import { LOCAL_STORAGE } from '../constants/constants';

enum Cookie_Type {
  LANG = 'ZataakSeUser_Lang',
  LocationPermission = 'ZataakSeUser_hasLocationPermission',
}
@Injectable({ providedIn: 'root' })
export class CookieService {
  constructor() {}

  setAppLanguage(lang: string) {
    localStorage.setItem(Cookie_Type.LANG, lang);
  }

  getAppLanguage(): string {
    return localStorage.getItem(Cookie_Type.LANG) || 'en';
  }

  setLocationPermissionStatus(hasLocationPermission: boolean) {
    localStorage.setItem(
      Cookie_Type.LocationPermission,
      hasLocationPermission + ''
    );
  }

  getLocationPermissionStatus(): boolean {
    const val = localStorage.getItem(Cookie_Type.LocationPermission);
    return Boolean(val);
  }

  setUserData(data: IUserDetails) {
    if (data) {
      data.id = data['_id'];
      const dataAfterStringify = JSON.stringify(data);
      localStorage.setItem(LOCAL_STORAGE, dataAfterStringify);
    } else {
      localStorage.removeItem(LOCAL_STORAGE);
    }
  }

  getUserData(): IUserDetails {
    const data = localStorage.getItem(LOCAL_STORAGE);
    return JSON.parse(data);
  }
}
