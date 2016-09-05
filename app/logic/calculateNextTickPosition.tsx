/// <reference path="../../typings/index.d.ts" />

export const calculateNextTickPosition = (direction, positionObject) => {
  // console.log('resolvePlayerMovement.tsx:: in positionCalc!');
  let { xLeft, yTop, speed } = positionObject;
  let hypoteneuse = speed / 1.4142;

  switch (direction.toString()) {
    case "Up":
      positionObject.yTop = yTop + speed;
      return positionObject;
    case "UpRight":
      positionObject.xLeft = xLeft - hypoteneuse;
      positionObject.yTop = yTop + hypoteneuse;
      return positionObject;
    case "Right":
      positionObject.xLeft = xLeft - speed;
      return positionObject;
    case "DownRight":
      positionObject.xLeft = xLeft - hypoteneuse;
      positionObject.yTop = yTop - hypoteneuse;
      return positionObject;
    case "Down":
      positionObject.yTop = yTop - speed;
      return positionObject;
    case "DownLeft":
      positionObject.xLeft = xLeft + hypoteneuse;
      positionObject.yTop = yTop - hypoteneuse;
      return positionObject;
    case "Left":
      positionObject.xLeft = xLeft + hypoteneuse;
      return positionObject;
    case "UpLeft":
      positionObject.xLeft = xLeft + hypoteneuse;
      positionObject.yTop = yTop + hypoteneuse;
      return positionObject;
    default:
      // console.log('ERROR: resolveMovement#resolvePosition: other value');
      return positionObject;
  }
};
