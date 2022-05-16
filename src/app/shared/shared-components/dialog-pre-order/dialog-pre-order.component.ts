import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'dialog-pre-order',
  templateUrl: 'dialog-pre-order.component.html',
  styleUrls: ['./dialog-pre-order.component.scss'],
})
export class DialogPreOrderComponent {
  constructor(
    public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: any) {}

  onNoClick(): void {
    this.dialogRef.close();
  }
}
