/// <reference path="../../../typings/index.d.ts" />

import moment from 'moment';

let logTime = (msg) => {
  let hour = moment().get('hour');
  let minute = moment().get('minute');
  let second = moment().get('second');
  let ms = moment().get('millisecond');

  let ts = `T: ${hour}:${minute}:${second}.${ms}`;

  let whitespace = ((70 - msg.length - ts.length) > 1)
      ? _.repeat(' ', (70 - msg.length - ts.length))
      : '';

  console.log(`|| ${ts}:: ${msg} ${whitespace} ||`);
};

let blockWrapLog = (next, msg) => {
  console.log(`${_.repeat('=', 80)}`);
  if (next) {
    next(msg);
  } else {
    console.log(msg);
  }
  console.log(`${_.repeat('=', 80)}`);
};

export const logger = ({ getState }) => {

  console.log('--------------------------------------');
  console.log('|  REDUX LOGGER MIDDLEWARE INJECTED  |');
  console.log('--------------------------------------');

  return (next) => (action) => {
    if (!_.includes(['RESET_LAST_RENDERED_TIME', 'SET_UI_UPDATE_READY', 'CLEAR_INPUT_QUEUE'], action.type)) {
      console.log('\n\n');
      blockWrapLog(logTime, 'START action dispatch');
      console.log('Action dispatched: ', action.type, ': data payload: ', action.payload);
    }

      // Call the next dispatch method in the middleware chain. Its result will then be logged.
      let returnValue = next(action);

    if (!_.includes(['RESET_LAST_RENDERED_TIME', 'SET_UI_UPDATE_READY', 'CLEAR_INPUT_QUEUE'], action.type)) {
      console.log('state after dispatch: ', getState());
      console.log('returnValue: ', returnValue);

      blockWrapLog(logTime, 'END action dispatch');
      console.log('\n\n');
    }

    // Likely the action itself unless a middleware further in the chain changed it
    return returnValue;
  };
};
