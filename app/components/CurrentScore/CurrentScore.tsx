/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

require('./CurrentScore.css');

export interface CurrentScoreProps {
  score: number;
};

export interface CurrentScoreState { };

export class CurrentScore extends React.Component<CurrentScoreProps, CurrentScoreState> {
  render() {
    return (
      <div id='currentscore'>
        Score: {this.props.score}
      </div>
    );
  }
};
