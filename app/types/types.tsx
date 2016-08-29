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

export enum SpeedChange {
  Accelerate,
  Decelerate,
  Stop
}

export interface Input {
  time: number;
}

export let controls = {
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
  ' ': "Shoot",
};

export interface Coordinates {
  xPos: number;
  yPos: number;
}

export interface PlayerVector {
  xPos: number;
  yPos: number;
  speed: number;
}

export interface PlayerUIData {
  xPos: number;
  yPos: number;
  angle: number;
  speed: number;
}

export enum InputType {
  PlayerMove,
  PlayerSpeedChange,
  PlayerShoot
}

export interface InputEvent {
  type: InputType;
  data: any;
}
