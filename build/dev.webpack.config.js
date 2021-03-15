const { merge } = require('webpack-merge');
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { EnvironmentPlugin } = require('webpack');
const { styleRules, commonConfig } = require('./common.webpack.config');

module.exports = merge(commonConfig, {
	mode: 'development',
	devtool: 'source-map',
	output: {
		filename: 'assets/js/[name].js'
	},
	module: {
		rules: [...styleRules({ isDev: true })]
	},
	devServer: {
		contentBase: path.join(__dirname, '../dist'),
		compress: true,
		port: 8081,
		open: true
	},
	plugins: [
		new EnvironmentPlugin({
			NODE_ENV: 'development',
			DEBUG: true
		})
	]
});
