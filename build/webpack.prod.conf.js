const TerserPlugin = require('terser-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

const { pathResolve } = require('./utils');

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
				cache: true,   // 启用文件缓存
				parallel: true,  // 使用多进程并行执行任务来提高构建效率
				sourceMap: true,  // 将错误消息位置映射到模块
				terserOptions: {
					drop_console: true,  // 打包时剔除所有console.log
					drop_debugger: true  // 打包时剔除所有debugger
				}
			}),
			new OptimizeCssAssetsPlugin({})
		]
	}
};