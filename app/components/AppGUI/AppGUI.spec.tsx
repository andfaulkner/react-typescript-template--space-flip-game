/// <reference path="../../../typings/index.d.ts" />

declare function require(name: string);

import * as _ from 'lodash';
import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { expect } from 'chai';
import { shallow } from 'enzyme';
import * as sinon from 'sinon';
import * as mocha from 'mocha';

import { AppGUI } from './AppGUI';

// let wrapper = shallow(<AppGUI spriteSize={20}/>);

// const buildWrapper = () => shallow(<AppGUI spriteSize={20}/>);

// const mapStateToProps = (state) => {
//   return {
//     time
//   };
// };



describe('<AppGUI>', () => {
  it('should be clickable', () => {
    const mockOnClick = sinon.spy();
    let wrapper = shallow(<AppGUI spriteSize={20}/>);

    // const onButtonClick = sinon.spy();
    // console.dir(wrapper.find('div').find({ 'onKeyDown': '' }));
    // wrapper.find('div').first().simulate('click');
    // expect(onButtonClick.calledOnce).to.equal(true);
  });
});