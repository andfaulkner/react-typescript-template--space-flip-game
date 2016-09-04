'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.resolveSpeed = exports.resolvePosition = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /// <reference path="../../typings/index.d.ts" />


var _types = require('../types/types');

var _calculateNextTickPosition = require('./calculateNextTickPosition');

//
// DETERMINE ANGLE SPRITE SHOULD BE FACING
//
const rotate = (angle, keyName) => {
    return _types.Direction[keyName] || angle;
};
/**
 * Ensure player sprite is in bounds on the given dimension
 */
const checkInBounds_1D = (direction, position, dimension = 'x') => {
    console.log('resolvePlayerMovement#checkInBounds_1D: direction:', direction, 'dimension:', dimension);
    let hasVertical = _.includes(direction, 'Up') || _.includes(direction, 'Down');
    let hasHorizontal = _.includes(direction, 'Left') || _.includes(direction, 'Right');
    if (hasHorizontal && hasVertical) {
        if (position >= 300) {
            return 300;
        }
        if (position <= -273) {
            return -273;
        }
        return position;
    } else {
        if (position >= 293) {
            return 293;
        }
        if (position <= -265) {
            return -265;
        }
        return position;
    }
};
//
// Determine new position of sprite, based on direction given
//
const resolvePosition = exports.resolvePosition = (uiObject, direction) => {
    let xLeft = uiObject.xLeft;
    let yTop = uiObject.yTop;
    let speed = uiObject.speed;
    let angle = uiObject.angle;
    let width = uiObject.width;
    let height = uiObject.height;

    let hypoteneuse = speed / 1.4142;
    let positionObject = {
        speed, angle: _types.Direction[direction.toString()] || angle, xLeft, yTop, width, height
    };
    const boundCheck = _.partial(checkInBounds_1D, direction.toString());
    positionObject = (0, _calculateNextTickPosition.calculateNextTickPosition)(direction, positionObject);
    return _extends({}, positionObject, {
        xLeft: boundCheck(positionObject.xLeft),
        yTop: boundCheck(positionObject.yTop)
    });
};
/**
 * Work out the current player speed. Alter if speed up or slow down event has occurred.
 * @param  {integer} speed - current speed
 * @param  {string} keyPressed - the key that was pressed.
 * @return {integer} updated speed
 */
const resolveSpeed = exports.resolveSpeed = (speed, keyPressed) => {
    switch (keyPressed) {
        case "RaiseSpeed":
            return speed < 10 ? speed + 1 : speed;
        case "LowerSpeed":
            return speed > 1 ? speed - 1 : speed;
        default:
            return speed;
    }
};