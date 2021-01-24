const webpack = require('webpack');
// const DynamicAddEntry = require('./dynamicAddEntry');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');

const { pathResolve } = require('./utils');

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	plugins:[
		new webpack.ProgressPlugin(),
    // new DynamicAddEntry(),
    new webpack.HotModuleReplacementPlugin(),
		new FriendlyErrorsWebpackPlugin({
			compilationSuccessInfo: {
				messages: ['Your application is running here http://localhost:7000'],
				// notes: ['Some additionnal notes to be displayed unpon successful compilation']
			},
			// additionalFormatters: [],
			// additionalTransformers: []
		})
	]
};