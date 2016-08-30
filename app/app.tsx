/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Button } from 'react-bootstrap';

import {
  Player,
  PlayerProps
} from './components/Player/Player.tsx';

import { ArenaBorder } from './components/ArenaBorder/ArenaBorder';
import { Bullet } from './components/Bullet/Bullet.tsx';
import { KeyController } from './components/KeyController/KeyController';
import { Clock } from './components/Clock/Clock';
import { Enemy } from './components/Enemy/Enemy';
import { CurrentScore } from './components/CurrentScore/CurrentScore';

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
  controls } from './types/types.tsx';

import {
  resolvePosition,
  resolveSpeed
} from './logic/resolvePlayerMovement.tsx';

import { createBullet } from './logic/createBullet.tsx';
import { updateBulletPositions } from './logic/resolveBulletMovement.tsx';

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
  player: UIEntityProps;
  bullets: UIEntityProps[];
  enemies: UIEntityProps[];
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
      xLeft: 0,
      yTop: 0,
      angle: 225,
      speed: 3
    },
    bullets: [],
    enemies: []
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
              {...bullet}
            />
          )}
          {_.map(this.state.enemies, (enemy, index) =>
            <Enemy
              key={index}
              {...enemy}
            />
          )}
          <ArenaBorder />
          <Clock time={this.state.time} />
          <CurrentScore />
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

  /**
   * Randomly generate enemies.
   */
  updateEnemyGeneration = (curState, enemies, odds: number = 40) => {
    // create enemy at random - approximately once / 40 ticks (every 4s). Don't create more than 10.
    if ((enemies.length <= 10) && (_.random(0, 20) === 20)) {
      console.log('app.tsx:: updateEnemyGeneration: enemy created!');
      const genPositions = () => {
        let xLeft = _.random(-260, 260);
        let yTop = _.random(-260, 260);
        if (Math.abs(curState.player.xLeft - xLeft) < 15) {
          return (Math.abs(curState.player.yTop - yTop) > 30) ? { xLeft, yTop } : genPositions();
        } else if (Math.abs(curState.player.yTop - yTop) < 15) {
          return (Math.abs(curState.player.xLeft - xLeft) > 30) ? { xLeft, yTop } : genPositions();
        } else {
          return { xLeft, yTop };
        }
      };
      enemies.push(Object.assign({}, genPositions(), { speed: 2, angle: Direction.Up }));
    }
    return enemies;
  }

  detectCollision = (uiItem1: Coordinates, uiItem2: Coordinates, item1Width: number, item2Width: number) => {
    if ((uiItem2.xLeft < uiItem1.xLeft + item1Width - item2Width) &&
        (uiItem2.xLeft + item2Width > uiItem1.xLeft - item1Width) &&
        (uiItem2.yTop < uiItem1.yTop + item1Width - item2Width) &&
        (uiItem2.yTop + item2Width > uiItem1.yTop - item1Width)) {
      return true;
    }
    return false;
  };

  destroyCollisions = (set1: Coordinates[], set2: Coordinates[], set1Width: number, set2Width: number) => {
    // start naive
    set1 = _.filter(set1, (set1Item) => {
      return _.every(set2, (set2Item, index) => {
        if (this.detectCollision(set1Item, set2Item, set1Width, set2Width)) {
          console.log('app.tsx:: detectCollisions COLLISION!');
          _.pull(set2, set2Item);
          return false;
        } else {
          return true;
        }
      });
    });
    return { set1, set2 };
  };

  bulletEnemyCollisions = (curState: AppState) => {
    const enemyWidth = 25;
    const bulletWidth = 7;
    // start naive
    curState.enemies = _.filter(curState.enemies, (enemy) => {
      return _.every(curState.bullets, (bullet, index) => {
        if ((bullet.xLeft < enemy.xLeft + enemyWidth - bulletWidth) &&
            (bullet.xLeft + bulletWidth > enemy.xLeft - enemyWidth) &&
            (bullet.yTop < enemy.yTop + enemyWidth - bulletWidth) &&
            (bullet.yTop + bulletWidth > enemy.yTop - enemyWidth)) {
          console.log('app.tsx:: bulletEnemyCollisions COLLISION!');
          _.pull(curState.bullets, bullet);
          return false;
        } else {
          return true;
        }
      });
    });
    return curState;
  };

  /**
   * Handle UI changes that occur without input from the user (e.g. bullet and enemy movement)
   */
  handleUpdates = (curState) => {
    curState.bullets = updateBulletPositions(curState.bullets);
    curState.enemies = this.updateEnemyGeneration(curState, curState.enemies);
    curState = this.bulletEnemyCollisions(curState);
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
