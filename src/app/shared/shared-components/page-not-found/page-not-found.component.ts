import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Socket } from 'ngx-socket-io';
import { CommonService } from 'src/app/shared/services/common.service';

@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
  styleUrls: ['./page-not-found.component.scss'],
})
export class PageNotFoundComponent implements OnInit, OnDestroy {
  isNoInternet = false;
  returnUrl: any;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private commonService: CommonService,
    private socket: Socket
  ) {}

  ngOnInit() {
    this.isNoInternet = this.route.snapshot.url[0].path === 'no-internet';
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'];
    if (this.commonService.getUserConnectedStatus()) {
      this.router.navigate([this.returnUrl]);
    }
  }

  gotoHome() {
    this.router.navigate(['/']);
  }

  tryAgain() {
    if (window.navigator.onLine && this.socket.ioSocket.connected) {
      this.router.navigate([this.returnUrl]);
    } else {
      // TODO: Add Loader
    }
  }

  ngOnDestroy(): void {}
}
