import { Component, Inject, OnInit } from '@angular/core';
import {
  MatBottomSheet, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA
} from '@angular/material/bottom-sheet';
import { LocationDialogComponent } from '../location-dialog/location-dialog.component';

@Component({
  selector: 'app-location-popup',
  templateUrl: './location-popup.component.html',
  styleUrls: ['./location-popup.component.scss'],
})
export class LocationPopupComponent implements OnInit {
  isLocationNotAllowed = false;
  constructor(
    private bottomSheet: MatBottomSheet,
    private bottomSheetRef: MatBottomSheetRef<LocationPopupComponent>,
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any
  ) {
    this.isLocationNotAllowed = data.isLocationNotAllowed;
  }

  ngOnInit() {}

  gotoHelpForLocation() {
    this.bottomSheetRef.dismiss();
    this.openDialog();
  }

  openDialog(): void {
    const dialogRef = this.bottomSheet.open(LocationDialogComponent, {
      data: null,
    });

    dialogRef.afterDismissed().subscribe((result) => {
      // Navigate to page
      // console.log('The dialog was closed', result);
    });
  }

  onAllow() {
    this.bottomSheetRef.dismiss();
  }
}
