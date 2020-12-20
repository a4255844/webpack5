// import "@babel/polyfill"
import { add2 } from './math2'
const { add } = require('./math')
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
console.log("image", img2)
const $img2 = $('<img>').attr('src', img2).addClass('avatar2')
const $img3 = $('<img>').attr('src', img2).addClass('avatar3')
$('body').append($img2).append($img3)

