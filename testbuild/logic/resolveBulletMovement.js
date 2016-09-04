'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.updateBulletPositions = undefined;

var _types = require('../types/types');

var _calculateNextTickPosition = require('./calculateNextTickPosition');

/// <reference path="../../typings/index.d.ts" />
const hypoteneuse = speed => speed / 1.4142;
const moveBullets = bullets => {
    return _.map(bullets, bullet => (0, _calculateNextTickPosition.calculateNextTickPosition)(_types.Direction[bullet.angle].toString(), bullet));
};
const updateBulletPositions = exports.updateBulletPositions = bullets => {
    bullets = moveBullets(bullets);
    bullets = _.filter(bullets, bullet => bullet.xLeft < 310 && bullet.xLeft > -283 && bullet.yTop < 290 && bullet.yTop > -303);
    return bullets;
};