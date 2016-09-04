import { Action } from './action.tsx';

export const TEST_SWITCH_STATE = 'TEST_SWITCH_STATE';
export const CHANGE_DIRECTION = 'CHANGE_DIRECTION';

//
// EXPERIMENTAL ACTION CREATOR
//
export const testSwitchState_AC = (newState: boolean): Action<{testStateProperty: boolean}> => ({
  type: TEST_SWITCH_STATE,
  payload: {
    testStateProperty: newState
  }
});
