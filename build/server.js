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

compiler.hooks.entryOption.tap('entryOption', (context, entry) => {
  console.log('=======', context, entry)
});

app.use(middlewareInstance);

app.use(hotMiddleware(compiler, {
  log: false,
  overlay: true,
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