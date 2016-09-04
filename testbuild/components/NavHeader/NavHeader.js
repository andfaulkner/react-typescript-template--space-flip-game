'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.NavHeader = undefined;

var _react = require('react');

var React = _interopRequireWildcard(_react);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

; /// <reference path="../../../typings/index.d.ts" />

;
;
class NavHeader extends React.Component {
  render() {
    return React.createElement(
      'header',
      { className: 'mdl-layout__header mdl-layout__header--transparent' },
      React.createElement(
        'div',
        { className: 'mdl-layout__header-row' },
        React.createElement(
          'span',
          { className: 'mdl-layout-title' },
          'Title'
        ),
        React.createElement('div', { className: 'mdl-layout-spacer' }),
        React.createElement(
          'nav',
          { className: 'mdl-navigation' },
          React.createElement(
            'a',
            { className: 'mdl-navigation__link', href: '' },
            'Game'
          ),
          React.createElement(
            'a',
            { className: 'mdl-navigation__link', href: '' },
            'Leaderboard'
          ),
          React.createElement(
            'a',
            { className: 'mdl-navigation__link', href: '' },
            'Info'
          ),
          React.createElement(
            'a',
            { className: 'mdl-navigation__link', href: '' },
            'Login'
          )
        )
      )
    );
  }
}
exports.NavHeader = NavHeader;
;