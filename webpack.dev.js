/* Get dependencies from webpack.common */
const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");

/* Environment-specific dependencies */
const HtmlWebpackPlugin = require("html-webpack-plugin");
const sveltePreprocess = require('svelte-preprocess');

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
		})
	],
});
