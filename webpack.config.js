const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const {CleanWebpackPlugin} = require('clean-webpack-plugin')
const CopyWebPackPlugin = require('copy-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const isDev = process.env.NODE_ENV === 'development'

const optimization = _ => {
	const config = {
		splitChunks: {
			chunks: 'all'
		}
	}

	if(!isDev){
		config.minimizer = [
			new OptimizeCssAssetWebpackPlugin,
			new TerserWebpackPlugin
		]
	}

	return config
}

const cssLoaders = extra => {
	const loaders = [{
		loader: MiniCssExtractPlugin.loader,
		options: {
			hmr: isDev,
			reloadAll: true
		}
	}, 'css-loader']

	if(extra){
		loaders.push(extra)
	}

	return loaders;
}

module.exports = {
	context: path.resolve(__dirname, 'src'),
	mode: 'development',
	entry: ['@babel/polyfill', './index.js'],
	output: {
		filename: '[hash].js',
		path: path.resolve(__dirname, 'build')
	},
	plugins: [
		new HtmlWebpackPlugin({
			template: './index.html',
			minify: {
				collapseWhitespace: !isDev // minify index.html if production
			}
		}),
		new CleanWebpackPlugin(),
		new CopyWebPackPlugin({
			patterns: [
				{from: path.resolve(__dirname, 'src/favicon.ico'),
				 to: path.resolve(__dirname, 'build')}
			]
		}),
		new MiniCssExtractPlugin({
			filename: '[hash].css'
		})
	],
	optimization: optimization(),
	resolve: {
		alias: {
			'@': path.resolve(__dirname, 'src'),
			'@assets': path.resolve(__dirname, 'src/assets'),
			'@components': path.resolve(__dirname, 'src/components'),
			'@styles': path.resolve(__dirname, 'src/styles'),
		},
	},
	devServer: {
		port: 3000
	},
	module: {
		rules: [
			{test: /\.css$/, use: cssLoaders()},
			{test: /\.s[ac]ss$/i, use: cssLoaders('sass-loader')},
			/*
			{test: /\.less$/i, use: cssLoaders('less-loader')},
			*/
			{test: /\.(png|jpg|svg|gif)$/, use: ['file-loader']},
			{test: /\.(ttf|woff|woff2|eot)$/, use: ['file-loader']},
			{
				test: /\.js$/, exclude: /node_modules/, 
				loader: {
					loader: 'babel-loader',
					options: {
						presets: [
							'@babel/preset-env'
						],
						plugins: [
							'@babel/plugin-proposal-class-properties'
						]
					}
				}}
		]
	}
}