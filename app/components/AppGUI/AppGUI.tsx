/// <reference path="../../../typings/index.d.ts" />

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

// CUSTOM UI ELEMENTS
import { Player, PlayerProps } from '../Player/Player.tsx';
import { Bullet } from '../Bullet/Bullet.tsx';
import { KeyController } from '../KeyController/KeyController';
import { BoxUIEntity } from '../BoxUIEntity/BoxUIEntity.tsx';
import { EnemyCrawler, EnemyCrawlerProps } from '../EnemyCrawler/EnemyCrawler';
import { HUD } from '../HUD/HUD';
import { NavHeader } from '../NavHeader/NavHeader.tsx';

// TYPES
import { PlayerColor, InputType, InputEvent, AppState, controls } from '../../types/types.tsx';

// LOGIC
import { resolvePosition, resolveSpeed } from '../../logic/resolvePlayerMovement.tsx';
import { createUIBox, createEnemy } from '../../logic/npcFactories.tsx';
import { createBullet } from '../../logic/createBullet.tsx';
import { updateBulletPositions } from '../../logic/resolveBulletMovement.tsx';
import { bulletToUIEntityCollisions } from '../../logic/collisionHandler.tsx';

// REDUX
import { connect } from 'react-redux';
import { addItemToInputQueue, clearInputQueue, testSwitchState_AC,
         resetLastRenderedTime } from '../../store/actions.tsx';

require('./AppGUI.css');

let lastRender = Date.now();

// INTERFACES
const uiBoxWidth = 25;
const crawlerWidth = 28;
const bulletWidth = 7;

const defaultState: AppState = {
  time: Date.now(),
  inputQueue: [],
  lastRenderedTime: 0,
  updateReady: false,
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

interface AppProps {
  spriteSize: number;
  addItemToInputQueue: Function;
  clearInputQueue: Function;
  testSwitchState: Function;
  resetLastRenderedTime: Function;
  testStateProperty: boolean;
  lastRenderedTime: number;
};

/**
 * Entry point for the whole application (excepting the redux wrapper)
 */
class AppGUIUnwrapped extends React.Component<AppProps, AppState> {
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
        let newInputQueue = _.cloneDeep(this.state.inputQueue);
        // console.log('newInputQueue', newInputQueue);
        newInputQueue.push({ type: inputType, data: keyName });
        this.setState(Object.assign({}, this.state, { inputQueue: newInputQueue }));
      };

      if (_.includes(keyName, 'Shoot')) {
        addKeypressToQueue(InputType.PlayerShoot);

      } else if (_.includes(keyName, 'Speed')) {
        addKeypressToQueue(InputType.PlayerSpeedChange);

      } else {
        addKeypressToQueue(InputType.PlayerMove);
      }
    },

    onClick: (e): void => {
      console.log('AppGUI.tsx:: e', e);
      console.log('AppGUI.tsx:: this', this);
      console.log('AppGUI.tsx:: testStateProperty: ', this.props.testStateProperty);
      this.props.testSwitchState(!this.props.testStateProperty);
    }
  };

  shouldComponentUpdate = (nextProps, nextState) => {
    // AHA THIS IS THE KEY! THIS IS HOW YOU CAN MAKE THIS WORK WITH A GAME LOOP!
    // TODO: SPLIT THIS COMPONENT.
    // console.log('AppGUI.tsx:: nextState', nextState);
    if (!_.isEqual(this.state, nextState)) {
      return true;
    }
    return false;
  };

  render() {
    const renderEntity = (entityCollection, EntityComponent, extraProps: Object) =>
        _.map(entityCollection, (entity, index) =>
            <EntityComponent key={index} {...extraProps} {...entity} />);
    return (
      <div onKeyDown={ this.events.keypress.bind(this) } onClick={ this.events.onClick.bind(this) }>
        <div className="layout-transparent mdl-layout mdl-js-layout">
          <NavHeader />
          <main className="mdl-layout__content">
            <Player color={ PlayerColor.Red } width={ this.props.spriteSize } {...this.state.player}/>
            { renderEntity(this.state.bullets,          Bullet,       {}) }
            { renderEntity(this.state.enemies.crawlers, EnemyCrawler, { reachedEnd: false }) }
            { renderEntity(this.state.uiBoxes,          BoxUIEntity,  {}) }
            <HUD score={ this.state.score } time={ this.state.time } />
          </main>
        </div>
      </div>
    );
  };

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


//
// ************************ REDUX ************************* //
//

const mapStateToProps = (state) => ({
  inputQueue: state.inputQueue,
  lastRenderedTime: state.lastRenderedTime,
  testStateProperty: state.testStateProperty
});

const mapDispatchToProps = (dispatch) => ({
  addItemToInputQueue: (input: InputEvent): void => { dispatch(addItemToInputQueue(input)); },
  clearInputQueue: (): void => { dispatch(clearInputQueue()); },
  resetLastRenderedTime: (): void => { dispatch(resetLastRenderedTime()); },
  testSwitchState: (newState: boolean): void => { dispatch(testSwitchState_AC(newState)); },
});

export const AppGUI: any = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppGUIUnwrapped as any);
