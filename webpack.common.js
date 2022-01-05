/* Common dependencies */
const path = require('path');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const { ModuleFilenameHelpers } = require('webpack');

module.exports = {
	entry: {
		'bundle': ['./src/main.ts']
	},
	resolve: {
		alias: {
			svelte: path.dirname(require.resolve('svelte/package.json')),
			src: path.resolve(__dirname, 'src/')
		},
		extensions: ['.mjs', '.js', '.ts', '.svelte'],
		mainFields: ['svelte', 'browser', 'module', 'main'],
		fallback: {
			"fs": false,
			"path": require.resolve('path-browserify')
		}
	},
	output: {
		path: path.join(__dirname, '/dist'),
		filename: '[name].[contenthash].js'
	},
	module: {
		rules: [
			// Don't use NoFlo's Component Loader
			{
				test: /noflo([\\]+|\/)lib([\\]+|\/)loader([\\]+|\/)register.js$/,
				use: [
					{
						loader: 'noflo-component-loader',
							options: {
							graph: null,
							debug: false,
							baseDir: path.resolve(__dirname, 'src/editor/components/'),
							manifest: {
								runtimes: ['noflo'],
								discover: false,
							},
							runtimes: [
								'noflo-browser',
							],
						},
					},
				],
			},
			// KlayJS Web Worker
			{
				test: /klay\.js$/,
				type: 'asset/resource',
				generator: {
					filename: 'worker/[name].js'
				}
			},
			{
				test: /\.ts$/,
				loader: 'ts-loader',
				exclude: /node_modules/
			},
			{
				test: /\.css$/,
				use: [
					MiniCssExtractPlugin.loader,
					'css-loader'
				]
			},
			{
				test: /\.scss$/,
				use: [
					MiniCssExtractPlugin.loader,
					"css-loader",
					"sass-loader"
				]
			},
			{
				test: /\.html$/,
				use: [
					"html-loader"
				]
			},
			{
				test: /\.(ico|svg|png|jpg|gif)$/,
				type: 'asset/resource',
				generator: {
					filename: 'assets/[name].[hash][ext]'
				}
			},
			{
				test: /.(ttf|otf|eot|woff(2)?)(\?[a-z0-9]+)?$/,
				type: 'asset/resource',
				generator: {
					filename: 'fonts/[name].[hash][ext]'
				}
			},
			{
				// required to prevent errors from Svelte on Webpack 5+
				test: /node_modules\/svelte\/.*\.mjs$/,
				resolve: {
					fullySpecified: false
				}
			}
		]
	},
	plugins: [
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].css'
		})
	]
};
