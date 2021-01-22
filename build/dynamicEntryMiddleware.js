function dynamicEntryMiddleware(compiler) {
  return function(req, res, next) {
    compiler.hooks.entryOption.tap('EntryOptionPlugin', (context, entry) => {
      // console.log('dynamic entry hooks');
      console.log('dynamic entry ====== EntryOptionPlugin')
    });
    compiler.hooks.entryOption.tap('dynamicEntry', (context, entry) => {
      // console.log('dynamic entry hooks');
      console.log('dynamic entry ====== entryOption')
    });
    compiler.hooks.done.tap('MyPlugin', (context, entry) => {
      console.log('dynamic entry ====== entryOption')
    });
    // console.log('middleware trigger');
    // console.log(Object.keys(compiler.hooks).join('\n'));
    next();
  }
}

module.exports = dynamicEntryMiddleware;