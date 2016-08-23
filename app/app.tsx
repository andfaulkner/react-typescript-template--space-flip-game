/// <reference path="../typings/globals/react/index.d.ts" />
/// <reference path="../typings/globals/react-dom/index.d.ts" />
/// <reference path="../typings/globals/react-bootstrap/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Button } from 'react-bootstrap';

import { TestComponent } from './components/TestComponent';
// import { Header } from './components/Header';
import { Player } from './components/Player/Player';
import { ArenaBorder } from './components/ArenaBorder/ArenaBorder';
import { KeyController } from './components/KeyController/KeyController';

import { PlayerColor } from './enums/enums';

export interface AppProps {
  spriteSize: number;
};

export interface Input {
  time: number;
}

interface AppState {
  input: Input;
};

console.log('js loaded');

/**
 * Entry point for the whole application
 */
class App extends React.Component<AppProps, AppState> {
  state: AppState = {
    input: {
      time: Date.now()
    }
  };

  componentWillMount = () => requestAnimationFrame(this.tick);

  render() {
    return (
      <div>
        <KeyController input={ this.state.input } />
        <Player
          input={ this.state.input }
          color={ PlayerColor.Red }
          width={ this.props.spriteSize }
        />
        <ArenaBorder />
      </div>
    );
  };

  /**
   * The game loop. Coordinates everything. Changes propagate down the tree every time it ticks
   */
  tick = () => {
    console.log('app.tsx:: game loop ticked!');
    let time = Date.now();
    // requestAnimationFrame(this.tick);
    this.setState({ input: { time } });
  };
};

document.addEventListener("DOMContentLoaded", function(event) {
  console.log('DOM loaded - mounting React');
  ReactDOM.render(
    <App spriteSize={ 20 } />,
    document.getElementById('content')
  );
});
