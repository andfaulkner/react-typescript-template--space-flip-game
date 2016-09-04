/// <reference path="../../../typings/index.d.ts" />

// declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { expect } from 'chai';
import { shallow } from 'enzyme';

import { NavHeader } from './NavHeader.tsx';

describe('<NavHeader />', () => {
  it('should contain 4 links', () => {
    console.log('CurrentScore.spec: testing');
    const wrapper = shallow(<NavHeader />);
    expect(wrapper.find('a')).to.have.length(4);
  });
});
