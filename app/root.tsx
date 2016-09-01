/// <reference path="../typings/index.d.ts" />

import * as React from 'react';
import * as ReactDOM from 'react-dom';

import { Provider } from 'react-redux';
import { store } from './store.tsx'; // only import from here
import { AppGUI } from './components/AppGUI/AppGUI.tsx';

export class Root extends React.Component<{}, {}> {
  render() {
    return (
      <Provider store={store}>
        <AppGUI spriteSize={20} />
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
