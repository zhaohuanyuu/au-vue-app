const path = require('path');

module.exports = {
	pathResolve: dir => path.resolve(__dirname, dir),
  getMultiPathMap: (glob, HtmlWebpackPlugin) => {
    const entries = {};
    const htmlPlugins = [];
    const entryFiles = glob.sync(path.join(__dirname, '../src/pages/*/index.js'));

    entryFiles.forEach(entryFile => {
      const match = entryFile.match(/src\/pages\/(.*)\/index\.js/);
      const pageName = match && match[1];

      // entries[pageName] = [entryFile];
      entries[pageName] = [entryFile, 'webpack-hot-middleware/client'];
      htmlPlugins.push(
        new HtmlWebpackPlugin({
          chunks: [pageName],
          filename: `${pageName}.html`,
          // template: path.resolve(__dirname, '../public/index.html'),
          favicon: path.join(__dirname, '../public/assets/favicon.ico'),
          template: path.join(__dirname, `../src/pages/${pageName}/index.html`)
        })
      );
    });

    return {
      entries,
      htmlPlugins
    }

    /*Object.keys(entryFiles)
      .map((index) => {
        const entryFile = entryFiles[index];
        // '/Users/cpselvis/my-project/src/index/index.js'
        // console.log('entryFile', entryFile);

        // const match = entryFile.match(/src\/(.*)\/index\.js/);
        const match = entryFile.match(/src\/pages\/index\.js/);
        const pageName = match && match[1];

        entries[pageName] = entryFile;
        htmlPlugins.push(
          new HtmlWebpackPlugin({
            template: path.join(__dirname, `../src/pages/${pageName}/index.html`),
            filename: `${pageName}.html`,
            chunks: [pageName],
            inject: true,
            minify: {
              html5: true,
              collapseWhitespace: true,
              preserveLineBreaks: false,
              minifyCSS: true,
              minifyJS: true,
              removeComments: false
            }
          })
        );
      });

    return {
      entries,
      htmlPlugins
    }*/
  }
};