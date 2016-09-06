/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';

import { PlayerColor, UIEntityProps, UIState } from '../../types/types.tsx';
import { BoxUIEntity } from '../BoxUIEntity/BoxUIEntity.tsx';
import { Bullet } from '../Bullet/Bullet.tsx';
import { EnemyCrawler } from '../EnemyCrawler/EnemyCrawler';
import { HUD } from '../HUD/HUD';
import { Player } from '../Player/Player.tsx';

require('./Arena.css'); // tslint:disable-line

export interface ArenaProps {
  uiState: UIState;
  spriteSize: number;
  time: number;
  color: PlayerColor;
};
export interface ArenaState { };

export class Arena extends React.Component<ArenaProps, ArenaState> {
  render() {
    const renderEntity = (entities: UIEntityProps[], EntityComponent, extraProps: Object) =>
        _.map(entities, (entity, index) =>
            <EntityComponent key={index} {...extraProps} {...entity} />);
    return (
      <main className="mdl-layout__content">
        <Player
          color={ PlayerColor.Red }
          width={ this.props.spriteSize }
          {...this.props.uiState.player}
        />
        { renderEntity(this.props.uiState.bullets, Bullet, {}) }
        { renderEntity(this.props.uiState.enemies.crawlers, EnemyCrawler, { reachedEnd: false }) }
        { renderEntity(this.props.uiState.uiBoxes, BoxUIEntity,  {}) }
        <HUD score={ this.props.uiState.score } time={ this.props.time } />
      </main>
    );
  }
};
