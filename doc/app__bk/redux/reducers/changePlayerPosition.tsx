/// <reference path="../../../typings/index.d.ts" />

import * as  _ from 'lodash';

import { handleActions } from 'redux-actions';
import Action from '../actions/action';

import {
  CHANGE_PLAYER_POSITION,
  changePlayerPosition
} from '../actions/changePlayerPosition';

export default handleActions({
  CHANGE_PLAYER_POSITION: (state, action: Action<CHANGE_PLAYER_POSITION>) =>
    _.assign({}, state, {
      player: _.assign({}, state.player, {
        xLeft: action.payload.xLeft,
        yTop: action.payload.yTop
      })
  })
}, {});
