/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';

import {
  Coordinates,
  PlayerColor,
  Dimension,
  Direction,
  Input,
  controls,
  PlayerVector
} from '../../types/types.tsx';

import { Cannon } from '../Cannon/Cannon';

import { connect } from "react-redux";

import { bindActionCreators } from "redux";
import * as MyActions from "../../actions/changePlayerPosition";

require('./Player.css');

// enum Action { Up, UpRight, Right, DownRight, Down, DownLeft, Left, UpLeft, RaiseSpeed, LowerSpeed }

export interface PlayerState {
  // xPos: number;
  // yPos: number;
  // angle: number;
  // speed: number;
}

export interface PlayerProps {
  angle: number;
  speed: number;
  xPos: number;
  yPos: number;
  width: number;
  color: PlayerColor;
}

export class Player extends React.Component<PlayerProps, PlayerState> {

  state = {
    xPos: 0,
    yPos: 0,
    angle: 225,
    speed: 3
  };

  // componentDidMount = (): void => {
  //   document.onkeydown = this.events.keypress;
  // }

  /**
   * Ensure player sprite is in bounds on the given dimension
   */
  checkInBounds_1D = (position: number, dimen: Dimension,
                      state: PlayerVector | PlayerState): number => {
    if (position >= 300) {
      return 300;
    }
    if (position - this.props[Dimension[dimen].toString()] <= -300) {
      return -300 + this.props[Dimension[dimen].toString()];
    }
    return position;
  }

  /**
   * Ensure player sprite remains in bounds on all dimensions
   */
  keepInBounds = (xPos: number, yPos: number): Coordinates => (
    {
      xPos: this.checkInBounds_1D(xPos, Dimension.width, this.props),
      yPos: this.checkInBounds_1D(yPos, Dimension.width, this.props)
    });

  /**
   * Reduce or increase player sprite speed (i.e. in response to keypresses)
   */
  adjustSpeed = (action, speed): number => speed + (action === "RaiseSpeed" ? 1 :
                                                    (action === "LowerSpeed" ? -1 : 0));

  /**
   * Respond to keyboard to change player sprite's position
   */
  move = ({ xPos, yPos, speed }: PlayerVector, key: string, action: string = ""): void => {
    console.log(`${key} pressed`);
    let yPosNew: number = yPos + (action.match(/Up/g) ? speed :
                                 (action.match(/Down/g) ? -1 * speed : 0));
    let xPosNew: number = xPos + (action.match(/Left/g) ? speed :
                                 (action.match(/Right/g) ? -1 * speed : 0));
    console.log('Player.tsx:: move: xPosNew: ', xPosNew, '; yPosNew: ', yPosNew);

    this.setState(Object.assign({}, this.props,
                                this.keepInBounds(xPosNew, yPosNew),
                                {speed: this.adjustSpeed(action, speed),
                                 angle: this.rotate(action)}));
  };

  rotate = (keyName: string) => {
    console.log('Player#rotate: keyName', keyName);
    let currentDirection: Direction = Direction[keyName];
    console.log('Player.jsx: rotate: currentDirection', currentDirection);
    /*downR:0 |down:45 |downL:90 |L:135 |upL:180 |up:225 |upR:270 |R:315*/
    return currentDirection || this.props.angle;
  }

  /**
  * Determine how much the ship should move
  */
  calcOffset = (): {marginTop: string; marginLeft: string} => (
    {
      marginTop: (-1 * this.props.yPos) + 'px',
      marginLeft: (-1 * this.props.xPos) + 'px'
    });

  render() {
    console.log('Player.tsx:: RE-RENDERED!');
    return (
      <div>
        <div className="centered" id="player" style={
          Object.assign({},
            this.calcOffset(),
            {transform: `rotate(${this.props.angle}deg)`})
        }>
        </div>
      </div>
    );
  }
};

// Perhaps add against later, inside div.centered#player: <Cannon />
