/// <reference path="../typings/modules/express/index.d.ts" />
/// <reference path="../typings/globals/node/index.d.ts" />

declare let __dirname;
import fs = require('fs');
import path = require('path');

import * as express from 'express';

let app = express();

app.use('/assets', express.static(path.join(__dirname, '../public_assets')));

app.listen(8000, () => {
  console.log('server.tsx:: express hosting static assets at localhost:8000');
});
