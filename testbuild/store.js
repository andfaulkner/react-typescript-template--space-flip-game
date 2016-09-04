'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.store = undefined;

var _redux = require('redux');

var _logger = require('./middleware/logger');

var _reducers = require('./reducers');

var _reducers2 = _interopRequireDefault(_reducers);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// // ACTIONS
// export const CHANGE_DIRECTION = 'CHANGE_DIRECTION';
// export const CHANGE_SPEED = 'CHANGE_SPEED';
// export const SHOOT_GUN = 'SHOOT_GUN';
// // ACTION CREATORS
// // export let changePosition = (xLeft: number, yTop: number) => ({ type: 'CHANGE_POSITION', xLeft, yTop });
// export let changeDirection = (direction: Direction) =>      ({ type: 'CHANGE_DIRECTION', direction });
// export let changeSpeed = (speed: number) =>                 ({ type: 'CHANGE_SPEED', speed });
// // INTERFACES
// interface State {
//   player: PlayerState;
// }
// // DEFAULT STATE
// let initialState: State = {
//   player: {
//     xLeft: 0,
//     yTop: 0,
//     angle: 225,
//     speed: 3
//   }
// };
// // create reducer without types
// // create state type
// // REDUCERS
// export let appReducers = (state: State = initialState, action: Action): State => {
//   switch (action.type) {
//     case "CHANGE_POSITION":
//       return Object.assign({}, state, {
//         player: Object.assign({}, state.player, {
//           xLeft: action.payload.xLeft,
//           yTop: action.payload.yTop
//         })
//       });
//     case "CHANGE_DIRECTION":
//       return Object.assign({}, state, {
//         player: Object.assign({}, state.player, {
//           direction: action.payload.direction
//         })
//       });
//     case "CHANGE_SPEED":
//       return Object.assign({}, state, {
//         player: Object.assign({}, state.player, {
//           speed: action.payload.speed
//         })
//       });
//     default:
//       break;
//   }
// };
let store = exports.store = (0, _redux.createStore)(_reducers2.default, (0, _redux.applyMiddleware)(_logger.logger)); /// <reference path="../typings/index.d.ts" />