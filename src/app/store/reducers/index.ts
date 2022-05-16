import {
  ActionReducerMap,
  MetaReducer
} from '@ngrx/store';
import { environment } from '../../../environments/environment';
import { IAppState } from '../states/app.states';
import { routerReducer } from '@ngrx/router-store';
import { CustomerReducers } from './customer.reducers';
import { PrelaunchReducer } from './prelaunch.reducers';

export interface State {
}

export const reducers: ActionReducerMap<IAppState, any> = {
  router: routerReducer,
  customer: CustomerReducers,
  prelaunch: PrelaunchReducer,
};




export const metaReducers: MetaReducer<State>[] = !environment.production ? [] : [];
