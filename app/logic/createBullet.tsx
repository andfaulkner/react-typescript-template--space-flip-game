/// <reference path="../../typings/index.d.ts" />

import { Direction, UIEntityProps } from '../types/types';

import * as _ from "lodash";

export const createBullet = (playerState, bullets: UIEntityProps[]): UIEntityProps[] => {
  let newBullet = { speed: 10, angle: playerState.angle, width: 7, height: 7 };
  switch (playerState.angle) {
    case Direction.Up:
      bullets.push(_.assign(newBullet, {
        xLeft: playerState.xLeft - 10,
        yTop: playerState.yTop,
      }));
      break;
    case Direction.Down:
      bullets.push(_.assign(newBullet, {
        xLeft: playerState.xLeft - 10,
        yTop: playerState.yTop - 40
      }));
      break;
    case Direction.Left:
      bullets.push(_.assign(newBullet, {
        xLeft: playerState.xLeft + 20,
        yTop: playerState.yTop - 10,
      }));
      break;
    case Direction.Right:
      bullets.push(_.assign(newBullet, {
        xLeft: playerState.xLeft - 20,
        yTop: playerState.yTop - 10,
      }));
      break;
    case Direction.UpRight:
      bullets.push(_.assign(newBullet, {
        xLeft: playerState.xLeft - 17,
        yTop: playerState.yTop - 6,
      }));
      break;
    case Direction.UpLeft:
      bullets.push(_.assign(newBullet, {
        xLeft: playerState.xLeft + 17,
        yTop: playerState.yTop - 6,
      }));
      break;
    case Direction.DownRight:
      bullets.push(_.assign(newBullet, {
        xLeft: playerState.xLeft - 17,
        yTop: playerState.yTop - 36,
      }));
      break;
    case Direction.DownLeft:
      bullets.push(_.assign(newBullet, {
        xLeft: playerState.xLeft + 17,
        yTop: playerState.yTop - 36,
      }));
      break;
    default:
      break;
  }
  return bullets;
};

