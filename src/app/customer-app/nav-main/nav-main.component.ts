import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { Location } from "@angular/common";
import { Component, OnDestroy, OnInit } from "@angular/core";
import { MatBottomSheet } from "@angular/material";
import { Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Observable, Subscription } from "rxjs";
import { map } from "rxjs/operators";
import { CookieService } from "src/app/shared/services/cookie.service";
import { CartNotEmptyComponent } from "src/app/shared/shared-components/cart-not-empty/cart-not-empty.component";
import { SignIn } from "src/app/store/actions/customer.actions";
import { IAppState } from "src/app/store/states/app.states";
import {
  ZATAAKSE_JWT_TOKEN,
  ZATAAKSE_PROFILE_DATA,
} from "../../shared/constants/constants";
import { CustomerStateService } from "../customer-state.service";
import { OrderService } from "../order.service";

@Component({
  selector: "app-nav-main",
  templateUrl: "./nav-main.component.html",
  styleUrls: ["./nav-main.component.scss"],
})
export class NavMainComponent implements OnInit, OnDestroy {
  name: string;
  cartCount = 0;
  hasAuthToken: boolean = false;
  constructor(
    private breakpointObserver: BreakpointObserver,
    private customerStateService: CustomerStateService,
    public router: Router,
    private cookieService: CookieService,
    private store: Store<IAppState>,
    private orderService: OrderService,
    private bottomSheet: MatBottomSheet,
    private location: Location
  ) {}

  get isLoggedIn() {
    return localStorage.getItem(ZATAAKSE_JWT_TOKEN) ? true : false;
  }
  currentPage = "main";
  headerChangeSubscription: Subscription;

  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(map((result) => result.matches));

  ngOnInit() {
    this.hasAuthToken = !!localStorage.getItem(ZATAAKSE_JWT_TOKEN);
    if (this.hasAuthToken) {
      const data = localStorage.getItem(ZATAAKSE_PROFILE_DATA);
      //name add
    }
    this.headerChangeSubscription =
      this.customerStateService.currentPage$.subscribe((value) => {
        this.currentPage = value;
      });

    this.orderService.orderCount$.subscribe((res) => {
      this.cartCount = res;
    });
  }

  ngOnDestroy(): void {
    this.headerChangeSubscription.unsubscribe();
  }

  onBackClick() {
    // TODO: This has to be previous url
    this.location.back();
  }

  onSideNavClick(item: string) {
    switch (item) {
      case "Partner":
        this.router.navigate(["/oa/login"]);
        break;
      case "Logout":
        if (this.isLoggedIn) {
          this.store.dispatch(new SignIn(null));
          this.cookieService.setUserData(null);
          localStorage.removeItem(ZATAAKSE_JWT_TOKEN);
          localStorage.removeItem(ZATAAKSE_PROFILE_DATA);
          // Remove user and navigate to Login page.
        }
        this.router.navigate(["login-signup"]);
        break;
      case "Care":
        this.router.navigate(["/customer/care"]);
        break;
      case "Profile":
        this.router.navigate(["/customer/profile"]);
        break;
      case "OrderList":
        this.router.navigate(["/customer/order-history"]);
        break;
      case "OrderStatus":
        this.router.navigate(["/customer/order-status"]);
        break;
      case "Language":
        this.router.navigate(["/customer/language"]);
        break;
      default:
        break;
    }
  }

  onNavigate(url: string) {
    // Check if cart has data
    if (this.cartCount && this.cartCount > 0) {
      const cartNotEmptyRef = this.bottomSheet.open(CartNotEmptyComponent);
      cartNotEmptyRef.afterDismissed().subscribe((res) => {
        if (res) {
          sessionStorage.setItem("path", `customer/${url}`);
          this.orderService.clearCart();
          this.customerStateService.updateCurrentService(url);
          this.router.navigate([`customer/${url}`]);
        }
      });
    } else {
      this.customerStateService.updateCurrentService(url);
      sessionStorage.setItem("path", `customer/${url}`);
      this.router.navigate([`customer/${url}`]);
    }
  }

  onCartClick() {
    this.router.navigate(["customer/cart-view"]);
  }
}
