/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Button } from 'react-bootstrap';

import {
  Player,
  PlayerProps
} from './components/Player/Player.tsx';

import { Bullet } from './components/Bullet/Bullet.tsx';
import { KeyController } from './components/KeyController/KeyController';
import { BoxUIEntity } from './components/BoxUIEntity/BoxUIEntity.tsx';
import { EnemyFighter } from './components/EnemyFighter/EnemyFighter';
import { HUD } from './components/HUD/HUD';
import { NavHeader } from './components/NavHeader/NavHeader.tsx';

import {
  PlayerColor,
  Direction,
  Dimension,
  UIEntityVector,
  Coordinates,
  SpeedChange,
  UIEntityProps,
  InputType,
  InputEvent,
  AppState,
  controls } from './types/types.tsx';

import {
  resolvePosition,
  resolveSpeed
} from './logic/resolvePlayerMovement.tsx';

import { createUIBox, createEnemy } from './logic/npcFactories.tsx';

import { createBullet } from './logic/createBullet.tsx';
import { updateBulletPositions } from './logic/resolveBulletMovement.tsx';
import { bulletToUIEntityCollisions } from './logic/collisionHandler.tsx';
import { Provider } from 'react-redux';
import { store } from './store.tsx'; // only import from here


console.log('app base js loaded');

require('./components/app.css');
console.log('app base css loaded');

require('./components/transparent.jpg');
console.log('images loaded');

let inputQueue: InputEvent[] = [];
let lastRender = Date.now();

// INTERFACES
export interface AppProps {
  spriteSize: number;
};

const uiBoxWidth = 25;
const fighterWidth = 28;
const bulletWidth = 7;

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
      xLeft: 0,
      yTop: 0,
      angle: 270,
      speed: 3,
      width: 20,
      height: 20
    },
    bullets: [],
    uiBoxes: [],
    enemies: {
      fighters: []
    },
    score: Math.floor(0.001) // help prevent coersion to boolean
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
          <div className="layout-transparent mdl-layout mdl-js-layout">
            <NavHeader />

            <main className="mdl-layout__content">
              <Player
                color={ PlayerColor.Red }
                width={ this.props.spriteSize }
                {...this.state.player}
              />
              {_.map(this.state.bullets, (bullet, index) =>
                <Bullet
                  key={index}
                  {...bullet}
                />
              )}
              {_.map(this.state.enemies.fighters, (enemyFighter, index) =>
                <EnemyFighter
                  key={index}
                  {...enemyFighter}
                />
              )}
              {_.map(this.state.uiBoxes, (uiBox, index) =>
                <BoxUIEntity
                  key={index}
                  {...uiBox}
                />
              )}
              <HUD
                score={this.state.score}
                time={this.state.time}
              />
            </main>
          </div>
        </div>
      </Provider>
    );
  };

  /**
   * calculate new positions of all the things
   */
  handleInputQueue = (curState, inputQueue: InputEvent[]) => {
    console.log('resolveMove#handleInputQueue: inputQueue', inputQueue);

    _.each(inputQueue, (inputEvent: InputEvent) => {
      let inputType = InputType[inputEvent.type];

      if (inputType === InputType[InputType.PlayerMove]) {
        let newPosition = resolvePosition(curState.player, inputEvent.data.keyPressed);
        console.log('handleInputQueue: playerMoved: newPosition', newPosition);
        curState.player = newPosition;

      } else if (inputType === InputType[InputType.PlayerSpeedChange]) {
        console.log('resolveMove#handleInputQueue: PlayerSpeedChange');
        curState.player.speed = resolveSpeed(curState.player.speed, inputEvent.data.keyPressed);

      } else if (inputType === InputType[InputType.PlayerShoot]) {
        console.log('handleInputQueue: bang!');
        curState.bullets = createBullet(curState.player, curState.bullets);

      } else {
        console.log('resolveMove#handleInputQueue: WTF IS THIS???');
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
  };

  /**
   * Randomly generate uiBoxes.
   */
  updateBoxUIEntity = (curState, odds: number = 40) => {
    // create uiBox at random - approximately once / 40 ticks (every 4s). Don't create more than 10.
    if ((curState.uiBoxes.length <= 10) && (_.random(0, 20) === 20)) {
      switch (_.sample(['uiBox', 'enemy.fighter'])) {
        case('uiBox'):
          curState.uiBoxes = createUIBox(curState);
          console.log('updateBoxUIEntity: curState.uiBoxes:', curState.uiBoxes);
        case('enemy.fighter'):
          curState.enemies = createEnemy(curState, curState.enemies, 'fighter');
      }
    }
    return curState;
  }
  /**
   * Generate random movements from enemies
   * ** ONGOING **
   */
  moveNpcs = (curState: AppState) => {
    let { fighters } = curState.enemies;
    curState.enemies.fighters = _.map(fighters, (fighter: UIEntityProps, i: number) => fighter);
    return curState;
  };

  /**
   * Handle UI changes that occur without input from the user (e.g. bullet and uiBox movement)
   */
  handleUpdates = (curState: AppState, time: number): AppState => {
    curState.time = time;
    curState.bullets = updateBulletPositions(curState.bullets);
    curState = this.moveNpcs(curState);
    curState = this.updateBoxUIEntity(curState);
    curState = bulletToUIEntityCollisions(curState);
    return curState;
  };

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
      newPositions = this.handleUpdates(newPositions, time);
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
