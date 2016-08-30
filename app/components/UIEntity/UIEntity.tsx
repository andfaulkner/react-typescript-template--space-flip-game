/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import {UIEntityProps, BoxCoordinates} from '../../types/types';

require('./UIEntity.css');

interface UIEntityState { };

const width = 30;

export abstract class UIEntity<S extends UIEntityProps, T> extends React.Component<S, T> {
  calcOffset = (offset: number = 0): {marginTop: string; marginLeft: string} => (
    {
      marginTop: ((-1 * this.props.yTop) - offset) + 'px',
      marginLeft: ((-1 * this.props.xLeft) + offset) + 'px'
    });

  box = () : BoxCoordinates => ({
    xLeft: this.props.xLeft,
    xRight: this.props.xLeft - width,
    yTop: this.props.yTop,
    yBottom: this.props.yTop - width
  })
};
