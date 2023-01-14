/*
 * @Author: Pan Jingyi
 * @Date: 2023-01-14 23:16:41
 * @LastEditTime: 2023-01-15 01:48:17
 */
//test
const p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('no ok')
  }, 1000);
})
const p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('ok')
  }, 2000);
})
Promise.allSettled([p1,p2]).then(data => { //是有顺序的
  console.log(data)
})
/**
[
  { status: 'rejected', reason: 'no ok' },
  { status: 'fulfilled', value: 'ok' }
]
 */


//* 实现
Promise.allSettled = (promises) => {
  let res = [];
  let count = 0;
  return new Promise((resolve, reject) => {
    promises.forEach((item, index) => {
      Promise.resolve(item).then(res => {
        count++;
        res[index] = { status: 'fulfilled', value: res }
        if(count == promises.length) return resolve(res)
      }, err => {
        count++;
        res[index] = { status: 'rejected', reason: err }
        if(count == promises.length) return resolve(res)
      })
    });
  })
}