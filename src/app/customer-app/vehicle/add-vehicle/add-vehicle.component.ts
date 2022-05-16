import { Component, OnInit } from '@angular/core';
import {MatInputModule} from '@angular/material/input';

export interface Car {
  value: string;
}

@Component({
  selector: 'app-add-vehicle',
  templateUrl: './add-vehicle.component.html',
  styleUrls: ['./add-vehicle.component.scss']
})
export class AddVehicleComponent implements OnInit {

  cars: Car[] = [
    {value: 'Hatchback'},
    {value: 'Sedan'},
    {value: 'MUV'},
    {value: 'SUV'}
  ];

  brand = ['Maruti Suzuki', 'Hundai', 'Honda', 'Mahindra', 'Tata', 'Toyota', 'Renault', 'Ford', 'Nissan', 'Datsun', 'MG', 'Kia', 'Skoda', 'Mitsubishi', 'Other'];

  constructor() { }

  ngOnInit() {
  }

}
