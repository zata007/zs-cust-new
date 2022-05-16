import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BottomVehicleComponent } from './bottom-vehicle.component';

describe('BottomVehicleComponent', () => {
  let component: BottomVehicleComponent;
  let fixture: ComponentFixture<BottomVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BottomVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BottomVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
