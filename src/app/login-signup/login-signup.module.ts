import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { createTranslateLoader } from '../shared/models/common-model';
import { MaterialModule } from '../shared/shared-components/material.module';
import { LoginSignupContainerComponent } from './login-signup-container.component';
import { LoginSignupRoutingModule } from './login-signup-routing.module';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { LoginComponent } from './login/login.component';
import { SigninOtpComponent } from './signin-otp/signin-otp.component';
import { SignupComponent } from './signup/signup.component';
import { SuccessfulRegistrationComponent } from './successful-registration/successful-registration.component';
import { UserFeedbackComponent } from './user-feedback/user-feedback.component';

@NgModule({
  declarations: [
    LoginSignupComponent,
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
        deps: [HttpClient],
      },
      isolate: false,
    }),
    LoginSignupRoutingModule,
  ],
  entryComponents: [SigninOtpComponent],
})
export class LoginSignupModule {}
