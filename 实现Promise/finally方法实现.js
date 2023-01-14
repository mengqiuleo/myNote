/*
 * @Author: Pan Jingyi
 * @Date: 2023-01-14 16:39:17
 * @LastEditTime: 2023-01-15 01:39:56
 */

/**
 * finally相当于独自美丽
 */
Promise.resolve(123).finally((data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('ok')
    }, 2000);
  })
}).then(data => { //*这里的then接收的参数不是上面返回的promise的参数，而是 Promise.resolve(123)的参数
  console.log(data) //123
})

//finally里面如果返回的promise是失败的，下面的then也会走失败
Promise.resolve(456).finally(data => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject('err')
    }, 5000);
  })
}).then(data => {
  console.log(data)
}, err => {
  console.log('err: ', err) //*走这里
})

//# 实现
Promise.prototype.finally = function(callback){
  return this.then(data => {
    return Promise.resolve(callback()).then(() => data)
    //注意看：这里成功的值拿到的是this.then的data，而不是前面的callback的值
    //这就证明了：如果finally里面的promise是成功的，向下传递的并不是它的成功值
  }, err => {
    return Promise.resolve(callback()).then(() => {
      //注意，这里也就证明了：它如果失败，值是会向下传递的
      throw err
    })
  })
}