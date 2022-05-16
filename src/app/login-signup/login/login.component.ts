import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  @Output() public numberUpdate = new EventEmitter();
  phoneNumber = null;
  constructor() { }

  ngOnInit() {
  }

}
