import {NgModule, Optional, Self} from '@angular/core';
import {routerReducer, RouterStateSerializer, StoreRouterConfig, StoreRouterConnectingModule} from '@ngrx/router-store';
import {StoreModule} from '@ngrx/store';
import {MergedRouterStateSerializer} from './merged-route-serialzer';
import {Router} from '@angular/router';

export const routerStateConfig = {
  stateKey: 'zataakse-router', // state-slice name for routing state
};

@NgModule({
  imports: [
    StoreModule.forFeature(routerStateConfig.stateKey, routerReducer),
    StoreRouterConnectingModule.forRoot(routerStateConfig),
  ],
  exports: [
    StoreModule,
    StoreRouterConnectingModule
  ],
  providers: [
    {
      provide: RouterStateSerializer,
      useClass: MergedRouterStateSerializer,
    }
  ]
})
export class NgrxRouterStoreModule {

  constructor(@Self() @Optional() router: Router) {
    if (router) {
      // console.log('All good, NgrxRouterStoreModule');
    } else {
      // console.error('NgrxRouterStoreModule must be imported in the same same level as RouterModule');
    }
  }

}
