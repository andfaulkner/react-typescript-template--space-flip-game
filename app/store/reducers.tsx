// /// <reference path="../../typings/index.d.ts" />

import { Action } from './action.tsx';
import { actions } from './actions.tsx';
import { AppStoreState, initialState } from './initialState.tsx';
import { resolveUIState } from './reducers/resolveUIState.tsx';

console.log('reducers.tsx:: actions: ', actions);

// All actions take this form:
// { type: string;     payload: T;     error?: boolean;     meta?: any; }

export const reducers = (state: AppStoreState = initialState, action: Action<any>) => {
  switch (action.type) {

    // EXPERIMENTAL REDUCER
    case actions.TEST_SWITCH_STATE:
      return Object.assign({}, state, { testStateProperty: action.payload.testStateProperty });

    case actions.ADD_ITEM_TO_INPUT_QUEUE:
      let newInputQueue = state.inputQueue;
      newInputQueue.push(action.payload);
      return Object.assign({}, state, { inputQueue: newInputQueue });

    case actions.CLEAR_INPUT_QUEUE:
      return Object.assign({}, state, { inputQueue: [] });

    // Saves a timestamp marking when the main game arena was last rendered
    case actions.RESET_LAST_RENDERED_TIME:
      return Object.assign({}, state, { lastRendered: Date.now() });

    // Add to top: import { SET_UI_UPDATE_READY } from './actions.tsx';
    case actions.SET_UI_UPDATE_READY:
      return Object.assign({}, state, { uiUpdateReady: true });

    // Saves a timestamp marking when the main game arena was last rendered
    case actions.SET_UI_STATE:
      let { player, bullets, uiBoxes, enemies, score } = action.payload;
      return Object.assign({}, state, {
        uiState: {
          player: (player) ? player : state.uiState.player,
          bullets: (bullets) ? bullets : state.uiState.bullets,
          uiBoxes: (uiBoxes) ? uiBoxes : state.uiState.uiBoxes,
          enemies: (enemies) ? enemies : state.uiState.enemies,
          score: (score) ? score : state.uiState.score,
        },
      });

    //Perform calcs to determine what the current UI should display. Handles collisions, etc..
    case actions.RESOLVE_UI_STATE:
      return Object.assign({}, state, {
        uiState: resolveUIState(action.payload.time, action.payload.uiState),
      });

    default:
      return state;
  }
};
