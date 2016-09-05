/// <reference path="../../typings/index.d.ts" />

import * as _ from 'lodash';

import {
  AppState, UIEntityProps, UIState
} from '../types/types';

declare function require(name: string);

// /**
//  * naive collision detection
//  * TODO replace with robust collision detection
//  */
// export const detectCollision = (npc: UIEntityProps, bullet: UIEntityProps) =>
//   ((bullet.xLeft < npc.xLeft + bullet.width) &&
//    (bullet.xLeft + bullet.width > npc.xLeft - npc.width) &&
//    (bullet.yTop < npc.yTop + bullet.height) &&
//    (bullet.yTop > npc.yTop - npc.height));

// temp storage of app state to let bulletCollisionHandler mutate it for bulletToUIEntityCollisions
let curStateClosure: UIState;

// /**
//  * Determine if a bullet struck a specific element; & if it did, rm the bullet from the app state
//  * and return the element array with the struck element removed.
//  */
// const bulletCollisionHandler = (entityArr: UIEntityProps[], { points }) =>
//   _.reject(entityArr, (uiBox: UIEntityProps) =>
//     !_.isEmpty(_.remove(curStateClosure.bullets, (bullet: UIEntityProps) => {
//       if (detectCollision(uiBox, bullet)) {
//         curStateClosure.score = curStateClosure.score + points;
//         console.log('collisionHandler.tsx:: COLLISION DETECTED!');
//         return true;
//       }
//     })));

const collisionHandlers = {
  curUI: [],

  start: (curUI) => {
    this.curUI = curUI;
    return this;
  },

  bulletCollisionHandler: (entityArr: UIEntityProps[], { points }) => {
    this.curUI.uiBoxes = _.reject(entityArr, (uiBox: UIEntityProps) =>
      !_.isEmpty(_.remove(this.curUI.bullets, (bullet: UIEntityProps) => {
        if (this.detectCollision(uiBox, bullet)) {
          this.curUI.score = this.curUI.score + points;
          // console.log('collisionHandler.tsx:: COLLISION DETECTED!');
          return true;
        }
      })));
    return this;
  },

  /**
   * naive collision detection
   * TODO replace with robust collision detection
   */
  detectCollision: (npc: UIEntityProps, bullet: UIEntityProps) =>
    ((bullet.xLeft < npc.xLeft + bullet.width) &&
     (bullet.xLeft + bullet.width > npc.xLeft - npc.width) &&
     (bullet.yTop < npc.yTop + bullet.height) &&
     (bullet.yTop > npc.yTop - npc.height))
};

/**
 * Detect collisions with bullets
 */
export const bulletToUIEntityCollisions = (curState: UIState): UIState => {
  curStateOutput = collisionHandlers.start(curState).bulletCollisionHandler();

  // return Object.assign({},
  //   curStateClosure,
  //   {
  //     uiBoxes: bulletCollisionHandler(curStateClosure.uiBoxes, { points: 0 }),
  //     enemies: {
  //       crawlers: bulletCollisionHandler(curStateClosure.enemies.crawlers, { points: 1 })
  //     }
  //   }
  // );
};
