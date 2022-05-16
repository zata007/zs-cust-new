import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PitstopRestaurantComponent } from './pitstop-restaurant.component';

describe('PitstopRestaurantComponent', () => {
  let component: PitstopRestaurantComponent;
  let fixture: ComponentFixture<PitstopRestaurantComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PitstopRestaurantComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PitstopRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
