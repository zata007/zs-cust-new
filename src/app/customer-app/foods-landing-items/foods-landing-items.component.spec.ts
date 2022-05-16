import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodsLandingItemsComponent } from './foods-landing-items.component';

describe('FoodsLandingItemsComponent', () => {
  let component: FoodsLandingItemsComponent;
  let fixture: ComponentFixture<FoodsLandingItemsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodsLandingItemsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodsLandingItemsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
