/// <reference path="../../../typings/index.d.ts" />

import * as _ from "lodash";
import moment from 'moment';

enum StartOrEnd {
  Start,
  End
};

/**
 * Styles to randomly select from when logging dispatches. One style is used for all logs
 * regarding one dispatch; another is randomly selected for the following dispatch, etc..
 * @type {Array}
 */
const styles = [
  'background: #222; color: #bada55;',
  'background: black; color: white;',
  'font-size: 12px; color: #000; font-weight: bolder; background: yellow',
  'font-size: 12px; color: #000; font-weight: bolder; background: lightgreen',
  'font-size: 12px; color: #000; font-weight: bolder; background: lightblue',
  'font-size: 12px; color: #000; font-weight: bolder; background: orange',
  'background: #faf2eb; color: green; font-weight: 900; text-decoration: underline; border: 1px solid #111111;',
  'background: darkred; color: white; font-weight: 900; font-size:12px' +
      /*cont*/ '; text-shadow: -4px -4px 8px #CCC, -0.5px -0.5px 0.5px yellow',
  'background: #000; color: yellow; font-weight: 900; font-size:12px' +
      /*cont*/ '; text-shadow: -4px -4px 8px #CCC, -0.5px -0.5px 0.5px yellow',
  'font-size: 12px; color: black; font-weight: 900; background: #ffccd5; border: black inset 2px' +
      /*cont*/ '; padding: 2px; box-sizing: content-box;',
  'color: white; background: indigo; font-size:12px; font-weight: 900' +
      /*cont*/ '; text-shadow: 0.5px 0.5px 0.5px darkred; padding: 2px;',
  'background: linear-gradient(#D33106, #571402); border: 1px solid #3E0E02; color: white;' +
      /*cont*/ 'display: block; text-shadow: 0 1px 0 rgba(0, 0, 0, 0.3)' +
      /*cont*/ '; box-shadow: 0 1px 0 rgba(255, 255, 255, 0.4) inset, 0 5px 3px -5px rgba(0, 0, 0, 0.5)' +
                           ', 0 -13px 5px -10px rgba(255, 255, 255, 0.4) inset' +
      /*cont*/ '; line-height: 40px; text-align: center; font-weight: bold; ',
  // Below is hilarious: //
  'color: white; background: white; font-size: 12px; font-weight: bolder' +
     /*cont*/ '; text-shadow: 1px 0.5px 2px black, 1px -0.5px 2px black; padding: 2px;',
];

const blockWidth = 100;
const ignoredActions = ['RESET_LAST_RENDERED_TIME', 'SET_UI_UPDATE_READY', 'CLEAR_INPUT_QUEUE'];
// const logDoubleLine = (): void => { console.log(`${_.repeat('=', 80)}`); };

const halfPad = (bookend: string, length: number, padChar: string = "="): string =>
  `${_.repeat(padChar, length)}${bookend}`;

/**
 * Surround 'header' text with extra-emphasizing padding
 * @param  {string} msg - header title
 * @return {string} header string with the emphasizing padding applied
 */
const headerPad = (msg: string): string => {
  const emphasizer = '||^^^';
  const padLen = blockWidth - msg.length - (emphasizer.length * 2);
  const lPadLen = Math.floor(padLen / 2);
  const rPadLen = Math.ceil(padLen / 2);
  const lPad = halfPad(emphasizer, lPadLen, '=');
  const rPad = _.reverse(halfPad(emphasizer, rPadLen, '=').split('')).join('');
  return `%c ${lPad} ${msg}${rPad}`;
};

/**
 * Display the current time in a human-friendly format, optionally stylized
 * @param  {String} msg    additional message to display beside the time
 * @param  {String} type?: name of the action called
 * @param  {String} style: style to apply to the message to differentiate it from other dispatches
 */
let logTime = (msg: string, type?: string, style: string = ''): void => {
  const hour = moment().get('hour');
  const minute = moment().get('minute');
  const second = moment().get('second');
  const ms = moment().get('millisecond');
  const ts = `T: ${hour}:${minute}:${second}.${ms}`;

  console.log(headerPad(`${ts}:: ${msg}${(type) ? (' ' + type + ' ') : ''}`), style);
};

let blockWrapLog = (next: (...args: any[]) => any, prePost: StartOrEnd, msg: string, type: string = '') => {
  if (next) {
    next(msg, (type) ? '--> ' + type : null);
  } else if (prePost === StartOrEnd.Start) {
    console.log(msg + `: ${type}`);
  }
};

/**
 * The logging middleware. Displays info on every dispatch to the store.
 */
export const logger = ({ getState }) => {
  console.log('-------------------------------------------');
  console.log('|---  REDUX LOGGER MIDDLEWARE INJECTED  ---|');
  console.log('-------------------------------------------');

  return (next) => (action) => {

    // select style for this runthru of the middleware (each run gets a style randomly selected
    // from a predefined group, to visually differentiation different calls to the store )
    const instanceStyle = _.sample(styles);
    const showAction = (when) => `%c || ${action.type} : ${when} dispatch: `;

    // don't display anything if this was triggered by an ignored action
    if (!_.includes(ignoredActions, action.type)) {
      blockWrapLog(_.partialRight(logTime, instanceStyle), StartOrEnd.Start,
                   'START action dispatch', action.type);
      console.log(showAction('before'), instanceStyle, '; data: ', action.payload);
    }

    // Call the next dispatch method in the middleware chain. Its result will then be logged.
    let returnValue = next(action);

    if (!_.includes(ignoredActions, action.type)) {
      console.log(showAction('after'), instanceStyle, getState(), 'returnValue --> ', returnValue);
    }

    // Likely the action itself is returned, unless a middleware further in the chain changed it
    return returnValue;
  };
};
