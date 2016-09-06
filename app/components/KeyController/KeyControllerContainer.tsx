/// <reference path="../../../typings/index.d.ts" />

import { actionCreators } from '../../store/actions.tsx';
import { InputEvent } from '../../types/types.tsx';
import { KeyController } from './KeyController.tsx';
import { connect } from 'react-redux';

let { addItemToInputQueue } = actionCreators;

const mapStateToProps = (state) => ({
  inputQueue: state.input.inputQueue,
});

const mapDispatchToProps = (dispatch) => ({
  addItemToInputQueue: (input: InputEvent) => {
    dispatch(addItemToInputQueue(input));
  },
});

export const KeyControllerContainer: any = connect(
  mapStateToProps,
  mapDispatchToProps
)(KeyController as any);
