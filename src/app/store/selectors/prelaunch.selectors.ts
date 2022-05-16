import { IAppState } from '../states/app.states';
import { createSelector } from '@ngrx/store';
import { IPrelaunchState } from '../states/prelaunch.states';

const selectPrelaunch = (state: IAppState) => state.prelaunch;

// This will return registered userId.
export const registeredUserId = createSelector(
  selectPrelaunch,
  (state: IPrelaunchState) => state.userId
);

// This will return registered userId.
export const questionData = createSelector(
  selectPrelaunch,
  (state: IPrelaunchState) => state.quesReply
);

// This will return registered userId.
export const signUpData = createSelector(
  selectPrelaunch,
  (state: IPrelaunchState) => state.signupData
);


