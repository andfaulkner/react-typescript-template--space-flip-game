/// <reference path="../../typings/index.d.ts" />

import * as _ from 'lodash';

import {
  UIEntityProps, UIState,
} from '../types/types';

declare function require(name: string);

/**
 * naive collision detection
 * TODO replace with robust collision detection
 */
export const detectCollision = (npc: UIEntityProps, bullet: UIEntityProps) =>
  ((bullet.xLeft < npc.xLeft + bullet.width) &&
   (bullet.xLeft + bullet.width > npc.xLeft - npc.width) &&
   (bullet.yTop < npc.yTop + bullet.height) &&
   (bullet.yTop > npc.yTop - npc.height));

// temp storage of app state to let bulletCollision mutate it for bulletToUIEntityCollisions
let curStateClosure: UIState;

/**
 * Determine if a bullet struck a specific element; & if it did, rm the bullet from the app state
 * and return the element array with the struck element removed.
 */
const bulletCollision = (entityArr: UIEntityProps[], { points }) =>
  _.reject(entityArr, (uiBox: UIEntityProps) => !_.isEmpty(_.remove(curStateClosure.bullets,
    (bullet: UIEntityProps) => {
      if (detectCollision(uiBox, bullet)) {
        curStateClosure.score = curStateClosure.score + points;
        return true;
      }
    })));

/**
 * Detect collisions with bullets
 */
export const bulletToUIEntityCollisions = (curState: UIState): UIState => {
  curStateClosure = curState;
  return Object.assign({},
    curStateClosure,
    {
      uiBoxes: bulletCollision(curStateClosure.uiBoxes, { points: 0 }),
      enemies: {
        crawlers: bulletCollision(curStateClosure.enemies.crawlers, { points: 1 }),
      },
    }
  );
};
