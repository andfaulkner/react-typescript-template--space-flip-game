import { EnemyCrawlerProps } from '../components/EnemyCrawler/EnemyCrawler.tsx';

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
  Right =     0.0000001, /* AKA 0. Prevents type issue */
  DownRight = 45,
  Down =      90,
  DownLeft =  135,
  Left =      180,
  UpLeft =    225,
  Up =        270,
  UpRight =   315,
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

export enum InputType {
  PlayerMove,
  PlayerSpeedChange,
  PlayerShoot
}

export interface InputEvent {
  type: InputType;
  input: any;
}

export interface Coordinates {
  xLeft: number;
  yTop: number;
}

export interface UIEntityVector extends Coordinates {
  speed: number;
}

export interface UIEntityProps extends UIEntityVector {
  angle: number;
  timeCreated?: number;
  width: number;
  height: number;
}

export interface BoxCoordinates extends Coordinates {
  xRight: number;
  yBottom: number;
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

export interface UIState {
  player: UIEntityProps;
  bullets: UIEntityProps[];
  uiBoxes: UIEntityProps[];
  enemies: {
    crawlers: UIEntityProps[]
  };
  score: number;
}

export interface AppState {
  time:    number;
  lastRenderedTime: number;
  updateReady: boolean;
  inputQueue: any[];
  uiState: UIState;
};
