import { Component, OnInit, Inject } from "@angular/core";
import {
  MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA,
  MatSnackBar,
} from "@angular/material";
import { ELoginSignup } from "../models";
import { DataService } from "src/app/shared/services/data.service";
import { CommonService } from "src/app/shared/services/common.service";

export interface ISigninOtpComponentData {
  isNotRegistered: boolean;
  isFailed: boolean;
  isAlreadyRegistered: boolean;
  isOtp: boolean;
  userId: string;
  onProceed: (type: any) => void;
}

@Component({
  selector: "app-signin-otp",
  templateUrl: "./signin-otp.component.html",
  styleUrls: ["./signin-otp.component.scss"],
})
export class SigninOtpComponent implements OnInit {
  otp = null;
  isFailed = false;
  isNotRegistered = false;
  isAlreadyRegistered = false;
  isOtp = false;
  constructor(
    private matSnackBar: MatSnackBar,
    private dataService: DataService,
    private commonService: CommonService,
    private bottomSheetRef: MatBottomSheetRef<SigninOtpComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: ISigninOtpComponentData
  ) {
    this.isNotRegistered = data.isNotRegistered;
    this.isFailed = data.isFailed;
    this.isAlreadyRegistered = data.isAlreadyRegistered;
    this.isOtp = data.isOtp;
  }

  ngOnInit() {}

  onClose() {
    this.bottomSheetRef.dismiss();
  }

  gotoLogin() {
    this.onClose();
    this.data.onProceed(ELoginSignup.Login);
  }

  gotoSignup() {
    this.onClose();
    this.data.onProceed(ELoginSignup.Signup);
  }

  verifyOtp() {
    this.data.onProceed(this.otp);
  }

  resendOTP() {
    const essentialParams = this.commonService.getRequestEssentialParams();
    const params = this.commonService.getPlatformParams();
    this.dataService
      .resendOTP(
        {
          pRoleId: params.interfaceData[0].pRoleId,
          pRelationId: params.interfaceData[0].pRelationId,
          userId: this.data.userId,
        },
        essentialParams.fingerprint,
        essentialParams.latitude,
        essentialParams.longitude
      )
      .subscribe((d: any) => {
        this.matSnackBar.open(d.message, "", { duration: 2000 });
      });
  }

  getHeaderText(): string {
    if (this.isNotRegistered) {
      return "LOGIN_SIGNUP.NOT_REGISTERED";
    } else if (this.isAlreadyRegistered) {
      return "LOGIN_SIGNUP.ALREADY_REGISTERED";
    }
    return "LOGIN_SIGNUP.VERIFY_OTP";
  }
}
