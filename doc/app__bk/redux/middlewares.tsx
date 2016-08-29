/// <reference path="../../typings/index.d.ts" />

import * as moment from 'moment';

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

let blockWrapLog = (msg, next) => {
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
    console.log('\n\n');
    blockWrapLog('START action dispatch', logTime);

    console.log('Action dispatched: ', action);

    // Call the next dispatch method in the middleware chain. Its result will then be logged.
    let returnValue = next(action);

    console.log('state after dispatch: ', getState());
    console.log('returnValue: ', returnValue);

    blockWrapLog('END action dispatch', logTime);
    console.log('\n\n');

    // Likely the action itself unless a middleware further in the chain changed it
    return returnValue;
  };
};
