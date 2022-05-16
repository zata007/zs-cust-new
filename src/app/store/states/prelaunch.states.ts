export interface IPrelaunchState {
  userId: string;
  lanPreference: string;
  signupData: {
    firstName: string;
    lastName: string;
    email: string;
    referalCode: string;
    mobileNumber: string;
  };
  quesReply: { data: Array<string>; curIndex: number };
}

export const initialPrelaunchData: IPrelaunchState = {
  userId: null,
  lanPreference: null,
  signupData: {
    firstName: null,
    lastName: null,
    email: null,
    referalCode: null,
    mobileNumber: null,
  },
  quesReply: {
    data: [],
    curIndex: 0,
  },
};
