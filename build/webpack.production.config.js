
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') //新版需要解构赋值
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const AddAssetHtmlWebpackPlugin = require('add-asset-html-webpack-plugin')
const TerserWebpackPlugin = require('terser-webpack-plugin')

const webpack = require('webpack');
const WorkboxPlugin = require('workbox-webpack-plugin')

const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.config')
const { resolve } = require('./utils')



const config = {
  //mode
  mode: 'production',
  //出口
  output: {
    filename: 'js/[name].[contenthash:8].js',
    publicPath: '/'
  },
  //模块加载器
  module: {
    rules: [
      {
        oneOf: [

          // 处理css
          {
            test: /\.css$/,
            use: [
              MiniCssExtractPlugin.loader,   //单独打包css需替换style-loader 
              'css-loader',
              'postcss-loader'
            ]  //从下往上，从右往左   style(css(css文件))
          },

          // 处理less
          {
            test: /\.less$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'less-loader']
          },

          // 处理styl|stylus
          {
            test: /\.styl|stylus$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'postcss-loader', 'stylus-loader']
          },
        ]
      }
    ]
  },
  //插件
  plugins: [
    //自动引入打包的js/css代码的插件 压缩html文件
    new HtmlWebpackPlugin({
      template: 'public/index.html', // 根据此模版生成 HTML 文件
      filename: 'index.html', // 生成后的文件名
      inject: true,
      minify: {
        // 压缩 HTML 文件
        removeComments: true, // 移除 HTML 中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联 css
      },
    }),
    //自动清除dist文件夹内文件的插件
    new CleanWebpackPlugin({
      root: resolve('dist')
    }),
    //单独打包css文件
    new MiniCssExtractPlugin({
      filename: 'css/[name].[contenthash:8].css'
    }),
    //压缩css
    new OptimizeCssAssetsWebpackPlugin(),
    // PWA项目离线加载
    new WorkboxPlugin.GenerateSW({
      // 这些选项帮助快速启用 ServiceWorkers
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true,
    }),
    // dll技术: 把第三方库进行预打包,加快生产环境打包速度
    // 告诉webpack哪些库不参与打包，同时使用时的名称也得变~
    new webpack.DllReferencePlugin({
      manifest: resolve('dll/manifest.json')
    }),
    // 将某个文件打包输出去，并在html中自动引入该资源
    new AddAssetHtmlWebpackPlugin({
      filepath: resolve('dll/*.js')
    })

  ],

  // source-map调试  
  // 测试环境 : 'cheap-module-source-map'  
  // 生产环境 : 'none' //上线后
  devtool: 'none',
  //优化配置
  // 使用 SplitChunksPlugin 去重和分离chunk
  optimization: {
    splitChunks: {
      chunks: 'all' // 将从node_modules引入的模块和异步加载的模块都拆分单独打包
    },
    // 将当前模块的记录其他模块的hash单独打包为一个文件 runtime
    // 解决：修改a文件导致b文件的contenthash变化导致缓存失败
    runtimeChunk: {
      name: entrypoint => `runtime-${entrypoint.name}`
    },
    minimizer: [
      // 配置生产环境的压缩方案：js和css
      new TerserWebpackPlugin({
        // 开启缓存
        cache: true,
        // 开启多进程打包
        parallel: true,
        // 启动source-map
        sourceMap: true
      })
    ]
  },

  /* dll和externals的区别: 使用外部cdn / 使用自己服务器暴露,他们都是提升打包速度 */
  // externals: {
  //   //忽略库名 -- npm包名,通过引入cdn来提升速度
  //   jquery: 'jQuery'
  // }
}
if (process.env.npm_config_report) {
  config.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = merge(baseConfig, config)