# async 与 await

[TOC]



## async 函数

1. 函数的返回值为promise 对象
2. promise 对象的结果由async 函数执行的返回值决定

```js
async function main() {
  return 1
}

let result = main();
console.log(result);
/*
Promise
[[Prototype]]: Promise
[[PromiseState]]: "fulfilled"
[[PromiseResult]]: 1
*/
```

### 用法

`async`函数返回一个 Promise 对象。

`async`函数内部`return`语句返回的值，会成为`then`方法回调函数的参数。

```javascript
async function f() {
  return 'hello world';
}

f().then(v => console.log(v))
// "hello world"
```

上面代码中，函数`f`内部`return`命令返回的值，会被`then`方法回调函数接收到。

`async`函数内部抛出错误，会导致返回的 Promise 对象变为`reject`状态。抛出的错误对象会被`catch`方法回调函数接收到。

```javascript
async function f() {
  throw new Error('出错了');
}

f().then(
  v => console.log('resolve', v),
  e => console.log('reject', e)
)
//reject Error: 出错了
```

> 只有`async`函数内部的异步操作执行完，才会执行`then`方法指定的回调函数。



正常情况下，`await`命令后面是一个 Promise 对象，返回该对象的结果。如果不是 Promise 对象，就直接返回对应的值。

```javascript
async function f() {
  // 等同于
  // return 123;
  return await 123;
}

f().then(v => console.log(v))
// 123
```

上面代码中，`await`命令的参数是数值`123`，这时等同于`return 123`。

另一种情况是，`await`命令后面是一个`thenable`对象（即定义了`then`方法的对象），那么`await`会将其等同于 Promise 对象。

```javascript
class Sleep {
  constructor(timeout) {
    this.timeout = timeout;
  }
  then(resolve, reject) {
    const startTime = Date.now();
    setTimeout(
      () => resolve(Date.now() - startTime),
      this.timeout
    );
  }
}

(async () => {
  const sleepTime = await new Sleep(1000);
  console.log(sleepTime);
})();
// 1000
```

上面代码中，`await`命令后面是一个`Sleep`对象的实例。这个实例不是 Promise 对象，但是因为定义了`then`方法，`await`会将其视为`Promise`处理。





## await 表达式

1. await 右侧的表达式一般为promise 对象, 但也可以是其它的值
2. 如果表达式是promise 对象, await 返回的是promise 成功的值
3. 如果表达式是其它值, 直接将此值作为await 的返回值

**总结：**

- 通常使用await是后面会跟上一个表达式，这个表达式会返回一个Promise；那么await会等到Promise的状态变成fulfilled状态，之后继续执行异步函数；
-  如果await后面是一个普通的值，那么会直接返回这个值；
-  如果await后面是一个thenable的对象，那么会根据对象的then方法调用来决定后续的值；
-  如果await后面的表达式，返回的Promise是reject的状态，那么会将这个reject结果直接作为函数的Promise的reject值；



### 注意

1. await 必须写在async 函数中, 但async 函数中可以没有await
2. 如果await 的promise 失败了, 就会抛出异常, 需要通过try...catch 捕获处理

```js
async function main() {
  let p = new Promise((resolve, reject) => {
    resolve('OK');
  });

  //1.右侧为promise的情况
  let res = await p;
  console.log("右侧为promise的情况: ",res);//右侧为promise的情况:  OK

  //2.右侧为其他类型的数据
  let res2 = await 20;
  console.log("右侧为其他类型的数据: ",res2);//右侧为其他类型的数据:  20
}

main();
```

await 的promise 失败  的情况：

```js
async function main() {
  let p = new Promise((resolve, reject) => {
    reject('OK');
  });

  try{
    let res3 = await p;
  }catch(e){
    console.log(e);//OK
  }
}  

main();
```







