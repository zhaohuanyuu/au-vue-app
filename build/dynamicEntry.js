class DynamicEntry {
  apply(compiler) {
    compiler.hook.afterCompile.tabAsync(this.constructor.name, this.afterCompile.bind(this))
  }

  afterCompile(compilation, callback) {
    console.log('afterCompile hook > ', compilation);
    callback();
  }
}

module.exports = DynamicEntry;