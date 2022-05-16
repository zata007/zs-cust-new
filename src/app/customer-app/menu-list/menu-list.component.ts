import { Component, OnInit, Input } from '@angular/core';
import { OrderService } from '../order.service';
import { MatIconRegistry } from '@angular/material';
import { DomSanitizer } from '@angular/platform-browser';
import { IMenuData } from 'src/app/shared/models/common-model';
import { CartNotEmptyComponent } from 'src/app/shared/shared-components/cart-not-empty/cart-not-empty.component';
import { MatBottomSheet } from '@angular/material';
import { CustomerStateService } from '../customer-state.service';
import { ECustomerServiceType } from '../../shared/constants/constants'

@Component({
  selector: 'app-menu-list',
  templateUrl: './menu-list.component.html',
  styleUrls: ['./menu-list.component.scss']
})
export class MenuListComponent implements OnInit {

  cartCount: number;
  ECustomerServiceType = ECustomerServiceType;

  @Input() foods: IMenuData[] = [];
  @Input() resName: string;
  constructor(
    private orderService: OrderService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,
    private bottomSheet: MatBottomSheet,
    private customerStateService: CustomerStateService,
    ) {
    this.matIconRegistry.addSvgIcon('svg-minus', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/minus.svg'));
    this.matIconRegistry.addSvgIcon('svg-plus', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../assets/icons/plus.svg'));
   }

  ngOnInit() {
    this.orderService.orderCount$.subscribe(res => {
      this.cartCount = res;
    });
  }

  removeFromCart(item: IMenuData) {
    this.orderService.removeFromCart(item);
  }
  addToCart(item: IMenuData) {
    if(this.customerStateService.currentServiceSelected == ECustomerServiceType.OrderAhead) {
      if((this.cartCount>0 && this.orderService.getCartData()[0].apPsBusinessLocId == item.apPsBusinessLocId) || this.cartCount == 0) {
        this.orderService.addToCart({...item});
      } else {
        const cartNotEmptyRef = this.bottomSheet.open(CartNotEmptyComponent);
        cartNotEmptyRef.afterDismissed().subscribe(res => {
          if (res) {
            this.orderService.clearCart();
            this.orderService.addToCart({...item});
          }
        });
      }
    } else {      
      this.orderService.addToCart({...item});
    }
  }

  isAddedToCart(item: IMenuData) {
    return this.orderService.isAddedToCart(item);
  }

  countInCart(item: IMenuData) {
    return this.orderService.countInCart(item);
  }

  getPrice(item: number) {
    return this.orderService.getPrice(item);
  }


}
