/// <reference path="../../typings/index.d.ts" />

declare let global: any;

require('babel-register')();

console.log('in!');

import * as React from 'react';

import { mount, shallow } from 'enzyme';
import { expect } from 'chai';

import { Input } from '../../app/app';
import { Player, PlayerVector, PlayerState, PlayerProps } from '../../app/components/Player/Player';
import { PlayerColor, Dimension } from '../../app/enums/enums';

describe('<Player />', () => {

  const playerMock: {props: PlayerProps, state: PlayerState} = {
    props: {
      // Output of a Date.now() call. Hardcoded for purity. TODO impure version,
      input: { time: 1471946745043},
      width: 20,
      color: PlayerColor.Red
    },
    state: {
      xPos: 0,
      yPos: 0,
      angle: 225,
      speed: 3
    }
  };

  let playerClass = new Player();
  console.log('\nplayerClass: below');
  console.log(playerClass);
  console.log('END playerClass\n');

  const playerComponent = mount(<Player {...playerMock.props} />);
  playerComponent.setProps(playerMock.props);

  // beforeEach(function() {
  //   player = new Player();
  // });

  describe('#checkInBounds_1D', () => {
    it('should return 300 if passed a position greater than or equal to 300', () => {
      let mockState: PlayerVector = {xPos: 400, yPos: 400, speed: 5};
      // let result: number = playerComponent.checkInBounds_1D(400, Dimension.width, playerMock.state);
    });
  });
});




