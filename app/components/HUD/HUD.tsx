/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Clock } from  '../Clock/Clock.tsx';
import { CurrentScore } from  '../CurrentScore/CurrentScore.tsx';
import { ArenaBorder } from  '../ArenaBorder/ArenaBorder.tsx';

require('./HUD.css');

export interface HUDProps {
  time: number;
  score: number;
};

export interface HUDState { };

const ArenaContainer = ({score}) => (
  <div className="arena-container">
    <CurrentScore score={score}/>
    <ArenaBorder />
  </div>
);

export class HUD extends React.Component<HUDProps, HUDState> {
  render() {
    return (
      <div>
        <div className='top-spacer' />
        <Clock time={this.props.time} />a
        <ArenaContainer score={this.props.score} />
      </div>
    );
  }
};
