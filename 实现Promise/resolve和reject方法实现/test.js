const Promise = require('./promise.js')

let p = new Promise((resolve, reject) => {
  // throw new Error('error');
  reject('失败了')
  resolve('成功了')
});
p.then((data) => {
  console.log('success', data)
}, (reason) => {
  return new Promise((resolve, reject) => {
    console.log('fail', reason)
    reject()
  })
}).then((data) => {
  console.log('链式调用：',data);
}, (reason) => {
  console.log('链式调用：',reason)
})

//--------------------------------
let p1 = new Promise((resolve, reject) => {
  resolve('ok')
}).then().then().then().then(data => {
  console.log(data)
})


//-------------Promise其他方法----------------
Promise.resolve('123').then((data) => {
  console.log(data)
})
Promise.reject('456').catch(data => {
  console.log(data)
})