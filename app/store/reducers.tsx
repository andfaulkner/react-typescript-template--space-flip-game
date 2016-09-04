// /// <reference path="../../typings/index.d.ts" />

import { TEST_SWITCH_STATE } from './actions.tsx';
import { Action } from './action.tsx';

// All actions take this form:
// interface Action<T> {
//   type: string;
//   payload: T;
//   error?: boolean;
//   meta?: any;
// }

interface AppStoreState {
  testStateProperty: boolean;
};

const initialState: AppStoreState = {
  testStateProperty: false,
};

export const reducers = (state: AppStoreState = initialState,
                         action: Action<{testStateProperty: boolean}>) => {
  switch (action.type) {
    // EXPERIMENTAL REDUCER
    case TEST_SWITCH_STATE:
      return Object.assign({}, state, { testStateProperty: action.payload.testStateProperty });
    default:
      return state;
  }
};



// import * as  _ from 'lodash';

// import { handleActions } from 'redux-actions';
// import Action from '../actions/action';

// import {
//   CHANGE_PLAYER_POSITION,
//   changePlayerPosition
// } from '../actions/changePlayerPosition';

// export default handleActions({
//   CHANGE_PLAYER_POSITION: (state, action: Action<CHANGE_PLAYER_POSITION>) =>
//     _.assign({}, state, {
//       player: _.assign({}, state.player, {
//         xLeft: action.payload.xLeft,
//         yTop: action.payload.yTop
//       })
//   })
// }, {});
