import { RouterReducerState } from '@ngrx/router-store';
import { ICustomerState } from './customer.states';
import { IPrelaunchState } from './prelaunch.states';

export interface IAppState {
  router?: RouterReducerState;
  customer: ICustomerState;
  prelaunch: IPrelaunchState;
}

export const initialAppState: IAppState = {
  customer: undefined,
  prelaunch: undefined,
};

export function getInitialState(): IAppState {
  return initialAppState;
}
