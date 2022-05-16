import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapVehicleComponent } from './map-vehicle.component';

describe('MapVehicleComponent', () => {
  let component: MapVehicleComponent;
  let fixture: ComponentFixture<MapVehicleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapVehicleComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
