/// <reference path="../../typings/index.d.ts" />

import * as _ from 'lodash';

import {
  AppState, UIEntityProps
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

// naive collision detection
export const handleUIEntityCollisions = (curState: AppState) =>
  _.assign(curState,
    {
      uiBoxes: _.reject(curState.uiBoxes, uiBox =>
                !_.isEmpty(_.remove(curState.bullets, bullet =>
                  detectCollision(uiBox, bullet)))),
      enemies: {
        fighters: _.reject(curState.enemies.fighters, fighter =>
                    !_.isEmpty(_.remove(curState.bullets, bullet =>
                      detectCollision(fighter, bullet))))
      }
    }
);

// naive collision detection
export const detectCollision = (npc: UIEntityProps, bullet: UIEntityProps) =>
  ((bullet.xLeft < npc.xLeft + bullet.width) &&
   (bullet.xLeft + bullet.width > npc.xLeft - npc.width) &&
   (bullet.yTop < npc.yTop + bullet.height) &&
   (bullet.yTop > npc.yTop - npc.height));

// detect collisions with bullets
export const bulletToUIEntityCollisions = (curState: AppState): AppState => {
  let newState = Object.assign({}, curState, {
      uiBoxes: _.reject(curState.uiBoxes, (uiBox: UIEntityProps) =>
                !_.isEmpty(_.remove(curState.bullets, bullet =>
                  detectCollision(uiBox, bullet)))),
      enemies: {
        fighters: _.reject(curState.enemies.fighters, (fighter: UIEntityProps) =>
                    !_.isEmpty(_.remove(curState.bullets, bullet =>
                      detectCollision(fighter, bullet))))
      }
    });
  console.log('newState', newState);
  return newState;
};
