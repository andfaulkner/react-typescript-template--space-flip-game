/// <reference path="../../typings/index.d.ts" />

import * as _ from 'lodash';

import {
  AppState, UIEntityProps, UIPositions
} from '../types/types';

declare function require(name: string);


// export const destroyCollisions = (set1: Coordinates[], set2: Coordinates[], ...widths: number[]) => (
//   {
//     set1: _.reject(set1, set1El =>
//             _.remove(set2, (set2El, i) =>
//               this.detectCollision(set1El, set2El, widths))),
//     set2
//   }
// );

/**
 * naive collision detection
 * TODO replace with robust collision detection
 */
export const detectCollision = (npc: UIEntityProps, bullet: UIEntityProps) =>
  ((bullet.xLeft < npc.xLeft + bullet.width) &&
   (bullet.xLeft + bullet.width > npc.xLeft - npc.width) &&
   (bullet.yTop < npc.yTop + bullet.height) &&
   (bullet.yTop > npc.yTop - npc.height));

// temp storage of app state to let bulletCollisionHandler mutate it for bulletToUIEntityCollisions
let curStateClosure: UIPositions;

/**
 * Determine if a bullet struck a specific element; & if it did, rm the bullet from the app state
 * and return the element array with the struck element removed.
 */
const bulletCollisionHandler = (entityArr: UIEntityProps[], { points }) =>
  _.reject(entityArr, (uiBox: UIEntityProps) =>
    !_.isEmpty(_.remove(curStateClosure.bullets, (bullet: UIEntityProps) => {
      if (detectCollision(uiBox, bullet)) {
        curStateClosure.score = curStateClosure.score + points;
        console.log('collisionHandler.tsx:: COLLISION DETECTED!');
        debugger;
        return true;
      }
    })));

/**
 * Detect collisions with bullets
 */
export const bulletToUIEntityCollisions = (curState: UIPositions): UIPositions => {
  curStateClosure = curState;
  return Object.assign({},
    curStateClosure,
    {
      uiBoxes: bulletCollisionHandler(curStateClosure.uiBoxes, { points: 0 }),
      enemies: {
        crawlers: bulletCollisionHandler(curStateClosure.enemies.crawlers, { points: 1 })
      }
    }
  );
};
