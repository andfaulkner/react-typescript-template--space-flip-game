'use strict';

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _chai = require('chai');

var _enzyme = require('enzyme');

var _NavHeader = require('./NavHeader.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/// <reference path="../../../typings/index.d.ts" />
describe('<NavHeader />', () => {
    it('should contain 4 links', () => {
        console.log('CurrentScore.spec: testing');
        const wrapper = (0, _enzyme.shallow)(React.createElement(_NavHeader.NavHeader, null));
        (0, _chai.expect)(wrapper.find('a')).to.have.length(4);
    });
});