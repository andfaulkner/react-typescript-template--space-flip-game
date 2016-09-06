// /// <reference path="../../typings/index.d.ts" />

import { Action } from './action.tsx';
import { actions } from './actions.tsx';
import { AppStoreState, initialState } from './initialState.tsx';
import { resolveUIState } from './reducers/resolveUIState.tsx';

import { combineReducers } from 'redux';

// All actions take this form:
// { type: string;     payload: T;     error?: boolean;     meta?: any; }

const debugReducers = (state: AppStoreState = initialState, action: Action<any>) => {
  switch (action.type) {
    // EXPERIMENTAL REDUCER
    case actions.TEST_SWITCH_STATE:
      console.log('*R* reducers: debugReducers # TEST_SWITCH_STATE :: Click reached reducers :)');
      return Object.assign({}, state, { testStateProperty: action.payload.testStateProperty });
    default:
      return state;
  }
};

/**
 * [description]
 * @param  {[type]} state:  AppStoreState [description]
 * @param  {[type]} action: Action<any>   [description]
 * @return {[type]}         [description]
 */
const uiStateReducers = (state: AppStoreState = initialState, action: Action<any>) => {
  switch (action.type) {

    // Saves a timestamp marking when the main game arena was last rendered
    case actions.RESET_LAST_RENDERED_TIME:
      return Object.assign({}, state, { lastRendered: Date.now() });

    // Add to top: import { SET_UI_UPDATE_READY } from './actions.tsx';
    case actions.SET_UI_UPDATE_READY:
      return Object.assign({}, state, { uiUpdateReady: true });

    //Perform calcs to determine what the current UI should display. Handles collisions, etc..
    case actions.RESOLVE_UI_STATE:
      return Object.assign({}, state, {
        uiState: resolveUIState(action.payload.time, action.payload.uiState),
      });

    default:
      return state;
  }
};

type QueuePushAction = { type: string, payload?: { input: string, type: number} };

const inputReducers = (state: AppStoreState = initialState, action: QueuePushAction) => {
  switch (action.type) {

    // action: { type: "ADD_ITEM_TO_INPUT_QUEUE", payload: { input: "Shoot", type: 2 }}
    case actions.ADD_ITEM_TO_INPUT_QUEUE:
      console.log('reducers#inputReducers: ADD_ITEM_TO_INPUT_QUEUE: action: ', action);
      return Object.assign({}, state, {
        inputQueue: state.inputQueue.concat(action.payload),
      });

    // action: {type: "CLEAR_INPUT_QUEUE"}
    case actions.CLEAR_INPUT_QUEUE:
      return Object.assign({}, state, { inputQueue: [] });

    default:
      return state;
  }
};

export const reducers = combineReducers({
  ui: uiStateReducers,
  input: inputReducers,
  debug: debugReducers,
});
