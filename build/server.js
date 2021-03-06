const fs = require('fs');
const { pathResolve } = require('./utils');
// const devConfig = require('./webpack.base.conf')({ multi: true, development: true });
const devConfig = require('./webpack.base.conf')({ development: true });

const webpack = require('webpack');
const Express = require('express');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

const app = new Express();
const compiler = webpack(devConfig);
const port = process.env.PORT || 7000;
const middlewareInstance = devMiddleware(compiler, {
  stats: 'errors-only',
});

console.log('build environment:', process.env.NODE_ENV)

app.use(middlewareInstance);
app.use(hotMiddleware(compiler, { log: false }));

// compiler.close();

app.listen(port);
