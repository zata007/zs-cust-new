import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { MAT_BOTTOM_SHEET_DATA, MatSnackBar } from '@angular/material';
import { MatBottomSheetRef } from '@angular/material/bottom-sheet';
import { FormGroup, FormControl } from '@angular/forms';
import { DataService } from '../../../shared/services/data.service';
import { IReqAddressData, IAddressData } from 'src/app/shared/models/common-model';
import { BottomSheetDismissMode } from 'src/app/shared/constants/constants';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-bottom-address',
  templateUrl: './bottom-address.component.html',
  styleUrls: ['./bottom-address.component.scss']
})
export class BottomAddressComponent implements OnInit {
  addressForm: FormGroup;
  allValidate = true;

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA)
    public data: IAddressData,
    private bottomSheetRef: MatBottomSheetRef<BottomAddressComponent>,
    private dataService: DataService,
    private router: Router,
    private snackbar: MatSnackBar,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    if (this.data) {
      this.addressForm = new FormGroup({
        addressId: new FormControl(),
        addrLine1: new FormControl(''),
        addrLine2: new FormControl(''),
        locality: new FormControl(''),
        landmark: new FormControl(''),
        addrType: new FormControl('')
      });
      this.addressForm.patchValue({
        ...this.data,
        addressId: this.data._id
      });
    } else {
      this.addressForm = new FormGroup({
        addrLine1: new FormControl(''),
        addrLine2: new FormControl(''),
        locality: new FormControl(''),
        landmark: new FormControl(''),
        addrType: new FormControl('')
      });
    }
  }

  validate() {
    if (
      this.addressForm.value['addrLine1'].length > 2 &&
      this.addressForm.value['landmark'].length > 2 &&
      this.addressForm.value['locality'].length > 2
    ) {
      this.allValidate = true;
    }
  }

  openLink(event: MouseEvent): void {
    this.bottomSheetRef.dismiss();
    event.preventDefault();
  }

  saveAddress() {
    const formvalues: IReqAddressData = {
      city: this.data.city,
      country: this.data.country,
      pincode: this.data.pincode,
      state: this.data.state,
      latitude: this.data.locationLongLat && this.data.locationLongLat.coordinates[0].toString(),
      longitude: this.data.locationLongLat && this.data.locationLongLat.coordinates[1].toString(),
      ...this.addressForm.value
    };
    this.dataService.manageAddress(formvalues).subscribe((data: any) => {
        this.bottomSheetRef.dismiss({actionType: BottomSheetDismissMode.DataUpdated , closeData: data.data});
        this.router.navigate(['customer/profile']);
        this.translateService.get('ADD_ADDRESS.SUCCESSFULLY_SAVED').subscribe((res: string) => {
          this.snackbar.open(res);
        });
      }, (err)=>{
        this.snackbar.open(err.error.message);
      });
  }
}
