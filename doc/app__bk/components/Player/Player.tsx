/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';
import {Coordinates, PlayerColor, Dimension, Direction, Input, actions, UIEntityVector} from '../../types/types.tsx';
import {Cannon} from '../Cannon/Cannon';

import { connect } from "react-redux";

import { bindActionCreators } from "redux";
import * as MyActions from "../../redux/actions/changePlayerPosition";

require('./Player.css');

// enum Action { Up, UpRight, Right, DownRight, Down, DownLeft, Left, UpLeft, RaiseSpeed, LowerSpeed }

export interface PlayerState {
  xLeft: number;
  yTop: number;
  angle: number;
  speed: number;
}

export interface PlayerProps {
  width: number;
  color: PlayerColor;
  input: Input;
}

function mapStateToProps(state) {
  return {
    massagedFoo: state.myAction.massagedFoo,
    message: state.myAction.message
  };
}

function mapDispatchToProps(dispatch) {
  return bindActionCreators(MyActions, dispatch);
}

export class Player extends React.Component<PlayerProps, PlayerState> {

  state = {
    xLeft: 0,
    yTop: 0,
    angle: 225,
    speed: 3
  };

  componentDidMount = (): void => {
    document.onkeydown = this.events.keypress;
  }

  /**
   * Ensure player sprite is in bounds on the given dimension
   */
  checkInBounds_1D = (position: number, dimen: Dimension,
                      state: UIEntityVector | PlayerState): number => {
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
  keepInBounds = (xLeft: number, yTop: number): Coordinates => (
    {
      xLeft: this.checkInBounds_1D(xLeft, Dimension.width, this.state),
      yTop: this.checkInBounds_1D(yTop, Dimension.width, this.state)
    });

  /**
   * Reduce or increase player sprite speed (i.e. in response to keypresses)
   */
  adjustSpeed = (action, speed): number => speed + (action === "RaiseSpeed" ? 1 :
                                                    (action === "LowerSpeed" ? -1 : 0));

  /**
   * Respond to keyboard to change player sprite's position
   */
  move = ({ xLeft, yTop, speed }: UIEntityVector, key: string, action: string = ""): void => {
    console.log(`${key} pressed`);
    let yTopNew: number = yTop + (action.match(/Up/g) ? speed :
                                 (action.match(/Down/g) ? -1 * speed : 0));
    let xLeftNew: number = xLeft + (action.match(/Left/g) ? speed :
                                 (action.match(/Right/g) ? -1 * speed : 0));
    console.log('Player.tsx:: move: xLeftNew: ', xLeftNew, '; yTopNew: ', yTopNew);

    this.setState(Object.assign({}, this.state,
                                this.keepInBounds(xLeftNew, yTopNew),
                                {speed: this.adjustSpeed(action, speed),
                                 angle: this.rotate(action)}));
  };

  rotate = (keyName: string) => {
    console.log('Player#rotate: keyName', keyName);
    let currentDirection: Direction = Direction[keyName];
    console.log('Player.jsx: rotate: currentDirection', currentDirection);
    /*downR:0 |down:45 |downL:90 |L:135 |upL:180 |up:225 |upR:270 |R:315*/
    return currentDirection || this.state.angle;
  }

  events = {
    keypress: (e: KeyboardEvent): void => {
      console.log('e:', e);
      let keyName = _.get(actions, e.key);
      if (_.isString(keyName)) {
        this.move(this.state, e.key, keyName);
        this.rotate(keyName);
      }
    }
  };

  calcOffset = (): {marginTop: string; marginLeft: string} => (
    {
      marginTop: (-1 * this.state.yTop) + 'px',
      marginLeft: (-1 * this.state.xLeft) + 'px'
    });

  render() {
    console.log('Player.tsx:: RE-RENDERED!');
    return (
      <div>
        <div className="centered" id="player" style={
          Object.assign({}, this.calcOffset(),
            {transform: `rotate(${this.state.angle}deg)`})
        }>
        </div>
      </div>
    );
  }
};

// Perhaps add against later, inside div.centered#player: <Cannon />
