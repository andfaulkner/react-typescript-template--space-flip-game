'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
const CHANGE_DIRECTION = exports.CHANGE_DIRECTION = 'CHANGE_DIRECTION';
const changeDirection = exports.changeDirection = direction => ({
    type: CHANGE_DIRECTION,
    payload: { direction }
});