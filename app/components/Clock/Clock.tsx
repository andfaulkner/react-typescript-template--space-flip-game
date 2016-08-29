/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';

require('./Clock.css');

interface ClockProps {
  time: number;
};

interface ClockState { };

export class Clock extends React.Component<ClockProps, ClockState> {

  events = {
    time: (clock) => {
      console.log('clock:', clock);
    }
  };

  render() {
    return (
      <div className={'clock--text'}>
        { this.props.time }
      </div>
    );
  }
};