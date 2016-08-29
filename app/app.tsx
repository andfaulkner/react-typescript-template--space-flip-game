/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Button } from 'react-bootstrap';

import {
  Player,
  PlayerState,
  PlayerProps
} from './components/Player/Player.tsx';

import { ArenaBorder } from './components/ArenaBorder/ArenaBorder';
import { KeyController } from './components/KeyController/KeyController';
import { Clock } from './components/Clock/Clock';

import {
  PlayerColor,
  Direction,
  Dimension,
  PlayerVector,
  Coordinates,
  SpeedChange,
  PlayerUIData,
  InputType,
  InputEvent,
  controls } from './types/types.tsx';

import { calcNewPositions } from './logic/resolveMovement.tsx';

import { Provider } from 'react-redux';
import { store } from './store.tsx'; // only import from here

console.log('js loaded');

let inputQueue: InputEvent[] = [];

let lastRender = Date.now();

// INTERFACES
export interface AppProps {
  spriteSize: number;
};

export interface AppState {
  time: number;
  player: PlayerUIData;
};

/**
 * Wrap App with Redux store.
 */
class Root extends React.Component<{}, {}> {
  render() {
    return (
      <Provider store={store}>
        <App spriteSize={20} />
      </Provider>
    );
  }
};

// let positionResolver = {
//   rotate: (angle: number, keyName: string): number => {
//     console.log('Player#rotate: keyName', keyName);
//     let curDirection: Direction = Direction[keyName];
//     console.log('Player.jsx: rotate: curDirection', curDirection);
//     /*downR:0 |down:45 |downL:90 |L:135 |upL:180 |up:225 |upR:270 |R:315*/
//     return curDirection || angle;
//   },

//   resolvePlayerPosition: ({ xPos, yPos, speed, angle }: PlayerUIData, direction: Direction): PlayerUIData => {
//     console.log('resolvePlayerPosition: direction', direction);
//     let hypoteneuse = (speed / 1.4142);

//     switch (direction.toString()) {
//       case "Up":
//         return {
//           xPos,
//           yPos: yPos + speed,
//           angle: this.rotate(angle, "Up"),
//           speed
//         };
//       case "UpLeft":
//         return {
//           xPos: xPos + (speed / 1.4142),
//           yPos: yPos + (speed / 1.4142),
//           angle: this.rotate(angle, "UpLeft"),
//           speed
//         };
//       case "Left":
//         return {
//           xPos: xPos + speed,
//           yPos,
//           angle: this.rotate(angle, "Left"),
//           speed
//         };
//       case "DownLeft":
//         return {
//           xPos: xPos + hypoteneuse,
//           yPos: yPos - hypoteneuse,
//           angle: this.rotate(angle, "DownLeft"),
//           speed
//         };
//       case "Down":
//         return {
//           xPos,
//           yPos: yPos - speed,
//           angle: this.rotate(angle, "Down"),
//           speed
//         };
//       case "DownRight":
//         return {
//           xPos: xPos - hypoteneuse,
//           yPos: yPos - hypoteneuse,
//           angle: this.rotate(angle, "DownRight"),
//           speed
//         };
//       case "Right":
//         return {
//           xPos: xPos - speed,
//           yPos,
//           angle: this.rotate(angle, "Right"),
//           speed
//         };
//       case "UpRight":
//         return {
//           xPos: xPos - (speed / 1.4142),
//           yPos: yPos + (speed / 1.4142),
//           angle: this.rotate(angle, "UpRight"),
//           speed
//         };
//       default:
//         console.log('resolvePlayerPosition: other value');
//         return { xPos, yPos, angle, speed };
//     }
//   }
// }



/**
 * Entry point for the whole application (excepting the redux wrapper)
 */
class App extends React.Component<AppProps, AppState> {
  state: AppState = {
    time: Date.now(),
    player: {
      xPos: 0,
      yPos: 0,
      angle: 225,
      speed: 3
    }
  };

  componentWillMount = () => requestAnimationFrame(this.tick);

  componentDidMount = (): void => {
    document.onkeydown = this.events.keypress;
  }

  events = {
  /**
  * Respond to any key press, but only if it's a registered type of key
  */
    keypress: (e: KeyboardEvent): void => {
      console.log('e:', e);
      let keyName = _.get(controls, e.key);
      if (_.isString(keyName) && !_.includes(keyName, 'Speed')) {
        inputQueue.push({ type: InputType.PlayerMove, data: { keyPressed: keyName } });
      } else if (_.isString(keyName) && _.includes(keyName, 'Speed')) {
        inputQueue.push({ type: InputType.PlayerSpeedChange, data: { keyPressed: keyName } });
      }
    }
  };

  render() {
    return (
      <Provider store={store}>
        <div
          onKeyDown = { this.events.keypress.bind(this) }
        >
          <Player
            color={ PlayerColor.Red }
            width={ this.props.spriteSize }
            {...this.state.player}
          />
          <ArenaBorder />
          <Clock time={this.state.time} />
        </div>
      </Provider>
    );
  };

  handleInput = (time: number) => {
    if (inputQueue.length > 0) { // do nothing if there are no input events
      let newPositions = calcNewPositions(this.state, inputQueue);
      inputQueue = [];
      console.log('app#tick: newPositions: ', newPositions);
      this.setState(_.assign(this.state, newPositions, { time }));
    }
  }

  // ON TICK:
  //   get input;   update game state;   render;    repeat;
  //   get queue from redux
  //   resolve position of all onscreen items
  //   ! save empty queue
  /**
   * The game loop. Coordinates everything. Changes propagate down the tree every time it ticks
   */
  tick = () => {
    let time = Date.now();
    if (time - lastRender > 100) { // ensure game loop only ticks 10X / s
      lastRender = time;
      this.handleInput(time);
    }
    requestAnimationFrame(this.tick);
  };
};

document.addEventListener("DOMContentLoaded", function(event) {
  console.log('DOM loaded - mounting React');
  ReactDOM.render(
    <Root />,
    document.getElementById('content')
  );
});
