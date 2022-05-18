import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { MaterialModule } from '../material-module/material.module';
import { createTranslateLoader } from '../models/common-model';
import { LocationDialogComponent } from './location-dialog/location-dialog.component';
import { LocationPopupComponent } from './location-popup/location-popup.component';
import { NotServicebleComponent } from './not-serviceble/not-serviceble.component';
import { PreRegisterComponent } from './pre-register/pre-register.component';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { TextDialogComponent } from './text-dialog/text-dialog.component';



@NgModule({
  declarations: [
    SplashScreenComponent,
    LocationPopupComponent,
    LocationDialogComponent,
    NotServicebleComponent,
    PreRegisterComponent,
    TextDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    FlexLayoutModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: false
  })
  ],
  entryComponents: [LocationPopupComponent, LocationDialogComponent, NotServicebleComponent, PreRegisterComponent, TextDialogComponent],
  exports: [SplashScreenComponent, NotServicebleComponent]
})
export class SharedComponentsModule { }
