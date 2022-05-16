import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AgmCoreModule } from '@agm/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  PitstopViewComponent,
  CustomerLayoutComponent,
  NavBottomComponent,
  NavTopComponent,
  MapVehicleComponent,
  MainContainerComponent
} from './index';
import { CustomerAppRoutes } from './customer-app.routes';
import { AgmDirectionModule } from 'agm-direction';
import { NavMainComponent } from './nav-main/nav-main.component';
import { CustomerService } from './customer.service';
import { OrderService } from './order.service';
import { FoodsLandingItemsComponent } from './foods-landing-items/foods-landing-items.component';
import { FoodsLandingComponent } from './foods-landing/foods-landing.component';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { JoyrideModule } from 'ngx-joyride';
import { PreOrderComponent } from './pre-order/pre-order.component';
import { CustomerCareComponent } from './customer-care/customer-care.component';
import { CartViewComponent } from './cart-view/cart-view.component';
import { CartItemComponent } from './cart-view/cart-item/cart-item.component';
import { BillDetailComponent } from './cart-view/bill-detail/bill-detail.component';
import { OrderAheadComponent } from './order-ahead/order-ahead.component';
import { OrderDeliveryComponent } from './order-delivery/order-delivery.component';
import { RestaurantListComponent } from './restaurant-list/restaurant-list.component';
import { AddAddressComponent } from './address/add-address/add-address.component';
import { BottomAddressComponent } from './address/bottom-address/bottom-address.component';
import { AddVehicleComponent } from './vehicle/add-vehicle/add-vehicle.component';
import { BottomVehicleComponent } from './vehicle/bottom-vehicle/bottom-vehicle.component';
import { MaterialModule } from '../shared/material-module/material.module';
import { SharedModule } from '../shared/shared-components/shared.module';
import { FlexLayoutModule } from '@angular/flex-layout';
import { ProfileComponent } from './profile/profile.component';
import { PitstopLandingComponent } from './pitstop-landing/pitstop-landing.component';
import { MenuListComponent } from './menu-list/menu-list.component';
import { RestaurantsListComponent } from './restaurants-list/restaurants-list.component';
import { PitstopRestaurantComponent } from './pitstop-restaurant/pitstop-restaurant.component';
import { AfterPaymentComponent } from './after-payment/after-payment.component';
import { AddressListComponent } from './cart-view/address-list/address-list.component';
import { VehicleListComponent } from './cart-view/vehicle-list/vehicle-list.component';
import { OrderListComponent } from './order-list/order-list.component';
import { EditProfileComponent } from './profile/edit-profile/edit-profile.component';
import { EssentialsComponent } from './essentials/essentials.component';
import { RecordComponent } from './essentials/record/record.component';
import { EssentialDialogComponent } from './essentials/essential-dialog/essential-dialog.component';
import { OrderDetailComponent } from './order-list/order-detail/order-detail.component';
import { OrderStatusComponent } from './order-status/order-status.component';
import { LanguageComponent } from './language/language.component';
import { NgxImageCompressService } from 'ngx-image-compress';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClient } from '@angular/common/http';
import { createTranslateLoader } from '../shared/models/common-model';

@NgModule({
  declarations: [
    CustomerLayoutComponent,
    NavBottomComponent,
    NavTopComponent,
    MapVehicleComponent,
    PitstopViewComponent,
    MainContainerComponent,
    NavMainComponent,
    FoodsLandingItemsComponent,
    FoodsLandingComponent,
    PreOrderComponent,
    CustomerCareComponent,
    CartViewComponent,
    CartItemComponent,
    BillDetailComponent,
    OrderAheadComponent,
    OrderDeliveryComponent,
    RestaurantListComponent,
    AddAddressComponent,
    BottomAddressComponent,
    AddVehicleComponent,
    BottomVehicleComponent,
    PitstopLandingComponent,
    ProfileComponent,
    MenuListComponent,
    RestaurantsListComponent,
    PitstopRestaurantComponent,
    AfterPaymentComponent,
    AddressListComponent,
    VehicleListComponent,
    OrderListComponent,
    EditProfileComponent,
    EssentialsComponent,
    RecordComponent,
    EssentialDialogComponent,
    OrderDetailComponent,
    OrderStatusComponent,
    LanguageComponent,
  ],
  entryComponents: [
    BillDetailComponent,
    RestaurantListComponent,
    BottomAddressComponent,
    BottomVehicleComponent,
    AddAddressComponent,
    AddVehicleComponent,
    AddressListComponent,
    VehicleListComponent,
    EssentialDialogComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    AgmCoreModule,
    AgmDirectionModule,
    JoyrideModule.forChild(),
    RouterModule.forChild(CustomerAppRoutes),
    SwiperModule,
    FlexLayoutModule,
    TranslateModule.forChild({
      loader: {
        provide: TranslateLoader,
        useFactory: createTranslateLoader,
        deps: [HttpClient]
      },
      isolate: false
    }),
  ],
  bootstrap: [CustomerLayoutComponent],
  providers: [CustomerService, OrderService, NgxImageCompressService],
})
export class CustomerAppModule {}
