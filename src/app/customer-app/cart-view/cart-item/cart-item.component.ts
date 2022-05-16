import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { MatIconRegistry } from '@angular/material';
import { IMenuData } from 'src/app/shared/models/common-model';

@Component({
  selector: 'app-cart-item',
  templateUrl: './cart-item.component.html',
  styleUrls: ['./cart-item.component.scss']
})
export class CartItemComponent implements OnInit {
  @Input() data: IMenuData;
  @Output() public addUnit = new EventEmitter();
  @Output() public removeUnit = new EventEmitter();
  @Output() public removeItem = new EventEmitter();

  constructor(private matIconRegistry: MatIconRegistry, private domSanitizer: DomSanitizer) {
    this.matIconRegistry.addSvgIcon('svg-minus', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/minus.svg'));
    this.matIconRegistry.addSvgIcon('svg-plus', this.domSanitizer.bypassSecurityTrustResourceUrl('../../../../assets/icons/plus.svg'));
   }

  ngOnInit() {
  }

}
