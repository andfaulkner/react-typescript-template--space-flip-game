/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

require('./Bullet.css');

interface BulletProps {
  xPos: number;
  yPos: number;
  angle?: number;
  speed?: number;
};
interface BulletState { };

export class Bullet extends React.Component<BulletProps, BulletState> {
  calcOffset = (): {marginTop: string; marginLeft: string} => (
    {
      marginTop: ((-1 * this.props.yPos) - 10) + 'px',
      marginLeft: ((-1 * this.props.xPos) + 10) + 'px'
    });

  render() {
    return (
      <div id='bullet'
        className={'centered'}
        style={ Object.assign({}, this.calcOffset()) }
      />
    );
  }
};
