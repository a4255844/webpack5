const path = require('path')

const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { CleanWebpackPlugin } = require('clean-webpack-plugin') //新版需要解构赋值
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const OptimizeCssAssetsWebpackPlugin = require('optimize-css-assets-webpack-plugin')
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer')
const WorkboxPlugin = require('workbox-webpack-plugin')


const config = {
  //mode
  mode: 'production',
  //入口
  entry: path.resolve(__dirname, 'src/index.js'),
  //出口
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'js/[name].[contenthash:8].js',
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
        // thread-loader: 开启多线程打包,启动开销大,不适合小型项目
        use: ['thread-loader', 'babel-loader'],
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
        use: [
          {
            loader: 'url-loader',
            options: {
              limit: 1024 * 8,  //把小于8kb的文件转换成beas64编码
              name: 'img/[hash:8].[ext]' //name哈希变化
            },
          },
          //压缩图片
          {
            loader: 'image-webpack-loader',
            options: {
              // 压缩 jpg/jpeg 图片
              mozjpeg: {
                progressive: true,
                quality: 65 // 压缩率
              },
              // 压缩 png 图片
              pngquant: {
                quality: [0.65, 0.90],
                speed: 4
              }
            }
          },
        ]
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
  },
  //插件
  plugins: [
    //自动引入打包的js/css代码的插件 压缩html文件
    new HtmlWebpackPlugin({
      template: 'public/index.html', // 根据此模版生成 HTML 文件
      minify: {
        // 压缩 HTML 文件
        removeComments: true, // 移除 HTML 中的注释
        collapseWhitespace: true, // 删除空白符与换行符
        minifyCSS: true // 压缩内联 css
      },
      // filename: 'index.html', // 生成后的文件名
    }),
    //自动清除dist文件夹内文件的插件
    new CleanWebpackPlugin(),
    //单独打包css文件
    new MiniCssExtractPlugin({
      filename: 'css/[name].css'
    }),
    //压缩css
    new OptimizeCssAssetsWebpackPlugin(),
    //打包文件显示进度
    new webpack.ProgressPlugin(),
    //PWA项目离线加载
    new WorkboxPlugin.GenerateSW({
      // 这些选项帮助快速启用 ServiceWorkers
      // 不允许遗留任何“旧的” ServiceWorkers
      clientsClaim: true,
      skipWaiting: true,
    }),



  ],
  //开发服务器
  devServer: {
    port: 3000,
    open: true,  //自动打开浏览器
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
    // historyApiFallback: true,
    historyApiFallback: { // 所有前台404的请求都返回index页面
      rewrites: [
        { from: /.*/, to: '/index.html' }
      ],
    },
    //mock数据接口
    before: function (app, server) {
      // 注册路由
      app.get('/api/user/:id', function (req, res) {
        res.json({ code: 0, data: { id: req.params.id, username: 'tom' } });
      });
    }
  },
  //映射代码,方便调试
  // 开发环境 : 'cheap-module-eval-source-map'
  // 测试环境 : 'cheap-module-source-map'
  // 生产环境 : 'none'
  devtool: 'cheap-module-eval-source-map',
  //优化配置
  // 使用 SplitChunksPlugin 去重和分离chunk
  optimization: {
    splitChunks: {
      chunks: 'all' // 将从node_modules引入的模块和异步加载的模块都拆分单独打包
    }
  },
}
if (process.env.npm_config_report) {
  config.plugins.push(new BundleAnalyzerPlugin())
}

module.exports = config

/*
  webpack性能优化
    文件资源缓存:当服务器设置了强制缓存后,如果被打包的文件名不发生变化,则会走缓存
     hash: 每次webpack构建时会生成一个唯一的hash值,每次重新打包,所有文件名都会发生改变
           缺点: 如果我只更新了js代码, 那么css文件名也会发生改变,导致服务器缓存失效
           适用于图片,音视频等资源
     chunkhash: 根据chunk生成的hash值,打包来源所属于同一个chunk,那么hash值就一样
                问题和hash一样,css代码是在js中被引入的,所属于同一个chunk
    首选==>  上线代码缓存使用
    contenthash: 根据文件内容生成的hash值,不同的文件hash值一定不一样,当文件发生变化时,hash值也会变,文件不变,hash也不会变

    tree shaking: (摇树)去除无用代码
         前提: 1.必须使用ES6模块化  2. 开启production环境
         作用: 减少代码体积,但会误删除部分文件例如
         在package.json中配置
        "sideEffects": false   所有代码都没有副作用(都可以进行tree shaking)
            问题:可能会把css/ @babel/polyfill(副作用) 文件干掉
        "sideEffects": ["*.css", './src/xxx.js']  //指定那些文件不需要tree shaking
    code split : 代码分隔
      入口起点：使用 entry 配置手动地分离代码
          指定entry值为对象,配置多个入口
      使用 SplitChunksPlugin 插件 去重和分离chunk
        1.可以将node_modules中的代码单独打包一个chunk最终输出
        2.自动分析多入口chunk中,有没有公共的文件,如果有会打包成单独一个chunk
      动态导入：通过模块中的内联函数调用来分离代码。
        import()  在js内被动态引入的模块会单独打包
           只有执行import()时才请求加载打包文件, 也就是懒加载
           (  webpackChunkName: "home" ) 魔法注释 可以指定文件名
           他返回一个promise
           正常加载:(并行加载) 与其他资源一同加载
           预加载:prefetch: 等其他资源加载完毕,浏览器空闲了,在偷偷加载资源
           ( webpackPrefetch: true) : 兼容性不是很好 ,而懒加载没有兼容性问题
 */