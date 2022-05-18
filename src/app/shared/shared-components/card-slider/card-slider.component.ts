import {
  Component, EventEmitter,
  Input, OnInit, Output, ViewChild
} from '@angular/core';
import {
  SwiperComponent, SwiperConfigInterface, SwiperDirective
} from 'ngx-swiper-wrapper';


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

  @ViewChild(SwiperComponent, { static: false }) componentRef: SwiperComponent;
  @ViewChild(SwiperDirective, { static: false }) directiveRef: SwiperDirective;

  constructor() {}

  ngOnInit(): void {}

  public onIndexChange(index: number) {
    this.slideChange.emit(this.data[index]);
  }

  onItemClick(item: any) {
    this.itemClicked.emit(item);
  }
}
