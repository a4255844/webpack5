
const webpack = require('webpack')

const { resolve } = require('./utils') //处理路径的工具函数

module.exports = {
  // 指定打包的基础目录的绝对路径(默认是执行命令的目录)
  context: resolve(''),
  //入口
  entry: resolve('src'),  //单入口[name].前缀main
  // entry: { //多入口模式,打包文件前缀app ==>自己设置的
  //   app: resolve('src')
  // },
  //出口
  output: {
    path: resolve('dist'),
  },
  //模块加载器
  module: {
    rules: [
      {
        enforce: "pre", // 前置loader, 最先执行
        test: /\.js$/,
        // exclude: /node_modules/,
        include: resolve('src'),
        loader: "eslint-loader",
        options: {
          formatter: require("eslint-friendly-formatter")
        }
      },
      //ES6==>ES5

      {
        test: /\.m?js$/,  //匹配文件的正则
        // exclude: '', //排除的文件夹
        include: [resolve('src')],  //指定匹配文件夹,效率更高
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
      {
        oneOf: [
          //处理图片
          {
            test: /\.(png|jpe?g|gif|svg)$/,
            use: [
              {
                loader: 'url-loader',
                options: {
                  limit: 1024 * 8,  //把小于8kb的文件转换成beas64编码
                  esModule: false,  // 关闭url-loader的es6模块化,否则影响html-loader
                  name: 'img/[hash:8].[ext]' //name哈希变化
                },
              },
              // 用 img-loader 压缩图片
              {
                loader: "img-loader",
                options: {
                  plugins: [
                    require("imagemin-pngquant")({
                      //压缩 png 的插件
                      speed: 4, // 取值范围 1-11  值越大压缩率越小 ，值越小压缩生成的文件越小 默认为4
                    }),
                    require("imagemin-gifsicle")({
                      // 压缩 gif 插件
                      optimizationLevel: 1, // 取值范围 1、2、3 默认1   3极限压缩,压缩和图片效果不好，使用默认1就行
                    }),
                    require("imagemin-mozjpeg")({
                      // 压缩 jpg 插件
                      quality: 50, // 1-100   值越大压缩率越小 ，值越小压缩生成的文件越小
                    }),
                  ],
                },
              }
            ]
          },
          //// 处理html文件的img图片（负责引入img，从而能被url-loader进行处理
          {
            test: /\.html$/,
            loader: 'html-loader'
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
        ]
      },

    ]
  },
  //插件
  plugins: [
    //打包文件显示进度
    new webpack.ProgressPlugin(),

  ],
}
