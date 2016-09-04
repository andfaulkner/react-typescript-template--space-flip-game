'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
const CHANGE_PLAYER_POSITION = exports.CHANGE_PLAYER_POSITION = 'CHANGE_PLAYER_POSITION';
const changePlayerPosition = exports.changePlayerPosition = (xLeft, yTop) => ({
    type: CHANGE_PLAYER_POSITION,
    payload: { xLeft, yTop }
});