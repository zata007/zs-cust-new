import { Routes } from "@angular/router";
import { AddAddressComponent } from "./address/add-address/add-address.component";
import { AfterPaymentComponent } from "./after-payment/after-payment.component";
import { CartViewComponent } from "./cart-view/cart-view.component";
import { CustomerCareComponent } from "./customer-care/customer-care.component";
import { CustomerLayoutComponent } from "./customer-layout/customer-layout.component";
import { EssentialsComponent } from "./essentials/essentials.component";
import { RecordComponent } from "./essentials/record/record.component";
import { LanguageComponent } from "./language/language.component";
import { MapVehicleComponent } from "./map-vehicle/map-vehicle.component";
import { OrderAheadComponent } from "./order-ahead/order-ahead.component";
import { OrderDeliveryComponent } from "./order-delivery/order-delivery.component";
import { OrderDetailComponent } from "./order-list/order-detail/order-detail.component";
import { OrderListComponent } from "./order-list/order-list.component";
import { OrderStatusComponent } from "./order-status/order-status.component";
import { PitstopLandingComponent } from "./pitstop-landing/pitstop-landing.component";
import { PitstopRestaurantComponent } from "./pitstop-restaurant/pitstop-restaurant.component";
import { PitstopViewComponent } from "./pitstop-view/pitstop-view.component";
import { PreOrderComponent } from "./pre-order/pre-order.component";
import { EditProfileComponent } from "./profile/edit-profile/edit-profile.component";
import { ProfileComponent } from "./profile/profile.component";

export const CustomerAppRoutes: Routes = [
  { path: "cart-view", component: CartViewComponent },
  { path: "care", component: CustomerCareComponent },
  { path: "profile", component: ProfileComponent },
  { path: "order-history", component: OrderListComponent },
  { path: "order-placed", component: AfterPaymentComponent },
  { path: "address/add", component: AddAddressComponent },
  { path: "profile/edit", component: EditProfileComponent },
  { path: "essentials", component: EssentialsComponent },
  { path: "essentials/record", component: RecordComponent },
  { path: "order-detail", component: OrderDetailComponent },
  { path: "order-status", component: OrderStatusComponent },
  { path: "language", component: LanguageComponent },
  {
    path: "",
    component: CustomerLayoutComponent,
    pathMatch: "prefix",
    children: [
      { path: "pitstop-landing", component: PitstopLandingComponent },
      { path: "pitstop-restaurant", component: PitstopRestaurantComponent },
      { path: "pitstop/:openType", component: PitstopViewComponent },
      { path: "pitstop", component: PitstopViewComponent },
      { path: "quick-preorder", component: PreOrderComponent },
      { path: "quick-pickup", component: PreOrderComponent },
      { path: "order-ahead", component: OrderAheadComponent },
      { path: "delivery", component: OrderDeliveryComponent },
      { path: "take-away", component: MapVehicleComponent },
      { path: "", component: MapVehicleComponent },
      { path: "**", redirectTo: "", pathMatch: "full" },
    ],
  },
];
