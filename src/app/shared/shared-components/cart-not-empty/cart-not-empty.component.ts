import { Component, OnInit } from '@angular/core';
import { MatBottomSheetRef } from '@angular/material';

@Component({
  selector: 'app-cart-not-empty',
  templateUrl: './cart-not-empty.component.html',
  styleUrls: ['./cart-not-empty.component.scss']
})
export class CartNotEmptyComponent implements OnInit {

  constructor(private bottomSheetRef: MatBottomSheetRef) { }

  ngOnInit() {
  }

  proceed() {
    this.bottomSheetRef.dismiss('clear');
  }

  cancel() {
    this.bottomSheetRef.dismiss();
  }

}
