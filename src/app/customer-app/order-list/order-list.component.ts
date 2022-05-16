import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { Router } from '@angular/router'
import { CustomerService } from '../customer.service';
import { CustomerStateService } from '../customer-state.service';
import { ZATAAKSE_JWT_TOKEN, ZATAAKSE_PROFILE_DATA } from '../../shared/constants/constants'
import { IResponseGetProfileData } from 'src/app/shared/models/common-model';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss']
})
export class OrderListComponent implements OnInit {
  listItems: any;

  constructor(
    private customerService: CustomerService,
    private location: Location,
    public customerStateService: CustomerStateService,
    private router: Router,
  ){}

  ngOnInit() {
    // Fetching profile details
    if (localStorage.getItem(ZATAAKSE_JWT_TOKEN)) {
      this.customerService.getProfile(localStorage.getItem(ZATAAKSE_JWT_TOKEN)).subscribe((data: IResponseGetProfileData) => {
      }, (err) => {
        // TODO: Handle error for invalid/expired token
        localStorage.removeItem(ZATAAKSE_JWT_TOKEN);
        localStorage.removeItem(ZATAAKSE_PROFILE_DATA);
        this.router.navigate(['login-signup']);

      });
    } else {
      this.router.navigate(['login-signup']);
    }

    this.customerService.getTransactionHistory(localStorage.getItem(ZATAAKSE_JWT_TOKEN), "1").subscribe((data: any) => {
      this.listItems = data.data.data;
    });
  }

  onBackClick() {
    this.customerStateService.setCurrentPage('main');
    this.router.navigate(['customer']);
  }

  goOrderDetail(id) {
    this.customerStateService.setOrderId(id);
    this.router.navigate(['/customer/order-detail'])
  }

}
