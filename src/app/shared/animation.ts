import { trigger, state, style, transition, animate, keyframes } from '@angular/animations';

export const ANIMATION_SLIDE = trigger('onSlide', [
  state(
    'slideLeft-start',
    style({
      transform: 'translate3d(-100%, 0, 0)',
      visibility: 'visible',
      overflow: 'hidden',
    })
  ),
  state(
    'slideLeft-end',
    style({
      transform: 'translate3d(0, 0, 0)',
      overflow: 'hidden',
    })
  ),
  state(
    'slideRight-start',
    style({
      transform: 'translate3d(100%, 0, 0)',
      visibility: 'visible',
      overflow: 'hidden',
    })
  ),
  state(
    'slideRight-end',
    style({
      transform: 'translate3d(0, 0, 0)',
      overflow: 'hidden',
    })
  ),
  transition('slideLeft-start => slideLeft-end', animate('600ms ease-in')),
  transition('slideRight-start => slideRight-end', animate('600ms ease-out')),
]);


export const ANIMATION_TEXT = trigger('onTextChange', [
  state(
    'text-start',
    style({
      transform: 'translate3d(-100%, 0, 0)',
      visibility: 'visible',
      overflow: 'hidden',
    })
  ),
  state(
    'text-end',
    style({
      transform: 'translate3d(0, 0, 0)',
      overflow: 'hidden',
    })
  ),
  transition('text-start => text-end', animate('600ms ease-in', keyframes([
    style({ opacity: 0,
      transform: 'translate3d(100%, 0, 0)'
     }),
    style({ opacity: 1,
      transform: 'translate3d(0, 0, 0)' })
  ])))
]);
