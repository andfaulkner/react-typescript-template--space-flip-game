/// <reference path="../../typings/index.d.ts" />

import { applyMiddleware, createStore } from 'redux';

import { logger } from './middleware/logger';

import { reducers } from './reducers.tsx';

export const store = createStore(
  reducers,
  applyMiddleware(logger)
);
