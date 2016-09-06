/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { AppGUIContainer } from './components/AppGUI/AppGUIContainer.tsx';
import { store } from './store/store.tsx'; // only import from here
import { Provider } from 'react-redux';

export class Root extends React.Component<{}, {}> {
  render() {
    return (
      <Provider store={store}>
        <AppGUIContainer spriteSize={20} />
      </Provider>
    );
  }
};

document.addEventListener("DOMContentLoaded", function(event) {
  console.log('DOM loaded - mounting React');
  ReactDOM.render(
    <Root />,
    document.getElementById('content')
  );
});
