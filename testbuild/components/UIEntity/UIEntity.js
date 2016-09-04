'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.UIEntity = undefined;

var _react = require('react');

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

; /// <reference path="../../../typings/index.d.ts" />

;
class UIEntity extends React.Component {
    constructor(...args) {
        super(...args);
        this.calcOffset = (offset = 0) => ({
            marginTop: -1 * this.props.yTop - offset + 'px',
            marginLeft: -1 * this.props.xLeft + offset + 'px'
        });
        this.box = (width = 30, height = 30) => ({
            xLeft: this.props.xLeft,
            xRight: this.props.xLeft - this.props.width,
            yTop: this.props.yTop,
            yBottom: this.props.yTop - this.props.height
        });
    }
}
exports.UIEntity = UIEntity;
;