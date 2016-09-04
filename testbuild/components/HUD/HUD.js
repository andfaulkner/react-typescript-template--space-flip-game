'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.HUD = undefined;

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _Clock = require('../Clock/Clock.js');

var _CurrentScore = require('../CurrentScore/CurrentScore.tsx');

var _ArenaBorder = require('../ArenaBorder/ArenaBorder.tsx');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/// <reference path="../../../typings/index.d.ts" />
;
;
;
const ArenaContainer = ({ score }) => React.createElement(
    'div',
    { className: 'arena-container' },
    React.createElement(_CurrentScore.CurrentScore, { score: score }),
    React.createElement(_ArenaBorder.ArenaBorder, null)
);
class HUD extends React.Component {
    render() {
        return React.createElement(
            'div',
            null,
            React.createElement('div', { className: 'top-spacer' }),
            React.createElement(_Clock.Clock, { time: this.props.time }),
            'a',
            React.createElement(ArenaContainer, { score: this.props.score })
        );
    }
}
exports.HUD = HUD;
;