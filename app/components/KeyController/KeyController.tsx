/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';

import { connect } from 'react-redux';
import { controls, InputType, InputEvent } from '../../types/types.tsx';

import { addItemToInputQueue } from '../../store/actions.tsx';

require('./KeyController.css');

export interface KeyControllerProps {
  input: { time: number };
  inputQueue: InputEvent[];
  addItemToInputQueue: Function;
  onClick: Function;
};

export interface KeyControllerState { };

export class KeyControllerUnwrapped extends React.Component<KeyControllerProps, KeyControllerState> {

  componentDidMount = () => (document.onkeydown = this.events.keypress);

  events = {
  /**
  * Respond to any key press, but only if it's a registered type of key
  */
    keypress: (e: KeyboardEvent): void => {
      const keyName = _.get(controls, e.key).toString();

      const addKeypressToQueue = (inputType) => {
        let newInputQueue = _.cloneDeep(this.props.inputQueue);
        // console.log('newInputQueue', newInputQueue);
        newInputQueue.push({ type: inputType, data: keyName });
        this.props.addItemToInputQueue({ type: inputType, data: keyName });
        this.setState(Object.assign({}, this.state, { inputQueue: newInputQueue }));
      };

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
      <div onKeyDown={ this.events.keypress.bind(this) } onClick={ this.props.onClick.bind(this) }>
        {this.props.children}
      </div>
    );
  }
};

const mapStateToProps = (state) => ({
  inputQueue: state.inputQueue
});

const mapDispatchToProps = (dispatch) => ({
  addItemToInputQueue: (input: InputEvent) => {
    dispatch(addItemToInputQueue(input));
  }
});

export const KeyController: any = connect(
  mapStateToProps,
  mapDispatchToProps
)(KeyControllerUnwrapped as any);

// in the component: this.prop.cmpProp2HoldDispatchFn('value') will let you dispatch to the store
// in the component: this.prop.propertyOnComponent will let you access a value from the store
