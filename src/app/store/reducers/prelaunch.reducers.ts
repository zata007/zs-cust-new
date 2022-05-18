import { initialPrelaunchData } from '../states/prelaunch.states';
import { PrelaunchActions, EPrelaunchActions } from '../actions/prelaunch.actions';

export function PrelaunchReducer(state = initialPrelaunchData, action: PrelaunchActions) {
  switch (action.type) {
    case EPrelaunchActions.Register:
        return {
          ...state,
          ...action.payload,
        };
    case EPrelaunchActions.QuesReply:
      return {
        ...state,
        quesReply: action.payload
      };
    case EPrelaunchActions.SignUpData:
      return {
        ...state,
        signupData: action.payload
      };
    default:
      return state;
  }

}
