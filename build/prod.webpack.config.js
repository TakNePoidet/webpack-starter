const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const { merge } = require('webpack-merge');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { EnvironmentPlugin } = require('webpack');
const { styleRules, commonConfig } = require('./common.webpack.config');

module.exports = merge(commonConfig, {
	mode: 'production',
	output: {
		filename: 'assets/js/[name]-[contenthash].js',
		publicPath: '/webpack-starter/'
	},
	module: {
		rules: [...styleRules({ isDev: false })]
	},
	watch: false,
	optimization: {
		minimize: true,
		minimizer: [
			new TerserPlugin({
				parallel: true,
				extractComments: false,
				terserOptions: {
					compress: {
						// unsafe: true,
						inline: true,
						passes: 1,
						keep_fargs: false,
						drop_console: true
					},
					output: {
						beautify: false,
						comments: false
					},
					mangle: true
				}
			})
		]
	},
	plugins: [
		new CleanWebpackPlugin(),
		new CompressionPlugin(),
		new MiniCssExtractPlugin({
			filename: 'assets/style/[name]-[contenthash].css',
			chunkFilename: 'assets/style/[name]-[contenthash].css'
		}),
		new ImageMinimizerPlugin({
			test: /\.(jpe?g|png|gif|svg)$/i,
			exclude: [/sprite.svg/],
			deleteOriginalAssets: true,
			minimizerOptions: {
				plugins: [
					['gifsicle', { interlaced: true }],
					['jpegtran', { progressive: true }],
					['optipng', { optimizationLevel: 5 }],
					['svgo', {}]
				]
			}
		}),
		new EnvironmentPlugin({
			NODE_ENV: 'production',
			DEBUG: false
		})
	]
});
