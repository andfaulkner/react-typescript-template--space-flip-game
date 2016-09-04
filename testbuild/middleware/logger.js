'use strict';

Object.defineProperty(exports, "__esModule", {
    value: true
});
exports.logger = undefined;

var _moment = require('moment');

var moment = _interopRequireWildcard(_moment);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

let logTime = msg => {
    let hour = moment().get('hour');
    let minute = moment().get('minute');
    let second = moment().get('second');
    let ms = moment().get('millisecond');
    let ts = `T: ${ hour }:${ minute }:${ second }.${ ms }`;
    let whitespace = 70 - msg.length - ts.length > 1 ? _.repeat(' ', 70 - msg.length - ts.length) : '';
    console.log(`|| ${ ts }:: ${ msg } ${ whitespace } ||`);
}; /// <reference path="../../typings/index.d.ts" />

let blockWrapLog = (msg, next) => {
    console.log(`${ _.repeat('=', 80) }`);
    if (next) {
        next(msg);
    } else {
        console.log(msg);
    }
    console.log(`${ _.repeat('=', 80) }`);
};
const logger = exports.logger = ({ getState }) => {
    console.log('--------------------------------------');
    console.log('|  REDUX LOGGER MIDDLEWARE INJECTED  |');
    console.log('--------------------------------------');
    return next => action => {
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