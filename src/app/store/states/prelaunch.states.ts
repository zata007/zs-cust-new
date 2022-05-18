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
  userId: '',
  lanPreference: '',
  signupData: {
    firstName: '',
    lastName: '',
    email: '',
    referalCode: '',
    mobileNumber: '',
  },
  quesReply: {
    data: [],
    curIndex: 0,
  },
};
