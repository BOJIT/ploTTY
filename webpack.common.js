/* Common dependencies */
const path = require('path');
const webpack = require('webpack');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');

let commitHash = require('child_process')
	.execSync('git rev-parse --short HEAD')
	.toString()
	.trim();

let gitTag = require('child_process')
	.execSync('git describe --tags')
	.toString()
	.trim();

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
			"fs": false
		}
	},
	output: {
		path: path.join(__dirname, '/dist'),
		filename: '[name].[contenthash].js',
		clean: true
	},
	module: {
		rules: [
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
		}),
		new webpack.DefinePlugin({
			__COMMIT_HASH__: JSON.stringify(commitHash),
			__GIT_TAG__: JSON.stringify(gitTag)
		})
	]
};
