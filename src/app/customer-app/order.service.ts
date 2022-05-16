import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { IMenuData } from '../shared/models/common-model';

@Injectable()
export class OrderService {
  cart: Array<IMenuData> = [];
  orderCount$ = new BehaviorSubject(0);
  foods = [
    {
      restaurant_id: 1,
      item: [
        {
          item_id: 1,
          name: 'Cheese Popcorn',
          Quantity: '100gms',
          price: '150',
          catagory: 'veg',
        },
        {
          item_id: 2,
          name: 'Caramel Popcorn',
          Quantity: '100gms',
          price: '180',
          catagory: 'veg',
        },
        {
          item_id: 3,
          name: 'salted Popcorn',
          Quantity: '100gms',
          price: '120',
          catagory: 'veg',
        },
      ],
    },
    {
      restaurant_id: 2,
      item: [
        {
          item_id: 1,
          name: 'Chicken Burger',
          Quantity: '1',
          price: '200',
          catagory: 'nonveg',
        },
        {
          item_id: 2,
          name: 'Paneer Burger',
          Quantity: '1',
          price: '180',
          catagory: 'veg',
        },
        {
          item_id: 3,
          name: 'Chicken Sandwich',
          Quantity: '1',
          price: '180',
          catagory: 'nonveg',
        },
        {
          item_id: 4,
          name: 'Paneer Sandwich',
          Quantity: '1',
          price: '160',
          catagory: 'veg',
        },
      ],
    },
  ];
  constructor() {}

  removeFromCart(item: IMenuData) {
    const index = this.cart.findIndex((i) => i._id === item._id);
    if (index !== -1) {
      if (this.cart[index].skuServes  > 1) {
        this.cart[index].skuServes  -= 1;
      } else {
        this.cart.splice(index, 1);
      }
      this.orderCount$.next(this.updatedTotalOrderCount());
    }
  }

  removeItem(item: IMenuData) {
    const index = this.cart.findIndex((i) => i._id === item._id);
    if (index !== -1) {
      this.cart.splice(index, 1);
      this.orderCount$.next(this.updatedTotalOrderCount());
    }
  }

  clearCart() {
    this.cart = [];
    this.orderCount$.next(0);
  }

  addToCart(item: IMenuData) {
    // Find item index;
    const index = this.cart.findIndex((i) => i._id === item._id);
    if (index > -1) {
      if (this.cart[index].skuServes ) {
        this.cart[index].skuServes  += 1;
      } else {
        this.cart[index].skuServes  = 1;
      }
    } else {
      item.skuServes  = 1;
      this.cart.push({ ...item });
    }
    this.orderCount$.next(this.updatedTotalOrderCount());
  }

  updatedTotalOrderCount(): number {
    let count = 0;
    this.cart.forEach((i) => {
      count += this.countInCart(i);
    });

    return count;
  }

  isAddedToCart(item: IMenuData) {
    const index = this.cart.findIndex((i) => i._id === item._id);
    return index > -1;
  }

  countInCart(item: IMenuData) {
    const data = this.cart.find((i) => i._id === item._id);
    return (data && data.skuServes) || 0;
  }

  getPrice(item: number) {
    return Math.ceil(item);
  }

  getTotal() {
    let total = 0;
    this.cart.forEach((i) => {
      total += i.skuPrice * i.skuServes;
    });
    return Math.ceil(total);
  }

  getFoodListByRestaurant(id: number) {
    return this.foods.find((i) => i.restaurant_id === id).item;
  }

  getCartData() {
    return this.cart;
  }

  getFoods() {
    return [
      {
        itemName: 'Veg Momos',
        foodPrefrence: 'Veg',
        count: 0,
        price: 61.95,
      },
      {
        itemName: 'Chicken Momos',
        foodPrefrence: 'Non Veg',
        count: 0,
        price: 61.95,
      },
      {
        itemName: '8” Margarita Pizza',
        foodPrefrence: 'Veg',
        count: 0,
        price: 78.75,
      },
      {
        itemName: '8” Fresh Veggie Pizza',
        foodPrefrence: 'Veg',
        count: 0,
        price: 110.25,
      },
      {
        itemName: '8” Tandoori Paneer Pizza',
        foodPrefrence: 'Veg',
        count: 0,
        price: 152.25,
      },
      {
        itemName: '8” Chicken  Tikka Pizza',
        foodPrefrence: 'Non Veg',
        count: 0,
        price: 114.45,
      },
      {
        itemName: '8” Spicy Chicken Pizza',
        foodPrefrence: 'Non Veg',
        count: 0,
        price: 145.95,
      },
      {
        itemName: '8” Chicken Italian',
        foodPrefrence: 'Non Veg',
        count: 0,
        price: 145.95,
      },
      {
        itemName: '8” Barbeque Chicken',
        foodPrefrence: 'Non Veg',
        count: 0,
        price: 187.95,
      },
      {
        itemName: 'Crispy Chicken 2 pcs',
        foodPrefrence: 'Non Veg',
        count: 0,
        price: 103.95,
      },
      {
        itemName: 'Chicken Samosa',
        foodPrefrence: 'Non Veg',
        count: 0,
        price: 18.9,
      },
      {
        itemName: 'Aloo Paratha',
        foodPrefrence: 'Veg',
        count: 0,
        price: 36.75,
      },
      {
        itemName: 'Laccha Paratha',
        foodPrefrence: 'Veg',
        count: 0,
        price: 26.25,
      },
      {
        itemName: 'Aloo Tikka Burger',
        foodPrefrence: 'Veg',
        count: 0,
        price: 36.75,
      },
      {
        itemName: 'Veg Burger',
        foodPrefrence: 'Veg',
        count: 0,
        price: 57.75,
      },
      {
        itemName: 'Paneer Steak Burger',
        foodPrefrence: 'Veg',
        count: 0,
        price: 93.45,
      },
      {
        itemName: 'Paneer Salsa Wrap',
        foodPrefrence: 'Veg',
        count: 0,
        price: 124.95,
      },
      {
        itemName: 'Chicken Burger',
        foodPrefrence: 'Non Veg',
        count: 0,
        price: 72.45,
      },
      {
        itemName: 'Royal Chicken Burger',
        foodPrefrence: 'Non Veg',
        count: 0,
        price: 103.95,
      },
      {
        itemName: 'Chicken Crispy Wrap',
        foodPrefrence: 'Non Veg',
        count: 0,
        price: 93.45,
      },
    ];
  }
}
