const STATUS = {
  PENDING: 'PENDING',
  FULFILLED: 'FULFILLED',
  REJECTED: 'REJECTED'
}
function resolvePromise(x,promise2,resolve,reject){
  if(promise2 == x){ //严谨：一般人不会这么写
    return reject(new TypeError('出错了，循环引用'))
  }
  if((typeof x === 'object' && x!==null) || typeof x === 'function'){
    let called;//then中的返回值是x，如果x是promise,那么我们只允许promise状态改变一次，called就是实现这个的
    try{
      let then = x.then;
      if(typeof then == 'function'){ //如果有then方法表示是一个promise
        then.call(x, function(y){ //最外层then的返回值是 x，如果 x 是一个promise，那么整体的then的返回值取决于里面的promise的返回值，即调用 x.then
          if(called) return;
          called = true;
          resolvePromise(y,promise2,resolve,reject); //如果 x.then 的返回值还是一个Promise，继续递归
        }, function(r){
          if(called) return;
          called = true;
          reject(r)
        })
      }else{
        if(called) return;
        called = true;
        resolve(x) //说明是一个普通对象
      }
    }catch(e){
      reject(e)
    }
  }else{
    resolve(x) //x是一个普通值，直接包装成resolve的promise
  }
}
class Promise{
  constructor(executor){
    this.status = STATUS.PENDING;
    this.value = undefined;
    this.reason = undefined;
    this.onResolvedCallbacks = [];
    this.onRejectedCallbacks = []; 
    const resolve = (val) => {
      if(val instanceof Promise){ //针对Promise.resolve()方法传入的是promise
        return val.then(resolve, reject)
      }

      if(this.status == STATUS.PENDING){
        this.status = STATUS.FULFILLED;
        this.value = val;
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }
    const reject = (reason) => {
      if(this.status == STATUS.PENDING){
        this.status = STATUS.REJECTED;
        this.reason = reason;
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    try{ //executor函数是立即执行的，为了处理executor函数中抛异常的情况，使用 try-catch
      executor(resolve,reject);
    }catch(e){
      reject(e)
    }
  }

  then(onFulfilled, onRejected){
    // then的第二个参数是可以不传的，如果不传我们自动补全
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data
    onRejected = typeof onRejected === 'function' ? onRejected : err => {throw err}

    // then返回的是一个promise
    let promise2 = new Promise((resolve, reject) => {
      if(this.status == STATUS.FULFILLED){
        setTimeout(() => {
          try{
            let x = onFulfilled(this.value); //then的返回值取决于里面的东西是不是promise，然后执行当前then的 resolve和reject
            resolvePromise(x,promise2,resolve,reject)
          }catch(e){
            reject(e)
          }
        }, 0);
      }
      if(this.status == STATUS.REJECTED){
        setTimeout(() => {
          try{
            let x = onRejected(this.reason);
            resolvePromise(x,promise2,resolve,reject)
          }catch(e){
            reject(e)
          }
        }, 0);
      }
      //下面这种情况适用于当executor函数中出现定时器时，定时器放到下一轮执行，那么整体代码继续向下执行，
      //就会走到then，但是此时还不允许执行then方法，处于pending状态，先把两个函数保存起来
      //使用发布订阅，先把函数存到两个数组中，
      //然后在上面的 resolve和reject函数中：在resolve 和 reject函数中使得状态发生变化，然后then中的函数放到下一轮执行，我们使用定时器实现下一轮执行
      if(this.status == STATUS.PENDING){ 
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try{
              let x = onFulfilled(this.value);
              resolvePromise(x,promise2,resolve,reject)
            }catch(e){
              reject(e)
            }
          }, 0);
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try{
              let x = onRejected(this.reason);
              resolvePromise(x,promise2,resolve,reject)
            }catch(e){
              reject(e)
            }
          }, 0);
        })
      }
    })

    return promise2;
  }

  catch(err){
    return this.then(null,err)
  }

  static resolve(val){
    return new Promise((resolve, reject) => {
      resolve(val)
    })
  }
  static reject(reason){
    return new Promise((resolve, reject) => {
      reject(reason)
    })
  }
}
module.exports = Promise;