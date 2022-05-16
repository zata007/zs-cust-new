import { Component, ViewChild, OnInit, AfterViewInit, Output, EventEmitter, Input } from '@angular/core';

import {
  SwiperComponent,
  SwiperDirective,
  SwiperConfigInterface,
  SwiperScrollbarInterface,
  SwiperPaginationInterface,
} from 'ngx-swiper-wrapper';
import { Marker } from '@agm/core/services/google-maps-types';

@Component({
  selector: 'card-slider',
  templateUrl: './card-slider.component.html',
  styleUrls: ['./card-slider.component.scss'],
})
export class CardSliderComponent implements OnInit {
  @Output() slideChange = new EventEmitter(null);
  @Output() itemClicked = new EventEmitter(null);
  @Input() data = [];
  @Input() selectedIndex = 0;
  public config: SwiperConfigInterface = {
    slidesPerView: 'auto',
    centeredSlides: true,
    spaceBetween: 20,
  };

  @ViewChild(SwiperComponent, {static: false}) componentRef: SwiperComponent;
  @ViewChild(SwiperDirective, {static: false}) directiveRef: SwiperDirective;

  constructor() {}

  ngOnInit(): void {}

  public onIndexChange(index: number) {
    this.slideChange.emit(this.data[index]);
  }

  onItemClick(item: any) {
    this.itemClicked.emit(item);
  }
}
