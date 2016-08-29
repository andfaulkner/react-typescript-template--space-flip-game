/// <reference path="../../typings/index.d.ts" />

import { Direction, UIEntityProps } from '../types/types';

import * as _ from "lodash";

export const createBullet = (playerState, bullets: UIEntityProps[]): UIEntityProps[] => {
    let newBullet = { speed: 10, angle: playerState.angle };
    switch (playerState.angle) {
      case Direction.Up:
        bullets.push(_.assign(newBullet, {
          xPos: playerState.xPos,
          yPos: playerState.yPos
        }));
        break;
      case Direction.Down:
        bullets.push(_.assign(newBullet, {
          xPos: playerState.xPos,
          yPos: playerState.yPos - 40
        }));
        break;
      case Direction.Left:
        bullets.push(_.assign(newBullet, {
          xPos: playerState.xPos + 20,
          yPos: playerState.yPos - 20
        }));
        break;
      case Direction.Right:
        bullets.push(_.assign(newBullet, {
          xPos: playerState.xPos - 20,
          yPos: playerState.yPos - 20
        }));
        break;
      case Direction.UpRight:
        bullets.push(_.assign(newBullet, {
          xPos: playerState.xPos - 17,
          yPos: playerState.yPos - 6
        }));
        break;
      case Direction.UpLeft:
        bullets.push(_.assign(newBullet, {
          xPos: playerState.xPos + 17,
          yPos: playerState.yPos - 6
        }));
        break;
      case Direction.DownRight:
        bullets.push(_.assign(newBullet, {
          xPos: playerState.xPos - 17,
          yPos: playerState.yPos - 36
        }));
        break;
      case Direction.DownLeft:
        bullets.push(_.assign(newBullet, {
          xPos: playerState.xPos + 17,
          yPos: playerState.yPos - 36
        }));
        break;
      default:
        break;
    }
    return bullets;
  };
;