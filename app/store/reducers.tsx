// /// <reference path="../../typings/index.d.ts" />

import { Action } from './action.tsx';
import { TEST_SWITCH_STATE, ADD_ITEM_TO_INPUT_QUEUE, CLEAR_INPUT_QUEUE,
         RESET_LAST_RENDERED_TIME } from './actions.tsx';
import { initialState, AppStoreState } from './initialState.tsx';

// All actions take this form:
// { type: string;     payload: T;     error?: boolean;     meta?: any; }

export const reducers = (state: AppStoreState = initialState, action: Action<any>) => {
  console.log('reducers: reducers function');
  switch (action.type) {

    // EXPERIMENTAL REDUCER
    case TEST_SWITCH_STATE:
      return Object.assign({}, state, { testStateProperty: action.payload.testStateProperty });

    case ADD_ITEM_TO_INPUT_QUEUE:
      let newInputQueue = state.inputQueue;
      newInputQueue.push(action.payload.itemToAdd);
      return Object.assign({}, state, { inputQueue: newInputQueue });

    case CLEAR_INPUT_QUEUE:
      return Object.assign({}, state, { inputQueue: [] });

    // Saves a timestamp marking when the main game arena was last rendered
    case RESET_LAST_RENDERED_TIME:
      return Object.assign({}, state, { lastRendered: Date.now() });

    default:
      return state;
  }
};
