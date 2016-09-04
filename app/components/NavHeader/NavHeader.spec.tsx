/// <reference path="../../../typings/index.d.ts" />

// declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { expect } from 'chai';
import { shallow } from 'enzyme';

import { NavHeader } from './NavHeader.tsx';

let config = require('../../../config/app_properties.json');

console.dir(config);

const wrapper = shallow(<NavHeader />);

describe('<NavHeader />', () => {

  it('should contain 4 links', () => {
    console.log('CurrentScore.spec: testing');
    expect(wrapper.find('a')).to.have.length(4);
  });

  it('should display a title that matches the configured app title', () => {
    expect(wrapper.find('span.mdl-layout-title').text()).to.equal(config.name);
  });

  it('should contain a login link', () => {
    expect(wrapper.find('a.mdl-navigation__link').someWhere((n) => (n.text() === 'Login')))
      .to.equal(true);
  });
});
