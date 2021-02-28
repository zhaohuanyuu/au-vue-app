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
// const compiler = webpack({
//   mode: 'development',
// })
const middlewareInstance = devMiddleware(compiler, {
  stats: 'errors-only',
});

app.use(middlewareInstance);
app.use(hotMiddleware(compiler));

// compiler.close();

app.listen(port);
