/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Button } from 'react-bootstrap';

import { Player } from './components/Player/Player.tsx';
import { ArenaBorder } from './components/ArenaBorder/ArenaBorder';
import { KeyController } from './components/KeyController/KeyController';

import { PlayerColor, Input } from './types/types.tsx';

import { Provider } from 'react-redux';
import { store } from './redux/store.tsx'; // only import from here

console.log('js loaded');

// INTERFACES
export interface AppProps {
  spriteSize: number;
};

export interface AppState {
  input: Input;
};

/**
 * Wrap App with Redux store.
 */
class Root extends React.Component<{}, {}> {
  render() {
    return (
      <Provider store={store}>
        <App spriteSize={20} />
      </Provider>
    );
  }
};

/**
 * Entry point for the whole application (excepting the redux wrapper)
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
      <Provider store={store}>
        <div>
          <KeyController input={ this.state.input } />
          <Player
            input={ this.state.input }
            color={ PlayerColor.Red }
            width={ this.props.spriteSize }
          />
          <ArenaBorder />
        </div>
      </Provider>
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
    <Root />,
    document.getElementById('content')
  );
});
