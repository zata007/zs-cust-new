import { Component, OnInit, OnDestroy } from '@angular/core';
import { CustomerStateService } from '../customer-state.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

enum HeaderState {}

@Component({
  selector: 'app-nav-top',
  templateUrl: './nav-top.component.html',
  styleUrls: ['./nav-top.component.scss'],
})
export class NavTopComponent implements OnInit, OnDestroy {
  currentPage = 'main';
  headerChangeSubscription: Subscription;
  constructor(private customerStateService: CustomerStateService, private router: Router) {}

  ngOnInit() {
    this.headerChangeSubscription = this.customerStateService.currentPage$.subscribe((value) => {
      this.currentPage = value;
    });
  }

  ngOnDestroy(): void {
    this.headerChangeSubscription.unsubscribe();
  }

  onBackClick() {
    this.customerStateService.setCurrentPage('main');
    this.router.navigate(['/customer']);
  }
}
