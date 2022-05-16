import { Component, OnInit, EventEmitter, Output, Input, ViewChild } from '@angular/core';
import { SwiperComponent, SwiperDirective, SwiperConfigInterface } from 'ngx-swiper-wrapper';

interface IFoodItem {
  id?: number;
  name: string;
  isVeg: boolean;
  url?: string;
}
@Component({
  selector: 'foods-landing-items',
  templateUrl: './foods-landing-items.component.html',
  styleUrls: ['./foods-landing-items.component.scss'],
})
export class FoodsLandingItemsComponent implements OnInit {
  @Output() slideChange = new EventEmitter(null);
  @Output() itemClicked = new EventEmitter(null);
  @Input() data: IFoodItem[] = [
    { name: 'Pao Bhaji', isVeg: true },
    { name: 'Burger', isVeg: true },
    { name: 'Chicken tikka', isVeg: false },
    { name: 'Chicken Tandoori', isVeg: false },
    { name: 'Pork masala', isVeg: false },
    { name: 'Chicken Kabab', isVeg: false },
    { name: 'Samosa', isVeg: true },
    { name: 'Sweet', isVeg: true },
  ];
  @Input() selectedIndex = 0;
  public config: SwiperConfigInterface = {
    slidesPerView: 'auto',
    centeredSlides: false,
    spaceBetween: 5,
  };

  @ViewChild(SwiperComponent, {static: false}) componentRef: SwiperComponent;
  @ViewChild(SwiperDirective, { static: false}) directiveRef: SwiperDirective;

  constructor() {}

  ngOnInit(): void {}

  public onIndexChange(index: number) {
    // console.log(index);
    this.slideChange.emit(this.data[index]);
  }

  onItemClick(item: any) {
    this.itemClicked.emit(item);
  }
}
