import { Component, Inject, OnInit, ViewEncapsulation } from '@angular/core';
import {
  MatBottomSheet, MatBottomSheetRef,
  MAT_BOTTOM_SHEET_DATA
} from '@angular/material/bottom-sheet';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { CommonService } from '../../services/common.service';
import { DataService } from '../../services/data.service';
import { TextDialogComponent } from '../text-dialog/text-dialog.component';

@Component({
  selector: 'app-not-serviceble',
  templateUrl: './not-serviceble.component.html',
  styleUrls: ['./not-serviceble.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class NotServicebleComponent implements OnInit {
  isSubmitRequestVisible = false;
  location = '';
  mailText = '';
  name = '';
  message: boolean = true;
  restaurantData = {
    name: '',
    contact: '',
    address: '',
  };
  constructor(
    private bottomSheetRef: MatBottomSheetRef<NotServicebleComponent>,
    private bottomSheet: MatBottomSheet,
    private dataService: DataService,
    private commonService: CommonService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog,
    private translateService: TranslateService,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
    this.location = data.location;
    this.name = data.name;
  }

  ngOnInit() {}

  requestService() {
    this.isSubmitRequestVisible = !this.isSubmitRequestVisible;
  }

  closePage() {
    this.bottomSheetRef.dismiss();
  }

  proceed() {
    this.isSubmitRequestVisible = true;
  }

  then() {
    this.message = false;
  }

  mailMe() {
    // this.mailText = `mailto:partners@zataakse.com?subject=Restaurant-Request&body=name:${this.restaurantData.name}<br> contact:${this.restaurantData.contact}<br> address:${this.restaurantData.address}`;
    // window.location.href = this.mailText;
    this.dataService
      .recommendRest({
        ...this.commonService.getRequestEssentialParams(),
        data: {
          mobileNum: this.restaurantData.contact,
          restAddr: this.restaurantData.address,
          restName: this.restaurantData.name,
          countryCode: 'IND',
        },
      })
      .subscribe(
        (res: any) => {
          this.closePage();
          this.translateService
            .get('ESSENTIAL_SERVICE.MODAL_TEXT')
            .subscribe((res: string) => {
              this.dialog.open(TextDialogComponent, {
                data: {
                  from: 'not-serviceble',
                  msg: res,
                },
              });
            });
        },
        (err) => {
          this.snackbar.open(err.error.message);
        }
      );
    // TODO: Integrate recom restaurant
    // this.bottomSheet.open(PreRegisterComponent, {});
  }
}
