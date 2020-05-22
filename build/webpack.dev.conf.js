const webpack = require('webpack');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const { pathResolve } = require('./config-utils');

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	devServer: {
		hot: true,
		noInfo: true,
    overlay: true,
    stats: {
      preset: 'errors-warnings',
		  colors: {
        green: '\u001b[32m'
      }
    }
	},
	plugins:[
		new webpack.ProgressPlugin(),
		new FriendlyErrorsWebpackPlugin({
			compilationSuccessInfo: {
				messages: ['Your application is running here http://localhost:8080'],
				// notes: ['Some additionnal notes to be displayed unpon successful compilation']
			},
			additionalFormatters: [],
			additionalTransformers: []
		})
	]
};