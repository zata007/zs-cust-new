import { createSelector } from '@ngrx/store';
import { IAppState } from '../states/app.states';
import { ICustomerState } from '../states/customer.states';

const selectCustomer = (state: IAppState) => state.customer;

// This will return signedIn user.
export const selectLoggedInUser = createSelector(
  selectCustomer,
  (state: ICustomerState) => state.user
);
