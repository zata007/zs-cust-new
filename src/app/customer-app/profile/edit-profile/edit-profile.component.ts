import { Component, OnInit } from "@angular/core";
import { Router } from "@angular/router";
import { Location } from "@angular/common";
import {
  IProfileData,
  IUpdateProfiledata,
  IUploadImage,
} from "../../../shared/models/common-model";
import { ZATAAKSE_PROFILE_DATA } from "../../../shared/constants/constants";
import {
  FormGroup,
  FormControl,
  Validators,
  FormGroupDirective,
} from "@angular/forms";
import { DataService } from "../../../shared/services/data.service";
import { MatSnackBar } from "@angular/material";
import { TranslateService } from "@ngx-translate/core";
import { NgxImageCompressService, DOC_ORIENTATION } from "ngx-image-compress";

@Component({
  selector: "app-edit-profile",
  templateUrl: "./edit-profile.component.html",
  styleUrls: ["./edit-profile.component.scss"],
})
export class EditProfileComponent implements OnInit {
  profile: IProfileData;
  image: any;
  uploadedImg: File;
  langs: Array<{ value: String; viewValue: String }> = [
    { value: "en", viewValue: "LANGUAGE.ENGLISH" },
    { value: "hn", viewValue: "LANGUAGE.HINDI" },
    { value: "bn", viewValue: "LANGUAGE.BENGALI" },
    { value: "gu", viewValue: "LANGUAGE.GUJRATI" },
  ];
  profileForm: FormGroup;
  updateProfile: any = [];
  selectedImage: File;

  constructor(
    private location: Location,
    private dataService: DataService,
    public router: Router,
    private snackbar: MatSnackBar,
    private translateService: TranslateService,
    private imageCompress: NgxImageCompressService
  ) {}

  ngOnInit() {
    this.profileForm = new FormGroup({
      indFirstName: new FormControl("", [Validators.required]),
      indLastName: new FormControl(""),
      indEmail: new FormControl("", [Validators.required, Validators.email]),
      indDob: new FormControl(""),
      indGender: new FormControl(""),
      indFoodPref: new FormControl(""),
      indLanPref: new FormControl(""),
    });

    this.profile = JSON.parse(localStorage.getItem(ZATAAKSE_PROFILE_DATA));
    if (this.profile.indDetail.basic.indPic) {
      this.image = this.profile.indDetail.basic.indPic[0].thumbnail;
    } else {
      this.image = "../../../assets/img/core/user.png";
    }
  }

  onSelectFile(event) {
    if (event.target.files && event.target.files[0]) {
      this.selectedImage = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (onloadEvent: any) => {
        this.image = reader.result;
        this.compressFile(onloadEvent.target.result, this.selectedImage.name);
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  compressFile(image, fileName) {
    this.imageCompress
      .compressFile(image, DOC_ORIENTATION.NotDefined, 100, 20)
      .then((result) => {
        // create file from byte
        // call method that creates a blob from dataUri
        const imageBlob = this.dataURItoBlob(result.split(",")[1]);
        const imageFile = new File([imageBlob], fileName, {
          type: "image/jpeg",
        });
        this.uploadedImg = imageFile;
      });
  }

  dataURItoBlob(dataURI) {
    const byteString = window.atob(dataURI);
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const int8Array = new Uint8Array(arrayBuffer);
    for (let i = 0; i < byteString.length; i++) {
      int8Array[i] = byteString.charCodeAt(i);
    }
    const blob = new Blob([int8Array], { type: "image" });
    return blob;
  }

  onBackClick() {
    this.location.back();
  }

  firstNameChange() {
    this.updateProfile = {
      ...this.updateProfile,
      indFirstName: this.profileForm.value["indFirstName"],
    };
  }

  lastNameChange() {
    this.updateProfile = {
      ...this.updateProfile,
      indLastName: this.profileForm.value["indLastName"],
    };
  }

  emailChange() {
    this.updateProfile = {
      ...this.updateProfile,
      indEmail: this.profileForm.value["indEmail"],
    };
  }

  dobChange() {
    this.updateProfile = {
      ...this.updateProfile,
      indDob: this.profileForm.value["indDob"],
    };
  }

  genderChange() {
    this.updateProfile = {
      ...this.updateProfile,
      indGender: this.profileForm.value["indGender"],
    };
  }

  foodchange() {
    this.updateProfile = {
      ...this.updateProfile,
      indFoodPref: this.profileForm.value["indFoodPref"],
    };
  }

  langChange() {
    this.updateProfile = {
      ...this.updateProfile,
      indLanPref: this.profileForm.value["indLanPref"],
    };
  }

  onSubmit() {
    this.dataService.updateProfile(this.updateProfile).subscribe(
      (res) => {
        if (this.uploadedImg && this.selectedImage.name) {
          const imageData: IUploadImage = {
            id: JSON.parse(localStorage.getItem(ZATAAKSE_PROFILE_DATA))
              .indDetail._id,
            imageType: "up",
            imageName: this.selectedImage.name,
            image: this.uploadedImg,
          };
          console.log(imageData.image);
          this.dataService.uploadImage(imageData).subscribe((data) => {});
        }
        this.translateService
          .get("ADD_ADDRESS.SUCCESSFULLY_SAVED")
          .subscribe((res: string) => {
            this.snackbar.open(res);
          });
        this.router.navigate(["customer/profile"]);
      },
      (err) => {
        this.snackbar.open(err.error.message);
      }
    );
  }
}
