const fs = require('fs');
const { pathResolve } = require('./utils');
const devConfig = require('./webpack.base.conf')({ multi: true, development: true});

const webpack = require('webpack');
const Koa = require('koa');
const koaStatic = require('koa-static');
const koaWebpack  = require('koa-webpack');

const app = new Koa();
const compiler = webpack(devConfig);
const port = process.env.PORT || 7000

async function startUp() {
  const middleware = await koaWebpack({
    compiler,
    devMiddleware: {
      publicPath: '/',
      stats: 'errors-only',
    }
  });

  app.use(middleware);
  app.use(koaStatic(
    pathResolve(__dirname, './dist'))
  );
  app.listen(port);
}


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

startUp();
