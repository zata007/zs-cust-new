import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { CustomerStateService } from '../../customer-state.service';
import { CustomerService } from '../../customer.service';
import { Location } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ZATAAKSE_JWT_TOKEN, ECustomerServiceType } from '../../../shared/constants/constants';


@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit, OnDestroy {
  data: any;
  getUpdatedDataIntervalRef: any;
  canShowTimer =  false;
  timer = (60 * 10) - 1; // sec
  timerRef: any;

  constructor(
    private customerStateservice: CustomerStateService,
    private location: Location,
    private router: Router,
    private route: ActivatedRoute,
    private customerService: CustomerService,
  ) { }

  ngOnInit() {
    if (!this.customerStateservice.getOrderId()) {
      this.router.navigate(['/customer/order-history']);
    }
    this.customerService.getTransactionHistory(localStorage.getItem(ZATAAKSE_JWT_TOKEN), '1', this.customerStateservice.getOrderId())
    .subscribe((data: any) => {
      this.data = data.data.data[0];
      // console.log(this.data);
    });

    this.route.queryParams.subscribe(params => {
      if (params.comingFromCart) {
        this.canShowTimer = true;
        this.timerRef = setInterval(() => {
          this.timer -= 1;
          if (this.timer < 1) {
            clearInterval(this.timerRef);
          }
        }, 1000);
        this.initGetStatusInterval();
      }
    });
  }

  ngOnDestroy(): void {
    clearInterval(this.getUpdatedDataIntervalRef);
    clearInterval(this.timerRef);
  }

  onBackClick() {
    if (this.customerStateservice.currentServiceSelected === ECustomerServiceType.Essential) {
      this.router.navigate(['customer']);
    } else {
      this.location.back();
    }

  }

  initGetStatusInterval() {
    this.getUpdatedDataIntervalRef = setInterval(() => {
      this.customerService.getTransactionHistory(localStorage.getItem(ZATAAKSE_JWT_TOKEN), '1', this.customerStateservice.getOrderId())
      .subscribe((data: any) => {
        this.data = data.data.data[0];
        // console.log(this.data);
      });
     },
      10 * 60 * 1000);
  }

  goToFile() {
    window.open(this.data.file);
  }

  checkOrderStatus() {	
    this.customerService.getTransactionHistory(localStorage.getItem(ZATAAKSE_JWT_TOKEN), '1', this.customerStateservice.getOrderId())	
    .subscribe((data: any) => {	
      this.data = data.data.data[0];	
    })	
  }

}
