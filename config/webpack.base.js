const path = require('path')
const htmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin') // css抽离
const chalk = require('chalk')
const ProgressBarPlugin = require('progress-bar-webpack-plugin') // 编译进度条
const CopyPlugin = require("copy-webpack-plugin");

// package 中的 KEY_PATH 必须填，当活文档 ??
var KEY_PATH = process.env.KEY_PATH;
var SLASH_KEY_PATH = KEY_PATH == "vec" ? "" : "/" + KEY_PATH;
var isDev = process.env.mode === 'dev'

const getPath = pathname => path.resolve(__dirname, pathname)

module.exports = {
  resolve: {
    // 配置路径别名
    alias: {
      '@': getPath("../src")
    },
    extensions: ['.js', '.jsx', '.json']
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/
      },
      {
        test: /\.(le|c)ss$/,
        exclude: /node_modules/,
        use: [
          'style-loader',
          MiniCssExtractPlugin.loader,
          'css-loader',
          'postcss-loader',
          // 当解析antd.less，必须写成下面格式，否则会报Inline JavaScript is not enabled错误
          { loader: 'less-loader', options: { lessOptions: { javascriptEnabled: true } } },
        ],
      },
      {
        test: /\.(png|jpe?g|svg|gif)$/,
        exclude: /node_modules/,
        type: 'asset/inline',
      },
      {
        test: /\.(eot|ttf|woff|woff2)$/,
        type: 'asset/resource',
        generator: {
          filename: 'fonts/[hash][ext][query]',
        },
      },
      {
        test: /\.s[ac]ss$/i,
        exclude: /node_modules/,
        use: [
          // 将 JS 字符串生成为 style 节点
          isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
          // 将 CSS 转化成 CommonJS 模块
          'css-loader',
          // 将 Sass 编译成 CSS
          'sass-loader',
        ],
      },
      {
				test: require.resolve("underscore"),
        loader: "expose-loader",
        options: {
          exposes: ['_'],
        },
			},
      {
				test: require.resolve("../src/ws/webim.config.js"),
				loader: "expose-loader",
        options: {
          exposes: ['WebIM']
        }
			},
      {
				test: [
					/plugin(\\|\/)+index\.js$/
				],
        exclude: /node_modules/,
				loader: "string-replace-loader",
        options: {
          search: "__WEBIM_SLASH_KEY_PATH__",
					replace: SLASH_KEY_PATH,
        }
			},
    ],
  },
  plugins: [
    new htmlWebpackPlugin({
      title: '环信客服',
      filename: 'index.html',
      template: getPath('../public/index.html'),
      excludeChunks: ['easemobvec']
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractPlugin({
      filename: './css/[name].css',
    }),
    // 进度条
    new ProgressBarPlugin({
      format: `  :msg [:bar] ${chalk.green.bold(':percent')} (:elapsed s)`,
    }),
    // 复制文件
    new CopyPlugin({
      patterns: [
        { from: getPath('../src/libs'), to: getPath('../build/js') },
        { from: getPath('../public/demo.html'), to: getPath('../build')}
      ],
    }),
  ],
}

