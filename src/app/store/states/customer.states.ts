import { IUserDetails } from 'src/app/shared/models/common-model';
import { LOCAL_STORAGE } from 'src/app/shared/constants/constants';

export interface ICustomerState {
  user: IUserDetails;
}

function getInitialData() {
  const data = localStorage.getItem(LOCAL_STORAGE);
  return JSON.parse(data);
}
export const initialCustomerState: ICustomerState = {
  user: getInitialData() || undefined,
};
