/*
 * @Author: Pan Jingyi
 * @Date: 2022-10-19 15:07:20
 * @LastEditTime: 2022-10-19 16:22:23
 */
const MyPromise = require('./index.js')
let p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 1000);
})
p.then((data) => {
  console.log('success: ',data)
},(err) => {
  console.log('failed: ',err)
})
p.then((data) => {
  console.log('success: ',data)
},(err) => {
  console.log('failed: ',err)
})

Promise.resolve('123').then((data) => {
  console.log(data)
})