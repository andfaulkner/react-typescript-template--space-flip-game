'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.Player = undefined;

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; }; /// <reference path="../../../typings/index.d.ts" />


var _react = require('react');

var React = _interopRequireWildcard(_react);

var _UIEntity = require('../UIEntity/UIEntity');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

;
const width = 30;
class Player extends _UIEntity.UIEntity {
    constructor(...args) {
        super(...args);
        /**
        * Convert numeric position to px value for css - determines how much the ship should move
        */
        this.calcOffset = () => ({
            marginTop: -1 * this.props.yTop + 'px',
            marginLeft: -1 * this.props.xLeft + 'px'
        });
        /**
         * Get the active zone
         */
        this.box = () => ({
            xLeft: this.props.xLeft,
            xRight: this.props.xLeft - width,
            yTop: this.props.yTop,
            yBottom: this.props.yTop - width
        });
    }
    render() {
        return React.createElement(
            'div',
            null,
            React.createElement('div', { className: 'centered', id: 'player', style: _extends({}, this.calcOffset(), { transform: `rotate(${ this.props.angle - 45 }deg)` }) })
        );
    }
}
exports.Player = Player;
;
// Perhaps add against later, inside div.centered#player: <Cannon />