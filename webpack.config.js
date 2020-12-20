const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
module.exports = {
  //mode
  // mode: 'development',
  //入口
  entry: path.resolve(__dirname, 'src/index.js'),
  //出口
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    publicPath: '/'
  },
  //模块加载器
  module: {
    rules: [
      {
        enforce: "pre", // 前置loader, 最先执行
        test: /\.js$/,
        // exclude: /node_modules/,
        include: path.resolve(__dirname, 'src'),
        loader: "eslint-loader",
        options: {
          formatter: require("eslint-friendly-formatter")
        }
      },
      //ES6==>ES5
      {
        test: /\.m?js$/,  //匹配文件的正则
        // exclude: '', //排除的文件夹
        include: [path.resolve(__dirname, 'src')],  //指定匹配文件夹,效率更高
        use: ['babel-loader'],
        //如果use是对象，可以直接在对象内写options
        // use: {  //一个loader使用对象，多个使用数组
        //   loader: 'babel-loader',
        //   options: {     //配置对象可以单独写在bable.config.js内或json
        //     presets: [],
        //     plugins: []
        //   }
        // }
      },
      //处理图片
      {
        test: /\.(png|jpe?g|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 1024 * 30,  //把小于30kb的文件转换成beas64编码
            name: 'img/[name].[ext]' //name哈希变化
          }
        }
      },
      //处理字体
      {
        test: /\.(woff2?|eot|ttf|otf)(\?.*)?$/, // 字体
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              name: 'fonts/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      //处理音视频
      {
        test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)(\?.*)$/,
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 10240,
              name: 'static/media/[name].[hash:8].[ext]'
            }
          }
        ]
      },
      // 处理css
      {
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,   //单独打包需替换style-loader
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
  },
  //插件
  plugins: [
    //自动引入打包的js/css代码的插件
    new HtmlWebpackPlugin({
      template: 'public/index.html'
    }),
    //自动清除dist文件夹内文件的插件
    new CleanWebpackPlugin(['dist']),
    //单独打包css文件
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    })

  ],
  //开发服务器
  devServer: {
    open: true
  },
  //优化配置
  optimization: {
    //压缩css
    minimizer: [new OptimizeCssAssetsWebpackPlugin()]
  }
}