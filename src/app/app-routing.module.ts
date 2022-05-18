import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PageNotFoundComponent } from './shared/shared-components';

const routes: Routes = [
  // { path: 'no-internet', component: PageNotFoundComponent, canActivate: [DirectAccessGuard] },
  // { path: 'payment-status', component: PaymentComponent },
  // { path: 'user/payment-response', component: PaymentComponent },
  // {
  //   path: 'customer',
  //   loadChildren: './customer-app/customer-app.module#CustomerAppModule',
  //   data: { preload: true },
  // },
  {
    path: 'login-signup',
    loadChildren: () =>
      import('./login-signup/login-signup.module').then(
        (m) => m.LoginSignupModule
      ),
    data: { preload: true },
  },
  { path: '', component: LandingPageComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
