import { CanActivate, Router } from '@angular/router';
import { CommonService } from '../services/common.service';
import { Injectable } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { IAppState } from 'src/app/store/states/app.states';
import { registeredUserId } from 'src/app/store/selectors/prelaunch.selectors';
import { map, take } from 'rxjs/operators';

@Injectable({ providedIn: 'root' })
export class PrelaunchGuard implements CanActivate {
  constructor(private commonService: CommonService, private router: Router, private store: Store<IAppState>) {}
  canActivate() {
    return  this.store
    .pipe(
      select(registeredUserId),
      take(1),
      map((i) => !!i)
    );

    // try {
    //   this.store
    //     .pipe(
    //       select(registeredUserId),
    //       take(1),
    //       map((i) => !!i)
    //     )
    //     .subscribe((r) => {
    //       if (r || this.commonService.userId || this.commonService.haslocationData) {
    //         Promise.resolve(true);
    //       } else {
    //         return this.router.navigate(['/']);
    //       }
    //     });
    // } catch (error) {
    //   console.log(error);
    //   return Promise.resolve(false);
    // }
  }
}
