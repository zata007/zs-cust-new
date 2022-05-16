import { Component, OnInit } from '@angular/core';
import { CustomerStateService } from '../customer-state.service';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-nav-bottom',
  templateUrl: './nav-bottom.component.html',
  styleUrls: ['./nav-bottom.component.scss']
})
export class NavBottomComponent implements OnInit {
  cartCount = 20;

  constructor(public orderService: OrderService) { }

  ngOnInit() {
    // {{orderService.orderCount$ | async}}

    this.orderService.orderCount$.subscribe(res=>{
      this.cartCount = res;
    });
  }

}
