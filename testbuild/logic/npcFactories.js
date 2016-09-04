'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createEnemy = exports.createUIBox = undefined;

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _types = require('../types/types');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/// <reference path="../../typings/index.d.ts" />
const generateRandomPosition = () => ({ xLeft: _.random(-260, 260), yTop: _.random(-260, 260) });
/**
 * Determine when to place new Entity
 */
const generateEntityStartPosition = curState => {
    var _generateRandomPositi = generateRandomPosition();

    let xLeftNew = _generateRandomPositi.xLeft;
    let yTopNew = _generateRandomPositi.yTop;
    var _curState$player = curState.player;
    let xLeftP = _curState$player.xLeft;
    let yTopP = _curState$player.yTop;
    let widthP = _curState$player.width;
    let heightP = _curState$player.height;
    // is there overlap? [TODO: confirm this works]

    if (Math.abs(xLeftP - xLeftNew) < widthP && !(Math.abs(yTopP - yTopNew) > widthP) || Math.abs(yTopP - yTopNew) < heightP && !(Math.abs(xLeftP - xLeftNew) > 30)) {
        return generateEntityStartPosition(curState);
    }
    return { xLeft: xLeftNew, yTop: yTopNew };
};
/**
 * Create inert 'Box' UI Entity
 */
const createUIBox = exports.createUIBox = curState => {
    curState.uiBoxes.push(_.assign({}, generateEntityStartPosition(curState), { speed: 2, angle: _types.Direction.Up, width: 25, height: 25 }));
    return curState.uiBoxes;
};
/**
 * Createa single 'enemy' UI Entity
 */
const createEnemy = exports.createEnemy = (curState, enemies, enemyType) => {
    switch (enemyType) {
        case 'crawler':
            console.log('app.tsx:: created crawler!');
            curState.enemies.crawlers.push(_.assign({}, generateEntityStartPosition(curState), { speed: 4, angle: _types.Direction.Up, width: 13, height: 25 }));
            break;
        default:
            console.error('app.tsx#createEnemy: Error: this enemy type does not exist');
    }
    return enemies;
};