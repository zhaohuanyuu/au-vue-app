const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');

const Os = require('os');
const { pathResolve } = require('./utils');
const pathSrc = pathResolve('../src');
const pathNodeModule = pathResolve('../node_modules');

module.exports = {
	devtool: 'nosources-source-map',
	optimization: {
    sideEffects: true,
		splitChunks: {
      cacheGroups: {
        defaultVendors: {
          chunks: 'all',
          name: 'vendors',
          test: /[\\/]node_modules[\\/]/,
          filename: "[name].js"
        },
        styles: {
          name: 'styles',
          type: 'styles/mini-extract',
          chunks: 'all',
          enforce: true,
        }
      }
		},
		minimizer: [
			new CssMinimizerPlugin({
        test: /\.css$/,
        include: pathSrc,
        exclude: pathNodeModule,
        parallel: Os.cpus().length,
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true }
            }
          ]
        }
      })
		]
	}
};