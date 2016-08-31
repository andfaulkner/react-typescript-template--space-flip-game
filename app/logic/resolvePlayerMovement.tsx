/// <reference path="../../typings/index.d.ts" />

import {
  UIEntityProps,
  Direction,
  InputType,
  Coordinates,
  UIEntityVector,
  Dimension,
  InputEvent
} from '../types/types';

import {
  calculateNextTickPosition
} from './calculateNextTickPosition';

//
// DETERMINE ANGLE SPRITE SHOULD BE FACING
//
const rotate = (angle: number, keyName: string) => {
  return Direction[keyName] || angle;
};

/**
 * Ensure player sprite is in bounds on the given dimension
 */
const checkInBounds_1D = (direction: string, position: number, dimension: string = 'x'): number => {
  console.log('resolvePlayerMovement#checkInBounds_1D: direction:', direction, 'dimension:', dimension);

  let hasVertical = _.includes(direction, 'Up') || _.includes(direction, 'Down');
  let hasHorizontal = _.includes(direction, 'Left') || _.includes(direction, 'Right');

  if (hasHorizontal && hasVertical) {
    if (position >= 300) {
      return 300;
    }
    if (position <= -273) {
      return -273;
    }
    return position;
  } else {
    if (position >= 293) {
      return 293;
    }
    if (position <= -265) {
      return -265;
    }
    return position;
  }
};

// /**
//  * Ensure player sprite remains in bounds on all dimensions
//  */
// const keepInBounds = ([{ xLeft, yTop }: {xLeft: number, yTop: number}]): Coordinates => (
//   {
//     xLeft: checkInBounds_1D(xLeft),
//     yTop: checkInBounds_1D(yTop)
//   });

//
// DETERMINE NEW POSITION OF SPRITE, BASED ON DIRECTION GIVEN
//
export const resolvePosition = (uiObject: UIEntityProps, direction: Direction): UIEntityProps => {
  let { xLeft, yTop, speed, angle, width, height } = uiObject;

  let hypoteneuse = (speed / 1.4142);
  let positionObject = {
    speed, angle: (Direction[direction.toString()] || angle), xLeft, yTop, width, height};
  const boundCheck = _.partial(checkInBounds_1D, direction.toString());

  positionObject = calculateNextTickPosition(direction, positionObject);

  return Object.assign({}, positionObject, {
    xLeft: boundCheck(positionObject.xLeft),
    yTop: boundCheck(positionObject.yTop)
  });
};

/**
 * Work out the current player speed. Alter if speed up or slow down event has occurred.
 * @param  {integer} speed - current speed
 * @param  {string} keyPressed - the key that was pressed. 
 * @return {integer} updated speed
 */
export const resolveSpeed = (speed: number, keyPressed: string): number => {
  switch (keyPressed) {
    case "RaiseSpeed":
      return (speed < 10) ? speed + 1 : speed;
    case "LowerSpeed":
      return (speed > 1) ? speed - 1 : speed;
    default:
      return speed;
  }
};
