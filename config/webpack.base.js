const path = require("path");
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { isDev } = require('../scripts/constants');
const config = require("./config");

const APP_PATH = path.resolve(__dirname, '../src');
const APP_PATH_COM = path.resolve(__dirname, '../src/components');

const getCssLoaders = (importLoaders) => [
	'style-loader',
	{
		loader: 'css-loader',
		options: {
			modules: {
				localIdentName: '[local]__[hash:base64:5]',
			},
			sourceMap: isDev,
			importLoaders,
		},
	},
	'postcss-loader',
];

module.exports = {
	devtool: 'cheap-module-eval-source-map',
	entry: path.resolve(__dirname, '../example/src/index.tsx'),
	output: {
		filename: 'static/js/[name].[chunkhash:8].js', // 每个输出js的名称
		path: path.resolve(__dirname, '../build'), // 打包的出口文件夹路径
		clean: true, // webpack4需要配置clean-webpack-plugin删除dist文件，webpack5内置了。
		publicPath: '/', // 打包后文件的公共前缀路径
	},
	resolve: {
		extensions: ['.json', '.tsx', '.ts', '.jsx', '.js'],
		alias: {
			'@src': APP_PATH,
			'@components': APP_PATH_COM,
		},
		modules: [path.resolve(__dirname, '../node_modules')],
	},
	module: {
		rules: [
			{
				test: /\.(tsx?|js)$/,
				loader: 'babel-loader',
				options: {cacheDirectory: true},
				exclude: /node_modules/,
			},
			{
				test: /\.css$/,
				use: getCssLoaders(1),
			},
			{
				test: /\.less$/,
				use: [
                    "style-loader",
                    'css-loader',
                    'postcss-loader',
                    {
                        loader: 'less-loader',
                        options: {
                            lessOptions: {
                                javascriptEnabled: true
                            }
                        }
                    }
                ]
			},
			// 处理图片、文件、字体
			{
				test: /\.(png|svg|jpg|jpeg|gif)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.(woff|woff2|eot|ttf|otf)$/i,
				type: 'asset/resource',
			},
			{
				test: /\.txt/,
				type: 'asset/source',
			},
			{
				// 通用文件则使用 asset，此时会按照默认条件自动决定是否转换为 Data URI
				test: /\.(?:ico|gif|png|jpg|jpeg)$/i,
				type: 'asset',
				parser: {
					// 如果文件大小小于 8kb，那么会转换为 data URI，否则为单独文件。
					// 8kb 是默认值，你可以根据需要进行调整
					dataUrlCondition: {
						maxSize: 8 * 1024, // 8kb
					},
				},
			},
		],
	},
	plugins: [
		new HtmlWebpackPlugin({
			inject: true,
            template: config.indexPath,
			filename: 'index.html',
			cache: false,
			minify: isDev
				? false
				: {
						removeAttributeQuotes: true,
						collapseWhitespace: true,
						removeComments: true,
						collapseBooleanAttributes: true,
						collapseInlineTagWhitespace: true,
						removeRedundantAttributes: true,
						removeScriptTypeAttributes: true,
						removeStyleLinkTypeAttributes: true,
						minifyCSS: true,
						minifyJS: true,
						minifyURLs: true,
						useShortDoctype: true,
					},
		}),
	],
	// 开启webpack持久化存储缓存
    cache: {
        type: "filesystem", // 使用文件缓存
    },
};
