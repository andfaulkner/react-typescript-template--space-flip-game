// ENUMS
export enum Dimension {
  width,
  height
}

export enum PlayerColor {
  Red,
  Blue,
  Green
};

export enum Direction {
  DownRight = 360,
  Down =      45,
  DownLeft =  90,
  Left =      135,
  UpLeft =    180,
  Up =        225,
  UpRight =   270,
  Right =     315
};

export interface Input {
  time: number;
}

export let actions = {
  ArrowUp: "RaiseSpeed",
  ArrowDown: "LowerSpeed",
  w: "Up",
  e: "UpRight",
  d: "Right",
  c: "DownRight",
  s: "Down",
  x: "Down",
  z: "DownLeft",
  a: "Left",
  q: "UpLeft",
  ' ': "Space"
};

export interface Coordinates {
  xPos: number;
  yPos: number;
}

export interface UIEntityVector {
  xPos: number;
  yPos: number;
  speed: number;
}
