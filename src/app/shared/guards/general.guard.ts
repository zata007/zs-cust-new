import { CanActivate, Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GeneralGuard implements CanActivate {
  constructor(private commonService: CommonService, private router: Router) {}
  canActivate() {
    if (this.commonService.userId || this.commonService.haslocationData) {
      return true;
    }

    this.router.navigate(['/login-signup']);
  }
}
