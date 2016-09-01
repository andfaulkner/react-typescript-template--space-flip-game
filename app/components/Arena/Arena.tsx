/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

require('./Arena.css');

interface ArenaProps { };
interface ArenaState { };

export class Arena extends React.Component<ArenaProps, ArenaState> {
  render() {
    return (
      <div>Arena</div>
    );
  }
};
