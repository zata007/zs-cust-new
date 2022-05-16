import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-essential-dialog',
  templateUrl: './essential-dialog.component.html',
  styleUrls: ['./essential-dialog.component.scss']
})
export class EssentialDialogComponent implements OnInit {

  constructor(
    public router: Router,
    public dialogRef: MatDialogRef<EssentialDialogComponent>
  ) { }

  ngOnInit() {
  }

  orderEssentials() {
    this.router.navigate(['customer/essentials']);
    this.dialogRef.close();
  }

}
