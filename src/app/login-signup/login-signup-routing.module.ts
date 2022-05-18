import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LoginSignupComponent } from './login-signup/login-signup.component';
import { LoginSignupContainerComponent } from './login-signup-container.component';
import { UserFeedbackComponent } from './user-feedback/user-feedback.component';
import { SuccessfulRegistrationComponent } from './successful-registration/successful-registration.component';

const routes: Routes = [ {
  path: '',
  component: LoginSignupContainerComponent,
  pathMatch: 'prefix',
  children: [
    { path: 'feedback', component: UserFeedbackComponent  },
    { path: 'successful', component: SuccessfulRegistrationComponent  },
    { path: '', component: LoginSignupComponent },
    { path: '**', redirectTo: '**', pathMatch: 'full' },
  ],
},];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class LoginSignupRoutingModule { }
