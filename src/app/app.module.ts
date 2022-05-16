import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { SharedComponentsModule } from './shared/shared-components/shared-components.module';
import { MaterialModule } from './shared/material-module/material.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { FlexLayoutModule } from '@angular/flex-layout';
import { StoreModule } from '@ngrx/store';
import { reducers, metaReducers } from './reducers';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { AgmCoreModule } from '@agm/core';
import { JoyrideModule } from 'ngx-joyride';
import { DeviceDetectorModule } from 'ngx-device-detector';
import { ConnectionServiceModule } from 'ng-connection-service';
import { SharedModule } from './shared/shared-components/shared.module';

import {StoreDevtoolsModule} from '@ngrx/store-devtools';

import { NgrxRouterStoreModule } from './store/reducers/router/ngrx-router.module';
import { PaymentComponent } from './payment/payment.component';
import { CustomerStateService } from './customer-app/customer-state.service';
import { createTranslateLoader } from './shared/models/common-model';
import { LOCAL_STORAGE_FINGERPRINT } from './shared/constants/constants'
import { MAT_SNACK_BAR_DEFAULT_OPTIONS } from '@angular/material';
import { SuccessSnackbarComponent } from './shared/shared-components/success-snackbar/success-snackbar.component';


const socketConfig: SocketIoConfig = { url: environment.SOCKET_API_Endpoint, options: { path: '/user/socket',
withCredentials: false,
  query: { authorization: 'gdfeduegdgdugd3gdugduygudgeudguedguegduegd'}
 //query: { authorization: localStorage.getItem(LOCAL_STORAGE_FINGERPRINT)}
} };

@NgModule({
  declarations: [
    AppComponent,
    LandingPageComponent,
    PaymentComponent,
    SuccessSnackbarComponent,
  ],
  imports: [
    MaterialModule,
    FlexLayoutModule,
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    DeviceDetectorModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
          provide: TranslateLoader,
          useFactory: createTranslateLoader,
          deps: [HttpClient]
      }
    }),
    SocketIoModule.forRoot(socketConfig),
    AgmCoreModule.forRoot({ apiKey: environment.mapApiKey, libraries: ['places', 'geometry'] }),
    JoyrideModule.forRoot(),
    SharedComponentsModule,
    ConnectionServiceModule,
    StoreModule.forRoot(reducers, {
      metaReducers,
      runtimeChecks: {
        strictStateImmutability: true,
        strictActionImmutability: true
      }
    }),
    !environment.production ? StoreDevtoolsModule.instrument() : [],
    NgrxRouterStoreModule,
    SharedModule,
  ],
  providers: [
    CustomerStateService,
    {provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 1200}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
