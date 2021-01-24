const glob = require('glob');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

const { pathResolve } = require('./utils');

const config = env => {
	const isDev = env.development;
	const isProd = env.production;
	const isMulti = env.multi;
	const modeType = isDev ? 'development' : 'production';
	const pathSrc = pathResolve('../src');

	const prodPlugins = [];
  // 生产环境单独提取css
  if (isProd) {
    prodPlugins.push(
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        name: '[name].[contenthash].[ext]'
      })
    );
  }

  let entry = pathResolve('../src');
  let htmlWebpackPlugins = [new HtmlWebpackPlugin({
    title: 'au-vue-app',
    chunk: ['vendor', 'style'],
    // favicon: pathResolve('../public/assets/favicon.ico'),
    template: pathResolve('../public/index.html'),
    files: {
      css: pathResolve('../src/scss/base.scss')
    }
  })];

  // 多页面配置
	if (isMulti) {
	  const { getMultiPathMap } = require('./utils');
	  const { entries, htmlPlugins } = getMultiPathMap(glob, HtmlWebpackPlugin);

	  entry = () => entries;
    htmlWebpackPlugins = htmlPlugins;
  }

  return {
		mode: modeType,
		entry: entry,
		output: {
      publicPath: '/',
      filename: '[name].[contenthash].js',
			path: isDev ? '/' : pathResolve('../dist'),
      assetModuleFilename: 'images/[hash][ext][query]'
    },
		resolve: {
			mainFields: ['main'],
			extensions: ['.js', '.vue', '.json'],
			modules: [pathResolve('../node_modules')],
			alias: {
        '@scss': pathResolve('../src/common/scss'),
        '@pages': pathResolve('../src/pages'),
        '@views': pathResolve('../src/views'),
        '@components': pathResolve('../src/components')
			},
		},
		module: {
			/*rules: [
				{
					test: /\.vue$/,
					loader: 'vue-loader',
					include: pathSrc
				},
				{
					test: /\.jsx?$/,
					loader: [
						'thread-loader',
						'babel-loader?cacheDirectory=true'
					],
					include: pathSrc
				},
				{
					test: /\.s?css$/,
					include: pathSrc,
					use: [
						isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
						{

							loader: 'css-loader',
							options: {
								importLoaders: 3,
								// esModule: false
							}
						},
						{
							loader: 'postcss-loader',
							options: {
								plugins: [
									require('autoprefixer')()
								]
							}
						},
            'sass-loader',
            {
              loader: 'sass-resources-loader',
              options: {
                resources: [
                  pathResolve('../src/common/scss/variables.scss'),
                  pathResolve('../src/common/scss/mixins.scss'),
                  pathResolve('../src/common/scss/functions.scss'),
                ]
              }
            }
					]
				},
				{
					test: /\.(png|jpe?g|gif|svg|webp)$/i,
          type: 'asset/resource'
				},
				{
					test: /\.(woff|woff2|eot|ttf|otf)$/,
					type: 'asset/resource'
				}
			]*/
		},
    plugins: [
			// new VueLoaderPlugin(),
		].concat(prodPlugins)
     .concat(htmlWebpackPlugins)
	}
};

module.exports = (env) => {
	const baseConfig = config(env);
	const devConfig = require('./webpack.dev.conf');
	const prodConfig = require('./webpack.prod.conf');

	return env.development
          ? merge(baseConfig, devConfig)
          : merge(baseConfig, prodConfig)
};
