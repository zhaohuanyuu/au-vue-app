const fs = require('fs');
const { pathResolve } = require('./utils');
const devConfig = require('./webpack.base.conf')({ multi: true, development: true });

const webpack = require('webpack');
const Express = require('express');
const devMiddleware = require('webpack-dev-middleware');
const hotMiddleware = require('webpack-hot-middleware');

const app = new Express();
const compiler = webpack(devConfig);
const middlewareInstance = devMiddleware(compiler, {
  // stats: 'errors-only'
});
const port = process.env.PORT || 7000;

app.use(middlewareInstance);
app.use(hotMiddleware(compiler));

compiler.hooks.entryOption.tap('entryOption', (context, entry) => {
  console.log('=======', context, entry)
});

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

app.listen(port);
