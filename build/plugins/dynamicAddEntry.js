const { getMultiPathMap }  = require('../utils');
const DynamicEntryPlugin = 'webpack/lib/DynamicEntryPlugin';

// Based on https://github.com/webpack/webpack/blob/master/lib/DynamicEntryPlugin.js#L29-L37
function addEntry(compilation, context, name, entry) {
  return new Promise((resolve, reject) => {
    const dep = DynamicEntryPlugin.createDependency(entry, name)
    compilation.addEntry(context, dep, name, (err) => {
      if (err) return reject(err)
      resolve()
    })
  })
}

class Invalidator {
  constructor( devMiddleware) {
    this.devMiddleware = devMiddleware;
    // contains an array of types of compilers currently building
    this.building = false;
    this.rebuildAgain = false;
  }

  invalidate() {
    // If there's a current build is processing, we won't abort it by invalidating.
    // (If aborted, it'll cause a client side hard reload)
    // But let it to invalidate just after the completion.
    // So, it can re-build the queued pages at once.
    if (this.building) {
      this.rebuildAgain = true;
      return
    }

    this.building = true;
    // Work around a bug in webpack, calling `invalidate` on Watching.js
    // doesn't trigger the invalid call used to keep track of the `.done` hook on multiCompiler
    for (const compiler of this.multiCompiler.compilers) {
      compiler.hooks.invalid.call()
    }
    this.devMiddleware.invalidate()
  }

  startBuilding() {
    this.building = true;
  }

  doneBuilding() {
    this.building = false;

    if (this.rebuildAgain) {
      this.rebuildAgain = false;
      this.invalidate()
    }
  }
}

class DynamicAddEntry {
  constructor(devMiddleware) {
    this.directories = [];
    this.devMiddleware = devMiddleware;
  }

  static getEntries() {
    const entries = getMultiPathMap().entries;
    console.log(entries);
    this.directories = entries;
    return () => entries;
  }

  middleware() {
    return (req, res, next) => {
      if (stopped) {
        // If this handler is stopped, we need to reload the user's browser.
        // So the user could connect to the actually running handler.
        res.statusCode = 302;
        res.setHeader('Location', req.url);
        res.end('302');
      } else if (reloading) {
        // Webpack config is reloading. So, we need to wait until it's done and
        // reload user's browser.
        // So the user could connect to the new handler and webpack setup.
        this.waitUntilReloaded().then(() => {
          res.statusCode = 302;
          res.setHeader('Location', req.url);
          res.end('302');
        })
      } else {
        if (!/^\/_next\/webpack-hmr/.test(req.url)) return next();

        const { query } = parse(req.url, true);
        const page = query.page;
        if (!page) return next();

        const runPing = () => {
          const data = handlePing(query.page as string);
          if (!data) return;
          res.write('data: ' + JSON.stringify(data) + '\n\n')
        };
        const pingInterval = setInterval(() => runPing(), 5000);

        req.on('close', () => {
          clearInterval(pingInterval)
        });
        next()
      }
    }
  }
  afterCompile(compilation, callback) {
    for (const directory of this.directories) {
      console.log('========');
      compilation.contextDependencies.add(directory);
    }
    callback();
  }

  apply(compiler) {
    console.log('apply========triggered');
    compiler.hooks.make.tapAsync('DynamicAddEntry', this.afterCompile.bind(this));
  }
}

module.exports = DynamicAddEntry;