/*
 * @Author: Pan Jingyi
 * @Date: 2022-10-21 19:48:10
 * @LastEditTime: 2022-10-21 20:15:22
 */
// finally 不论成功或失败都会执行


let p = new Promise((resolve,reject) => {
  reject(1000)
})

p.finally(() => {
  console.log('finally')
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('ok')
    }, 3000);
  })
}).catch((e) => {
  console.log(e)
})

Promise.prototype.finally = function(callback) {
  return this.then(data => {
    // 让函数执行 内部会调用方法，如果方法是promise需要等到它完成
    return Promise.resolve(callback()).then(() => data)
  }, err => {
    return Promise.resolve(callback()).then(() => {
      throw err
    })
  })
}