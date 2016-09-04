'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Clock = undefined;

var _react = require('react');

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

; /// <reference path="../../../typings/index.d.ts" />

;
;
class Clock extends React.Component {
    constructor(...args) {
        super(...args);
        this.events = {
            time: clock => {
                console.log('clock:', clock);
            }
        };
    }
    render() {
        return React.createElement(
            'div',
            { className: 'clock--text' },
            this.props.time
        );
    }
}
exports.Clock = Clock;
;