const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { pathResolve } = require('./utils');

const config = env => {
	const isDev = env === 'development';
	const isProd = env === 'production';


	const concatPlugins = [];
	// 生产环境单独提取css
	// isProd && concatPlugins.push(new MiniCssExtractPlugin({
	// 	name: '[name].[contenthash].[ext]'
	// }));

	return {
		mode: env,
		entry: pathResolve('../src'),
		output: {
			path: pathResolve('../dist'),
			filename: '[name].[hash].js'
		},
		resolve: {
			mainFiles: ['index'],
			extensions: ['.vue', '.js', '.json'],
			modules: [pathResolve('../node_modules')],
			alias: {
				'@views': pathResolve('../src/views'),
				'@components': pathResolve('../src/components')
			},
		},
		module: {
			rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader',
					include: pathResolve('../src')
				},
				{
					test: /\.jsx?$/,
					loader: [
						'thread-loader',
						'babel-loader?cacheDirectory=true'
					],
					include: pathResolve('../src')
				},
				{
					test: /\.css$/,
					include: pathResolve('../src'),
					use: [
						{
							loader: MiniCssExtractPlugin.loader,
							options: {
								publicPath: '/external',
							}
						},
						'css-loader'
					]
				}
				// {
				// 	test: /\.s?css$/,
				// 	include: pathResolve('../src'),
				// 	use: [
				// 		isDev
				// 			? 'vue-style-loader'
				// 			:  {
				// 				loader: MiniCssExtractPlugin.loader,
				// 				options: {
				// 					publicPath: pathResolve('../dist/css')
				// 				}
				// 			},
				// 		{
				//
				// 			loader: 'css-loader',
				// 			options: {
				// 				importLoaders: 2,
				// 				// esModule: false
				// 			}
				// 		},
				// 		{
				// 			loader: 'postcss-loader',
				// 			options: {
				// 				plugins: [
				// 					require('autoprefixer')()
				// 				]
				// 			}
				// 		},
				// 		'sass-loader'
				// 	]
				// },
				// {
				// 	test: /\.(png|jpe?g|gif|svg|webp)$/i,
				// 	use: [
				// 		{
				// 			loader: 'url-loader',
				// 			options: {
				// 				limit: 8192,
				// 				esModule: false,
				// 				name: 'image/[name].[hash:7].[ext]'
				// 			},
				// 		},
				// 	],
				// }
			]
		},
		plugins: [
			new VueLoaderPlugin(),
			new CleanWebpackPlugin(),
			new webpack.DefinePlugin({
				NODE_ENV: env
			}),
			new HtmlWebpackPlugin({
				title: 'au-vue-cli',
				chunks: ['index'],
				favicon: pathResolve('../public/assets/favicon.ico'),
				template: pathResolve('../public/index.html')
			}),
			new MiniCssExtractPlugin({
				filename: '[name].css',
				chunkFilename: '[id].css',
			})
		]
		// ].concat(concatPlugins),
	}
};

module.exports = (env) => {
	const baseConfig = config(env);
	const devConfig = require('./webpack.dev.conf');
	const prodConfig = require('./webpack.prod.conf');

	return env === 'development'
					? merge(baseConfig, devConfig)
					: merge(baseConfig, prodConfig)
};
