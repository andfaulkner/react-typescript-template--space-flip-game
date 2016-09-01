/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Clock } from  '../Clock/Clock.tsx';
import { CurrentScore } from  '../CurrentScore/CurrentScore.tsx';
import { ArenaBorder } from  '../ArenaBorder/ArenaBorder.tsx';

require('./HUD.css');

interface HUDProps {
  time: number;
  score: number;
};
interface HUDState { };

export class HUD extends React.Component<HUDProps, HUDState> {
  render() {
    return (
      <div>
        <div className='top-spacer' />
        <Clock time={this.props.time} />a
        <div className="arena-container">
          <CurrentScore score={this.props.score}/>
          <ArenaBorder />
        </div>
      </div>
    );
  }
};
