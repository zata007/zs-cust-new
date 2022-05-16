import { Action } from '@ngrx/store';

export enum EPrelaunchActions {
  Register = '[Register] user',
  SignUpData = '[Register] signup data',
  QuesReply = '[Register] ques Reply'
}

export class Register implements Action {
  public readonly type = EPrelaunchActions.Register;
  constructor(readonly payload: { userId: string, lanPreference: string }) {}
}

export class QuesReply implements Action {
  public readonly type = EPrelaunchActions.QuesReply;
  constructor(readonly payload: {data: Array<string>; curIndex: number}) {}
}
export class SignUpData implements Action {
  public readonly type = EPrelaunchActions.SignUpData;
  constructor(readonly payload: {
    firstName: string,
    lastName: string,
    email: string,
    referalCode: string,
    mobileNumber: string,
  }) {}
}



export type PrelaunchActions = Register | QuesReply | SignUpData;
