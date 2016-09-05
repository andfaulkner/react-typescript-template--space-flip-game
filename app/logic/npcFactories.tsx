/// <reference path="../../typings/index.d.ts" />

import * as _ from 'lodash';

import { Direction, AppState, UIState } from '../types/types';

declare function require(name: string);

const generateRandomPosition = () => ({ xLeft: _.random(-260, 260), yTop: _.random(-260, 260)});

/**
 * Determine when to place new Entity
 */
const generateEntityStartPosition = (curState: UIState) => {
  let { xLeft: xLeftNew, yTop: yTopNew } = generateRandomPosition();
  let { xLeft: xLeftP, yTop: yTopP, width: widthP, height: heightP } = curState.player;

  // is there overlap? [TODO: confirm this works]
  if (((Math.abs(xLeftP - xLeftNew) < widthP) && !(Math.abs(yTopP - yTopNew) > widthP)) ||
      ((Math.abs(yTopP - yTopNew) < heightP) && !(Math.abs(xLeftP - xLeftNew) > 30))) {
    return generateEntityStartPosition(curState);
  }
  return { xLeft: xLeftNew, yTop: yTopNew };
};

/**
 * Create inert 'Box' UI Entity
 */
export const createUIBox = (curState) => {
  curState.uiBoxes.push(_.assign({}, generateEntityStartPosition(curState),
                                 { speed: 2, angle: Direction.Up, width: 25, height: 25 }));
  return curState.uiBoxes;
};

/**
 * Create a single 'enemy' UI Entity
 */
export const createEnemy = (curState, enemies, enemyType) => {
  switch (enemyType) {
    case 'crawler':
      console.log('app.tsx:: created crawler!');
      curState.enemies.crawlers.push(_.assign({}, generateEntityStartPosition(curState),
                                    { speed: 4, angle: Direction.Up, width: 13, height: 25 }));
    break;
    default:
      console.error('app.tsx#createEnemy: Error: this enemy type does not exist');
  }
  return enemies;
};
