/**
 * 只要参数实例有一个变成fulfilled状态，包装实例就会变成fulfilled状态；
 * 只有当所有参数实例都变成rejected状态，包装实例就会变成rejected状态。
 */
//* 实现
Promise.any = function(promises){
  let res = []
  let count = 0
  return new Promise((resolve, reject) => {
    promises.forEach((item, index) => {
      Promise.resolve(item).then(res => {
        resolve(res)
      }, err => {
        res[index] = { status: 'rejected', reason: err }
        count++;
        if(count == promises.length) return reject(new Error('没有Promise ok'))
      })
    });
  })
}


//test1
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('no ok')
  }, 1000);
})
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('ok')
  }, 2000);
})
Promise.any([p1, p2]).then(data => { 
  console.log(data)
}, err => {
  console.log(err)
})

// 答案：[AggregateError: All promises were rejected]

//test2
const p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('no ok')
  }, 1000);
})
const p4 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('ok')
  }, 2000);
})
Promise.any([p3, p4]).then(data => { 
  console.log(data)
}, err => {
  console.log(err)
})
//答案： OK


