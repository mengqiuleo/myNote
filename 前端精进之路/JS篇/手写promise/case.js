/*
 * @Author: Pan Jingyi
 * @Date: 2022-10-19 15:07:20
 * @LastEditTime: 2022-10-21 19:20:10
 */
const MyPromise = require('./index.js')
let p = new MyPromise((resolve, reject) => {
  resolve(new Promise((resolve,reject) => {
    setTimeout(() => {
      new Promise((resolve,reject) => {
        resolve('1000')
      })
    }, 1000);
  }))
})
p.then(data => {
  return 100
}).then(data => {
  console.log(data)
})

p.then(data => {
  return new Promise((resolve,reject) => {
    resolve(new Promise((resolve,reject) => {
      resolve('10000')
    }))
  })
})

p.then((data) => {
  console.log('success: ',data)
},(err) => {
  console.log('failed: ',err)
})

Promise.resolve('123').then((data) => {
  console.log(data)
})