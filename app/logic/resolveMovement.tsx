import {
  PlayerUIData,
  Direction,
  InputType,
  Coordinates,
  PlayerVector,
  Dimension,
  InputEvent
} from '../types/types';

import {
  PlayerState
} from '../components/Player/Player.tsx';

//
// DETERMINE ANGLE SPRITE SHOULD BE FACING
//
const rotate = (angle: number, keyName: string) => {
  console.log('resolveMovement#rotate: keyName', keyName);
  let curDirection: Direction = Direction[keyName];
  console.log('resolveMovement#rotate: curDirection', curDirection);
  /*downR:0 |down:45 |downL:90 |L:135 |upL:180 |up:225 |upR:270 |R:315*/
  return curDirection || angle;
};

/**
 * Ensure player sprite is in bounds on the given dimension
 */
const checkInBounds_1D = (direction: string, position: number, dimension: string = 'x'): number => {
  let hasVertical = _.includes(direction, 'Up') || _.includes(direction, 'Down');
  let hasHorizontal = _.includes(direction, 'Left') || _.includes(direction, 'Right');
  console.log('direction:', direction);
  console.log('dimension:', dimension);
  console.log('hasVertical?', hasVertical, '; hasHorizontal? ', hasHorizontal);
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
// const keepInBounds = ([{ xPos, yPos }: {xPos: number, yPos: number}]): Coordinates => (
//   {
//     xPos: checkInBounds_1D(xPos),
//     yPos: checkInBounds_1D(yPos)
//   });

//
// DETERMINE NEW POSITION OF SPRITE, BASED ON DIRECTION GIVEN
//
export const resolvePosition = ({ xPos, yPos, speed, angle }: PlayerUIData, direction: Direction): PlayerUIData => {
  console.log('resolveMovement#resolvePosition: direction', direction);

  let hypoteneuse = (speed / 1.4142);
  let positionObject = { speed, angle: rotate(angle, direction.toString()) };
  const boundCheck = _.partial(checkInBounds_1D, direction.toString());

  switch (direction.toString()) {
    case "Up":
      return Object.assign(positionObject, {
        xPos: boundCheck(xPos),
        yPos: boundCheck(yPos + speed)
      });
    case "UpLeft":
      return Object.assign(positionObject, {
        xPos: boundCheck(xPos + (speed / 1.4142)),
        yPos: boundCheck(yPos + (speed / 1.4142)),
      });
    case "Left":
      return Object.assign(positionObject, {
        xPos: boundCheck(xPos + speed),
        yPos: boundCheck(yPos)
      });
    case "DownLeft":
      return Object.assign(positionObject, {
        xPos: boundCheck(xPos + hypoteneuse),
        yPos: boundCheck(yPos - hypoteneuse),
        angle: rotate(angle, "DownLeft"),
        speed
      });
    case "Down":
      return Object.assign(positionObject, {
        xPos: boundCheck(xPos),
        yPos: boundCheck(yPos - speed),
      });
    case "DownRight":
      return Object.assign(positionObject, {
        xPos: boundCheck(xPos - hypoteneuse),
        yPos: boundCheck(yPos - hypoteneuse),
      });
    case "Right":
      return Object.assign(positionObject, {
        xPos: boundCheck(xPos - speed),
        yPos: boundCheck(yPos)
      });
    case "UpRight":
      return Object.assign(positionObject, {
        xPos: boundCheck(xPos - (speed / 1.4142)),
        yPos: boundCheck(yPos + (speed / 1.4142))
      });
    default:
      console.log('ERROR: resolveMovement#resolvePosition: other value');
      return Object.assign(positionObject, { xPos, yPos });
  }
};

/**
 * Work out the current player speed. Alter if speed up or slow down event has occurred.
 * @param  {integer} speed - current speed
 * @param  {string} keyPressed - the key that was pressed. 
 * @return {integer} updated speed
 */
export const resolveSpeed = (speed: number, keyPressed: string): number => {
  console.log('resolveMovement#resolveSpeed: keyPressed: ', keyPressed);

  switch (keyPressed) {
    case "RaiseSpeed":
      return (speed < 10) ? speed + 1 : speed;
    case "LowerSpeed":
      return (speed > 1) ? speed - 1 : speed;
    default:
      return speed;
  }
};
