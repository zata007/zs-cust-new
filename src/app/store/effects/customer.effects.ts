import { Injectable } from '@angular/core';
import { Actions, Effect, ofType } from '@ngrx/effects';
import { CustomerActions } from '../actions/customer.actions';

@Injectable()
export class CustomerEffect {
  @Effect()
  getProducts$ = this.actions$.pipe(ofType<CustomerActions>());


  constructor(private actions$: Actions) {
  }
}
