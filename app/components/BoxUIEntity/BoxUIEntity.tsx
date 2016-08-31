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

require('./BoxUIEntity.css');

interface BoxUIEntityProps extends UIEntityProps { };
interface BoxUIEntityState { };

export class BoxUIEntity extends UIEntity<BoxUIEntityProps, { }> {
  render() {
    return (
      <div id="box-ui-entity"
        className="diamond"
        style={ this.calcOffset() }
      />
    );
  }
};

