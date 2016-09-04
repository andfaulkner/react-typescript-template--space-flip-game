/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import {AppGUI} from '../AppGUI/AppGUI.tsx';
import {keypress} from '../../actions/action_creators.tsx';

import {connect} from 'react-redux';

require('./Game.css');

interface GameProps { };
interface GameState { };

class GameUnbound extends React.Component<GameProps, GameState> {

  events = {
    /**
    * Respond to any key press, but only if it's a registered type of key
    */
    keypress: (e: KeyboardEvent): void => {
      const keyName = _.get(controls, e.key).toString();

      const addKeypressToQueue = (inputType) => {
        inputQueue.push({ type: inputType, data: keyName}); };

      if (_.includes(keyName, 'Shoot')) {
        addKeypressToQueue(InputType.PlayerShoot);

      } else if (_.includes(keyName, 'Speed')) {
        addKeypressToQueue(InputType.PlayerSpeedChange);

      } else {
        addKeypressToQueue(InputType.PlayerMove);
      }
    }
  };

  render() {
    return (
      <div>
        <AppGUI keyFunction={this.events.keypress.bind(this)}/>
      </div>
    );
  }
};

export const Game = connect(
  null,
  (dispatch) => ({
    keypress: (inputName, keyName) => {
      dispatch(keypress(inputName, keyName));
    }
  })
)(GameUnbound);
