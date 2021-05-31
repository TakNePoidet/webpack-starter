const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBar = require('webpackbar');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const CopyPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const ESLintPlugin = require('eslint-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const DotenvWebpack = require('dotenv-webpack');
const WebpackChunksAssetsManifest = require('webpack-chunks-assets-manifest');
const { EnvironmentPlugin } = require('webpack');
const {
	ids: { HashedModuleIdsPlugin }
} = require('webpack');

const styleLoader = ({ isDev }, ...extra) => [
	isDev
		? 'style-loader'
		: {
				loader: MiniCssExtractPlugin.loader,
				options: {}
		  },
	{
		loader: 'css-loader',
		options: {
			sourceMap: isDev
		}
	},
	{
		loader: 'postcss-loader',
		options: {}
	},
	...extra
];

const styleRules = ({ isDev = false }) => [
	{
		test: /\.css$/,
		use: styleLoader({ isDev })
	},
	{
		test: /\.s(c|a)ss$/,
		use: styleLoader(
			{ isDev },
			{
				loader: 'sass-loader',
				options: {
					sourceMap: isDev,
					webpackImporter: true
				}
			}
		)
	}
];
const generateHtmlPlugins = (
	entryFolder = path.resolve(__dirname, '../src/templates/views'),
	test = /\.(pug|html)$/,
	options = {}
) => {
	function scanFolder(folder, files = []) {
		// eslint-disable-next-line no-restricted-syntax
		for (const item of fs.readdirSync(folder)) {
			const pathfile = `${folder}/${item}`;

			if (fs.lstatSync(pathfile).isDirectory()) {
				files.push(...scanFolder(pathfile));
			} else if (test.exec(pathfile)) {
				files.push(pathfile);
			}
		}
		return files;
	}
	if (fs.existsSync(entryFolder)) {
		const files = scanFolder(entryFolder);

		if (files.length > 0) {
			return scanFolder(entryFolder).map((pathfile) => {
				const template = path.resolve(__dirname, pathfile);

				return new HTMLWebpackPlugin({
					filename: template.replace(`${entryFolder}/`, './').replace(test, '.html'),
					template
				});
			});
		}
	}

	return [new HTMLWebpackPlugin()];
};

exports.styleRules = styleRules;

exports.commonConfig = {
	entry: {
		index: './src/js/index.ts'
	},
	output: {
		publicPath: '/',
		path: path.join(__dirname, '../dist')
	},
	module: {
		rules: [
			{
				test: /\.jsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'babel-loader',
						options: { configFile: path.resolve(__dirname, '../.babelrc') }
					}
				]
			},
			{
				test: /\.tsx?$/,
				exclude: /node_modules/,
				use: [
					{
						loader: 'ts-loader',
						options: {
							transpileOnly: true
						}
					}
				]
			},
			{
				test: /\.vue$/,
				loader: 'vue-loader'
			},
			{
				test: /\.(png|jpe?g|svg|gif)$/,
				exclude: [/\.(inline.svg)$/],
				loader: 'file-loader',
				options: {
					limit: 8192,
					name: '[name]-[contenthash].[ext]',
					outputPath: 'assets/images',
					esModule: false,
					useRelativePath: true
				}
			},
			{
				test: /\.(inline.svg)$/,
				loader: 'svg-inline-loader',
				options: {
					removeSVGTagAttrs: false
				}
			},
			{
				test: /\.(woff(2)?|ttf|eot)(\?v=\d+\.\d+\.\d+)?$/,
				loader: 'file-loader',
				options: {
					name: '[name]-[contenthash].[ext]',
					outputPath: 'assets/font',
					esModule: false
				}
			},
			{
				test: /\.html$/i,
				use: [
					{
						loader: 'html-loader',
						options: {
							esModule: false
						}
					}
				]
			},
			{
				test: /\.pug$/,
				oneOf: [
					{
						resourceQuery: /^\?vue/,
						use: ['pug-plain-loader']
					},
					{
						use: [
							{
								loader: 'html-loader',
								options: {
									esModule: false
								}
							},

							{
								loader: 'pug-html-loader',
								options: {
									pretty: true,
									basedir: path.resolve(__dirname, '../src')
								}
							}
						]
					}
				]
			}
		]
	},
	plugins: [
		...generateHtmlPlugins(),
		new HtmlWebpackPugPlugin(),
		new DotenvWebpack(),
		new ESLintPlugin({
			context: '../src',
			extensions: ['.js', '.ts', '.vue']
		}),
		new VueLoaderPlugin(),
		new WebpackBar(),
		new HashedModuleIdsPlugin({
			hashFunction: 'sha256',
			hashDigest: 'hex',
			hashDigestLength: 20
		}),
		new WebpackChunksAssetsManifest({
			writeToDisk: true,
			output: path.join(__dirname, '../dist/assets/chunks-manifest.json')
		}),
		new WebpackAssetsManifest({
			writeToDisk: true,
			output: path.join(__dirname, '../dist/assets/manifest.json')
		}),
		new CopyPlugin({
			patterns: [
				{
					from: './static',
					to: '.',
					filter(resourcePath) {
						const relativePath = resourcePath.replace(path.join(__dirname, '../static', '/'), '');
						if (['README.md'].includes(relativePath)) {
							return false;
						}
						return true;
					}
				}
			]
		}),
		new EnvironmentPlugin({
			__BROWSER__: JSON.stringify(true),
			'process.client': JSON.stringify(true),
			'process.server': JSON.stringify(false)
		})
	],
	resolve: {
		extensions: ['.js', '.ts', '.jsx', '.tsx'],
		alias: {
			'@': path.resolve(__dirname, '../src'),
			'@js': path.resolve(__dirname, '../src/js'),
			'@libs': path.resolve(__dirname, '../src/js/libs'),
			'@types': path.resolve(__dirname, '../src/js/types'),
			'@style': path.resolve(__dirname, '../src/style'),
			'@fonts': path.resolve(__dirname, '../src/fonts'),
			'@images': path.resolve(__dirname, '../src/images'),
			'@components': path.resolve(__dirname, '../src/js/components'),
			'@store': path.resolve(__dirname, '../src/js/store'),
			'@pages': path.resolve(__dirname, '../src/js/pages')
		}
	},
	optimization: {
		runtimeChunk: {
			name: `runtime`
		},
		splitChunks: {
			chunks: 'async',
			maxAsyncRequests: Infinity,
			cacheGroups: {
				vendors: {
					test: /[\\/]node_modules[\\/]/,
					name: 'vendor',
					chunks: 'initial'
				}
			}
		}
	}
};
