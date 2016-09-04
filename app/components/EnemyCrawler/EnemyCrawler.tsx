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

require('./EnemyCrawler.css');

interface EnemyCrawlerState { };

export interface EnemyCrawlerProps extends UIEntityProps {
  reachedEnd: boolean;
};

export class EnemyCrawler extends UIEntity<EnemyCrawlerProps, { }> {
  render() {
    return (
      <div
        className='enemyCrawler'
        style={ this.calcOffset() }
      />
    );
  }
};
