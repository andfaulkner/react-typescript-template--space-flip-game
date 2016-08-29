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
  controls } from './types/types.tsx';

import { Provider } from 'react-redux';
import { store } from './store.tsx'; // only import from here

console.log('js loaded');

interface PlayerUIData {
  xPos: number;
  yPos: number;
  angle: number;
  speed: number;
}

enum InputEventType {
  PlayerMove,
  PlayerSpeedChange
}

interface InputEvent {
  type: InputEventType;
  data: Object;
}

let inputQueue: InputEvent[] = [];

let lastRender = Date.now();

// events:
//   PlayerMove
//   PlayerSpeedChange
//
// state:
//   time: number,
//   player: {
//     xPos: number,
//     yPos: number,
//     speed: number,
//     direction: number
//   }


//{ event: { }} 

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


  // /**
  //  * Ensure player sprite is in bounds on the given dimension
  //  */
  // checkInBounds_1D = (position: number, dimen: Dimension,
  //                     state: PlayerVector | PlayerState): number => {
  //   if (position >= 300) {
  //     return 300;
  //   }
  //   if (position - this.props[Dimension[dimen].toString()] <= -300) {
  //     return -300 + this.props[Dimension[dimen].toString()];
  //   }
  //   return position;
  // }

  // /**
  //  * Ensure player sprite remains in bounds on all dimensions
  //  */
  // keepInBounds = (xPos: number, yPos: number): Coordinates => (
  //   {
  //     xPos: this.checkInBounds_1D(xPos, Dimension.width, this.state),
  //     yPos: this.checkInBounds_1D(yPos, Dimension.width, this.state)
  //   });

  // /**
  //  * Reduce or increase player sprite speed (i.e. in response to keypresses)
  //  */
  // adjustSpeed = (action, speed): number => speed + (action === "RaiseSpeed" ? 1 :
  //                                                   (action === "LowerSpeed" ? -1 : 0));

  // *
  //  * Respond to keyboard to change player sprite's position
   
  // move = ({ xPos, yPos, speed }: PlayerVector, key: string, action: string = ''): void => {
  //   console.log(`${key} pressed`);
  //   let yPosNew: number = yPos + (action.match(/Up/g) ? speed :
  //                                (action.match(/Down/g) ? -1 * speed : 0));
  //   let xPosNew: number = xPos + (action.match(/Left/g) ? speed :
  //                                (action.match(/Right/g) ? -1 * speed : 0));
  //   console.log('Player.tsx:: move: xPosNew: ', xPosNew, '; yPosNew: ', yPosNew);

  //   return Object.assign({}, this.state,
  //            this.keepInBounds(xPosNew, yPosNew),
  //            {speed: this.adjustSpeed(action, speed),
  //            angle: this.rotate(action)});
  // };

  // rotate = (keyName: string) => {
  //   console.log('Player#rotate: keyName', keyName);
  //   let currentDirection: Direction = Direction[keyName];
  //   console.log('Player.jsx: rotate: currentDirection', currentDirection);
  //   /*downR:0 |down:45 |downL:90 |L:135 |upL:180 |up:225 |upR:270 |R:315*/
  //   return currentDirection || this.state.angle;
  // }

  events = {
  /**
  * Respond to any key press, but only if it's a registered type of key
  */
    keypress: (e: KeyboardEvent): void => {
      console.log('e:', e);
      let keyName = _.get(controls, e.key);
      console.log('keyName', keyName);
      console.log('keyName', typeof keyName);
      if (_.isString(keyName)) {
        inputQueue.push({ type: InputEventType.PlayerMove, data: { direction: keyName } });
        console.log('app#keyPress: added item to event queue! Event queue: ', inputQueue);
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
            angle = { this.state.player.angle }
            speed = { this.state.player.speed }
            xPos = { this.state.player.xPos }
            yPos = { this.state.player.yPos }
          />
          <ArenaBorder />
          <Clock time={this.state.time} />
        </div>
      </Provider>
    );
  };

  //
  // DETERMINE NEW POSITION OF SPRITE, BASED ON DIRECTION GIVEN
  //
  resolveNewPlayerPosition = ({ xPos, yPos, speed, angle }: PlayerUIData, direction: Direction): PlayerUIData => {
    console.log('resolveNewPlayerPosition: direction', direction);
    let hypoteneuse = (speed / 1.4142);

    switch (direction.toString()) {
      case "Up":
        return {
          xPos,
          yPos: yPos + speed,
          angle: this.rotate(angle, "Up"),
          speed
        };
      case "UpLeft":
        return {
          xPos: xPos + (speed / 1.4142),
          yPos: yPos + (speed / 1.4142),
          angle: this.rotate(angle, "UpLeft"),
          speed
        };
      case "Left":
        return {
          xPos: xPos + speed,
          yPos,
          angle: this.rotate(angle, "Left"),
          speed
        };
      case "DownLeft":
        return {
          xPos: xPos + hypoteneuse,
          yPos: yPos - hypoteneuse,
          angle: this.rotate(angle, "DownLeft"),
          speed
        };
      case "Down":
        return {
          xPos,
          yPos: yPos - speed,
          angle: this.rotate(angle, "Down"),
          speed
        };
      case "DownRight":
        return {
          xPos: xPos - hypoteneuse,
          yPos: yPos - hypoteneuse,
          angle: this.rotate(angle, "DownRight"),
          speed
        };
      case "Right":
        return {
          xPos: xPos - speed,
          yPos,
          angle: this.rotate(angle, "Right"),
          speed
        };
      case "UpRight":
        return {
          xPos: xPos - (speed / 1.4142),
          yPos: yPos + (speed / 1.4142),
          angle: this.rotate(angle, "UpRight"),
          speed
        };
      default:
        console.log('resolveNewPlayerPosition: other value');
        return { xPos, yPos, angle, speed };
    }
  }

  rotate = (angle: number, keyName: string) => {
    console.log('Player#rotate: keyName', keyName);
    let currentDirection: Direction = Direction[keyName];
    console.log('Player.jsx: rotate: currentDirection', currentDirection);
    /*downR:0 |down:45 |downL:90 |L:135 |upL:180 |up:225 |upR:270 |R:315*/
    return currentDirection || angle;
  }

  // calculate new positions of all the things
  calculateNewPositions = (inputQueue) => {
    console.log('calculateNewPositions: inputQueue', inputQueue);

    let tempState = _.cloneDeep(this.state);

    _.each(inputQueue, (inputEvent) => {

      if (InputEventType[inputEvent.type] === InputEventType[InputEventType.PlayerMove]) {
        console.log('playerMoved');
        let newPosition = this.resolveNewPlayerPosition(tempState.player, inputEvent.data.direction);
        console.log('calculateNewPositions: newPosition', newPosition);
        tempState.player = newPosition;

      } else if (InputEventType[inputEvent.type] === InputEventType[InputEventType.PlayerSpeedChange]) {
        console.log('PlayerSpeedChange');

      } else {
        console.log('WTF IS THIS???');
      }
    });
    return tempState;
  }

  // ON TICK:
  //   get input
  //   update game state
  //   render
  //   repeat
  //   get queue from redux
  //   resolve position of all onscreen items
  //   rerender onscreen elements, with new properties passed down
  //   save empty queue
  /**
   * The game loop. Coordinates everything. Changes propagate down the tree every time it ticks
   */
  tick = () => {
    let time = Date.now();
    // ensure game loop only ticks 10X / s
    if (time - lastRender > 100) {
      // console.log('app.tsx:: game loop ticked: inputQueue', inputQueue);
      lastRender = time;
      if (inputQueue.length > 0) {
        let newPositions = this.calculateNewPositions(inputQueue);
        inputQueue = [];
        console.log('app#tick: newPositions: ', newPositions);
        this.setState(_.assign(this.state, newPositions, { time }));
      }
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
