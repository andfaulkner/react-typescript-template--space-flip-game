'use strict';

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _chai = require('chai');

var _enzyme = require('enzyme');

var _EnemyCrawler = require('./EnemyCrawler');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/// <reference path="../../../typings/index.d.ts" />
describe('<EnemyCrawler>', () => {
    it('should have one div', () => {
        const wrapper = (0, _enzyme.shallow)(React.createElement(_EnemyCrawler.EnemyCrawler, { reachedEnd: true, angle: 90, width: 20, height: 20, speed: 3, xLeft: 22, yTop: 55 }));
        (0, _chai.expect)(wrapper.find('div')).to.have.length(1);
    });
});