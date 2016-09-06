// 
// APP UI
// 

  render() {
    return (
      <KeyController onClick={this.events.onClick}>
        <div className="layout-transparent mdl-layout mdl-js-layout">
          <NavHeader />
          <Arena
            uiState={this.props.uiState}
            spriteSize={this.props.spriteSize}
            color={ PlayerColor.Red }
            time={ this.state.time }
          />
        </div>
      </KeyController>
    );
  };





// 
// ARENA
// 

/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';

import { PlayerColor, UIEntityProps, UIState } from '../../types/types.tsx';
import { BoxUIEntity } from '../BoxUIEntity/BoxUIEntity.tsx';
import { Bullet } from '../Bullet/Bullet.tsx';
import { EnemyCrawler } from '../EnemyCrawler/EnemyCrawler';
import { HUD } from '../HUD/HUD';
import { Player } from '../Player/Player.tsx';

require('./Arena.css'); // tslint:disable-line

export interface ArenaProps {
  uiState: UIState;
  spriteSize: number;
  time: number;
  color: PlayerColor;
};
export interface ArenaState { };

export class Arena extends React.Component<ArenaProps, ArenaState> {
  render() {
    const renderEntity = (entities: UIEntityProps[], EntityComponent, extraProps: Object) =>
        _.map(entities, (entity, index) =>
            <EntityComponent key={index} {...extraProps} {...entity} />);
    return (
      <main className="mdl-layout__content">
        <Player
          color={ PlayerColor.Red }
          width={ this.props.spriteSize }
          {...this.props.uiState.player}
        />
        { renderEntity(this.props.uiState.bullets, Bullet, {}) }
        { renderEntity(this.props.uiState.enemies.crawlers, EnemyCrawler, { reachedEnd: false }) }
        { renderEntity(this.props.uiState.uiBoxes, BoxUIEntity,  {}) }
        <HUD score={ this.props.uiState.score } time={ this.props.time } />
      </main>
    );
  }
};



//
// PLAYER  
// 

/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as React from 'react';

import { UIEntity } from '../UIEntity/UIEntity';

import {
  BoxCoordinates,
  PlayerColor,
} from '../../types/types.tsx';

require('./Player.css'); // tslint:disable-line

export interface PlayerProps {
  angle: number;
  speed: number;
  xLeft: number;
  yTop: number;
  width: number;
  height: number;
  color: PlayerColor;
}

const width = 30;

export class Player extends UIEntity<PlayerProps, { }> {

  /**
   * Convert numeric position to px value for css - determines how much the ship should move
   */
  calcOffset = (): {marginTop: string; marginLeft: string} => (
    {
      marginTop: (-1 * this.props.yTop) + 'px',
      marginLeft: (-1 * this.props.xLeft) + 'px',
    });

  /**
   * Get the active zone
   */
  box = () : BoxCoordinates => ({
    xLeft: this.props.xLeft,
    xRight: this.props.xLeft - width,
    yTop: this.props.yTop,
    yBottom: this.props.yTop - width,
  })

  render() {
    const rotation = `rotate(${this.props.angle - 45}deg)`;
    return (
      <div>
        <div
          className="centered"
          id="player"
          style={ Object.assign({}, this.calcOffset(), {transform: rotation}) }
        />
      </div>
    );
  }
};

// Perhaps add against later, inside div.centered#player: <Cannon />







// 
// UIENTITY
//

/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as React from 'react';

import {BoxCoordinates, UIEntityProps} from '../../types/types';

require('./UIEntity.css'); // tslint:disable-line

interface UIEntityState { };

export abstract class UIEntity<S extends UIEntityProps, T> extends React.Component<S, T> {
  calcOffset = (offset: number = 0): {marginTop: string; marginLeft: string} => (
    {
      marginTop: ((-1 * this.props.yTop) - offset) + 'px',
      marginLeft: ((-1 * this.props.xLeft) + offset) + 'px',
    });

  box = (width: number = 30, height: number = 30) : BoxCoordinates => ({
    xLeft: this.props.xLeft,
    xRight: this.props.xLeft - this.props.width,
    yTop: this.props.yTop,
    yBottom: this.props.yTop - this.props.height,
  })
};






// 
// 
// KEYCONTROLLER
// 
// 

/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';

import { InputEvent, InputType, controls } from '../../types/types.tsx';
import { connect } from 'react-redux';

import { actionCreators } from '../../store/actions.tsx';

let { inputQueuePush } = actionCreators;

require('./KeyController.css'); // tslint:disable-line

export interface KeyControllerProps {
  input: { time: number };
  inputQueue: InputEvent[];
  inputQueuePush: Function;
  onClick: Function;
};

export interface KeyControllerState { };

  // addKeypressToQueue = (inputType, keyName) => {
  //   this.props.({ type: inputType, input: keyName });
  //   this.setState(Object.assign({}, this.state,
  //     {
  //       inputQueue: _.cloneDeep(this.props.inputQueue)
  //                    .concat({ type: inputType, input: keyName })
  //     }));
  // };

export class KeyControllerUnwrapped extends React.Component<KeyControllerProps, KeyControllerState> {
  private events = {
   /**
    * Respond to any key press, but only if it's a registered type of key
    */
    keypress: (e: KeyboardEvent): void => {
      console.log('KeyController.tsx:: key was pressed');
      const keyName = _.get(controls, e.key).toString();

      const addKeypressToQueue = (inputType) => {
        let newInputQueue = _.cloneDeep(this.props.inputQueue);
        newInputQueue.push({ type: inputType, input: keyName });
        this.props.inputQueuePush({ type: inputType, input: keyName });
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
  };

  componentDidMount = () => (document.onkeydown = this.events.keypress);

  render() {
    return (
      <div onKeyDown={ this.events.keypress.bind(this) } onClick={ this.props.onClick.bind(this) }>
        {this.props.children}
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  inputQueue: state.input.inputQueue,
});

const mapDispatchToProps = (dispatch) => ({
  inputQueuePush: (input: InputEvent) => {
    dispatch(inputQueuePush(input));
  },
});

export const KeyController: any = connect(
  mapStateToProps,
  mapDispatchToProps
)(KeyControllerUnwrapped as any);
