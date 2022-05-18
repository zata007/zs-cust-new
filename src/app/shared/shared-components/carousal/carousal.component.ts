import { Component, OnInit } from '@angular/core';
import { ANIMATION_SLIDE } from 'src/app/shared/animation';

@Component({
  selector: 'carousal',
  templateUrl: 'carousal.component.html',
  styleUrls: ['./carousal.component.scss'],
  animations: [ANIMATION_SLIDE],
})
export class CarousalComponent implements OnInit {
  animationState: string;
  currentIndex = 0;
  constructor() {}

  ngOnInit() {}

  onPrev() {
    this.setAnimation();
    this.currentIndex = this.currentIndex === 0 ? 2 : this.currentIndex - 1;
  }
  onNext() {
    this.setAnimation('next');
    this.currentIndex = (this.currentIndex + 1) % 3;
  }

  onClickBubble(num: number) {
    if (num < this.currentIndex) {
      this.setAnimation();
    } else {
      this.setAnimation('next');
    }
    this.currentIndex = num;
  }

  setAnimation(side?: string) {
    if (side === 'next') {
      this.animationState = 'slideRight-start';
      setTimeout(() => {
        this.animationState = 'slideRight-end';
      }, 0);
    } else {
      this.animationState = 'slideLeft-start';
      setTimeout(() => {
        this.animationState = 'slideLeft-end';
      }, 0);
    }
  }
}
