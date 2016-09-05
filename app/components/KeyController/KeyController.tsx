/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';

import { InputEvent, InputType, controls } from '../../types/types.tsx';
import { connect } from 'react-redux';

import { actionCreators } from '../../store/actions.tsx';

let { addItemToInputQueue } = actionCreators;

require('./KeyController.css'); // tslint:disable-line

export interface KeyControllerProps {
  input: { time: number };
  inputQueue: InputEvent[];
  addItemToInputQueue: Function;
  onClick: Function;
};

export interface KeyControllerState { };

export class KeyControllerUnwrapped extends React.Component<KeyControllerProps, KeyControllerState> {
  private events = {
   /**
    * Respond to any key press, but only if it's a registered type of key
    */
    keypress: (e: KeyboardEvent): void => {
      console.log('KeyController.tsx:: key was pressed');
      const keyName = _.get(controls, e.key).toString();

      const addKeypressToQueue = (inputType) => {
        let newInputQueue = _.cloneDeep(this.props.inputQueue);
        newInputQueue.push({ type: inputType, input: keyName });
        this.props.addItemToInputQueue({ type: inputType, input: keyName });
        this.setState(Object.assign({}, this.state, { inputQueue: newInputQueue }));
      };

      if (_.includes(keyName, 'Shoot')) {
        addKeypressToQueue(InputType.PlayerShoot);

      } else if (_.includes(keyName, 'Speed')) {
        addKeypressToQueue(InputType.PlayerSpeedChange);

      } else {
        addKeypressToQueue(InputType.PlayerMove);
      }
    },
  };

  componentDidMount = () => (document.onkeydown = this.events.keypress);

  render() {
    return (
      <div onKeyDown={ this.events.keypress.bind(this) } onClick={ this.props.onClick.bind(this) }>
        {this.props.children}
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  inputQueue: state.inputQueue,
});

const mapDispatchToProps = (dispatch) => ({
  addItemToInputQueue: (input: InputEvent) => {
    dispatch(addItemToInputQueue(input));
  },
});

export const KeyController: any = connect(
  mapStateToProps,
  mapDispatchToProps
)(KeyControllerUnwrapped as any);
