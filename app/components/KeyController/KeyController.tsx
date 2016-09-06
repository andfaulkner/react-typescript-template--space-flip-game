/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';

import { InputEvent, InputType, controls } from '../../types/types.tsx';

require('./KeyController.css'); // tslint:disable-line

export interface KeyControllerProps {
  input: { time: number };
  inputQueue: InputEvent[];
  addItemToInputQueue: Function;
  onClick: Function;
};

export interface KeyControllerState { };

export class KeyController extends React.Component<KeyControllerProps, KeyControllerState> {

  events = {
   /**
    * Respond to any key press, but only if it's a registered type of key
    */
    keypress: (e: KeyboardEvent): void => {
      console.log('KeyController.tsx:: key was pressed');
      const keyName = _.get(controls, e.key).toString();

      if (_.includes(keyName, 'Shoot')) {
        this.addKeypressToQueue(keyName, InputType.PlayerShoot);

      } else if (_.includes(keyName, 'Speed')) {
        this.addKeypressToQueue(keyName, InputType.PlayerSpeedChange);

      } else {
        this.addKeypressToQueue(keyName, InputType.PlayerMove);
      }
    },
  };

  componentDidMount = () => (document.onkeydown = this.events.keypress);

  render() {
    return (
      <div
        onKeyDown={ this.events.keypress.bind(this) }
        onClick={ this.props.onClick.bind(this) }
      >
        {this.props.children}
      </div>
    );
  }

  private addKeypressToQueue = (keyName, inputType) => {
    let newInput = {
      type: inputType,
      input: keyName,
    };
    this.props.addItemToInputQueue(newInput);
    this.setState(Object.assign({}, this.state, {
        inputQueue: _.cloneDeep(this.props.inputQueue).concat(newInput),
    }));
  };
};
