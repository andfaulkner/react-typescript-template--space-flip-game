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

require('./Enemy.css');

interface EnemyProps extends UIEntityProps { };
interface EnemyState { };

const width = 25;

export class Enemy extends UIEntity<EnemyProps, { }> {
  render() {
    return (
      <div id="enemy"
        className="diamond"
        style={ this.calcOffset() }
      />
    );
  }
};
