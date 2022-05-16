import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginSignupRoutingModule } from './login-signup-routing.module';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { MaterialModule } from '../shared/shared-components/material.module';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { SigninOtpComponent } from './signin-otp/signin-otp.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { UserFeedbackComponent } from './user-feedback/user-feedback.component';
import { LoginSignupContainerComponent } from './login-signup-container.component';
import { SuccessfulRegistrationComponent } from './successful-registration/successful-registration.component';
import { HttpClient } from '@angular/common/http';
import { createTranslateLoader } from '../shared/models/common-model';

@NgModule({
  declarations: [LoginSignupComponent,
    LoginComponent,
    SignupComponent,
    SigninOtpComponent,
    UserFeedbackComponent,
    LoginSignupContainerComponent,
    SuccessfulRegistrationComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: false
  }),
    LoginSignupRoutingModule
  ],
  entryComponents: [SigninOtpComponent]
})
export class LoginSignupModule { }
