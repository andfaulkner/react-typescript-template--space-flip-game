/// <reference path="../../typings/index.d.ts" />

export const calculateNextTickPosition = (direction, positionObject) => {
  console.log('resolvePlayerMovement.tsx:: in positionCalc!');
  let { xPos, yPos, speed } = positionObject;
  let hypoteneuse = speed / 1.4142;

  switch (direction.toString()) {
    case "Up":
      positionObject.yPos = yPos + speed;
      return positionObject;
    case "UpRight":
      positionObject.xPos = xPos - hypoteneuse;
      positionObject.yPos = yPos + hypoteneuse;
      return positionObject;
    case "Right":
      positionObject.xPos = xPos - speed;
      return positionObject;
    case "DownRight":
      positionObject.xPos = xPos - hypoteneuse;
      positionObject.yPos = yPos - hypoteneuse;
      return positionObject;
    case "Down":
      positionObject.yPos = yPos - speed;
      return positionObject;
    case "DownLeft":
      positionObject.xPos = xPos + hypoteneuse;
      positionObject.yPos = yPos - hypoteneuse;
      return positionObject;
    case "Left":
      positionObject.xPos = xPos + hypoteneuse;
      return positionObject;
    case "UpLeft":
      positionObject.xPos = xPos + hypoteneuse;
      positionObject.yPos = yPos + hypoteneuse;
      return positionObject;
    default:
      console.log('ERROR: resolveMovement#resolvePosition: other value');
      return positionObject;
  }
};
