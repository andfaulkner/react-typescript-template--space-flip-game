/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { UIEntity } from '../UIEntity/UIEntity';

import {
  UIEntityProps,
  BoxCoordinates
} from '../../types/types';

require('./EnemyFighter.css');

interface EnemyFighterProps extends UIEntityProps { };
interface EnemyFighterState { };

export class EnemyFighter extends UIEntity<EnemyFighterProps, { }> {
  render() {
    return (
      <div
        className='enemyFighter'
        style={ this.calcOffset() }
      />
    );
  }
};
