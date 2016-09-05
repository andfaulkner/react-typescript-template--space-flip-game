import { Action } from './action.tsx';
import { InputEvent } from '../types/types.tsx';

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

export const ADD_ITEM_TO_INPUT_QUEUE = 'ADD_ITEM_TO_INPUT_QUEUE';

export const addItemToInputQueue = (itemToAdd: InputEvent): Action<{itemToAdd: InputEvent}> => ({
  type: ADD_ITEM_TO_INPUT_QUEUE,
  payload: {
    itemToAdd
  }
});

export const CLEAR_INPUT_QUEUE = 'CLEAR_INPUT_QUEUE';

export const clearInputQueue = (): Action<{}> => ({
  type: CLEAR_INPUT_QUEUE,
  payload: {}
});

export const RESET_LAST_RENDERED_TIME = 'RESET_LAST_RENDERED_TIME';

export const resetLastRenderedTime = (): Action<{}> => ({
  type: RESET_LAST_RENDERED_TIME,
  payload: { }
});