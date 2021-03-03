// import "@babel/polyfill"
import axios from 'axios'
import { add2 } from './math2'
// const { add } = require('./math')
import $ from 'jquery'
import img2 from './assets/imgs/u=3584292853,440103369&fm=26&gp=0.jpg'
import './assets/css/test.css'
import './assets/css/test2.less'
import './assets/css/test3.styl'
console.log('hello webpack444!')
/* eslint-disable no-undef */
console.log(add(1, 2))
console.log(add2(3, 4))
/* 测试ES6==>ES5 */
new Promise(() => { })
const fn = () => {
  console.log("fn()")
}
fn()
Array.from(new Set([1, 2]))
class a {
}
/* 测试：打包图片 */
const $img2 = $('<img>').attr('src', img2).addClass('avatar2')
const $img3 = $('<img>').attr('src', img2).addClass('avatar3')
const $div = $('<div></div>').addClass('test')
const $input = $('<input>').addClass('test2')

$('body').append($img2).append($img3).append($div).append($input)
console.log($);
axios({
  url: '/api/user/5',
}).then(
  response => {
    console.log(response);
  }
)
/* 异步加载此模块(懒加载),并单独打包 
  webpackPrefetch: 开启预加载,浏览器空闲时自动加载,兼容性不强
*/
import(/* webpackChunkName: "math" , webpackPrefetch: true */ './math')
  .then(
    (res) => {
      console.log('文件加载成功', res);
    }
  ).catch(() => {
    console.log('文件加载失败');
  })
// 注册 Service Worker
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/service-worker.js')
      .then(() => {
        console.log('SW注册成功');
      }).catch(() => {
        console.log('SW注册失败');
      });
  });
}