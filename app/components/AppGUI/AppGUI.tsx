/// <reference path="../../../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import TransitionGroup from 'react-addons-transition-group';

import { Button } from 'react-bootstrap';

import {
  Player,
  PlayerProps
} from '../Player/Player.tsx';

import { Bullet } from '../Bullet/Bullet.tsx';
import { KeyController } from '../KeyController/KeyController';
import { BoxUIEntity } from '../BoxUIEntity/BoxUIEntity.tsx';
import { EnemyCrawler } from '../EnemyCrawler/EnemyCrawler';
import { HUD } from '../HUD/HUD';
import { NavHeader } from '../NavHeader/NavHeader.tsx';

import {
  PlayerColor,
  InputType,
  InputEvent,
  AppState,
  EnemyCrawlerProps,
  controls } from '../../types/types.tsx';

import {
  resolvePosition,
  resolveSpeed
} from '../../logic/resolvePlayerMovement.tsx';

import { createUIBox, createEnemy } from '../../logic/npcFactories.tsx';

import { createBullet } from '../../logic/createBullet.tsx';
import { updateBulletPositions } from '../../logic/resolveBulletMovement.tsx';
import { bulletToUIEntityCollisions } from '../../logic/collisionHandler.tsx';

console.log('app base js loaded');

require('./AppGUI.css');
console.log('app base css loaded');

let inputQueue: InputEvent[] = [];
let lastRender = Date.now();

// INTERFACES
const uiBoxWidth = 25;
const crawlerWidth = 28;
const bulletWidth = 7;

const defaultState: AppState = {
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
      crawlers: []
    },
    score: Math.floor(0.001) // help prevent coersion to boolean
};

/**
 * Entry point for the whole application (excepting the redux wrapper)
 */
export class AppGUI extends React.Component<{ spriteSize: number }, AppState> {
  state: AppState = defaultState;

  componentWillMount = () => requestAnimationFrame(this.tick);
  componentDidMount = () => (document.onkeydown = this.events.keypress);

  events = {

  /**
  * Respond to any key press, but only if it's a registered type of key
  */
    keypress: (e: KeyboardEvent): void => {
      const keyName = _.get(controls, e.key).toString();

      const addKeypressToQueue = (inputType) => {
        inputQueue.push({ type: inputType, data: keyName}); };

      if (_.includes(keyName, 'Shoot')) {
        addKeypressToQueue(InputType.PlayerShoot);

      } else if (_.includes(keyName, 'Speed')) {
        addKeypressToQueue(InputType.PlayerSpeedChange);

      } else {
        addKeypressToQueue(InputType.PlayerMove);
      }
    }
  };

  render() {
    const renderEntity = (entityCollection, EntityComponent, extraProps: Object) => {
      return _.map(entityCollection, (entity, index) =>
          <EntityComponent key={index} {...extraProps} {...entity} />);
    };
    return (
      <div onKeyDown = { this.events.keypress.bind(this) }>
        <div className="layout-transparent mdl-layout mdl-js-layout">
          <NavHeader />
          <main className="mdl-layout__content">
            <Player
              color={ PlayerColor.Red }
              width={ this.props.spriteSize }
              {...this.state.player}
            />
            { renderEntity(this.state.bullets,          Bullet,       {}) }
            { renderEntity(this.state.enemies.crawlers, EnemyCrawler, { reachedEnd: false }) }
            { renderEntity(this.state.uiBoxes,          BoxUIEntity,  {}) }
            <HUD
              score={ this.state.score }
              time={ this.state.time }
            />
          </main>
        </div>
      </div>
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
        curState.player = resolvePosition(curState.player, inputEvent.data);

      } else if (inputType === InputType[InputType.PlayerSpeedChange]) {
        curState.player.speed = resolveSpeed(curState.player.speed, inputEvent.data);

      } else if (inputType === InputType[InputType.PlayerShoot]) {
        curState.bullets = createBullet(curState.player, curState.bullets);
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
    }
    return newPositions;
  };

  /**
   * Randomly generate NPCs (self-directed UI elements such as enemies) 
   */
  generateNPCs = (curState: AppState, odds: number = 40) => {
    // create NPC at random - approximately once / 40 ticks (every 4s). Don't create more than 10.
    if ((curState.uiBoxes.length <= 10) && (_.random(0, 20) === 20)) {
      switch (_.sample(['uiBox', 'enemy.crawler'])) {
        case('uiBox'):
          curState.uiBoxes = createUIBox(curState);
          break;
        case('enemy.crawler'):
          curState.enemies = createEnemy(curState, curState.enemies, 'crawler');
          break;
      }
    }
    return curState;
  }

  /**
   * Generate random movements from enemies
   * ** ONGOING **
   */
  moveNpcs = (curState: AppState) => {
    curState.enemies.crawlers = _.map(curState.enemies.crawlers, (crawler: EnemyCrawlerProps) => {
      crawler.xLeft -= 1;
      if ((crawler.xLeft - crawler.width) < -300) {
        crawler.xLeft = -300 + crawler.width;
        crawler.reachedEnd = true;
      }
      return crawler;
    });
    return curState;
  };

  /**
   * Handle UI changes that occur without input from the user (e.g. bullet and uiBox movement)
   */
  handleUpdates = (curState: AppState, time: number): AppState => {
    curState.time = time;
    curState.bullets = updateBulletPositions(curState.bullets);
    curState = this.moveNpcs(curState);
    curState = this.generateNPCs(curState);
    curState = bulletToUIEntityCollisions(curState);
    return curState;
  };

  /**
   * The game loop. Coordinates everything. Changes propagate down the tree every time it ticks.
   * On each tick: 1) get input (from inputQueue);
   *               2) Calc new app state (resolve position of items), then update stored app state
   *               3) re-render views
   *               4) Clear inputQueue
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
