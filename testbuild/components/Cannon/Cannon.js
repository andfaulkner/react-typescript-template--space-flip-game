'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Cannon = undefined;

var _react = require('react');

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

; /// <reference path="../../../typings/globals/jquery/index.d.ts" />
/// <reference path="../../../typings/globals/react/index.d.ts" />
/// <reference path="../../../typings/globals/react-dom/index.d.ts" />
/// <reference path="../../../typings/globals/lodash/index.d.ts" />

;
;
class Cannon extends React.Component {
    constructor(...args) {
        super(...args);
        this.events = {
            spacePressed: e => {
                console.log('Cannon.tsx: e:', e);
            }
        };
    }
    render() {
        return React.createElement(
            'div',
            { id: "weapon" },
            React.createElement('div', { id: "cannon" })
        );
    }
}
exports.Cannon = Cannon;
;
// under a div
// <div className={"random-tinkering"} />
// <div className={"random-tinkering-triangle"} />
// <div className={"hollow-triangle"} />