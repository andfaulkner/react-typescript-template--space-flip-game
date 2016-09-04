/// <reference path="../../../typings/globals/jquery/index.d.ts" />
/// <reference path="../../../typings/globals/react/index.d.ts" />
/// <reference path="../../../typings/globals/react-dom/index.d.ts" />
/// <reference path="../../../typings/globals/lodash/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';

require('./Cannon.css');

export interface CannonProps { };

export interface CannonState {
  ammo: number;
  level: number;
};

export class Cannon extends React.Component<CannonProps, CannonState> {

  events = {
    spacePressed: (e) => {
      console.log('Cannon.tsx: e:', e);
    }
  };

  render() {
    return (
      <div id={"weapon"}>
        <div id={"cannon"} />
      </div>
    );
  }
};

// under a div
// <div className={"random-tinkering"} />
// <div className={"random-tinkering-triangle"} />
// <div className={"hollow-triangle"} />
