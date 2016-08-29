/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import {UIEntityProps} from '../../types/types';

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

require('./Enemy.css');

interface EnemyProps extends UIEntityProps { };
interface EnemyState { };

export class Enemy extends React.Component<EnemyProps, EnemyState> {
  calcOffset = (): {marginTop: string; marginLeft: string} => (
    {
      marginTop: ((-1 * this.props.yPos)) + 'px',
      marginLeft: ((-1 * this.props.xPos)) + 'px'
    });

  render() {
    return (
      <div id="enemy"
        className="diamond"
        style={ Object.assign({}, this.calcOffset()) }
      />
    );
  }
};
