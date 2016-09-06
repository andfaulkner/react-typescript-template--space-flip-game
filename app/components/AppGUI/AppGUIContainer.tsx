import { connect } from 'react-redux';

import { InputEvent, UIState } from '../../types/types.tsx';
import { AppGUI } from './AppGUI.tsx';

import { actionCreators } from '../../store/actions.tsx';
let { addItemToInputQueue, clearInputQueue, testSwitchState,
      resetLastRenderedTime, setUIUpdateReady, resolveUIState } = actionCreators;

//
// ************************ REDUX ************************* //
//
const mapStateToProps = (state) => {
  return {
    inputQueue: state.input.inputQueue,
    lastRenderedTime: state.ui.lastRenderedTime,
    testStateProperty: state.input.testStateProperty,
    uiUpdateReady: state.input.testStateProperty,  /// TODO STILL REQUIRES DEFINING, ALL THIS DOES IS TEST
    uiState: state.ui.uiState,
  };
};

const mapDispatchToProps = (dispatch) => ({
  addItemToInputQueue: (input: InputEvent): void => { dispatch(addItemToInputQueue(input)); },
  clearInputQueue: (): void => { dispatch(clearInputQueue()); },
  resetLastRenderedTime: (): void => { dispatch(resetLastRenderedTime()); },
  testSwitchState: (newState: boolean): void => { dispatch(testSwitchState(newState)); },
  setUIUpdateReady: (): void => { dispatch(setUIUpdateReady()); },
  resolveUIState: (time: number, uiState: UIState): void => { dispatch(resolveUIState(time, uiState)); },
});

export const AppGUIContainer: any = connect(
  mapStateToProps,
  mapDispatchToProps
)(AppGUI as any);
