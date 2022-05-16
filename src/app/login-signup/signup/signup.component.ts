import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { IAppState } from 'src/app/store/states/app.states';
import { Store } from '@ngrx/store';
import { SignUpData } from 'src/app/store/actions/prelaunch.actions';
import { Router } from '@angular/router';
import { CommonService } from 'src/app/shared/services/common.service';
import { MatSnackBar, MatBottomSheet } from '@angular/material';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  @Output() dataChange = new EventEmitter();
  registrationForm: FormGroup;
  isAgreed: boolean;
  constructor(
    private store: Store<IAppState>,
    private router: Router    ) { }

  ngOnInit() {
    this.registrationForm = new FormGroup({
      // firstName: new FormControl(''),
      // lastName: new FormControl(''),
      email: new FormControl(''),
      referalCode: new FormControl(''),
      mobileNumber: new FormControl('', Validators.pattern('^[0-9]{10}$')),
    });

    // if (this.prelaunchService.userData) {
    //   this.registrationForm.patchValue({
    //     firstName: this.prelaunchService.userData.firstName,
    //     lastName: this.prelaunchService.userData.lastName,
    //     email: this.prelaunchService.userData.email,
    //     referalCode: this.prelaunchService.getReferralCode() || '',
    //   });
    // } else {
    //   this.store
    //     .pipe(
    //       select(signUpData),
    //       take(1)
    //     )
    //     .subscribe((r) => this.registrationForm.patchValue(r));
    // }

    // if (this.prelaunchService.getReferralCode()) {
    //   this.registrationForm.get('referalCode').setValue(this.prelaunchService.getReferralCode());
    // }

    setTimeout(() => {
      this.registrationForm.valueChanges.subscribe((_) => {
        console.log(this.isAgreed);

        // TODO: remove once store is functional
        this.dataChange.emit(this.registrationForm.value);
        this.store.dispatch(new SignUpData(this.registrationForm.value));
      });
    }, 2000);
  }

  register() {
    // if (this.registrationForm.valid && this.isAgreed) {
    //   this.prelaunchService.setUserData(this.registrationForm.value);
    //   this.commonService.setDataLoading(true);
    //   this.prelaunchService.registerUser().subscribe(
    //     (d: any) => {
    //       this.commonService.setDataLoading(false);
    //       this.prelaunchService.setUserId(d.data.userId);
    //       this.store.dispatch(new SignUpData(this.registrationForm.value));
    //       this.store.dispatch(new Register({ userId: d.data.userId, lanPreference: d.data.lanPreference }));
    //       this.matSnackBar.open(d.message);
    //       this.router.navigate(['login-signup/feedback']);
    //     },
    //     (err) => {
    //       this.commonService.setDataLoading(false);
    //       // TODO: if status is 403 then user is already registered
    //       if (err.status === 403) {
    //         this.bottomSheet.open(SigninOtpComponent, {
    //           data: {
    //             isAlreadyRegistered: true,
    //           }
    //         });
    //       }
    //     }
    //   );
    // } else {
    //   const msg = this.getValidationMessage();
    //   this.matSnackBar.open(msg);
    // }
  }

  get firstName() {
    return this.registrationForm.get('firstName');
  }

  get email() {
    return this.registrationForm.get('email');
  }

  get mobile() {
    return this.registrationForm.get('mobileNumber');
  }

  getValidationMessage(): string {
    let msg = 'Please check all the fields?';

    if (this.firstName.invalid) {
      msg = 'Please provide you first name.';
    } else if (this.email.invalid) {
      msg = 'Please provide valid email id.';
    } else if (this.mobile.invalid) {
      msg = 'Please provide valid mobile number.';
    }
    return msg;
  }

  gotoTerms() {
    const url = `${window.location.origin}/#/terms`;
    window.open(url, '_blank');
  }

  gotoLogin() {
    this.router.navigate(['login-signup']);
  }

}
