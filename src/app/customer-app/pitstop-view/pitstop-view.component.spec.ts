import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PitstopViewComponent } from './pitstop-view.component';

describe('PitstopViewComponent', () => {
  let component: PitstopViewComponent;
  let fixture: ComponentFixture<PitstopViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PitstopViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PitstopViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
