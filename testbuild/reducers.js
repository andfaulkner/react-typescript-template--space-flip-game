'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});

var _lodash = require('lodash');

var _ = _interopRequireWildcard(_lodash);

var _reduxActions = require('redux-actions');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/// <reference path="../typings/index.d.ts" />
exports.default = (0, _reduxActions.handleActions)({
    CHANGE_PLAYER_POSITION: (state, action) => _.assign({}, state, {
        player: _.assign({}, state.player, {
            xLeft: action.payload.xLeft,
            yTop: action.payload.yTop
        })
    })
}, {});