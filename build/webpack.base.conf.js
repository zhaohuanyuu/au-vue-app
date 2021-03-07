const glob = require('glob');
const webpack = require('webpack');
const { merge } = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackTagsPlugin = require('html-webpack-tags-plugin');
const CopyPlugin = require('copy-webpack-plugin');
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
	const pathNodeModule = pathResolve('../node_modules');

	const prodPlugins = [];
  // 生产环境单独提取css
  if (isProd) {
    prodPlugins.push(
      new CleanWebpackPlugin(),
      new MiniCssExtractPlugin({
        filename: '[name].[contenthash].[ext]',
        chunkFilename: '[id].[contenthash].[ext]'
      })
    );
  }

  let entry = [pathResolve('../src'), 'webpack-hot-middleware/client'];
  let htmlWebpackPlugins = [
    new HtmlWebpackPlugin({
      title: 'au-vue-app',
      chunk: ['vendor', 'styles'],
      favicon: pathResolve('../public/assets/myicon.ico'),
      template: pathResolve('../public/index.html'),
    }),
    new CopyPlugin({
      patterns: [
        {
          from: pathResolve('../static'),
          to: 'static'
        }
      ]
    }),
    // new HtmlWebpackTagsPlugin({
    //   append: true,
    //   links: 'static/css/base.css',
    //   attributes: {
    //     type: 'css'
    //   }
    // })
  ];

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
			path: pathResolve('../dist'),
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
			rules: [
				{
					test: /\.vue$/,
					include: pathSrc,
          exclude: pathNodeModule,
					loader: 'vue-loader',
				},
				{
					test: /\.jsx?$/,
					include: pathSrc,
          exclude: pathNodeModule,
          use: [
            'thread-loader',
            'babel-loader?cacheDirectory=true'
          ],
        },
        {
					test: /\.s?css$/,
					include: pathSrc,
          exclude: pathNodeModule,
          use: [
						isDev ? 'vue-style-loader' : MiniCssExtractPlugin.loader,
						{

							loader: 'css-loader',
							options: {
								importLoaders: 3,
							}
						},
						{
							loader: 'postcss-loader',
							options: {
                postcssOptions: {
                  plugins: [
                    require('autoprefixer')()
                  ]
                }
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
			]
		},
    plugins: [
			new VueLoaderPlugin(),
		].concat(prodPlugins)
     .concat(htmlWebpackPlugins)
	}
};

module.exports = (env) => {
	const baseConfig = config(env);
	const devConfig = require('./webpack.dev.conf');
	const prodConfig = require('./webpack.prod.conf');

	// console.log(merge(baseConfig, devConfig));

	return env.development
          ? merge(baseConfig, devConfig)
          : merge(baseConfig, prodConfig)
};
