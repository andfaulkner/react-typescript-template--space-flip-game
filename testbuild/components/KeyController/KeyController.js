'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.KeyController = undefined;

var _react = require('react');

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

; /// <reference path="../../../typings/globals/jquery/index.d.ts" />
/// <reference path="../../../typings/globals/react/index.d.ts" />
/// <reference path="../../../typings/globals/react-dom/index.d.ts" />
/// <reference path="../../../typings/globals/lodash/index.d.ts" />

;
;
class KeyController extends React.Component {
    constructor(...args) {
        super(...args);
        this.events = {
            keyPressed: e => {
                console.log('KeyController.tsx:: key pressed: e.key: ', e.key);
            }
        };
    }
    render() {
        return React.createElement('div', null);
    }
}
exports.KeyController = KeyController;
;