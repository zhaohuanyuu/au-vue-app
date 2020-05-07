const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const { pathResolve } = require('./config-utils');

module.exports = {
	devtool: 'cheap-module-source-map',
	optimization: {
		usedExports: true,
		splitChunks: {
			cacheGroups: {
				chunks: 'all',
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					filename: "[name].vendors.js"
				},
				styles: {
					test: /\.s?css$/,
					enforce: true
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