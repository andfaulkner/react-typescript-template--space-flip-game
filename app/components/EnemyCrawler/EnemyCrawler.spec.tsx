/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { expect } from 'chai';
import { shallow } from 'enzyme';
import * as sinon from 'sinon';
import * as mocha from 'mocha';

import { EnemyCrawler } from './EnemyCrawler';

describe('<EnemyCrawler>', () => {
  it('should have one div', () => {
    const wrapper = shallow(<EnemyCrawler reachedEnd={true} angle={90} width={20} height={20} speed={3} xLeft={22} yTop={55}/>);
    expect(wrapper.find('div')).to.have.length(1);
  });
});