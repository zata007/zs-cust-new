import { initialCustomerState, ICustomerState } from '../states/customer.states';
import { CustomerActions, ECustomerAction } from '../actions/customer.actions';

export function CustomerReducers(state = initialCustomerState, action: CustomerActions): ICustomerState {
  switch (action.type) {
    case ECustomerAction.SignIn:
      return {
        ...state,
        user: action.payload,
      };
    default:
      return state;
  }
}

