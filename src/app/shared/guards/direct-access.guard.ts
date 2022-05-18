import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, Router } from '@angular/router';
import { CommonService } from '../services/common.service';

@Injectable({ providedIn: 'root' })
export class DirectAccessGuard implements CanActivate {
  constructor(private commonService: CommonService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
    if (state.url === 'no-internet') {
      const isConnected = this.commonService.getUserConnectedStatus();
      if (isConnected) {
        this.router.navigate(['/']);
        return false;
      }

      return true;
    }
    return true;
  }
}
