import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LandingPageComponent } from './landing-page/landing-page.component';
import { PageNotFoundComponent } from './shared/shared-components/page-not-found/page-not-found.component';
import { DirectAccessGuard } from './shared/guards/direct-access.guard';
import { PaymentComponent } from './payment/payment.component';


const routes: Routes = [
  { path: 'no-internet', component: PageNotFoundComponent, canActivate: [DirectAccessGuard] },
  { path: 'payment-status', component: PaymentComponent },
  { path: 'user/payment-response', component: PaymentComponent },
  {
    path: 'customer',
    loadChildren: './customer-app/customer-app.module#CustomerAppModule',
    data: { preload: true },
  },
  {
    path: 'login-signup',
    loadChildren: './login-signup/login-signup.module#LoginSignupModule',
    data: { preload: true },
  },
  { path: '', component: LandingPageComponent },
  { path: '**', component: PageNotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: false})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
