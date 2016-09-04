"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.createBullet = undefined;

var _types = require("../types/types");

var _lodash = require("lodash");

var _ = _interopRequireWildcard(_lodash);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/// <reference path="../../typings/index.d.ts" />
const createBullet = exports.createBullet = (playerState, bullets) => {
    let newBullet = { speed: 10, angle: playerState.angle, width: 7, height: 7 };
    switch (playerState.angle) {
        case _types.Direction.Up:
            bullets.push(_.assign(newBullet, {
                xLeft: playerState.xLeft - 10,
                yTop: playerState.yTop
            }));
            break;
        case _types.Direction.Down:
            bullets.push(_.assign(newBullet, {
                xLeft: playerState.xLeft - 10,
                yTop: playerState.yTop - 20
            }));
            break;
        case _types.Direction.Left:
            bullets.push(_.assign(newBullet, {
                xLeft: playerState.xLeft + 7,
                yTop: playerState.yTop - 10
            }));
            break;
        case _types.Direction.Right:
            bullets.push(_.assign(newBullet, {
                xLeft: playerState.xLeft - 23,
                yTop: playerState.yTop - 10
            }));
            break;
        case _types.Direction.UpRight:
            bullets.push(_.assign(newBullet, {
                xLeft: playerState.xLeft - 17,
                yTop: playerState.yTop - 6
            }));
            break;
        case _types.Direction.UpLeft:
            bullets.push(_.assign(newBullet, {
                xLeft: playerState.xLeft + 17,
                yTop: playerState.yTop - 6
            }));
            break;
        case _types.Direction.DownRight:
            bullets.push(_.assign(newBullet, {
                xLeft: playerState.xLeft - 17,
                yTop: playerState.yTop - 36
            }));
            break;
        case _types.Direction.DownLeft:
            bullets.push(_.assign(newBullet, {
                xLeft: playerState.xLeft + 17,
                yTop: playerState.yTop - 36
            }));
            break;
        default:
            break;
    }
    return bullets;
};