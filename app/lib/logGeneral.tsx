/// <reference path="../../typings/index.d.ts" />

import * as _ from "lodash";

let coreLog = (currentLevel, msg, ...args) => {
  if (logLevel <= currentLevel) {
    console.log(msg, ...args);
  }
};

export const log = {
  silly: _.partial(coreLog, 1),
  verbose: _.partial(coreLog, 2),
  debug: _.partial(coreLog, 3),
  info: _.partial(coreLog, 4),
  error: _.partial(coreLog, 5),
  wtf: _.partial(coreLog, 6)
};
