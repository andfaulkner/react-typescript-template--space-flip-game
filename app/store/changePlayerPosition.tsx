/// <reference path="../../typings/index.d.ts" />

import { Action } from './action.tsx';

export const CHANGE_PLAYER_POSITION = 'CHANGE_PLAYER_POSITION';
export type CHANGE_PLAYER_POSITION = { xLeft: number, yTop: number};

export const changePlayerPosition = (xLeft: number, yTop: number): Action<CHANGE_PLAYER_POSITION> =>
  ({
    type: CHANGE_PLAYER_POSITION,
    payload: { xLeft, yTop }
  });
