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
