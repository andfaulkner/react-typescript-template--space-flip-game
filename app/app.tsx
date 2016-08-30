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
import { BoxUIEntity } from './components/BoxUIEntity/BoxUIEntity.tsx';
import { CurrentScore } from './components/CurrentScore/CurrentScore';
import { EnemyFighter } from './components/EnemyFighter/EnemyFighter';

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
  uiBoxes: UIEntityProps[];
  enemies: {
    fighters: UIEntityProps[]
  };
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
      angle: 225,
      speed: 3
    },
    bullets: [],
    uiBoxes: [],
    enemies: {
      fighters: []
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
          <ArenaBorder />
          <Clock time={this.state.time} />a
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
  };

  genPositions = (curState) => {
    let xLeft = _.random(-260, 260);
    let yTop = _.random(-260, 260);

    if (Math.abs(curState.player.xLeft - xLeft) < 15) {
      return (Math.abs(curState.player.yTop - yTop) > 30)
          ? { xLeft, yTop }
          : this.genPositions(curState);

    } else if (Math.abs(curState.player.yTop - yTop) < 15) {
      return (Math.abs(curState.player.xLeft - xLeft) > 30)
          ? { xLeft, yTop }
          : this.genPositions(curState);

    } else {
      return { xLeft, yTop };
    }
  };

  createUIBox = (curState, uiBoxes) => {
    uiBoxes.push(Object.assign({}, this.genPositions(curState), { speed: 2, angle: Direction.Up }));
    return uiBoxes;
  };

  createEnemy = (curState, enemies, enemyType) => {
    switch (enemyType) {
      case 'fighter':
        console.log('app.tsx:: created fighter!');
        enemies.fighters.push(Object.assign({},
          this.genPositions(curState),
          { speed: 4, angle: Direction.Down }
        ));
      break;
      default:
        console.error('app.tsx#createEnemy: Error: this enemy type does not exist');
    }
    console.log('app.tsx:: curState', curState);
    return enemies;
  };

  /**
   * Randomly generate uiBoxes.
   */
  updateBoxUIEntityGeneration = (curState, odds: number = 40) => {
    // create uiBox at random - approximately once / 40 ticks (every 4s). Don't create more than 10.
    if ((curState.uiBoxes.length <= 10) && (_.random(0, 20) === 20)) {
      switch (_.sample(['uiBox', 'enemy.fighter'])) {
        case('uiBox'):
          curState.uiBoxes = this.createUIBox(curState, curState.uiBoxes);
        case('enemy.fighter'):
          curState.enemies = this.createEnemy(curState, curState.enemies, 'fighter');

      }
    }
    return curState;
  }

  detectCollision = ((el1: Coordinates, el2: Coordinates, [el1Width, el2Width]: number[]) =>
    ((el2.xLeft < el1.xLeft + el1Width - el2Width) &&
     (el2.xLeft + el2Width > el1.xLeft - el1Width) &&
     (el2.yTop < el1.yTop + el1Width - el2Width) &&
     (el2.yTop + el2Width > el1.yTop - el1Width)));

  destroyCollisions = (set1: Coordinates[], set2: Coordinates[], ...widths: number[]) => (
    {
      set1: _.reject(set1, set1El =>
              _.remove(set2, (set2El, i) =>
                this.detectCollision(set1El, set2El, widths))),
      set2
    }
  );

  // naive collision detection
  bulletBoxUIEntityCollisions = (curState: AppState) =>
    _.assign(curState,
      {
        uiBoxes: _.reject(curState.uiBoxes, uiBox =>
                  !_.isEmpty(_.remove(curState.bullets, bullet =>
                    this.detectCollision(uiBox, bullet, [uiBoxWidth, bulletWidth])))),
        enemies: {
          fighters: _.reject(curState.enemies.fighters, fighter =>
                      !_.isEmpty(_.remove(curState.bullets, bullet =>
                        this.detectCollision(fighter, bullet, [fighterWidth, bulletWidth]))))
        }
      }
  );

  /**
   * Handle UI changes that occur without input from the user (e.g. bullet and uiBox movement)
   */
  handleUpdates = (curState) => {
    curState.bullets = updateBulletPositions(curState.bullets);
    curState = this.updateBoxUIEntityGeneration(curState);
    curState = this.bulletBoxUIEntityCollisions(curState);
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
