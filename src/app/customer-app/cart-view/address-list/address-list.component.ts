import { Component, OnInit, Inject } from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { IAddressData } from 'src/app/shared/models/common-model';

@Component({
  selector: 'app-address-list',
  templateUrl: './address-list.component.html',
  styleUrls: ['./address-list.component.scss']
})
export class AddressListComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottemSheetRef: MatBottomSheetRef<AddressListComponent>
  ) { }

  ngOnInit() {}

  onAddressSelection(selectedAddress: IAddressData) {
    this.bottemSheetRef.dismiss(selectedAddress);
  }

}
