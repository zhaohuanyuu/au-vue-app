const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const { pathResolve } = require('./config-utils');

module.exports = {
	devtool: 'cheap-module-source-map',
	optimization: {
		splitChunks: {
			cacheGroups: {
				vendors: {
          chunks: 'all',
          name: 'vendors',
					test: /[\\/]node_modules[\\/]/,
					filename: "[name].js"
				},
        styles: {
          name: 'style',
          test: /\.s?css$/,
          chunks: 'initial',
          enforce: true,
          filename: "[name].js"
        }
			}
		},
		minimizer: [
			new TerserPlugin({
				cache: true,
				parallel: true,
				sourceMap: true,
				terserOptions: {
					drop_console: true,
					drop_debugger: true
				}
			}),
			new OptimizeCssAssetsPlugin({})
		]
	}
};