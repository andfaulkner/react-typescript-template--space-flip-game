'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.bulletToUIEntityCollisions = exports.detectCollision = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /// <reference path="../../typings/index.d.ts" />


var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

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
const detectCollision = exports.detectCollision = (npc, bullet) => bullet.xLeft < npc.xLeft + bullet.width && bullet.xLeft + bullet.width > npc.xLeft - npc.width && bullet.yTop < npc.yTop + bullet.height && bullet.yTop > npc.yTop - npc.height;
// temp storage of app state to let bulletCollisionHandler mutate it for bulletToUIEntityCollisions
let curStateClosure;
/**
 * Determine if a bullet struck a specific element; & if it did, rm the bullet from the app state
 * and return the element array with the struck element removed.
 */
const bulletCollisionHandler = (entityArr, { points }) => _.reject(entityArr, uiBox => !_.isEmpty(_.remove(curStateClosure.bullets, bullet => {
    if (detectCollision(uiBox, bullet)) {
        curStateClosure.score = curStateClosure.score + points;
        return true;
    }
})));
/**
 * Detect collisions with bullets
 */
const bulletToUIEntityCollisions = exports.bulletToUIEntityCollisions = curState => {
    curStateClosure = curState;
    return _extends({}, curStateClosure, {
        uiBoxes: bulletCollisionHandler(curStateClosure.uiBoxes, { points: 0 }),
        enemies: {
            crawlers: bulletCollisionHandler(curStateClosure.enemies.crawlers, { points: 1 })
        }
    });
};