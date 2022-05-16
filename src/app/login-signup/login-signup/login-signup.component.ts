import { Component, OnInit } from "@angular/core";
import { MatBottomSheet, MatSnackBar } from "@angular/material";
import { SigninOtpComponent } from "../signin-otp/signin-otp.component";
import {
  IResponseLoginSignup,
  ILoginSignupData,
  IRequestVerifyOtp,
  IResponseGetProfileData,
} from "src/app/shared/models/common-model";
import { Router } from "@angular/router";
import { CommonService } from "src/app/shared/services/common.service";
import { ELoginSignup } from "../models";
import { DataService } from "src/app/shared/services/data.service";
import {
  ZATAAKSE_JWT_TOKEN,
  ZATAAKSE_PROFILE_DATA,
} from "src/app/shared/constants/constants";
import { CustomerService } from "src/app/customer-app/customer.service";
import { CustomerStateService } from "src/app/customer-app/customer-state.service";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-login-signup",
  templateUrl: "./login-signup.component.html",
  styleUrls: ["./login-signup.component.scss"],
})
export class LoginSignupComponent implements OnInit {
  // @ViewChild(SignupComponent) signupComponent: SignupComponent;
  selected = 0;
  ELoginSignup = ELoginSignup;
  loginMobNumber = null;
  isRegistrationFormValid = false;
  userByMobile: ILoginSignupData;
  signupData: any;
  constructor(
    private bottomSheet: MatBottomSheet,
    private router: Router,
    private snack: MatSnackBar,
    private commonService: CommonService,
    private dataService: DataService,
    private customerService: CustomerService,
    private snackbar: MatSnackBar,
    private translateService: TranslateService,
    private customerStateService: CustomerStateService
  ) {}

  ngOnInit() {}

  onLoginNumberUpdate(mobNumber: number) {
    // console.log(mobNumber);
    this.loginMobNumber = mobNumber;
  }

  openVerifyOTP() {
    this.bottomSheet.open(SigninOtpComponent, {
      data: {
        isOtp: true,
        userId: this.userByMobile.userId,
        onProceed: (otp) => this.verifyLoginOtp(otp),
      },
    });
  }

  verifyLoginOtp(otp: number) {
    const { fingerprint, lan } = this.commonService.getRequestEssentialParams();
    const { latitude, longitude } =
      this.commonService.getRequestEssentialParams();
    const data: IRequestVerifyOtp = {
      userId: this.userByMobile.userId,
      mobileOTP: otp,
      pRoleId: this.userByMobile.pRoleId,
      pRelationId: this.userByMobile.pRelationId,
      fingerprint,
      lan,
      pInterface: this.commonService.getPlatformParams().interfaceData[0]._id,
    };
    this.dataService.verifyOtp(data, latitude, longitude).subscribe(
      (resVerifyOTP) => {
        this.bottomSheet.dismiss();
        const data = { ...resVerifyOTP.data.indDetail };
        localStorage.setItem(ZATAAKSE_JWT_TOKEN, data.accessToken);
        this.customerService
          .getProfile(localStorage.getItem(ZATAAKSE_JWT_TOKEN))
          .subscribe((resData: IResponseGetProfileData) => {
            // Store profile data
            localStorage.setItem(
              ZATAAKSE_PROFILE_DATA,
              JSON.stringify(resData.data)
            );
          });
        // data.id = data._id;
        // this.store.dispatch(new SignIn(data));
        // this.cookieService.setUserData(data);
        // if navigated from cart then navigate back to cart-view page
        if (this.customerStateService.currentEssentialServiceData) {
          this.router.navigate(["customer/cart-view"]);
        } else {
          this.router.navigate(["customer"]);
        }
      },
      (err) => {
        this.translateService
          .get("LOGIN_SIGNUP.CHECK_OTP")
          .subscribe((res: string) => {
            this.snackbar.open(res);
          });
      },
      () => {
        this.bottomSheet.dismiss();
      }
    );
  }

  onSubmitButtonClick() {
    switch (this.selected) {
      case ELoginSignup.Login:
        this.handleLoginSignupRequest("login");
        return;
      case ELoginSignup.Signup:
        this.handleLoginSignupRequest("register");
        return;

      default:
        break;
    }
  }

  handleLoginSignupRequest(type: string) {
    // TODO: Send register data.
    const params = this.commonService.getPlatformParams();
    const { latitude, longitude } =
      this.commonService.getRequestEssentialParams();
    const data = {
      ...this.commonService.getRequestEssentialParams(),
      data: {
        indMobileNum:
          type === "register"
            ? this.signupData.mobileNumber
            : this.loginMobNumber,
        indCountryCode: "91",
        pRoleId: params.interfaceData[0].pRoleId,
        pRelationId: params.interfaceData[0].pRelationId,
        pInterface: params.interfaceData[0]._id,
        reqType: type,
        indEmailNotify: true,
        indMobileNotify: true,
        indPushNotify: true,
      },
      latitude,
      longitude,
    };
    if (type === "register" && this.signupData.email) {
      data.data["indEmail"] = this.signupData.email;
    }
    this.dataService.registerLogin(data).subscribe(
      (res: IResponseLoginSignup) => {
        this.userByMobile = res.data;
        this.openVerifyOTP();
      },
      (error) => {
        if (error.error.statusCode === 400) {
          this.bottomSheet.open(SigninOtpComponent, {
            data: {
              isNotRegistered: true,
              onProceed: (typeInfo) => this.onProceedFromBottomSheet(typeInfo),
            },
          });
        } else if (error.error) {
          this.snack.open(error.error.message);
        }
      }
    );
  }

  onProceedFromBottomSheet(type: number) {
    switch (type) {
      case ELoginSignup.Login:
        this.onPanelSelect(ELoginSignup.Login);
        return;
      case ELoginSignup.Signup:
        this.onPanelSelect(ELoginSignup.Signup);
        return;

      default:
        break;
    }
  }

  onSignupDataChange(value: any) {
    this.signupData = value;
  }

  onPanelSelect(selected: number) {
    this.selected = selected;
  }
}
