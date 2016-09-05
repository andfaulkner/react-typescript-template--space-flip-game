/// <reference path="../../../typings/index.d.ts" />

import moment from 'moment';

enum LogTitlePosition {
  Start,
  End
}

let logTime = (msg, type?: string) => {
  let hour = moment().get('hour');
  let minute = moment().get('minute');
  let second = moment().get('second');
  let ms = moment().get('millisecond');

  let ts = `T: ${hour}:${minute}:${second}.${ms}`;

  let len = (70 - msg.length - ts.length);

  let whitespace = (((type) ? (len - type.length) : (len)) > 1)
      ? _.repeat(' ', ((type) ? (len - type.length) : (len)))
      : '';

  // console.log(`|| ${ts}:: ${msg}${(type) ? (' ' + type + ' ') : ''}${whitespace} ||`);
};

let blockWrapLog = (next, titlePosition: LogTitlePosition, msg: string, type?: string) => {
  if (titlePosition === LogTitlePosition.Start) console.log(`${_.repeat('=', 80)}`);
  if (next) {
    next(msg, (type) ? '--> ' + type : null);
  } else {
    if (titlePosition === LogTitlePosition.Start) console.log(msg + `: ${type}`);
  }
  if (titlePosition === LogTitlePosition.End) console.log(`${_.repeat('=', 80)}`);
};

export const logger = ({ getState }) => {

  console.log('-------------------------------------------');
  console.log('|---  REDUX LOGGER MIDDLEWARE INJECTED  ---|');
  console.log('-------------------------------------------');

  return (next) => (action) => {
    // if (!_.includes(['RESET_LAST_RENDERED_TIME', 'SET_UI_UPDATE_READY', 'CLEAR_INPUT_QUEUE'], action.type)) {
    //   blockWrapLog(logTime, LogTitlePosition.Start, 'START action dispatch', action.type);
    //   console.log(action.type, ': data: ', action.payload);
    // }

    // Call the next dispatch method in the middleware chain. Its result will then be logged.
    let returnValue = next(action);

    // if (!_.includes(['RESET_LAST_RENDERED_TIME', 'SET_UI_UPDATE_READY', 'CLEAR_INPUT_QUEUE'], action.type)) {
    //   console.log('state after dispatch: ', getState(), ';; returnValue: ', returnValue);

    //   blockWrapLog(logTime, LogTitlePosition.End, 'END action dispatch', action.type);
    // }

    // Likely the action itself unless a middleware further in the chain changed it
    return returnValue;
  };
};
