/// <reference path="../../typings/index.d.ts" />

import { Direction, UIEntityProps } from '../types/types';

import { calculateNextTickPosition } from './calculateNextTickPosition';

const hypoteneuse = (speed) => speed / 1.4142;

const moveBullets = (bullets: UIEntityProps[]): UIEntityProps[] => {
  return _.map(bullets, (bullet: UIEntityProps) =>
    calculateNextTickPosition(Direction[bullet.angle].toString(), bullet));
};

export const updateBulletPositions = (bullets: UIEntityProps[]) => {
  bullets = moveBullets(bullets);
  bullets = _.filter(bullets, (bullet) =>
    (bullet.xLeft < 310 && bullet.xLeft > -283 && bullet.yTop < 290 && bullet.yTop > -303));
  return bullets;
};
