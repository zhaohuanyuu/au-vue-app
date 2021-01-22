const fs = require('fs');
const { pathResolve } = require('./utils');
let baseConfig = require('./webpack.base.conf')({ multi: true, development: true});

const webpack = require('webpack');
const express = require('express');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');
const dynamicEntryMiddleware = require('./dynamicEntryMiddleware');

const app = express();
const compiler = webpack(baseConfig);
const middlewareInstance = devMiddleware(compiler, {stats: "errors-warnings"} );

app.use(dynamicEntryMiddleware(compiler));

app.use(middlewareInstance);

app.use(hotMiddleware(compiler, {
  log: false,
  overlay: true,
}));

app.listen(7000);