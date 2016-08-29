/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as $ from 'jquery';

import {
  Coordinates,
  PlayerColor,
  Dimension,
  Direction,
  Input,
  controls,
  PlayerVector
} from '../../types/types.tsx';

import { Cannon } from '../Cannon/Cannon';

import { connect } from "react-redux";

import { bindActionCreators } from "redux";
import * as MyActions from "../../actions/changePlayerPosition";

require('./Player.css');

// enum Action { Up, UpRight, Right, DownRight, Down, DownLeft, Left, UpLeft, RaiseSpeed, LowerSpeed }

export interface PlayerState {
  // xPos: number;
  // yPos: number;
  // angle: number;
  // speed: number;
}

export interface PlayerProps {
  angle: number;
  speed: number;
  xPos: number;
  yPos: number;
  width: number;
  color: PlayerColor;
}


// function testDecorator(target) {
//   // function buildDecoratedTarget(targetToDecorate) {
//   //   return class Decorated {
//   //      constructor() {
//   //        super();
//   //        console.log('built!');
//   //      }
//   //   };
//   // }
//   target.prototype.testValue = "test success!";
//   target.testValue = "test success!";
//   // target.constructor = _.partialRight(target.constructor,
//   //                                   { testValue: '!!! test success !!!!!!!'});
//   target.constructor.testValue = "test success!";
//   console.log('decorated!');
//   console.log(target);
// }


// class TestMixin {
//   testMethodOnTestMixin() {
//     console.log('TestMixin#testMethodOnTestMixin entered!');
//   }
// }
// console.log('this.testMethodOnTestMixin', this.testMethodOnTestMixin());

const testDecorator = (target: Function) => {
  const testMethod = () => 'successfully mixed testMethod into component';
  target.prototype.testMethod = testMethod;
};

interface TestDecorated {
  testMethod: () => any;
}

@testDecorator
export class Player extends React.Component<PlayerProps, PlayerState> implements TestDecorated {

  testMethod;

  constructor() {
    super();
    console.log(this);
  };

  /**
  * Determine how much the ship should move
  */
  calcOffset = (): {marginTop: string; marginLeft: string} => (
    {
      marginTop: (-1 * this.props.yPos) + 'px',
      marginLeft: (-1 * this.props.xPos) + 'px'
    });

  render() {
    console.log('Player.tsx:: re-rendered. this: ', this);
    console.log('this.testMethod', this.testMethod());
    return (
      <div>
        <div className="centered" id="player" style={
          Object.assign({},
            this.calcOffset(),
            {transform: `rotate(${this.props.angle}deg)`})
        }>
        </div>
      </div>
    );
  }
};

// Perhaps add against later, inside div.centered#player: <Cannon />
