'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.EnemyCrawler = undefined;

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _UIEntity = require('../UIEntity/UIEntity');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/// <reference path="../../../typings/index.d.ts" />
;
;
class EnemyCrawler extends _UIEntity.UIEntity {
    render() {
        return React.createElement('div', { className: 'enemyCrawler', style: this.calcOffset() });
    }
}
exports.EnemyCrawler = EnemyCrawler;
;