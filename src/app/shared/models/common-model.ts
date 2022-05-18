import { HttpClient } from "@angular/common/http";
import { TranslateHttpLoader } from "@ngx-translate/http-loader";

export interface ISignUpData {
  fullName: string;
  latitude: number;
  longitude: number;
  email: string;
  mobileNumber: string;
  referralCodeUsed: string;
  foodPreference: string;
  lanPreference: string;
}

export interface Marker {
  lat: number;
  lng: number;
  pitstop?: string;
  landmark?: string;
  label?: string;
  draggable?: boolean;
  id?: string;
  image?: string;
}

export interface ILoginData {
  lanPreference: string;
  fingurePrint?: string;
  mobileNumber: string;
}

export interface IMobileLoginData {
  userId: string;
  lanPreference: string;
  fingerprint: string;
  mobileOTP: number;
}

export interface IUserDetails {
  id: string;
  email: string;
  fullName: string;
  isVerified: boolean;
  locationLongLat?: {
    type: string;
    coordinates: number[];
  };
  mobileNumber: string;
  referralCode: string;
  remainingReferrals: number;
  requestedAt: string;
  walletBalance: number;
}

export interface IRolesData {
  _id: string;
  roleCode: string;
  defaultAuthority: number;
  roleName: string;
}

export interface IRelationsData {
  _id: string;
  relationCode: string;
  defaultAuthority: number;
  relationName: string;
}
export interface ILanguageData {
  _id: string;
  code: string;
  name: string;
}

export interface IInterfaceData {
  _id: string;
  name: string;
  pRelationId: string;
  pRoleId: string;
}

export interface IDesignationsData {
  _id: string;
  name: string;
}

export interface IAddressTypesData {
  _id: string;
  type: string;
}

export interface IPlatformParams {
  rolesData: Array<IRolesData>;
  relationsData: Array<IRelationsData>;
  languageData: Array<ILanguageData>;
  interfaceData: Array<IInterfaceData>;
  designationsData: IDesignationsData;
  addressTypesData: Array<IAddressTypesData>;
}
export interface IResponsePlatformParams {
  message: string;
  data: IPlatformParams;
}

export interface IRequestRegister {
  reqType: string;
  pRoleId: string;
  pRelationId: string;
  pInterface: string;
  indCountryCode: string;
  indMobileNum: string;
  indEmailNotify?: boolean;
  indMobileNotify?: boolean;
  indPushNotify?: boolean;
  latitude?: number;
  longitude?: number;
  indPwd?: string;
}

export interface IRequestMainParams {
  fingerprint: string;
  lan: string;
  latitude: number;
  longitude: number;
}
export interface IRequestGetRestaurantData extends IRequestMainParams {
  isOrderAhead: boolean;
  isTakeAway: boolean;
  isDelivery: boolean;
  pitstopLatitude: number;
  pitstopLongitude: number;
  page?: number;
}

export interface IRestaurantData {
  _id: string;
  businessLocId: string;
  displayName: string;
  locality: string;
  longLat: number[];
  avgRating: number;
  images: {
    _id: string;
    original: string;
    thumbnail: string;
  }[];
  blWorkingHrs: [
    {
      _id: string;
      day: number;
      time: [
        {
          _id: string;
          startTime: number;
          endTime: number;
        }
      ];
    }
  ];
  distance: number;
}

export interface IPaginationResGetRestaurant {
  blData: IRestaurantData[];
  totalPage: number;
  itemPerPage: number;
  currentPage: number;
}

export interface IResponseGetRestaurantData {
  message: string;
  data: IPaginationResGetRestaurant;
}

export interface IBusinessLocData {
  _id: string;
  businessLocationsId: string;
  blPitstops: boolean;
  blOrderAhead: boolean;
  blDelivery: boolean;
  blDineIn: boolean;
  images: {
    imageName: string;
    original: string;
    thumbnail: string;
    _id: string;
    updatedAt: string;
    createdAt: string;
  }[];
  blDeliveryRadius: number;
  businessLocationCoord: Array<number>;
  distance: number;
  coDoingBusinessAs: string;
  displayName: string;
}

export interface IResponseLocationServed {
  message: string;
  data: {
    isLocationServed: boolean;
    isLocationKnown: boolean;
    currentLocationDetails: string;
    businessLocData: Array<IBusinessLocData>;
  };
}

export interface IRequestGetSkuData extends IRequestMainParams {
  pageNum: number;
  flag: number;
  pitstopLatitude?: string;
  pitstopLongitude?: string;
  businessLocId?: string;
}

export interface IMenuData {
  _id: string;
  apPsBusinessLocId: {
    corpId: {
      _id: string;
      coDoingBusinessAs: string;
      coLegalName: string;
      coBrandName: string;
    };
  };
  skuType: string[];
  skuSubType: string[];
  skuName: string;
  skuQty: string[];
  isTaxIncluded: boolean;
  skuPrice: number;
  cgstPercentFlag: boolean;
  cgst: number;
  cgstSuffix: string;
  sgstPercentFlag: boolean;
  sgst: number;
  sgstSuffix: string;
  totalPrice: number;
  skuDesc: string;
  skuCuisine: string;
  skuServes: number;
  skuRating: number;
  skuSpice: number;
  skuImages: {
    _id: string;
    original: string;
    thumbnail: string;
  };
  type: string;
  skuNutrition: string;
  skuCustom: string[];
  skuCombo?: {
    skuType: string;
    skuSubType: string;
    skuName: string;
    skuQty: string;
    skuPrice: number;
    skuDesc: string;
    skuCuisine: string;
    type: string;
    skuServes: number;
    skuRating: number;
    skuSpice: number;
    skuNutrition: string;
    skuCustom: string[];
  };
}

export interface IResponseGetSkuData {
  message: string;
  data: {
    totalPage: number;
    itemPerPage: number;
    currentPage: number;
    skuData: IMenuData[];
  };
}

export interface ILoginSignupData {
  userId: string;
  indLanPref: string;
  indFingerPrint: string;
  pRoleId: string;
  pRelationId: string;
}

export interface IRequestVerifyOtp {
  userId: string;
  pRoleId: string;
  pRelationId: string;
  mobileOTP: number;
  fingerprint: string;
  lan: string;
  pInterface: string;
}
export interface IRequestPlaceOrder {
  orderType: string;
  orderMode: "voice" | "picture";
  orderData: [
    {
      businessLocId: string;
      skuId: string;
      qty: number;
    }
  ];
  addressId?: string;
  pitstopId?: string;
  time?: number;
  vehicleId?: string;
  totalPrice: number;
}
export interface IRequestPlaceOrderForEssential {
  orderType: string;
  orderMode: "voice" | "picture";
  businessLocId: string;
  file: File;
  time?: number;
  paymentMode: string;
}

export interface IResponsePlaceOrder {
  message: string;
  data: {
    msg: string;
    billdeskUrl: string;
  };
}

export interface IResponseVerifyOtp {
  message: string;
  data: {
    indDetail: {
      _id: string;
      indCountryCode: string;
      indMobileNum: string;
      roles: [
        {
          indEmailNotify: boolean;
          indMobileNotify: boolean;
          _id: string;
          deviceId: {
            indCurrLocLongLat: {
              type: string;
              coordinates: number[];
            };
            indPushNotify: boolean;
            indFingerPrint: string;
          };
          indMobileNum: string;
        }
      ];
      uniqueId: string;
      accessToken: string;
    };
  };
}

export interface IResponseLoginSignup {
  message: string;
  data: ILoginSignupData;
}

export interface IProfileData {
  indDetail: {
    _id: string;
    indCountryCode: string;
    indMobileNum: string;
    roles: {
      indEmail?: String;
      indEmailNotify: boolean;
      indMobileNotify: boolean;
      _id: string;
      pRoleId: string;
      pRoleAuthority: number;
      pRelationId: string;
      pRelationAuthority: number;
      deviceId: {
        indCurrLocLongLat: {
          type: string;
          coordinates: number[];
        };
        indPushNotify: boolean;
        indFingerPrint: string;
      };
      indMobileNum: string;
      indAddr: IAddressData[];
      indVehicles: IVehicleData[];
    }[];
    uniqueId: string;
    basic: {
      indFirstName: string;
      indLastName: string;
      indDob: string;
      apAge: number;
      apAgeUpdateOn: string;
      indGender: string;
      indFoodPref: string;
      indLanPref: string;
      indPic: [
        {
          imageName: string;
          original: string;
          thumbnail: string;
          tags: [];
        }
      ];
    };
  };
}

export interface IAddressData {
  locationLongLat: {
    type: string;
    coordinates: number[];
  };
  _id: string;
  addrType: string;
  addrLine1: string;
  addrLine2: string;
  city: string;
  state: string;
  country: string;
  pincode: string;
  locality: string;
  landmark: string;
  formattedAddress?: string;
}

export interface IReqAddressData {
  addressId: string;
  addrType: string;
  addrLine1: string;
  addrLine2: string;
  city: string;
  locality: string;
  landmark: string;
  state: string;
  country: string;
  pincode: string;
  latitude: string;
  longitude: string;
}

export interface IVehicleData {
  _id?: string;
  vehicleId?: string;
  vehType: string;
  vehbrand: string;
  vehModel: string;
  vehNum: string;
  vehColor: string;
}

export interface IResponseGetProfileData {
  message: string;
  data: IProfileData;
}

export interface IOrderData {
  orderData: {
    businessLocId: string;
    skuId: string;
    qty: number;
  };
}

export interface IUploadImage {
  imageType: string;
  id: string;
  imageName: string;
  image: File;
}

export interface IUpdateProfiledata {
  indFirstName: string;
  indLastName: string;
  indDob: string;
  indGender: string;
  indFoodPref: string;
  indLanPref: string;
  indEmail: string;
  indPushNotify: boolean;
  indPwd: string;
}

export interface ICartItemInfo {
  businessLocId: string;
  skuId: string;
  qty: number;
  isTaxIncluded: boolean;
  skuPrice: number;
  cgstPercentFlag: number;
  cgst: any;
  sgstPercentFlag: boolean;
  sgst: any;
  zsPercentFlag: boolean;
  zsComm: number;
  totalPrice: number;
}

// required for AOT compilation
export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, "./assets/i18n/", ".json");
}
export interface ICartViewData {
  orderData: ICartItemInfo[];
  totalPrice: number;
  deliveryCharges: number;
  totalTax: number;
  paybleAmount: number;
}
export interface IResponseAddCart {
  message: string;
  data: ICartViewData;
}

// export interface ITransactionList {
//   "_id": "5e3a77fe1ddc8165f337ae53",
//   "addressId": null,
//   "pitstopId": {
//     "_id": "5e3694f1d2321da3b45e361b",
//     "blPitStopLandmark": "PurbaLok",
//     "blPitStopLongLat": {
//       "type": "Point",
//       "coordinates": [
//         88.398923,
//         22.497804
//       ]
//     },
//     "blPitstopDirection": "west",
//     "blPitstopName": "ZS-KOL-1234567892"
//   },
//   "orderStatus": "Payment Pending",
//   "paymentStatus": "Pending",
//   "orderId": 20200205133830240,
//   "orderType": "take-away",
//   "orderData": [
//     {
//       "_id": "5e3a77fe1ddc8165f337ae54",
//       "businessLocId": {
//         "_id": "5e356afe2000b41e6ba0a397",
//         "businessLocName": "Moments"
//       },
//       "skuId": {
//         "_id": "5e36d6ced2321da3b48fcb41",
//         "skuCuisine": {
//           "en": "Chinese"
//         },
//         "skuCustom": {
//           "en": [
//             "test4"
//           ]
//         },
//         "skuDesc": {
//           "en": "Crispy fried potato longs sprinkled white salt and pepper extra"
//         },
//         "skuImages": [],
//         "skuName": {
//           "en": "French Toast"
//         },
//         "skuNutrition": {
//           "en": "Carbohydrates, Vitamins"
//         },
//         "skuPrice": 150,
//         "skuQty": {
//           "en": "Full"
//         },
//         "skuRating": 0,
//         "skuServes": 1,
//         "skuSpice": 3,
//         "skuSubType": {
//           "en": "Starter"
//         },
//         "skuType": {
//           "en": "Starter"
//         },
//         "type": {
//           "en": "nv"
//         }
//       },
//       "qty": 1,
//       "isTaxIncluded": true,
//       "skuPrice": 150,
//       "cgstPercentFlag": false,
//       "cgst": null,
//       "sgstPercentFlag": false,
//       "sgst": null,
//       "zsPercentFlag": true,
//       "zsComm": 7.5,
//       "totalPrice": 150
//     }
//   ],
//   "orderDateTime": "2020-02-05T08:08:30.242Z",
//   "totalPrice": 150
// }

export interface IEssentialProductData {
  displayName: string;
  isRecording: boolean;
  file: any;
  id: string;
}

export interface ISampleFile {
  message: string;
  data: {
    audio: string;
    image: string;
  };
}
