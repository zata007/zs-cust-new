import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { CardSliderComponent } from './card-slider/card-slider.component';
import { CartNotEmptyComponent } from './cart-not-empty/cart-not-empty.component';
import { DialogPreOrderComponent } from './dialog-pre-order/dialog-pre-order.component';
import {
  CarousalComponent,
  LoaderComponent,
  MaterialModule,
  PageNotFoundComponent,
  TermsAndConditionComponent
} from './index';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    SwiperModule,
    MaterialModule,
  ],
  exports: [
    CarousalComponent,
    LoaderComponent,
    MaterialModule,
    PageNotFoundComponent,
    TermsAndConditionComponent,
    CardSliderComponent,
    DialogPreOrderComponent,
    CartNotEmptyComponent,
  ],
  declarations: [
    CarousalComponent,
    LoaderComponent,
    PageNotFoundComponent,
    TermsAndConditionComponent,
    CardSliderComponent,
    DialogPreOrderComponent,
    CartNotEmptyComponent,
  ],
  entryComponents: [DialogPreOrderComponent, CartNotEmptyComponent],
  providers: [],
})
export class SharedModule {}
