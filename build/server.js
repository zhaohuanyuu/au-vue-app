const fs = require('fs');
const { pathResolve } = require('./utils');
let baseConfig = require('./webpack.base.conf')({ multi: true, development: true});

const webpack = require('webpack');
const middleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

const compiler = webpack(baseConfig);
const middlewareInstance = middleware(compiler);
const express = require('express');
const app = express();

compiler.hooks.entryOption.tap('entryOption', (context, entry) => {
  console.log('=======', context, entry)
});

app.use(middlewareInstance);
// app.use(middleware(compiler, { logLevel: 'errors-only' }));

app.use(hotMiddleware(compiler, {
  overlay: true,
  log: false
}));

fs.watch(pathResolve('../src/pages'), (eventType, filename) => {
  console.log(filename + ': trigger' +eventType);

  // compiler.hooks.make.tabAsync('dynamicEntry', )

  /*const pageDir = pathResolve('../src/pages');
  const entryMap = fs.readdirSync(pageDir).reduce((entries, pagename) => {
    entries[pagename] = pageDir + '/' + pagename;
    return entries;
  }, {});*/

  // middlewareInstance.invalidate();

  /*compiler.hooks.make.tap('dynamicAddEntry', (compilation) => {
    console.log(compilation, '===========')
  })*/

  // middlewareInstance.invalidate();
});

app.listen(7000);