"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _react = require("react");

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

class Hello extends React.Component {
    render() {
        return React.createElement(
            "div",
            null,
            "Hello, ",
            this.props.name
        );
    }
} /// <reference path="../typings/index.d.ts" />
exports.default = Hello;