/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

require('./NavHeader.css');
let appProps = require('../../../config/app_properties.json');

export interface NavHeaderProps { };
export interface NavHeaderState { };

export class NavHeader extends React.Component<NavHeaderProps, NavHeaderState> {
  render() {
    return (
      <header className="mdl-layout__header mdl-layout__header--transparent">
        <div className="mdl-layout__header-row">
          <span className="mdl-layout-title">{appProps.name}</span>
          <div className="mdl-layout-spacer"></div>
          <nav className="mdl-navigation">
            <a className="mdl-navigation__link" href="">Game</a>
            <a className="mdl-navigation__link" href="">Leaderboard</a>
            <a className="mdl-navigation__link" href="">Info</a>
            <a className="mdl-navigation__link" href="">Login</a>
          </nav>
        </div>
      </header>
    );
  }
};
