import { NgModule } from '@angular/core';
import { CarousalComponent, MaterialModule, LoaderComponent, PageNotFoundComponent, TermsAndConditionComponent } from './index';
import { CommonModule } from '@angular/common';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CardSliderComponent } from './card-slider/card-slider.component';

import { SwiperModule } from 'ngx-swiper-wrapper';
import { DialogPreOrderComponent } from './dialog-pre-order/dialog-pre-order.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CartNotEmptyComponent } from './cart-not-empty/cart-not-empty.component';
@NgModule({
  imports: [CommonModule, FormsModule, ReactiveFormsModule, SwiperModule, MaterialModule],
  exports: [
    CarousalComponent,
    LoaderComponent,
    MaterialModule,
    PageNotFoundComponent,
    TermsAndConditionComponent,
    CardSliderComponent,
    DialogPreOrderComponent,
    CartNotEmptyComponent
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
