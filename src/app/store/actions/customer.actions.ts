import { Action } from '@ngrx/store';
import { IUserDetails } from 'src/app/shared/models/common-model';

export enum ECustomerAction {
  SignIn = '[Sign In]',
}

// TODO: Add further actions
export class SignIn implements Action {
  public readonly type = ECustomerAction.SignIn;
  constructor(readonly payload: {customerData: IUserDetails}) {

  }
}

// TODO: Add futher types seperated by |
export type CustomerActions = SignIn | any;
