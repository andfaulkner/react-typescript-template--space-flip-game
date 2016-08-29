/// <reference path="../../typings/index.d.ts" />

import * as  _ from 'lodash';
import { handleActions } from 'redux-actions';
import Action from './actions/action';
import {
  CHANGE_POSITION,
  changePosition
} from './actions/changePosition';

import {
  CHANGE_DIRECTION,
  changeDirection
} from './actions/changeDirection';

const reducer = handleActions(
  {
    CHANGE_POSITION: (state, action: Action<CHANGE_POSITION>) =>
      _.assign({}, state, {
        player: _.assign({}, state.player, {
          xPos: action.payload.xPos,
          yPos: action.payload.yPos
        })
    }),
    CHANGE_DIRECTION: (state, action: Action<CHANGE_DIRECTION>) =>
        _.assign({}, state, {
          player: _.assign({}, state.player, {
            direction: action.payload.direction
          })
        });

  }
);
  // ,
  // [CHANGE_DIRECTION]: function(state, action: Action<CHANGE_DIRECTION>) {
  //     return Object.assign({}, state, {
  //       player: Object.assign({}, state.player, {
  //         direction: action.payload.direction
  //       })
  //     });
  // }

export default reducer;