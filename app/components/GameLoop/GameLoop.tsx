/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {AppGUI} from '../AppGUI/AppGUI.tsx';
import { EnemyCrawler, EnemyCrawlerProps } from '../EnemyCrawler/EnemyCrawler';

import {resetLastRenderedTime} from '../../store/actions.tsx';

// TYPES
import { PlayerColor, InputType, InputEvent, AppState, controls } from '../../types/types.tsx';

// LOGIC
import { resolvePosition, resolveSpeed } from '../../logic/resolvePlayerMovement.tsx';
import { createUIBox, createEnemy } from '../../logic/npcFactories.tsx';
import { createBullet } from '../../logic/createBullet.tsx';
import { updateBulletPositions } from '../../logic/resolveBulletMovement.tsx';
import { bulletToUIEntityCollisions } from '../../logic/collisionHandler.tsx';

import { connect } from 'react-redux';

require('./GameLoop.css');

interface GameLoopProps {
  resetLastRenderedTime: Function;
  lastRenderedTime: number;
};
interface GameLoopState { };

export class GameLoopUnwrapped extends React.Component<GameLoopProps, GameLoopState> {

  componentWillMount = () => requestAnimationFrame(this.tick);

  render() {
    return (
      <div>
        <AppGUI />
      </div>
    );
  }

  // ** GAME LOOP ** //
  /**
   * The game loop. Coordinates everything. Changes propagate down the tree every time it ticks.
   * On each tick: 1) get input (from inputQueue);
   *               2) Calc new app state (resolve position of items), then update stored app state
   *               3) re-render views
   *               4) Clear inputQueue
   */
  tick = () => {
    let time: number = Date.now();
    if (time - this.props.lastRenderedTime > 100) { // ensure game loop only ticks 10X / s
      this.props.resetLastRenderedTime();
      // console.log('AppGUI.tsx:: tick: this.state', this.state);

      this.handleInput(time, this.state, (newPositions) => {
        newPositions = this.handleUpdates(newPositions, time);
        this.setState(Object.assign({}, this.state, newPositions,
                                    { inputQueue: [], updateReady: true }), () => {
            this.setState(Object.assign({}, this.state, { updateReady: false }));
          });
      });
    }
    requestAnimationFrame(this.tick);
  };

  // ** INPUT HANDLING ** //
  /**
   * calculate new positions of all the things
   */
  handleInputQueue = (curState, inputQueue: InputEvent[]) => {
    // console.logeMove#handleInputQueue: inputQueue', this.state.inputQueue);

    _.each(this.state.inputQueue, (inputEvent: InputEvent) => {
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

  // ** INPUT HANDLING ** //
  /**
   * Handle UI changes that occur as a direct result of user input (e.g. player movement, shooting)
   */
  handleInput = (time: number, newPositions, cb: Function) => {
    if (this.state.inputQueue.length > 0) { // do nothing if there are no input events
      newPositions = this.handleInputQueue(this.state, this.state.inputQueue);
      this.setState(Object.assign({}, this.state, { inputQueue: [] }));
      cb(newPositions);
    } else {
      cb(newPositions);
    }
  };

  // ** GENERATION OF DATA ** //
  /**
   * Randomly generate NPCs (self-directed UI elements such as enemies) 
   */
  generateNPCs = (curState: AppState, odds: number = 20) => {
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

  // ** UPDATE HANDLING ** //
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

  // ** UPDATE HANDLING ** //
  /**
   * Handle UI changes that occur without input from the user (e.g. bullet and uiBox movement)
   */
  handleUpdates = (curState: AppState, time: number): AppState => {
    curState.time = time;
    curState.bullets = updateBulletPositions(curState.bullets);
    curState = this.moveNpcs(this.generateNPCs(bulletToUIEntityCollisions(curState)));
    return curState;
  };
};

const mapStateToProps = (state) => ({
  resetLastRenderedTime: state.resetLastRenderedTime
});

const mapDispatchToProps = (dispatch) => ({
  resetLastRenderedTime: () => dispatch(resetLastRenderedTime();
});

export const GameLoop: any = connect(
  mapStateToProps,
  mapDispatchToProps
)(GameLoopUnwrapped as any);

// in the component: this.prop.cmpProp2HoldDispatchFn('value') will let you dispatch to the store
// in the component: this.prop.propertyOnComponent will let you access a value from the store

