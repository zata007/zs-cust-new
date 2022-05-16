import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SplashScreenComponent } from './splash-screen/splash-screen.component';
import { MaterialModule } from '../material-module/material.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { LocationDialogComponent } from './location-dialog/location-dialog.component';
import { LocationPopupComponent } from './location-popup/location-popup.component';
import { NotServicebleComponent } from './not-serviceble/not-serviceble.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FlexLayoutModule } from '@angular/flex-layout';
import { PreRegisterComponent } from './pre-register/pre-register.component';
import { HttpClient } from '@angular/common/http';
import { createTranslateLoader } from '../models/common-model';
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
