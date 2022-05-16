import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SigninOtpComponent } from './signin-otp.component';

describe('SigninOtpComponent', () => {
  let component: SigninOtpComponent;
  let fixture: ComponentFixture<SigninOtpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SigninOtpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SigninOtpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
