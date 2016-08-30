/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {
  UIEntityProps,
  BoxCoordinates
} from '../../types/types';

import { UIEntity } from '../UIEntity/UIEntity';

require('./Bullet.css');

interface BulletProps {
  xLeft: number;
  yTop: number;
  angle: number;
  speed: number;
};
interface BulletState { };

export class Bullet extends UIEntity<BulletProps, { }> {
  render() {
    return (
      <div id='bullet'
        className={'centered'}
        style={ Object.assign({}, this.calcOffset()) }
      />
    );
  }
};
