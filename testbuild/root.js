'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Root = undefined;

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _reactDom = require('react-dom');

var ReactDOM = _interopRequireWildcard(_reactDom);

var _reactRedux = require('react-redux');

var _store = require('./store.js');

var _AppGUI = require('./components/AppGUI/AppGUI.tsx');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

class Root extends React.Component {
    render() {
        return React.createElement(
            _reactRedux.Provider,
            { store: _store.store },
            React.createElement(_AppGUI.AppGUI, { spriteSize: 20 })
        );
    }
}
exports.Root = Root; /// <reference path="../typings/index.d.ts" />

;
document.addEventListener("DOMContentLoaded", function (event) {
    console.log('DOM loaded - mounting React');
    ReactDOM.render(React.createElement(Root, null), document.getElementById('content'));
});