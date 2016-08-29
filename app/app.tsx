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
import { Bullet } from './components/Bullet/Bullet.tsx';
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
  BulletProps,
  controls } from './types/types.tsx';

import { resolvePosition, resolveSpeed } from './logic/resolveMovement.tsx';
import { createBullet } from './logic/createBullet.tsx';

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
  bullets: BulletProps[];
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
    },
    bullets: []
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
      let keyName = _.get(controls, e.key).toString();
      if (_.includes(keyName, 'Shoot')) {
        console.log('bang bang');
        inputQueue.push({ type: InputType.PlayerShoot, data: { keyPressed: keyName } });
      } else if (_.includes(keyName, 'Speed')) {
        inputQueue.push({ type: InputType.PlayerSpeedChange, data: { keyPressed: keyName } });
      } else {
        inputQueue.push({ type: InputType.PlayerMove, data: { keyPressed: keyName } });
      }
    }
  };

  render() {
    return (
      <Provider store={store}>
        <div onKeyDown = { this.events.keypress.bind(this) }>
          <Player
            color={ PlayerColor.Red }
            width={ this.props.spriteSize }
            {...this.state.player}
          />
          {_.map(this.state.bullets, (bullet, index) =>
            <Bullet
              key={index}
              xPos={bullet.xPos}
              yPos={bullet.yPos}
              speed={bullet.speed}
            />
          )}
          <ArenaBorder />
          <Clock time={this.state.time} />
        </div>
      </Provider>
    );
  };

  /**
   * calculate new positions of all the things
   */
  handleInputQueue = (curState, inputQueue: InputEvent[]) => {
    console.log('resolveMovement#handleInputQueue: inputQueue', inputQueue);

    _.each(inputQueue, (inputEvent: InputEvent) => {
      let inputType = InputType[inputEvent.type];

      if (inputType === InputType[InputType.PlayerMove]) {
        let newPosition = resolvePosition(curState.player, inputEvent.data.keyPressed);
        console.log('handleInputQueue: playerMoved: newPosition', newPosition);
        curState.player = newPosition;

      } else if (inputType === InputType[InputType.PlayerSpeedChange]) {
        console.log('resolveMovement#handleInputQueue: PlayerSpeedChange');
        curState.player.speed = resolveSpeed(curState.player.speed, inputEvent.data.keyPressed);

      } else if (inputType === InputType[InputType.PlayerShoot]) {
        console.log('handleInputQueue: bang!');
        curState.bullets = createBullet(curState.player, curState.bullets);

      } else {
        console.log('resolveMovement#handleInputQueue: WTF IS THIS???');
      }
    });
    return curState;
  };

  /**
   * Handle UI changes that occur as a direct result of user input (e.g. player movement, shooting)
   */
  handleInput = (time: number, newPositions) => {
    if (inputQueue.length > 0) { // do nothing if there are no input events
      newPositions = this.handleInputQueue(newPositions, inputQueue);
      inputQueue = [];
      console.log('app#tick: newPositions: ', newPositions);
    }
    return newPositions;
  }

  moveBullets = (bullets: BulletProps[]): BulletProps[] => {
    return _.map(bullets, (bullet: BulletProps) => {
      let {xPos, yPos, speed} = bullet;
      let hypoteneuse = (speed / 1.4142);

      switch (Direction[bullet.angle].toString()) {
        case "Up":
          bullet.yPos = yPos + speed;
          break;
        case "UpLeft":
          bullet.yPos = yPos + hypoteneuse;
          bullet.xPos = xPos + hypoteneuse;
          break;
        case "UpRight":
          bullet.xPos = xPos - hypoteneuse;
          bullet.yPos = yPos + hypoteneuse;
          break;
        case "DownLeft":
          bullet.xPos = xPos + hypoteneuse;
          bullet.yPos = yPos - hypoteneuse;
          break;
        case "DownRight":
          bullet.xPos = xPos - hypoteneuse;
          bullet.yPos = yPos - hypoteneuse;
          break;
        case "Down":
          bullet.yPos = yPos - speed;
          break;
        case "Right":
          bullet.xPos = xPos - speed;
          break;
        case "Left":
          bullet.xPos = xPos + speed;
          break;
        default:
          console.log('app.tsx#handleUpdates: ERROR: unknown direction:', Direction[bullet.angle]);
          break;
      }
      return bullet;
    });
  }

  updateBulletPositions = (bullets: BulletProps[]) => {
    bullets = this.moveBullets(bullets);
    bullets = _.filter(bullets, (bullet) =>
      (bullet.xPos < 310 && bullet.xPos > -283 && bullet.yPos < 290 && bullet.yPos > -303));
    return bullets;
  }

  /**
   * Handle UI changes that occur without input from the user (e.g. bullet and enemy movement)
   */
  handleUpdates = (curState) => {
    curState.bullets = this.updateBulletPositions(curState.bullets);
    return curState;
  }

  /**
   * The game loop. Coordinates everything. Changes propagate down the tree every time it ticks.
   *
   * Each tick: 1) get input (from inputQueue);
   *            2) Calculate new app state (resolve position of items), then update stored app state
   *            3) re-render views
   *            4) Clear inputQueue
   */
  tick = () => {
    let time = Date.now();
    if (time - lastRender > 100) { // ensure game loop only ticks 10X / s
      lastRender = time;
      let newPositions = this.handleInput(time, this.state);
      newPositions = this.handleUpdates(newPositions);
      this.setState(_.assign(this.state, newPositions, { time }));
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
