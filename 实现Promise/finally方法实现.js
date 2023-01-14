Promise.resolve(123).finally((data) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve('ok')
    }, 5000);
  })
}).then(data => { //*这里的then接收的参数不是上面返回的promise的参数，而是 Promise.resolve(123)的参数
  console.log(data) //123
})

//finally里面如果返回的promise是失败的，下面的then也会走失败
Promise.resolve(123).finally(data => {
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
  }, err => {
    return Promise.resolve(callback()).then(() => {
      throw err
    })
  })
}