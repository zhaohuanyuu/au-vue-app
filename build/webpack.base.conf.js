const glob = require('glob');
const webpack = require('webpack');
const merge = require('webpack-merge');
const svgToMiniDataURI = require('mini-svg-data-uri');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader/lib/plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const HardSourceWebpackPlugin = require('hard-source-webpack-plugin');

const { pathResolve } = require('./config-utils');

const config = env => {
	const isDev = env === 'development';
	const isProd = env === 'production';
	const pathSrc = pathResolve('../src');

	console.log(glob.sync(`${pathResolve('../src')}/**/*.vue`, { nodir: true }));

	const prodPlugins = [];
	// 生产环境单独提取css
	isProd && prodPlugins.push(
	  new MiniCssExtractPlugin({
      name: '[name].[contenthash].[ext]'
    }),
    // new PurgecssPlugin({
    //   paths: glob.sync(`${pathSrc}/**/*.vue`, { nodir: true }),
    //   // whitelistPatterns: [ /-(leave|enter|appear)(|-(to|from|active))$/, /^(?!(|.*?:)cursor-move).+-move$/, /^router-link(|-exact)-active$/, /data-v-.*/ ]
    // })
  );

	return {
		mode: env,
		entry: pathResolve('../src'),
		output: {
			path: pathResolve('../dist'),
			filename: '[name].[hash].js'
		},
		resolve: {
			mainFields: ['main'],
			extensions: ['.vue', '.js', '.json'],
			modules: [pathResolve('../node_modules')],
			alias: {
        '@scss': pathResolve('../src/scss'),
        '@views': pathResolve('../src/views'),
				'@components': pathResolve('../src/components')
			},
		},
		module: {
			rules: [
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
                  pathResolve('../src/scss/variables.scss'),
                  pathResolve('../src/scss/mixins.scss'),
                  pathResolve('../src/scss/functions.scss'),
                ]
              }
            }
					]
				},
				{
					test: /\.(png|jpe?g|gif|webp)$/i,
					use: [
						{
							loader: 'url-loader',
							options: {
								limit: 8192,
								esModule: false,
								outputPath: 'images',
								name: '[name].[hash:7].[ext]',
							},
						},
            {
              loader: 'image-webpack-loader',
              options: {
                mozjpeg: {
                  progressive: true,
                  quality: 65
                },
                optipng: {
                  enabled: false,
                },
                pngquant: {
                  quality: [0.65, 0.90],
                  speed: 4
                },
                gifsicle: {
                  interlaced: false,
                },
                webp: {
                  quality: 75
                }
              }
            }
					],
				},
				{
					test: /\.svg$/i,
					use: [
						{
							loader: 'url-loader',
							options: {
								generator: (content) => svgToMiniDataURI(content.toString()),
							},
						},
					],
				},
				{
					test: /\.(woff|woff2|eot|ttf|otf)$/,
					loader: 'url-loader',
					include: pathSrc,
					options: {
						limit: 4096,
						name: '[name].[contenthash:5].[ext]',
						outputPath: 'fonts'
					}
				}
			]
		},
		plugins: [
			new VueLoaderPlugin(),
      new CleanWebpackPlugin(),
			new HtmlWebpackPlugin({
        title: 'au-vue-app',
        chunk: ['vendor', 'style'],
				favicon: pathResolve('../public/assets/favicon.ico'),
        template: pathResolve('../public/index.html'),
        files: {
          css: pathResolve('../src/scss/base.scss')
        }
			}),
      new HardSourceWebpackPlugin(),
		].concat(prodPlugins),
    stats: {
		  colors: {
        green: '\u001b[32m'
      }
    }
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
