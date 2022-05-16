import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomAddressComponent } from './bottom-address.component';

describe('BottomAddressComponent', () => {
  let component: BottomAddressComponent;
  let fixture: ComponentFixture<BottomAddressComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomAddressComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
