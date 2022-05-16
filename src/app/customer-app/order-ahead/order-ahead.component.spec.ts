import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { OrderAheadComponent } from './order-ahead.component';

describe('OrderAheadComponent', () => {
  let component: OrderAheadComponent;
  let fixture: ComponentFixture<OrderAheadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ OrderAheadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrderAheadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
