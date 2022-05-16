import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  SwiperComponent,
  SwiperDirective,
  SwiperConfigInterface,
  SwiperScrollbarInterface,
  SwiperPaginationInterface
} from 'ngx-swiper-wrapper';

@Component({
  selector: 'app-pre-order',
  templateUrl: './pre-order.component.html',
  styleUrls: ['./pre-order.component.scss'],
})
export class PreOrderComponent implements OnInit {
  restaurants = [
    {
      id: 1,
      name: 'fasoos',
      description: 'Finest imported soft cheese gently melting over toasted bread with sauteed mushrooms and Italian white truffle oil.',
    },
    {
      id: 2,
      name: 'Havmour',
      description: 'Succulent pieces of boneless chicken marinated in ginger and garlic, spiced with freshly pounded black peppercorns',
    },
    {
      id: 1,
      name: 'Lapinoz Taste',
      description: 'Finest imported soft cheese gently melting over toasted bread with sauteed mushrooms and Italian white truffle oil.',
    },
  ];

  public show: boolean = true;

  public slides = [
    'First slide',
    'Second slide',
    'Third slide',
    'Fourth slide',
    'Fifth slide',
    'Sixth slide'
  ];

  public type: string = 'component';

  public disabled: boolean = false;

  public config: SwiperConfigInterface = {
    direction: 'horizontal',
    slidesPerView: 1.5,
    keyboard: true,
    mousewheel: true,
    scrollbar: false,
    navigation: false,
    pagination: false
  };

  private scrollbar: SwiperScrollbarInterface = {
    el: '.swiper-scrollbar',
    hide: false,
    draggable: true
  };

  private pagination: SwiperPaginationInterface = {
    el: '.swiper-pagination',
    clickable: true,
    hideOnClick: false
  };


  constructor(private router: Router) {}

  ngOnInit() {}

  onClickOverItem(restaurant: { id: number; name: string; description: string }) {
    this.router.navigate([`/customer/pitstop/${restaurant.id}`]);
  }

  public onIndexChange(index: number) {
  }
}
