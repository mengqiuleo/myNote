# 【promise】注意点

### 一、promise异常穿透

- 当使用 promise 的 then 链式调用时, 可以在最后指定失败的回调
- 前面任何操作出了异常, 都会传到最后失败的回调中处理

在.then()中, 我们经常传入onResolved用以处理成功时的数据, 一般不在then里面传入onRejected, 而处理失败的数据一般放在最后的.catch()中:

```js
// 现在执行失败:
new Promise((resolve, reject) => {
  reject('失败了')
}).then(
  (data) => { console.log('onResolved1', data)},
).then(
  (data) => { console.log('onResolved2', data)},
).then(
  (data) => { console.log('onResolved3', data)},
).catch(
  (err) => { console.log('onRejected1', data)},
)
```

上述例子中, 一开始 reject就接收了失败的数据, 而数据最终也会通过.catch中的回调函数进行处理, 但是这里我想说明的是, 这个失败的数据是一下子就直接进入了.catch吗? 显然不是的, 既然是链式调用, 那必定也是一层层的传过去了, 但是在.then()中并没有传入处理失败数据的回调, 为什么还会正常往下传递呢? 其实, 当我们在.then()中, 不写第二个参数时, 默认是这样的:

```js
.then(
(data) => { ...处理data },
// 不写第二个参数, 相当于默认传了:
(err) => Promise.reject(err), 
// 或
(err) => { throw err; }
).then()
```

这就是为什么链式调用时, 能在最后写.catch() 还能拿到数据的原因了



### 二、多个 .catch

```js
var p = new Promise((resolve, reject) => {
  return Promise.reject(Error('The Fails!'))
})
p.catch(error => console.log(error.message))
p.catch(error => console.log(error.message))
```

以上代码并不会执行p.catch，也不会执行两次。

真正的打印结果：`UnhandledPromiseRejectionWarning: Error: The Fails!`

解释：使用 Promise 构造函数时，必须调用 `resolve()` 或 `reject()` 回调。 Promise 构造函数不使用你的返回值，因此实际上不会再收到由 `Promise.reject()` 创建的其他 Promise。

在 `Promise.reject()` 之后没有 `.catch` 时，答案是 `UnhandledPromiseRejectionWarning`。



### 三、try-catch 能抛出 promise 的异常吗

```js
try {
 throw new Error('1')
} catch(error) {
 console.log(error)
}
```

这是最常见的 try-catch，会 log 下面的内容：

```
Error: 1
```

注意，这里并不是红色的，因为 js 异常被捕获后，js 是能够正常往下执行的，如果没有被捕获的话，那么 js 将抛出异常，js 执行将会停止！



另一个例子：

```js
// 异步，宏任务
try {
 setTimeout(function() {
  console.log(b);
 }, 0);
} catch (error) {
 console.log(error); // 这里是不会执行的
}
console.log('out try catch')
```

此时会抛出错误，catch后面的代码都不会执行

```
ReferenceError: b is not defined
```



另一个例子：

```js
// 异步，微任务
try {
 new Promise(() => {
  throw new Error('new promise throw error');
 });
} catch (error) {
 console.log(error);
}
```

此时也会抛出错误

```
 UnhandledPromiseRejectionWarning: Error: new promise throw error
```

**解释：**

try-catch 主要用于捕获异常，注意，这里的异常，是指同步函数的异常，如果 try 里面的异步方法出现了异常，此时**catch 是无法捕获到异常的**。

原因是因为：当异步函数抛出异常时，对于宏任务而言，执行函数时已经将该函数推入栈，此时并不在 try-catch 所在的栈，所以 try-catch 并不能捕获到错误。对于微任务而言，比如 promise，promise 的构造函数的异常只能被自带的 reject 也就是.catch 函数捕获到。


**解决方案：**

**对于异步函数-宏任务**

window 有全局的错误捕获函数 onerror

```js
try {
 setTimeout(function() {
  console.log(b);
 }, 0);
} catch (error) {
 console.log(error); // 这里是不会执行的
}
window.onerror = function() {
 console.log(...arguments)
}
```

这时，是可以捕获到比如 setTimeout 的回调函数异常的，这里可以针对全局的异常做一些处理，比如数据上报等。



**对于异步函数-微任务**

对于微任务，js 有专门捕获没有写 catch 的 promise，如下：

```js
window.addEventListener('unhandledrejection', function() {
 console.log(...arguments)
})
```



### 四、try-catch的异常只会抛出一层，不会冒泡

try-catch 中的异常只会抛出一层，即不会冒泡，也就是如果你有多层的 try-catch 然后异常已经被内层的 catch 捕获了，外层的 catch 是捕获不到异常的

```js
try {
  try {
    throw new Error('oops');
  }
  catch (ex) {
    console.error('inner', ex.message);
  }
  finally {
    console.log('finally');
  }
}
catch (ex) {
  console.error('outer', ex.message);
}

//inner oops
//finally
```

解决方案是可以在内层的 catch 再手动 throw 出异常



### 五、try catch 注意点

> try...catch能捕获的异常必须是线程执行进入到try...catch且try...catch未执行完的时候抛出来。

#### 1. 进入之前

语法异常在语法检查阶段就报错了，线程尚未进入try...catch代码块，所以无法捕获到异常。

```javascript
try {
    a.
}catch(e) {
    console.log('error-------', e);
}

// 执行结果：
VM483:3 Uncaught SyntaxError: Unexpected token '}'
```

#### 2. 进入之中

代码报错的时候，线程处于try...catch之中，能够捕获到异常。

```javascript
try {
    a.b
}catch(e) {
    console.log('error-------', e);
}

VM488:4 error------- ReferenceError: a is not defined
```

#### 3. 进入之后

代码报错的时候，线程已经执行完try...catch，这种无法捕获异常。

```javascript
try {
    setTimeout(() => {
        a.b = 1;
    }, 1000)
}catch(e) {
    console.log('error---------', e);
}


// 执行结果：
VM544:3 Uncaught ReferenceError: a is not defined
```



4.async...await 捕获异常

> async...await捕获异常，需要将await函数写在try...catch中。

```js
async function f2() {
    try{
        await Promise.reject(new Error('await出错'));
    }catch(e) {
        console.log(111, e);
    }
}
f2();

//执行结果：
111 Error: await出错 at f2 (<anonymous>:3:30)
```

