/// <reference path="../../typings/index.d.ts" />

import * as _ from "lodash";
import createActions from '../../node_modules/redux-actions/lib/createActions'; // WEIRD IMPORT REQUIRED DUE TO ERROR
import { InputEvent, UIState } from '../types/types.tsx';

const actionData = {
  ADD_ITEM_TO_INPUT_QUEUE: (input: InputEvent) => input,
  CLEAR_INPUT_QUEUE: i => i,
  RESET_LAST_RENDERED_TIME: i => i,
  SET_UI_STATE: newState => newState,
  SET_UI_UPDATE_READY: i => i,
  TEST_SWITCH_STATE: i => i,
  RESOLVE_UI_STATE: (time: number, uiState: UIState) => ({ time, uiState }),
};

export const actions: any = _.reduce(Object.keys(actionData),
  (total, act) => _.merge(total, {[act]: act}),
{});

export const actionCreators = _.mapKeys(createActions(actionData),
  (v, k: string) => _.replace(k, /ui/i, 'UI'));
