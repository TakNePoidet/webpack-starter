const path = require('path');
const fs = require('fs');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const WebpackBar = require('webpackbar');
const WebpackAssetsManifest = require('webpack-assets-manifest');
const CopyPlugin = require('copy-webpack-plugin');
const { VueLoaderPlugin } = require('vue-loader');
const ESLintPlugin = require('eslint-webpack-plugin');
const FriendlyErrorsWebpackPlugin = require('friendly-errors-webpack-plugin');
const HTMLWebpackPlugin = require('html-webpack-plugin');
const TerserPlugin = require('terser-webpack-plugin');
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
const CompressionPlugin = require('compression-webpack-plugin');
const HtmlWebpackPugPlugin = require('html-webpack-pug-plugin');
const ImageMinimizerPlugin = require('image-minimizer-webpack-plugin');
const DotenvWebpack = require('dotenv-webpack');
const { merge } = require('webpack-merge');
const {
	ids: { HashedModuleIdsPlugin },
	EnvironmentPlugin
} = require('webpack');
const notifier = require('node-notifier');

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

const generateHtmlPlugins = (
	entryFolder = path.join(__dirname, 'src/templates/views'),
	test = /\.(pug|html)$/
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

	return (
		scanFolder(entryFolder).map((pathfile) => {
			const template = path.relative(__dirname, pathfile);

			return new HTMLWebpackPlugin({
				filename: template
					.replace('src/templates/views/', '')
					.replace(test, '.html'),
				template
			});
		}) ?? new HTMLWebpackPlugin()
	);
};

module.exports = (env) => {
	const isDev = env.WEBPACK_BUNDLE !== true;
	const commonConfig = {
		entry: {
			index: './src/js/index.ts'
		},
		output: {
			publicPath: '/',
			path: path.join(__dirname, 'dist')
		},
		module: {
			rules: [
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
				},
				{
					test: /\.jsx?$/,
					exclude: /node_modules/,
					use: [
						{
							loader: 'babel-loader',
							options: { configFile: path.resolve(__dirname, './.babelrc') }
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
										basedir: path.resolve(__dirname, './src')
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
				context: './src',
				extensions: ['.js', '.ts', '.vue']
			}),
			new FriendlyErrorsWebpackPlugin({
				// compilationSuccessInfo: {
				// 	messages: ['You application is running here http://localhost:3000'],
				// 	notes: ['Some additionnal notes to be displayed unpon successful compilation']
				// },
				onErrors(severity, errors) {
					if (severity !== 'error') {
						return;
					}
					const error = errors[0];

					console.log(severity, error);
					notifier.notify({
						title: 'Webpack error',
						message: `${severity}: ${error.name}`,
						subtitle: error.file || ''
					});
				},
				clearConsole: false,
				additionalFormatters: [],
				additionalTransformers: []
			}),
			new VueLoaderPlugin(),
			new WebpackBar(),
			new EnvironmentPlugin({
				NODE_ENV: 'production',
				DEBUG: false
			}),
			new HashedModuleIdsPlugin({
				hashFunction: 'sha256',
				hashDigest: 'hex',
				hashDigestLength: 20
			}),
			new WebpackAssetsManifest({
				writeToDisk: true,
				output: path.join(__dirname, './dist/assets/assets-manifest.json'),
				entrypoints: true,
				transform(assets) {
					const entrypoints = {};

					// eslint-disable-next-line no-restricted-syntax
					for (const key of Object.keys(assets.entrypoints)) {
						if (Object.hasOwnProperty.call(assets.entrypoints, key)) {
							const element = assets.entrypoints[key];
							const { js, css } = element.assets;

							entrypoints[key] = {
								css,
								js
							};
						}
					}
					return entrypoints;
				}
			}),
			new WebpackAssetsManifest({
				writeToDisk: true,
				output: path.join(__dirname, 'dist/assets/manifest.json')
			}),
			new CopyPlugin({
				patterns: [{ from: './static', to: '.' }]
			})
		],
		resolve: {
			extensions: ['.js', '.ts', '.jsx', '.tsx'],
			alias: {
				'~': path.resolve(__dirname, './src'),
				'~js': path.resolve(__dirname, './src/js'),
				'~libs': path.resolve(__dirname, './src/js/libs'),
				'~type': path.resolve(__dirname, './src/js/types'),
				'~interface': path.resolve(__dirname, './src/js/interface'),
				'~style': path.resolve(__dirname, './src/style'),
				'~fonts': path.resolve(__dirname, './src/fonts'),
				'~images': path.resolve(__dirname, './src/images'),
				'~components': path.resolve(__dirname, './src/js/components')
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

	if (isDev) {
		return merge(commonConfig, {
			mode: 'development',
			// watch: true,
			devtool: 'source-map',
			output: {
				filename: 'assets/js/[name].js'
			},
			devServer: {
				contentBase: path.join(__dirname, 'dist'),
				compress: true,
				port: 8081,
				open: false
			}
		});
	}
	return merge(commonConfig, {
		mode: 'production',
		output: {
			filename: 'assets/js/[name]-[contenthash].js'
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
			})
		]
	});
};
