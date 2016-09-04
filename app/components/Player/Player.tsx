/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';

import { UIEntity } from '../UIEntity/UIEntity';

import {
  Coordinates,
  PlayerColor,
  Dimension,
  Direction,
  Input,
  controls,
  UIEntityVector,
  BoxCoordinates
} from '../../types/types.tsx';

import { Cannon } from '../Cannon/Cannon';

import { connect } from "react-redux";

import { bindActionCreators } from "redux";

require('./Player.css');

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
      marginLeft: (-1 * this.props.xLeft) + 'px'
    });

  /**
   * Get the active zone
   */
  box = () : BoxCoordinates => ({
    xLeft: this.props.xLeft,
    xRight: this.props.xLeft - width,
    yTop: this.props.yTop,
    yBottom: this.props.yTop - width
  })

  render() {
    return (
      <div>
        <div className="centered" id="player" style={
          Object.assign({},
            this.calcOffset(),
            {transform: `rotate(${this.props.angle - 45}deg)`})
        }>
        </div>
      </div>
    );
  }
};

// Perhaps add against later, inside div.centered#player: <Cannon />
