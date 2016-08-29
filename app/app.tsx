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
  controls } from './types/types.tsx';

import { resolvePosition, resolveSpeed } from './logic/resolveMovement.tsx';

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

export interface BulletProps {
  xPos: number;
  yPos: number;
  angle?: number;
  speed: number;
}

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

  createBullet = (playerState, bullets: BulletProps[]): BulletProps[] => {
    switch (playerState.angle) {
      case Direction.Up:
        bullets.push({
          xPos: playerState.xPos,
          yPos: playerState.yPos,
          speed: 10
        });
        break;
      case Direction.Down:
        bullets.push({
          xPos: playerState.xPos,
          yPos: playerState.yPos - 40,
          speed: 10
        });
        break;
      case Direction.Left:
        bullets.push({
          xPos: playerState.xPos + 20,
          yPos: playerState.yPos - 20,
          speed: 10
        });
        break;
      case Direction.Right:
        bullets.push({
          xPos: playerState.xPos - 20,
          yPos: playerState.yPos - 20,
          speed: 10
        });
        break;
      case Direction.UpRight:
        bullets.push({
          xPos: playerState.xPos - 17,
          yPos: playerState.yPos - 6,
          speed: 10
        });
        break;
      case Direction.UpLeft:
        bullets.push({
          xPos: playerState.xPos + 17,
          yPos: playerState.yPos - 6,
          speed: 10
        });
        break;
      case Direction.DownRight:
        bullets.push({
          xPos: playerState.xPos - 17,
          yPos: playerState.yPos - 36,
          speed: 10
        });
        break;
      case Direction.DownLeft:
        bullets.push({
          xPos: playerState.xPos + 17,
          yPos: playerState.yPos - 36,
          speed: 10
        });
        break;
      default:
        break;
    }
    return bullets;
  };

  // calculate new positions of all the things
  handleInputEvent = (curState, inputQueue: InputEvent[]) => {
    console.log('resolveMovement#handleInputEvent: inputQueue', inputQueue);

    _.each(inputQueue, (inputEvent: InputEvent) => {
      let inputType = InputType[inputEvent.type];

      if (inputType === InputType[InputType.PlayerMove]) {
        let newPosition = resolvePosition(curState.player, inputEvent.data.keyPressed);
        console.log('handleInputEvent: playerMoved: newPosition', newPosition);
        curState.player = newPosition;

      } else if (inputType === InputType[InputType.PlayerSpeedChange]) {
        console.log('resolveMovement#handleInputEvent: PlayerSpeedChange');
        curState.player.speed = resolveSpeed(curState.player.speed, inputEvent.data.keyPressed);

      } else if (inputType === InputType[InputType.PlayerShoot]) {
        console.log('handleInputEvent: bang!');
        curState.bullets = this.createBullet(curState.player, curState.bullets);

      } else {
        console.log('resolveMovement#handleInputEvent: WTF IS THIS???');
      }
    });
    return curState;
  };

  handleInput = (time: number) => {
    if (inputQueue.length > 0) { // do nothing if there are no input events
      let newPositions = this.handleInputEvent(this.state, inputQueue);
      inputQueue = [];
      console.log('app#tick: newPositions: ', newPositions);
      this.setState(_.assign(this.state, newPositions, { time }));
    } else {
      this.setState(_.assign(this.state, { time }));
    }
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
