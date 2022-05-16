import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FoodsLandingComponent } from './foods-landing.component';

describe('FoodsLandingComponent', () => {
  let component: FoodsLandingComponent;
  let fixture: ComponentFixture<FoodsLandingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FoodsLandingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FoodsLandingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
