/*
 * @Author: Pan Jingyi
 * @Date: 2022-10-19 14:55:13
 * @LastEditTime: 2022-10-21 16:41:32
 */
const STATUS = { //存取所需要的状态
  PENDING : 'PENDING',
  FULFILLED : 'FULFILLED',
  REJECTED : 'REJECTED'
}

function resolvePromise(x,promise2,resolve,reject){
  if(promise2 == x){ //防止等待自己完成： 没啥用，只是为了规范，没人会这么写
    return reject(new TypeError('出错了'))
  }
  if((typeof x === 'object' && x!==null) || typeof x === 'function'){ //x可能是promise，具体还要看有没有then
    let called //设置标志变量：只允许走resolve或rejected
    try{ //可能then被Object.defineProperty设置过不允许读取，那么我们就要抛异常：其实也是为了严谨
      let then = x.then //看有没有then方法
      if(typeof then === 'function'){ //x是promise
        then.call(x, function(y){
          if(called) return
          called = true
          //递归:直到它是一个普通值为止
          resolvePromise(y,promise2,resolve,reject)
        }, function(r){
          if(called) return
          called = true
          reject(r)
        })
      } else {
        resolve(x) //没有then，只是个普通对象
      }

    }catch(e){
      if(called) return
      called = true
      reject(e)
    }
    
   
    
  }else { //x是普通值
    resolve(x)
  }
}

class Promise {
  constructor(executor) {
    this.status = STATUS.PENDING //当前默认状态
    this.value = undefined //成功
    this.reason = undefined //失败
    this.onResolvedCallbacks = [] //存放成功的回调
    this.onRejectedCallbacks = []
    const resolve = (value) => {
      if(value instanceof Promise){
        return value.then(resolve, reject)
      }

      if(this.status == STATUS.PENDING){
        this.status = STATUS.FULFILLED
        this.value = value
        this.onResolvedCallbacks.forEach(fn => fn())
      }
    }
    const reject = (reason) => {
      if(this.status == STATUS.PENDING){
        this.status = STATUS.REJECTED
        this.reason = reason
        this.onRejectedCallbacks.forEach(fn => fn())
      }
    }
    try{
      executor(resolve, reject)
    }catch(e){
      reject(e)
    }
  }
  then(onFulfilled,onRejected){
    //如果then().then()，中没有参数，我们要自己加上参数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err }

    let promise2 = new Promise((resolve,reject) => {
      if(this.status == STATUS.FULFILLED){
        setTimeout(() => {
          try{
            let x = onFulfilled(this.value)
            resolvePromise(x,promise2,resolve,reject)
          }catch(e){
            reject(e)
          }
        }, 0);
      }
      if(this.status == STATUS.REJECTED){
        setTimeout(() => {
          try{
            let x = onRejected(this.reason)
            resolvePromise(x,promise2,resolve,reject)
          }catch(e){
            reject(e)
          }
        }, 0);
      }
      if(this.status == STATUS.PENDING){
        this.onResolvedCallbacks.push(() => {
          setTimeout(() => {
            try{
              let x = onFulfilled(this.value)
              resolvePromise(x,promise2,resolve,reject)
            }catch(e){
              reject(e)
            }
          }, 0);
        })
        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try{
              let x = onRejected(this.reason)
              resolvePromise(x,promise2,resolve,reject)
            }catch(e){
              reject(e)
            }
          },0)
        })
      }
    })
    return promise2
  }
  catch(err){
    return this.then(null, err)
  }
  static resolve(val){
    return new Promise((resolve,reject) => {
      resolve(val)
    })
  }
  static reject(reason){
    return new Promise((resolve,reject) => {
      reject(reason)
    })
  }
}

module.exports = Promise