/* Get dependencies from webpack.common */
const path = require("path");
const webpack = require('webpack');
const common = require("./webpack.common");
const { merge } = require("webpack-merge");

/* Environment-specific dependencies */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const sveltePreprocess = require('svelte-preprocess');

let commitHash = require('child_process')
	.execSync('git rev-parse --short HEAD')
	.toString()
	.trim();

let gitTag = require('child_process')
	.execSync('git describe --tags')
	.toString()
	.trim();

module.exports = merge(common, {
	mode: "development",
	devtool: 'source-map',
	devServer: {
		compress: true,
		host: '0.0.0.0',
		port: 4000,
		static: {
			directory: path.join(__dirname, 'dist')
		}
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						compilerOptions: {
							dev: true
						},
						emitCss: false,
						hotReload: true,
						preprocess: sveltePreprocess({ sourceMap: true })
					}
				}
			},
		]
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: "./src/index.html"
		}),
		new webpack.DefinePlugin({
			__COMMIT_HASH__: JSON.stringify(commitHash),
			__GIT_TAG__: JSON.stringify(gitTag),
			__MODE__: JSON.stringify("development")
		})
	],
});
