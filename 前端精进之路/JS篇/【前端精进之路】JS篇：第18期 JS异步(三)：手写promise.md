[TOC]



## 写在前面

这里是小y🥳，立志成为一名优秀的前端程序媛！！！

本篇文章收录于我的专栏：[前端精进之路](https://blog.csdn.net/weixin_52834435/category_11886356.html?spm=1001.2014.3001.5482)

同时收录于我的[github](https://github.com/mengqiuleo)前端笔记仓库中，持续更新中，欢迎star~

👉[https://github.com/mengqiuleo/myNote](https://github.com/mengqiuleo/myNote)

<hr>
本节会实现手写promise



### 基本实现

我们先定义几种状态

```js
const STATUS = { //存取所需要的状态
  PENDING : 'PENDING',
  FULFILLED : 'FULFILLED',
  REJECTED : 'REJECTED'
}
```

然后声明一个class类：

- 这个类上存在默认状态，成功值，失败值，他们都有对应的初始化的值
- constructor的参数是一个executor函数，这个executor函数有两个参数，分别是resolve和reject函数，所以我们先声明这两个函数。
- 在resolve和reject函数中，我们首先需要判断此时的状态是不是pending，只有在pending状态下我们才可以改变状态为成功或失败，并且赋成功或失败的值。
- 然后我们需要在constructor中默认执行`executor(resolve, reject)`函数。
- then方法中，有两个参数：成功的回调，失败的回调，我们根据状态判断执行哪个

```js
class Promise {
  constructor(executor) {
    this.status = STATUS.PENDING //当前默认状态
    this.value = undefined //成功
    this.reason = undefined //失败
    const resolve = (value) => {
      if(this.status == STATUS.PENDING){ //状态只能改变一次，只有当PENDING时才能改变状态
        this.status = STATUS.FULFILLED
        this.value = value
      }
    }
    const reject = (reason) => {
      if(this.status == STATUS.PENDING){
        this.status = STATUS.REJECTED
        this.reason = reason
      }
    }
    executor(resolve, reject) //执行器函数会默认执行
  }
  
  then(onFulfilled,onRejected){ //成功的回调，失败的回调
      if(this.status == STATUS.FULFILLED){
        onFulfilled(this.value)
      }
      if(this.status == STATUS.REJECTED){
        onRejected(this.reason)
      }
  }
}
```



当我们抛出异常时，也会调用`resolve`：

那就对exector执行器函数的结果使用`try...catch`

如果有错误，调用reject

```js
    try{
      executor(resolve, reject)
    }catch(e){
      reject(e)
    }
```



### 实现异步执行，多次调用promise

举例：

```js
const MyPromise = require('./index.js')
let p = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve('成功')
  }, 1000);
})
p.then((data) => {
  console.log('success: ',data)
},(err) => {
  console.log('failed: ',err)
})
p.then((data) => {
  console.log('success: ',data)
},(err) => {
  console.log('failed: ',err)
})
```

当出现这种情况时，首先会同步执行setTimeout，它会异步执行，此时会跳过它执行下面的代码。

但此时promise的状态还没有改变还是pending，所以`p.then`都不允许被执行。

所以我们需要将`p.then`保存起来，

那么就是在then方法中，判断当状态为pending时，保存里面的成功和失败的回调。因为`p.then`可以重复使用，所以我们需要使用数组保存。其实就是**发布订阅模式**。

```js
class Promise {
  constructor(executor) {
    this.status = STATUS.PENDING //当前默认状态
    this.value = undefined //成功
    this.reason = undefined //失败
+   this.onResolvedCallbacks = [] //存放成功的回调
+   this.onRejectedCallbacks = [] //存放失败的回调
    const resolve = (value) => {
      if(this.status == STATUS.PENDING){ //状态只能改变一次，只有当PENDING时才能改变状态
        this.status = STATUS.FULFILLED
        this.value = value
+       this.onResolvedCallbacks.forEach(fn => fn()) //发布
      }
    }
    const reject = (reason) => {
      if(this.status == STATUS.PENDING){
        this.status = STATUS.REJECTED
        this.reason = reason
+       this.onRejectedCallbacks.forEach(fn => fn()) //发布
      }
    }
    try{
      executor(resolve, reject) //执行器函数会默认执行
    }catch(e){
      reject(e)
    }
  }
  
  then(onFulfilled,onRejected){ //成功的回调，失败的回调
      if(this.status == STATUS.FULFILLED){
        onFulfilled(this.value)
      }
      if(this.status == STATUS.REJECTED){
        onRejected(this.reason)
      }
+    	if(this.status == STATUS.PENDING){
+  			//异步就订阅
+        this.onResolvedCallbacks.push(() => {
+          onFulfilled(this.value)
+        })
+        this.onRejectedCallbacks.push(() => {
+          onRejected(this.value)
+        })
+     }
  }
}
```





### then实现

测试代码

```js
const MyPromise = require('./index.js')
let p = new MyPromise((resolve, reject) => {
    resolve()
})
p.then(data => {
  return 100
}).then(data => {
  console.log(data)
})
```



当第一个then执行结束后，我们希望将then的执行结果传给下一个then。

`onRejected(this.reason)`：它的返回值其实就是一个then的执行结果，我们希望将这个值传递给下一个。所以我们先使用变量x进行承接：`let x = onRejected(this.reason)`

**我们会将这个值包装成一个promise返回，这样就可以实现链式调用**。

我们令这个返回的promise称为`promsie2`，并且将上面的代码放入到这个promise2中，因为promise2的执行器时同步执行，所以并不会影响上面代码的执行时机。

```js
then(onFulfilled,onRejected){ //成功的回调，失败的回调
+  let promise2 = new Promise((resolve,reject) => {
      if(this.status == STATUS.FULFILLED){
+        let x = onFulfilled(this.value)
      }
      if(this.status == STATUS.REJECTED){
+        let x = onRejected(this.reason)
      }
    	if(this.status == STATUS.PENDING){
  			//异步就订阅
        this.onResolvedCallbacks.push(() => {
+          let x = onFulfilled(this.value)
        })
        this.onRejectedCallbacks.push(() => {
+          let x = onRejected(this.value)
        })
      }
+  })
+  return promise2;
}
```



接下来我们实现将then后的返回结果传给下一个then。

既然返回了一个promise2，它的exector执行器函数的返回结果是x，想要把x传给下一个then,不就是相当于调用`promise2.then`吗？想一想，我们是如何调用`promise2.then`的呢？通过`resolve(x)`来将值传递给then。

```js
let x = onFulfilled(this.value)
resolve(x)
```



其实上面我们默认x是一个普通值，但x也可以是一个promise.

如果x是一个promise，那么就不是`resolve(x)`了，传递给下一个then的值应该为当时promise的结果。

并且传递给下一个then，也不一定是传给成功的回调，如果promise(这里的promsie就是x)失败了，那应该传给下一个then的失败的回调

所以我们抽离一个公共的方法来处理x: `resolvePromise(x, promsie2, resolve, reject)`

**resolvePromise函数**：

根据x的值来判断promise2的状态，如果x是普通值，那就调用promise2的resolve，如果x是promise，那就根据它的返回值来使用resolve或reject。

```js
let x = onFulfilled(this.value)
resolvePromise(x,promise2,resolve,reject)
```

但是因为这部分代码放在了promise2的内部，此时promise2还没有构造完毕，还在构造中，所以拿不到promise2，怎么办？
我们可以使用setTimeout包裹，在下一轮执行中拿到promise2.

```js
			setTimeout(() => {
          try{
            let x = onFulfilled(this.value)
            resolvePromise(x,promise2,resolve,reject)
          }catch(e){
            reject(e)
          }
        }, 0);
```

这里加try...catch是因为：和上面的原因差不多，都是判断使用`throw new Error()`的情况。

可能在`let x = onFulfilled(this.value)`的过程中，在执行onFuilled函数中直接报错，那么就直接走catch。

如果有异常，直接调用promise2的reject即可。



还有情况就是：`then().then()`，用户会传输空的then。

这种情况相当于：

```
then(data => data, err => { throw err })
```

判断`then(onFulfilled,onRejected)`是否有成功和失败的回调，要放在then的最开始进行判断。

```js
onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data
onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err }
```

完整代码：

```js
then(onFulfilled,onRejected){
    //如果then().then()，中没有参数，我们要自己加上参数
    onFulfilled = typeof onFulfilled === 'function' ? onFulfilled : data => data
    onRejected = typeof onRejected === 'function' ? onRejected : err => { throw err }

    let promise2 = new Promise((resolve,reject) => {
      if(this.status == STATUS.FULFILLED){
        //...
      }
      if(this.status == STATUS.REJECTED){
        //...
      }
      if(this.status == STATUS.PENDING){
        //...
    })
    return promise2
}
```



此时我们已经完整了then的所有逻辑，还差实现那个resolvePromise函数。

```js
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
```



下面我们来实现`resolvePromise`函数

这个函数的核心功能是判断x是否是promise

```js
// 举例: 比如我们在then中返回一个promise
let promise2 = p.then(data => {
	return new Promise((resolve, reject) => {
		
	})
})
```



首先，防止出现下面这种情况：

```js
let p = new Promise((resolve,reject) => {
	resolve()
})
let promise2 = p.then(() => { //我们声明了一个promise2，并且等待then里面的promise2返回
	return promise2
})
```

上面的这种情况就相当于：我在家里等待我从超市买菜回来。

那么在`resolvePromise`函数中，我们首先判断这种情况：出现该情况报类型错误。

```js
function resolvePromise(x,promise2,resolve,reject){
	if(promise2 == x){ //防止等待自己完成： 没啥用，只是为了规范，没人会这么写
    	return reject(new TypeError('出错了'))
	}
  //...
}
```

接下来判断x是promise还是普通值

```js
if((typeof x === 'object' && x!==null) || typeof x === 'function'){ //x可能是promise，具体还要看有没有then
      let then = x.then //看有没有then方法
      if(typeof then === 'function'){ //x是promise
        //这里x是promise
      } else {
        resolve(x) //没有then，只是个普通对象
      }

}else { //x是普通值
    resolve(x)
}
```

其实上面的逻辑还有个漏洞，在`let then = x.then`的时候，我们想要拿到then方法，但是如果用户的then方法使用了Object.defineProperty设置过不允许读取，那么我们就要抛异常：其实也是为了严谨。

```js
		try{ //可能then被Object.defineProperty设置过不允许读取，那么我们就要抛异常：其实也是为了严谨
      let then = x.then //看有没有then方法
      if(typeof then === 'function'){ //x是promise
        //这里x是promise
      } else {
        resolve(x) //没有then，只是个普通对象
      }

    }catch(e){
      reject(e)
    }
```

如果在拿到then方法的过程中出错，那就直接调用promise2的reject。



如果x是一个promise，那就调用x的then

一般思维是：`x.then`，但是这里我们要使用：`then.call(x)`

这样做的原因是：能保证我们使用上面已经获取到的then，能保证不用再次获取then的值，因为可能在再次获取`x.then`的过程中抛出异常。

```js
        then.call(x, function(y){
					resolve(y)
        }, function(r){
           reject(r)
        })
```

完整代码：

```js
 if((typeof x === 'object' && x!==null) || typeof x === 'function'){ //x可能是promise，具体还要看有没有then
    try{ //可能then被Object.defineProperty设置过不允许读取，那么我们就要抛异常：其实也是为了严谨
      let then = x.then //看有没有then方法
      if(typeof then === 'function'){ //x是promise
+        then.call(x, function(y){
+					 resolve(y)
+        }, function(r){
+           reject(r)
+        })
      } else {
        resolve(x) //没有then，只是个普通对象
      }

    }catch(e){
      reject(e)
    }
  }else { //x是普通值
    resolve(x)
 }
```



我们可能在返回的promise中继续返回一个promise，比如下面的例子：

```js
p.then(data => {
  return new Promise((resolve,reject) => {
    resolve(new Promise((resolve,reject) => {
      resolve('10000')
    }))
  })
})
```

上面的例子对应的源码就是我们在`resolve(y)`中，如果直接`resolve(y)`那就是默认y是个普通值，但是上面说明y也可以是个promise，这里就需要**递归**调用：

```js
        then.call(x, function(y){
					//resolve(y)
          //递归:直到解析出来的结果是一个普通值为止
          resolvePromise(y,promise2,resolve,reject)
        }, function(r){
           reject(r)
        })
```



此时还差最后一步：我们需要保证只能调用一次reject或者一次resolve，即状态只能改变一次。

我们可以使用一个标识变量。

```js
function resolvePromise(x,promise2,resolve,reject){
  if(promise2 == x){ //防止等待自己完成： 没啥用，只是为了规范，没人会这么写
    return reject(new TypeError('出错了'))
  }
  if((typeof x === 'object' && x!==null) || typeof x === 'function'){ //x可能是promise，具体还要看有没有then
+   let called //设置标志变量：只允许走resolve或rejected
    try{ //可能then被Object.defineProperty设置过不允许读取，那么我们就要抛异常：其实也是为了严谨
      let then = x.then //看有没有then方法
      if(typeof then === 'function'){ //x是promise
        then.call(x, function(y){
+          if(called) return //防止多次调用
+          called = true
           //递归:直到它是一个普通值为止
           resolvePromise(y,promise2,resolve,reject)
        }, function(r){
+          if(called) return
+          called = true
           reject(r)
        })
      } else {
         resolve(x) //没有then，只是个普通对象
      }

    }catch(e){
+      if(called) return
+      called = true
       reject(e)
    }
    
   
    
  }else { //x是普通值
    resolve(x)
  }
}
```





### all方法

```js
function isPromise(val){
  return val && (typeof val.then == 'function')
}

Promise.all = function(promises){
  return new Promise((resolve, reject) => {
    let result = [] //结果数组
    let times = 0 //解决多个异步并发问题 要使用计数器
    function processData(index, val){
      result[index] = val //下标要与结果对应
      if(++times === promises.length){ //只有成功的时候才会times++，如果此时全部成功
        resolve(result) //那就调用要返回的新promise的resolve
      }
    }
    for(let i=0; i<promises.length; i++){
      let p = promises[i]
      if(isPromise(p)){ 
        p.then((data) => { //如果当前promise成功，我们需要将该promise的值放入结果数组
          processData(i, data)
        },reject) //这个reject是用的外层的promise：如果失败全部失败
      }else{
        processData(i,p) //普通值
      }
    }
  })
}
```



### finally方法

不论成功或失败都会执行

测试代码：

```js
let p = new Promise((resolve,reject) => {
  reject(1000)
})

p.finally(() => {
  console.log('最终的')
}).catch((e) => {
  console.log(e)
})
```



finally 返回的是一个promise实例

调用finally，相当于是调用这个pormise实例的then方法，无论成功或失败都会执行finally里面的参数。

```js
Promise.prototype.finally = function(callback) {
  return this.then(data => { //this在调用是就是前面的那个promise实例
    callback()
  }, err => {
    callback()
  })
}
```



finally可以返回primise：

```js
//举例
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
})
```



我们对上面的实现方法进行改进：

```js
Promise.prototype.finally = function(callback) {
  return this.then(data => {
    // 让函数执行 内部会调用方法，如果方法是promise需要等到它完成
    return Promise.resolve(callback()).then(() => data)
  }, err => {
    return Promise.resolve(callback()).then(() => { throw err })
  })
}
```





### race方法

```js
Promise.race = function(promises){
  return new Promise((resolve, reject) => {
    for(let i=0;i<promises.length; i++){
      let currentVal = promises[i]
      if(currentVal && typeof currentVal.then == 'function'){
        currentVal.then(resolve, reject) //所有的同时执行，如果当前成功或失败就立即通知调用外层promise的resolve/reject
      } else {
        resolve(currentVal) //普通值
      }
    }
  })
}
```

