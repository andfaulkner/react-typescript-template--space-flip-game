'use strict';

var _react = require('react');

var React = _interopRequireWildcard(_react);

var _chai = require('chai');

var _enzyme = require('enzyme');

var _CurrentScore = require('./CurrentScore.js');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/// <reference path="../../../typings/index.d.ts" />
describe('<CurrentScore />', () => {
    it('should contain 1 div', () => {
        console.log('CurrentScore.spec: testing');
        const wrapper = (0, _enzyme.shallow)(React.createElement(_CurrentScore.CurrentScore, { score: 3 }));
        (0, _chai.expect)(wrapper.find('div')).to.have.length(1);
    });
});