'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Bullet = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /// <reference path="../../../typings/index.d.ts" />


var _react = require('react');

var React = _interopRequireWildcard(_react);

var _UIEntity = require('../UIEntity/UIEntity');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

;
;
;
class Bullet extends _UIEntity.UIEntity {
    render() {
        return React.createElement('div', { id: 'bullet', className: 'centered', style: _extends({}, this.calcOffset()) });
    }
}
exports.Bullet = Bullet;
;