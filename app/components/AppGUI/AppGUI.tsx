/// <reference path="../../../typings/index.d.ts" />

import * as _ from 'lodash';
import * as React from 'react';

// CUSTOM UI ELEMENTS
import { Arena } from '../Arena/Arena.tsx';
import { KeyControllerContainer } from '../KeyController/KeyControllerContainer.tsx';
import { NavHeader } from '../NavHeader/NavHeader.tsx';

// TYPES
import { InputEvent, InputType, PlayerColor, UIState } from '../../types/types.tsx';

// LOGIC
import { createBullet } from '../../logic/createBullet.tsx';
import { resolvePosition, resolveSpeed } from '../../logic/resolvePlayerMovement.tsx';

require('./AppGUI.css'); // tslint:disable-line

interface GameArenaState {
  time: number;
  lastRenderedTime: number;
  updateReady: boolean;
}

const defaultState: GameArenaState = {
  time: Date.now(),
  lastRenderedTime: 0,
  updateReady: false,
};

interface GameArenaProps {
  spriteSize: number;

  addItemToInputQueue: Function;
  clearInputQueue: Function;
  testSwitchState: Function;
  resetLastRenderedTime: Function;
  setUIUpdateReady: Function;
  resolveUIState: Function;

  testStateProperty: boolean;
  lastRenderedTime: number;
  inputQueue: InputEvent[];
  uiState: UIState; // TODO more specific
};

/**
 * Entry point for the app's GUI (excepting the redux wrapper in root.jsx...for now.)
 */
export class AppGUI extends React.Component<GameArenaProps, GameArenaState> {
  events = {
    onClick: (e): void => {
      console.log('AppGUI.tsx:: clicked the component!');
      this.props.testSwitchState(!this.props.testStateProperty);
    },
  };

  state: GameArenaState = defaultState;

  componentWillMount = () => requestAnimationFrame(this.tick); // kickstart the game loop

  // TODO this is fucked up, look at the equality comparison, it makes no sense
  // AHA THIS IS THE KEY! THIS IS HOW YOU CAN MAKE THIS WORK WITH AN OUTER GAME LOOP! TODO: SPLIT THIS COMPONENT.
  shouldComponentUpdate = (nextProps, nextState) =>
    !_.isEqual(this.props.uiState.player, nextProps.uiState);

  render() {
    return (
      <KeyControllerContainer onClick={this.events.onClick}>
        <div className="layout-transparent mdl-layout mdl-js-layout">
          <NavHeader />
          <Arena
            uiState={this.props.uiState}
            spriteSize={this.props.spriteSize}
            color={ PlayerColor.Red }
            time={ this.state.time }
          />
        </div>
      </KeyControllerContainer>
    );
  };

  /**
   * Determine when the game loop logic should run - ensures it only runs on set intervals.
   */
  tick = (): void => {
    let time = Date.now();
    if (time - this.state.lastRenderedTime > 50) { // ensure game loop only ticks 20X / s
      this.setState(Object.assign({}, this.state, { lastRenderedTime: Date.now() }), () => {
        this.executeGameLoopActions(time);
      });
    }
    requestAnimationFrame(this.tick);
  };

  /**
   * The game loop actions, run after a certain amount of time elapsed. 
   * Coordinates everything, changes propagate down the UI tree. On each run:
   *     1) get input (from inputQueue);
   *     2) Calc new app state (resolve position of items), then update stored app state
   *     3) re-render views & Clear inputQueue
   */
  executeGameLoopActions = (time: number): void => {
    this.handleInput(time, this.props.uiState, (newPositions) => {
      this.props.resolveUIState(time, newPositions);
      this.props.clearInputQueue();
      this.props.setUIUpdateReady();
    });
  };

  /**
   * calculate new positions of all the things
   */
  handleInputQueue = (curUI: UIState, inputQueue: InputEvent[]) => {
    _.each(this.props.inputQueue, (inputEvent: InputEvent) => {
      const inputType = InputType[inputEvent.type];

      if (inputType === InputType[InputType.PlayerMove]) {
        curUI.player = resolvePosition(curUI.player, inputEvent.input);

      } else if (inputType === InputType[InputType.PlayerSpeedChange]) {
        curUI.player.speed = resolveSpeed(curUI.player.speed, inputEvent.input);

      } else if (inputType === InputType[InputType.PlayerShoot]) {
        curUI.bullets = createBullet(curUI.player, curUI.bullets);
      }
    });
    return curUI;
  };

  /**
   * Handle UI changes that occur as a direct result of user input (e.g. player movement, shooting)
   */
  handleInput = (time: number, curUI: UIState, cb: Function) => {
    if (this.props.inputQueue.length > 0) { // do nothing if there are no input events
      curUI = this.handleInputQueue(this.props.uiState, this.props.inputQueue);
      this.props.clearInputQueue();
    }
    cb(curUI);
  };
};
