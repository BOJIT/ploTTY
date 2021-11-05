/* Get dependencies from webpack.common */
const path = require("path");
const common = require("./webpack.common");
const { merge } = require("webpack-merge");

/* Environment-specific dependencies */
const TerserPlugin = require("terser-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const sveltePreprocess = require('svelte-preprocess');
const WebpackPwaManifest = require('webpack-pwa-manifest');
const WorkboxWebpackPlugin = require('workbox-webpack-plugin');

module.exports = merge(common, {
	mode: "production",
	devtool: false,
	performance: {
		hints: false,
		maxEntrypointSize: 512000,
		maxAssetSize: 512000
	},
	optimization: {
		minimizer: [
			new TerserPlugin({
				extractComments: false,
			}),
			new HtmlWebpackPlugin({
				template: "./src/index.html",
				minify: {
					removeAttributeQuotes: true,
					collapseWhitespace: true,
					removeComments: true
				}
			})
		],
	},
	module: {
		rules: [
			{
				test: /\.svelte$/,
				use: {
					loader: 'svelte-loader',
					options: {
						compilerOptions: {
							dev: false
						},
						emitCss: true,
						hotReload: false,
						preprocess: sveltePreprocess({ sourceMap: false })
					}
				}
			},
		]
	},
	plugins: [
		new WebpackPwaManifest({
			publicPath: './',
			name: 'NPI Logger App',
			orientation: 'portrait',
			display: 'standalone',
			start_url: '.',
			short_name: 'NPI Logger App',
			description: 'PWA for offline logging of data in the field.',
			background_color: '#2c2c2c',
			theme_color: '#2c2c2c',
			icons: [
				{
					src: "./src/assets/favicon/apple-touch-icon.png",
					size: "180x180",
					destination: "assets"
				},
				{
					src: "./src/assets/favicon/android-chrome-192x192.png",
					size: "192x192",
					destination: "assets"
				},
				{
					src: "./src/assets/favicon/android-chrome-512x512.png",
					size: "512x512",
					destination: "assets"
				}
			],
			}),
		new WorkboxWebpackPlugin.GenerateSW({
			clientsClaim: true,
			skipWaiting: true
		})
	]
});
