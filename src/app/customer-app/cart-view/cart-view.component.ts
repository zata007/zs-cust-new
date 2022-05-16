import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { Location } from "@angular/common";
import { MatDialog, MatBottomSheet, MatSnackBar } from "@angular/material";
import { BillDetailComponent } from "./bill-detail/bill-detail.component";
import { OrderService } from "../order.service";
import {
  IMenuData,
  IRequestPlaceOrder,
  IOrderData,
  IRestaurantData,
  IProfileData,
  IAddressData,
  IVehicleData,
  IResponseAddCart,
  ICartViewData,
  IRequestPlaceOrderForEssential,
  IEssentialProductData,
} from "src/app/shared/models/common-model";
import {
  ZATAAKSE_JWT_TOKEN,
  ZATAAKSE_PAYMENT_TOKEN,
  ZATAAKSE_SELECTED_SERVICE,
  ECustomerServiceType,
  ZATAAKSE_PROFILE_DATA,
  PAYMENT_STATUS,
} from "src/app/shared/constants/constants";
import { Router, NavigationExtras } from "@angular/router";
import { DataService } from "src/app/shared/services/data.service";
import { CommonService } from "src/app/shared/services/common.service";
import { CustomerStateService } from "../customer-state.service";
import { AddressListComponent } from "./address-list/address-list.component";
import { VehicleListComponent } from "./vehicle-list/vehicle-list.component";
import { BottomVehicleComponent } from "../vehicle/bottom-vehicle/bottom-vehicle.component";
import { FormControl, FormGroup } from "@angular/forms";
import { environment } from "src/environments/environment";
import { TextDialogComponent } from "src/app/shared/shared-components/text-dialog/text-dialog.component";
import { TranslateService } from "@ngx-translate/core";

@Component({
  selector: "app-cart-view",
  templateUrl: "./cart-view.component.html",
  styleUrls: ["./cart-view.component.scss"],
  encapsulation: ViewEncapsulation.None,
})
export class CartViewComponent implements OnInit {
  ECustomerServiceType = ECustomerServiceType;
  orderedItems: IMenuData[] = [];
  profileData: IProfileData = null;
  addressData: IAddressData[] = null;
  vehicleData: IVehicleData[] = null;
  notToProvideVehicle = false;
  hasAuthToken = false;
  deliveryLocation = "";
  pitstopData = {
    locality: "",
    name: "",
  };
  currentRestaurantData: IRestaurantData = null;
  selectedTime: string;
  selectedLocationForDelivery: IAddressData;
  selectedVehicle: IVehicleData;
  orderAheadtime: number;
  form: FormGroup;
  time: any;
  orderData: IOrderData[] = [];
  cartData: ICartViewData;
  windowChildIntervalRef = null;
  windowObjectReference: Window = null;
  currentEssentialServiceData: IEssentialProductData;
  essentialPaymentMode = "Cash On Delivery";
  loading: boolean = false;

  constructor(
    private location: Location,
    private dataService: DataService,
    public dialog: MatDialog,
    private bottomSheet: MatBottomSheet,
    private orderService: OrderService,
    private router: Router,
    private commonService: CommonService,
    public customerStateService: CustomerStateService,
    private snackbar: MatSnackBar,
    private translateService: TranslateService
  ) {}

  ngOnInit() {
    this.form = new FormGroup({
      time: new FormControl(),
    });
    this.orderedItems = this.orderService.getCartData();
    if (
      !this.orderedItems.length &&
      this.customerStateService.currentServiceSelected !==
        ECustomerServiceType.Essential
    ) {
      this.router.navigate(["customer"]);
    }

    const position = this.customerStateService.getFromLocation();
    const data = {
      orderData: this.orderService.cart.map((i) => {
        return {
          businessLocId: i.apPsBusinessLocId,
          skuId: i._id,
          qty: i.skuServes,
        };
      }) as any,
    };
    const fingerprint = this.commonService.fingerPrint;

    // TODO: Handle when no data is present
    this.dataService.addCart(fingerprint, data, position).subscribe(
      (res: IResponseAddCart) => {
        this.cartData = res.data;
        this.hasAuthToken = !!localStorage.getItem(ZATAAKSE_JWT_TOKEN);
        this.handleAddressVehicleViewData();
      },
      (err) => {
        // console.log(err);
      }
    );
  }

  handleAddressVehicleViewData() {
    switch (this.customerStateService.currentServiceSelected) {
      case ECustomerServiceType.TakeAway:
        if (this.customerStateService.currentPitstopData) {
          this.pitstopData = {
            locality: this.customerStateService.currentPitstopData.landmark,
            name: this.customerStateService.currentPitstopData.pitstop,
          };
        }
        this.profileData = localStorage.getItem(ZATAAKSE_PROFILE_DATA)
          ? JSON.parse(localStorage.getItem(ZATAAKSE_PROFILE_DATA))
          : null;
        if (this.profileData) {
          this.vehicleData =
            this.profileData.indDetail.roles[0] &&
            this.profileData.indDetail.roles[0].indVehicles;
          this.selectedVehicle = this.vehicleData[0];
        }
        break;
      case ECustomerServiceType.Delivery:
        if (this.customerStateService.currentDeliveryLocation) {
          this.profileData = localStorage.getItem(ZATAAKSE_PROFILE_DATA)
            ? JSON.parse(localStorage.getItem(ZATAAKSE_PROFILE_DATA))
            : null;
          if (this.profileData) {
            this.addressData =
              this.profileData.indDetail.roles[0] &&
              this.profileData.indDetail.roles[0].indAddr;
            this.selectedLocationForDelivery = this.addressData[0];
          }
          this.deliveryLocation =
            this.customerStateService.currentDeliveryLocation;
        }
        break;
      case ECustomerServiceType.Essential:
        this.currentEssentialServiceData =
          this.customerStateService.currentEssentialServiceData;
        break;
      default:
        this.currentRestaurantData =
          this.customerStateService.currentRestaurantData;
        break;
    }
  }

  onBackClick() {
    this.customerStateService.setCurrentPage("main");
    this.location.back();
  }

  openDetailedBill() {
    this.bottomSheet.open(BillDetailComponent, {
      data: {},
    });
  }

  onAddUnit(data: IMenuData) {
    this.orderService.addToCart(data);
  }

  onRemoveUnit(data: IMenuData) {
    this.orderService.removeFromCart(data);
  }

  removeItemFromCart(data: IMenuData) {
    this.orderService.removeItem(data);
  }

  onSubmitClick() {
    if (this.hasAuthToken) {
      this.loading = true;
      // TODO place order.
      const data: IRequestPlaceOrder = {
        orderData: this.orderService.cart.map((i) => {
          return {
            businessLocId: i.apPsBusinessLocId,
            skuId: i._id,
            qty: i.skuServes,
          };
        }) as any,
        orderType: this.customerStateService.currentServiceSelected,
        totalPrice: this.cartData.paybleAmount,
        orderMode: this.customerStateService.currentEssentialServiceData
          .isRecording
          ? "voice"
          : "picture",
      };

      switch (this.customerStateService.currentServiceSelected) {
        case ECustomerServiceType.TakeAway:
          data.pitstopId = this.customerStateService.getCurrentPitstopData().id;
          if (!this.notToProvideVehicle) {
            data.vehicleId = this.selectedVehicle["_id"];
          } else {
            delete data.vehicleId;
          }
          break;
        case ECustomerServiceType.Delivery:
          data.addressId = this.selectedLocationForDelivery["_id"];
          break;
        case ECustomerServiceType.Essential:
          break;
        case ECustomerServiceType.OrderAhead:
          // TODO: Refactor
          this.time = this.form.value["time"].split(":");
          this.orderAheadtime =
            Number(this.time[0]) * 60 + Number(this.time[1]);
          data.time = this.orderAheadtime;
          break;
      }

      if (
        this.customerStateService.currentServiceSelected !==
        ECustomerServiceType.Essential
      ) {
        this.dataService.placeOrder(data).subscribe(
          (res) => {
            this.commonService.paymentInformation = res;
            const localStorageData = {};
            switch (this.customerStateService.currentServiceSelected) {
              case ECustomerServiceType.TakeAway:
                // tslint:disable-next-line: no-string-literal
                localStorageData["data"] = {
                  locationData: this.customerStateService.selectedLocation,
                  pitstopData:
                    this.customerStateService.getCurrentPitstopData(),
                };
                break;
              case ECustomerServiceType.Delivery:
                // tslint:disable-next-line: no-string-literal
                localStorageData["data"] = {
                  locationData: this.customerStateService.selectedLocation,
                  address: `${
                    this.selectedLocationForDelivery.addrLine1 +
                    +this.selectedLocationForDelivery.addrLine2 +
                    +this.selectedLocationForDelivery.locality
                  }`, // TODO: pass customer's address
                };
                break;
              case ECustomerServiceType.OrderAhead:
                // tslint:disable-next-line: no-string-literal
                localStorageData["data"] = {
                  name: this.orderedItems[0].skuCuisine,
                  time: this.orderAheadtime,
                };
                break;

              default:
                break;
            }
            // tslint:disable-next-line: no-string-literal
            localStorageData["serviceType"] =
              this.customerStateService.currentServiceSelected;
            localStorage.setItem(
              ZATAAKSE_SELECTED_SERVICE,
              JSON.stringify(localStorageData)
            );
            localStorage.setItem(ZATAAKSE_PAYMENT_TOKEN, JSON.stringify(res));
            // window features
            if (!this.windowObjectReference) {
              this.handlePaymentWindowLogic(
                `${res.data.billdeskUrl}?msg=${res.data.msg}`
              );
            } else {
              this.windowObjectReference.close();
              this.handlePaymentWindowLogic(
                `${res.data.billdeskUrl}?msg=${res.data.msg}`
              );
            }
            // TODO: Add loader
          },
          (errorPlaceOrder) => {
            if (errorPlaceOrder.statusCode !== 400) {
              this.hasAuthToken = false;
              localStorage.removeItem(ZATAAKSE_JWT_TOKEN);
              // console.log(errorPlaceOrder);
              this.router.navigate(["login-signup"]);
            }
            this.snackbar.open(errorPlaceOrder.error.message);
          }
        );
      } else {
        const essentialData: IRequestPlaceOrderForEssential = {
          businessLocId: this.currentEssentialServiceData.id,
          file: this.currentEssentialServiceData.file,
          orderType: "order-ahead",
          paymentMode: this.essentialPaymentMode,
          orderMode: this.customerStateService.currentEssentialServiceData
            .isRecording
            ? "voice"
            : "picture",
        };

        console.log(`Essential data is ${essentialData}`);

        this.dataService.placeOrderForEssential(essentialData).subscribe(
          (res) => {
            this.commonService.paymentInformation = res;
            const localStorageData = {};
            this.customerStateService.currentEssentialServiceData = null;
            this.customerStateService.currentServiceSelected = null;
            // tslint:disable-next-line: no-string-literal
            localStorageData["serviceType"] =
              this.customerStateService.currentServiceSelected;
            localStorage.setItem(
              ZATAAKSE_SELECTED_SERVICE,
              JSON.stringify(localStorageData)
            );
            this.customerStateService.setOrderId(res.data.orderId);
            this.translateService
              .get("CART.ORDER_SUCCESS_DIALOG")
              .subscribe((res: string) => {
                this.dialog.open(TextDialogComponent, {
                  data: {
                    from: "order-cart",
                    msg: res,
                  },
                });
              });
            const navigationExtras: NavigationExtras = {
              queryParams: {
                comingFromCart: true,
              },
            };
            this.router.navigate(["/customer/order-detail"], navigationExtras);
          },
          (errorPlaceOrder) => {
            if (errorPlaceOrder.statusCode !== 400) {
              this.hasAuthToken = false;
              // localStorage.removeItem(ZATAAKSE_JWT_TOKEN);
              // console.log(errorPlaceOrder);
              //this.router.navigate(['login-signup']);
            }
            this.snackbar.open(errorPlaceOrder.error.message);
            this.loading = false;
          }
        );
      }
    } else {
      // Goto login-signup
      this.router.navigate(["login-signup"]);
    }
  }

  handlePaymentWindowLogic(url: string) {
    const strWindowFeatures = "toolbar=no, menubar=no, width=500";
    this.windowObjectReference = window.open(
      url,
      "Zataakse_Payment",
      strWindowFeatures
    );
    this.windowObjectReference.focus();
    this.windowChildIntervalRef = setInterval(() => {
      this.checkPaymentWindowChildCloseStatus(this.windowObjectReference);
    }, 500);
    window.addEventListener("message", this.paymentMessageHandler.bind(this));
  }

  paymentMessageHandler(event: MessageEvent) {
    if (
      !event.origin.includes(environment.paymentUrl) &&
      !(event.data && event.data.paymentStatus)
    ) {
      return;
    }
    if (this.windowObjectReference) {
      this.windowObjectReference.close();
    }
    switch (event.data.paymentStatus) {
      case PAYMENT_STATUS.COMPLETED:
        this.orderService.clearCart();
        this.router.navigate([`customer/order-placed`]);
        break;

      default:
        this.router.navigate([`customer`]);
        // this.router.navigate([`customer`]);
        break;
    }
  }

  checkPaymentWindowChildCloseStatus(child) {
    if (child.closed) {
      window.removeEventListener(
        "message",
        this.paymentMessageHandler.bind(this)
      );
      this.windowObjectReference = null;
      clearInterval(this.windowChildIntervalRef);
      // TODO: Perform task if payment is closed
    }
  }

  private getPlaceName(lat, lng, callback: Function) {
    const geocoder = new google.maps.Geocoder();
    const latlng = new google.maps.LatLng(lat, lng);
    const request = { location: latlng };
    geocoder.geocode(request, (results, status) => {
      if (status === google.maps.GeocoderStatus.OK) {
        const result = results[0];
        const rsltAdrComponent = result.address_components;
        const resultLength = rsltAdrComponent.length;
        if (result != null) {
          callback(result);
          // this.address = rsltAdrComponent[resultLength - 8].short_name;
        } else {
          callback(result);
          alert("No address available!");
        }
      }
    });
  }

  onAddressChange(): void {
    const addressListRef = this.bottomSheet.open(AddressListComponent, {
      data: this.addressData,
    });

    addressListRef.afterDismissed().subscribe((data: IAddressData) => {
      if (data) {
        this.selectedLocationForDelivery = data;
      }
    });
  }

  onVehicleChange(): void {
    const vehicleListRef = this.bottomSheet.open(VehicleListComponent, {
      data: this.vehicleData,
    });
    vehicleListRef.afterDismissed().subscribe((res: IVehicleData) => {
      if (res) {
        this.selectedVehicle = res;
      }
    });
  }

  addVehicle() {
    const bottomVehicleRef = this.bottomSheet.open(BottomVehicleComponent);
    bottomVehicleRef.afterDismissed().subscribe((res: IVehicleData[]) => {
      if (res) {
        this.vehicleData = res;
      }
    });
  }

  openBillDetail() {
    this.bottomSheet.open(BillDetailComponent, {
      data: this.cartData,
    });
  }

  onAddAddressClick() {
    this.router.navigate(["customer/address/add"]);
  }
}
