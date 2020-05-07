const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const { pathResolve } = require('./config-utils');

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	devServer: {
		hot: true,
		noInfo: true,
		// open: true,
		overlay: true
	},
	plugins:[
		new webpack.ProgressPlugin(),
		new FriendlyErrorsWebpackPlugin({
			compilationSuccessInfo: {
				messages: ['You application is running here http://localhost:8080'],
				// notes: ['Some additionnal notes to be displayed unpon successful compilation']
			},
			additionalFormatters: [],
			additionalTransformers: []
		})
	]
};