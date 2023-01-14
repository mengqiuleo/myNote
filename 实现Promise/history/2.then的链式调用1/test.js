const Promise = require('./promise.js')

let p = new Promise((resolve, reject) => {
  // throw new Error('error');
  reject('失败了')
  resolve('成功了')
});
p.then((data) => {
  console.log('success', data)
}, (reason) => {
  console.log('fail', reason)
}).then((data) => {
  console.log('链式调用：',data);
}, (reason) => {
  console.log('链式调用：',reason)
})
console.log(2)