import { Component, OnInit, Inject } from '@angular/core';
import {MAT_BOTTOM_SHEET_DATA, MatBottomSheetRef} from '@angular/material/bottom-sheet';
import { IVehicleData } from 'src/app/shared/models/common-model';

@Component({
  selector: 'app-vehicle-list',
  templateUrl: './vehicle-list.component.html',
  styleUrls: ['./vehicle-list.component.scss']
})
export class VehicleListComponent implements OnInit {

  constructor(
    @Inject(MAT_BOTTOM_SHEET_DATA) public data: any,
    private bottomSheetRef: MatBottomSheetRef<VehicleListComponent>
  ) { }

  ngOnInit() {}
  onSelect(selectedVehicle: IVehicleData){
    this.bottomSheetRef.dismiss(selectedVehicle);
  }
}
