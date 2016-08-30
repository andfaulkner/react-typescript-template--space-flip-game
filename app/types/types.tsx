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
  xLeft: number;
  yTop: number;
}

export interface BoxCoordinates extends Coordinates {
  xRight: number;
  yBottom: number;
}

export interface UIEntityVector extends Coordinates {
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

export interface UIEntityProps extends UIEntityVector {
  angle: number;
  timeCreated?: number;
}

export interface UIEntityBoxProps {
  xLeft: number;
  xRight: number;
  yTop: number;
  yBottom: number;
  speed: number;
  angle: number;
  timeCreated?: number;
}
