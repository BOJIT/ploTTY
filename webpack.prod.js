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
			name: 'ploTTY',
			orientation: 'portrait',
			display: 'standalone',
			start_url: './',
			scope: '.',
			short_name: 'ploTTY',
			description: 'Browser Based Serial Monitor/Plotter that doesn\'t suck!',
			background_color: '#2b3534',
			theme_color: '#2b3534',
			icons: [
				{
					src: "./src/assets/favicon/icon_x72.png",
					size: "72x72",
					destination: "assets",
					type: "image/png",
					purpose: "maskable"
				},
				{
					src: "./src/assets/favicon/icon_x96.png",
					size: "96x96",
					destination: "assets",
					type: "image/png",
					purpose: "maskable"
				},
				{
					src: "./src/assets/favicon/icon_x128.png",
					size: "128x128",
					destination: "assets",
					type: "image/png",
					purpose: "maskable"
				},
				{
					src: "./src/assets/favicon/icon_x192.png",
					size: "192x192",
					destination: "assets",
					type: "image/png",
					purpose: "maskable"
				},
				{
					src: "./src/assets/favicon/icon_x384.png",
					size: "384x384",
					destination: "assets",
					type: "image/png",
					purpose: "maskable"
				},
				{
					src: "./src/assets/favicon/icon_x512.png",
					size: "512x512",
					destination: "assets",
					type: "image/png",
					purpose: "maskable"
				}
			],
			}),
		new WorkboxWebpackPlugin.GenerateSW({
			clientsClaim: true,
			skipWaiting: true
		})
	]
});
