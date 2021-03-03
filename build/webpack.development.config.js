
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { merge } = require('webpack-merge')
const baseConfig = require('./webpack.base.config')

const config = {
  //mode
  mode: 'development',
  //出口
  output: {
    filename: '[name].js',
    publicPath: '/'
  },
  //模块加载器
  module: {
    rules: [


      // 处理css
      {
        test: /\.css$/,
        use: [
          'style-loader',
          'css-loader',
          'postcss-loader'
        ]  //从下往上，从右往左   style(css(css文件))
      },

      // 处理less
      {
        test: /\.less$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'less-loader']
      },

      // 处理styl|stylus
      {
        test: /\.styl|stylus$/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'stylus-loader']
      },
    ]
  },
  //插件
  plugins: [
    //自动引入打包的js/css代码的插件
    new HtmlWebpackPlugin({
      template: 'public/index.html', // 根据此模版生成 HTML 文件
      filename: 'index.html', // 生成后的文件名
      inject: true, // 自动引入打包文件
    })
  ],
  //映射代码,方便调试
  devtool: 'cheap-module-eval-source-map',
  //开发服务器
  devServer: {
    port: 8081,
    open: true,  //自动打开浏览器
    // quiet: true, // 减少打包日志输出
    hot: true,  //热膜替换
    //配置代理解决开发环境ajax跨域
    proxy: {
      // 处理以/api开头路径的请求
      '/api': {
        target: 'http://localhost:4000', // 转发的目标地址
        pathRewrite: {
          '^/api': ''  // 转发请求时去除路径前面的/api
        },
        changeOrigin: true, // 支持跨域, 如果协议/主机也不相同, 必须加上
      },
    },
    // 解决history路由刷新404问题
    historyApiFallback: true,
    //mock数据接口
    before: function (app, server) {
      // 注册路由
      app.get('/api/user/:id', function (req, res) {
        res.json({ code: 0, data: { id: req.params.id, username: 'tom' } });
      });
    }
  },
}
module.exports = merge(baseConfig, config)
