/// <reference path="../typings/index.d.ts" />

import { Direction } from './types/types.tsx';
import { PlayerState } from './components/Player/Player.tsx';

import { createStore, applyMiddleware } from 'redux';
import { logger } from './middleware/logger';

import Action from './actions/action';
import reducers from './reducers';


// // ACTIONS
// export const CHANGE_DIRECTION = 'CHANGE_DIRECTION';
// export const CHANGE_SPEED = 'CHANGE_SPEED';
// export const SHOOT_GUN = 'SHOOT_GUN';

// // ACTION CREATORS
// // export let changePosition = (xPos: number, yPos: number) => ({ type: 'CHANGE_POSITION', xPos, yPos });
// export let changeDirection = (direction: Direction) =>      ({ type: 'CHANGE_DIRECTION', direction });
// export let changeSpeed = (speed: number) =>                 ({ type: 'CHANGE_SPEED', speed });

// // INTERFACES
// interface State {
//   player: PlayerState;
// }

// // DEFAULT STATE
// let initialState: State = {
//   player: {
//     xPos: 0,
//     yPos: 0,
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
//           xPos: action.payload.xPos,
//           yPos: action.payload.yPos
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

export let store = createStore(
  reducers,
  applyMiddleware(logger)
);
