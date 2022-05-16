import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EssentialDialogComponent } from './essential-dialog.component';

describe('EssentialDialogComponent', () => {
  let component: EssentialDialogComponent;
  let fixture: ComponentFixture<EssentialDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EssentialDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EssentialDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
