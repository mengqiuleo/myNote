[TOC]



## 写在前面

这里是小飞侠Pan🥳，立志成为一名优秀的前端程序媛！！！

本篇文章收录于我的专栏：[前端精进之路](https://blog.csdn.net/weixin_52834435/category_11886356.html?spm=1001.2014.3001.5482)

同时收录于我的[github](https://github.com/mengqiuleo)前端笔记仓库中，持续更新中，欢迎star~

👉[https://github.com/mengqiuleo/myNote](https://github.com/mengqiuleo/myNote)

<hr>

在上篇文章中，我们介绍了异步的第一种解决方案：callback。本篇文章介绍第二种：**promise** 

在这里并不会介绍promise的基础语法，我会在这里记录一些promise以前没有涉及到的问题

前置文章：

[【JS异步】Promise入门（一）](https://blog.csdn.net/weixin_52834435/article/details/123927178)

[【JS异步】PromiseAPI（二）](https://blog.csdn.net/weixin_52834435/article/details/124422513)

[【promise】注意点](https://blog.csdn.net/weixin_52834435/article/details/124595729)

[【Promise】代码输出面试题](https://blog.csdn.net/weixin_52834435/article/details/124594392)



## 基础语法细节

### new Promise的快捷方式

比如 `Promise.resolve(42);` 可以认为是以下代码的语法糖。

```javascript
new Promise(function(resolve){
    resolve(42);
});
```

在这段代码中的 `resolve(42);` 会让这个promise对象立即进入确定（即resolved）状态，并将 `42` 传递给后面then里所指定的 `onFulfilled` 函数。

方法 `Promise.resolve(value);` 的返回值也是一个promise对象，所以我们可以像下面那样接着对其返回值进行 `.then` 调用。

```javascript
Promise.resolve(42).then(function(value){
    console.log(value);
});
```



### Thenable

`thenable`对象指的是具有`then`方法的对象，比如下面这个对象。

```javascript
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};
```

`Promise.resolve()`方法会将这个对象转为 Promise 对象，然后就立即执行`thenable`对象的`then()`方法。

```javascript
let thenable = {
  then: function(resolve, reject) {
    resolve(42);
  }
};

let p1 = Promise.resolve(thenable);
p1.then(function (value) {
  console.log(value);  // 42
});
```

上面代码中，`thenable`对象的`then()`方法执行后，对象`p1`的状态就变为`resolved`，从而立即执行最后那个`then()`方法指定的回调函数，输出42。



## then or catch?

`Promise.prototype.catch()`方法是`.then(null, rejection)`或`.then(undefined, rejection)`的别名，用于指定发生错误时的回调函数。

Promise 对象的错误具有“冒泡”性质，会一直向后传递，直到被捕获为止。也就是说，错误总是会被下一个`catch`语句捕获。

```javascript
getJSON('/post/1.json').then(function(post) {
  return getJSON(post.commentURL);
}).then(function(comments) {
  // some code
}).catch(function(error) {
  // 处理前面三个Promise产生的错误
});
```

上面代码中，一共有三个 Promise 对象：一个由`getJSON()`产生，两个由`then()`产生。它们之中任何一个抛出的错误，都会被最后一个`catch()`捕获。

一般来说，不要在`then()`方法里面定义 Reject 状态的回调函数（即`then`的第二个参数），总是使用`catch`方法。

```javascript
// bad
promise
  .then(function(data) {
    // success
  }, function(err) {
    // error
  });

// good
promise
  .then(function(data) { //cb
    // success
  })
  .catch(function(err) {
    // error
  });
```

上面代码中，第二种写法要好于第一种写法，理由是第二种写法可以捕获前面`then`方法执行中的错误，也更接近同步的写法（`try/catch`）。因此，建议总是使用`catch()`方法，而不使用`then()`方法的第二个参数。

跟传统的`try/catch`代码块不同的是，如果没有使用`catch()`方法指定错误处理的回调函数，Promise 对象抛出的错误不会传递到外层代码，即不会有任何反应。

```javascript
const someAsyncThing = function() {
  return new Promise(function(resolve, reject) {
    // 下面一行会报错，因为x没有声明
    resolve(x + 2);
  });
};

someAsyncThing().then(function() {
  console.log('everything is great');
});

setTimeout(() => { console.log(123) }, 2000);
// Uncaught (in promise) ReferenceError: x is not defined
// 123
```

上面代码中，`someAsyncThing()`函数产生的 Promise 对象，内部有语法错误。浏览器运行到这一行，会打印出错误提示`ReferenceError: x is not defined`，但是不会退出进程、终止脚本执行，2 秒之后还是会输出`123`。这就是说，Promise 内部的错误不会影响到 Promise 外部的代码，通俗的说法就是“Promise 会吃掉错误”。

再看下面的例子。

```javascript
const promise = new Promise(function (resolve, reject) {
  resolve('ok');
  setTimeout(function () { throw new Error('test') }, 0)
});
promise.then(function (value) { console.log(value) });
// ok
// Uncaught Error: test
```

上面代码中，Promise 指定在下一轮“事件循环”再抛出错误。到了那个时候，Promise 的运行已经结束了，所以这个错误是在 Promise 函数体外抛出的，会冒泡到最外层，成了未捕获的错误。

一般总是建议，Promise 对象后面要跟`catch()`方法，这样可以处理 Promise 内部发生的错误。`catch()`方法返回的还是一个 Promise 对象，因此后面还可以接着调用`then()`方法。



## 使用reject而不是throw

为什么在想将promise对象的状态设置为Rejected的时候应该使用 `reject` 而不是 `throw` 呢？

首先是因为我们很难区分 `throw` 是我们主动抛出来的，还是因为真正的其它 **异常** 导致的。

比如在使用Chrome浏览器的时候，Chrome的开发者工具提供了在程序发生异常的时候自动在调试器中break的功能。

当我们开启这个功能的时候，在执行到下面代码中的 `throw` 时就会触发调试器的break行为（打断点）。

```javascript
var promise = new Promise(function(resolve, reject){
    throw new Error("message");
});
```

本来这是和调试没有关系的地方，也因为在Promise中的 `throw` 语句被break了，这也严重的影响了浏览器提供的此功能的正常使用。



## promise的局限性

### 异步回调中抛错catch捕捉不到

首先我们看在Promise对象的处理器函数中直接抛出错误

```js
const p = new Promise((resolve, reject)=>{
  throw new Error('这是一个错误')
});
p.catch((error)=>{ console.log(error) });
```

按照上述内容来看，在Promise对象的处理器函数中直接抛出错误，`catch`是可以捕捉到的

在下面代码，在Promise对象的处理器函数中模拟一个异步抛错

```js
const p = new Promise((resolve, reject)=>{
  setTimeout(()=>{ throw new Error('这是一个错误') }, 0)
});
p.catch((error)=>{ console.log(error) });
```

这种情况`catch`是捕捉不到的，这是为什么呢？先想后看，再做不难

**原因**

JS 事件循环列表有宏任务与微任务之分，setTimeOut是宏任务， promise是微任务，执行顺序不同

那么这段代码的执行顺序是：

1. 代码执行栈进入promise 触发setTimeOut，setTimeOut回调函数入宏任务队列
2. 代码执行promise的catch方法，入微任务队列，此时setTimeOut回调还没有执行
3. 执行栈检查发现当前微任务队列执行完毕，开始执行宏任务队列
4. 执行`throw new Error('这是一个错误')` 此时这个异常其实是在promise外部抛出的

**解决**

使用`try catch`捕获异常主动触发`reject`

```js
const p = new Promise((resolve, reject)=>{
  setTimeout(()=>{ 
    try{
       throw new Error('这是一个错误') 
    }catch(e){
       reject(e)
    }
 }, 0)
});
p.catch((error)=>{ console.log(error) });
```

### 错误被吃掉

首先我们要理解，什么是错误被吃掉，是指错误信息不被打印吗？

并不是，举个例子：

```js
throw new Error('error');
console.log(233333);
```

在这种情况下，因为 throw error 的缘故，代码被阻断执行，并不会打印 233333，再举个例子：

```js
const promise = new Promise(null);
console.log(233333);
```

以上代码依然会被阻断执行，这是因为如果通过无效的方式使用 Promise，并且出现了一个错误阻碍了正常 Promise 的构造，结果会得到一个立刻跑出的异常，而不是一个被拒绝的 Promise。

然而再举个例子：

```js
let promise = new Promise(() => {
    throw new Error('error')
});
console.log(2333333);
```

这次会正常的打印 `233333`，说明 Promise 内部的错误不会影响到 Promise 外部的代码，而这种情况我们就通常称为 “吃掉错误”。

其实这并不是 Promise 独有的局限性，try..catch 也是这样，同样会捕获一个异常并简单的吃掉错误。

而正是因为错误被吃掉，Promise 链中的错误很容易被忽略掉，这也是为什么会一般推荐在 Promise 链的最后添加一个 catch 函数，因为对于一个没有错误处理函数的 Promise 链，任何错误都会在链中被传播下去，直到你注册了错误处理函数。

### 单一值

Promise 只能有一个完成值或一个拒绝原因，然而在真实使用的时候，往往需要传递多个值，一般做法都是构造一个对象或数组，然后再传递，then 中获得这个值后，又会进行取值赋值的操作，每次封装和解封都无疑让代码变得笨重。

说真的，并没有什么好的方法，建议是使用 ES6 的解构赋值：

```js
Promise.all([Promise.resolve(1), Promise.resolve(2)])
.then(([x, y]) => {
    console.log(x, y);
});
```

### 无法取消

Promise 一旦新建它就会立即执行，无法中途取消。

### 无法得知 pending 状态

当处于 pending 状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）。



## Promise 凭借什么消灭了回调地狱？

Promise 利用了三大技术手段来解决`回调地狱`:

- **回调函数延迟绑定**
- **返回值穿透**
- **错误冒泡**

首先来举个例子:

```js
let readFilePromise = (filename) => {
  fs.readFile(filename, (err, data) => {
    if(err) {
      reject(err);
    }else {
      resolve(data);
    }
  })
}
readFilePromise('1.json').then(data => {
  return readFilePromise('2.json')
});
```

回调函数不是直接声明的，而是在通过后面的 then 方法传入的，即延迟传入。这就是`回调函数延迟绑定`。

然后做以下微调:

```js
let x = readFilePromise('1.json').then(data => {
  return readFilePromise('2.json')//这是返回的Promise
});
x.then(/* 内部逻辑省略 */)
```

我们会根据 then 中回调函数的传入值创建不同类型的Promise, 然后把返回的 Promise 穿透到外层, 以供后续的调用。这里的 x 指的就是内部返回的 Promise，然后在 x 后面可以依次完成链式调用。

这便是`返回值穿透`的效果。

这两种技术一起作用便可以将深层的嵌套回调写成下面的形式:

```js
readFilePromise('1.json').then(data => {
    return readFilePromise('2.json');
}).then(data => {
    return readFilePromise('3.json');
}).then(data => {
    return readFilePromise('4.json');
});
```

这样就显得清爽了许多，更重要的是，它更符合人的线性思维模式，开发体验也更好。

两种技术结合产生了`链式调用`的效果。

这解决的是多层嵌套的问题，那另一个问题，即每次任务执行结束后`分别处理成功和失败`的情况怎么解决的呢？

Promise 采用了`错误冒泡`的方式。其实很简单理解:

```js
readFilePromise('1.json').then(data => {
    return readFilePromise('2.json');
}).then(data => {
    return readFilePromise('3.json');
}).then(data => {
    return readFilePromise('4.json');
}).catch(err => {
  // xxx
})
```

这样前面产生的错误会一直向后传递，被 catch 接收到，就不用频繁地检查错误了。

解决效果：

- 实现链式调用，解决多层嵌套问题
- 实现错误冒泡后一站式处理，解决每次任务中判断错误、增加代码混乱度的问题



## 为什么Promise要引入微任务？

回到问题本身，其实就是如何处理回调的问题。总结起来有三种方式:

1. 使用同步回调，直到异步任务进行完，再进行后面的任务。
2. 使用异步回调，将回调函数放在进行`宏任务队列`的队尾。
3. 使用异步回调，将回调函数放到`当前宏任务中`的最后面。

### 优劣对比

第一种方式显然不可取，因为同步的问题非常明显，会让整个脚本阻塞住，当前任务等待，后面的任务都无法得到执行，而这部分`等待的时间`是可以拿来完成其他事情的，导致 CPU 的利用率非常低，而且还有另外一个致命的问题，就是无法实现`延迟绑定`的效果。

如果采用第二种方式，那么执行回调(resolve/reject)的时机应该是在前面`所有的宏任务`完成之后，倘若现在的任务队列非常长，那么回调迟迟得不到执行，造成`应用卡顿`。

为了解决上述方案的问题，另外也考虑到`延迟绑定`的需求，Promise 采取第三种方式, 即`引入微任务`, 即把 resolve(reject) 回调的执行放在当前宏任务的末尾。

这样，利用`微任务`解决了两大痛点:

- 采用**异步回调**替代同步回调解决了浪费 CPU 性能的问题。
- 放到**当前宏任务最后**执行，解决了回调执行的实时性问题。




## 面试题：红绿灯问题

题目：红灯三秒亮一次，绿灯一秒亮一次，黄灯2秒亮一次；如何让三个灯不断交替重复亮灯？（用 Promse 实现）



### promsie实现

三个亮灯函数已经存在：

```js
function red(){
    console.log('red');
}
function green(){
    console.log('green');
}
function yellow(){
    console.log('yellow');
}
```

**思路**

首先设置一个定时器接收亮灯和亮灯的时间，我们需要用到一个定时器函数接收两个参数，亮灯颜色和亮灯时间，然后设置一个Promise，由于Promise是一个异步操作，只有发生状态响应的时候，才会继续执行后续的操作(这样就实现了三个灯有顺序的执行)，那么我们先在Promise中将颜色打印出来，然后通过一个定时器设置时间延时，延时相当于就是亮灯的时间，因为我们亮灯了，然后延时，就会造成一种灯在这段时间一直亮着的效果

```js
var light = function(timmer, cb){
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            cb();
            resolve();
        }, timmer);
    });
};
```

从上面操作我们可以看出我们声明了一个异步函数，返回了一个Promise，亮灯后定时进行resolve(),才能进入到下一步骤，所以我们已经完成了亮灯和延时，现在我们对三个颜色的灯配合`then`进行三个灯的顺序亮灯

```js
Promise.resolve().then(function(){
        return light(3000, red);
    }).then(function(){
        return light(2000, green);
    }).then(function(){
        return light(1000, yellow);
    })
```

最后我们给他进行循环显示，通过`递归`实现：

```js
var step = function() {
    Promise.resolve().then(function(){
        return light(3000, red);
    }).then(function(){
        return light(2000, green);
    }).then(function(){
        return light(1000, yellow);
    }).then(function(){
        step();
    });
}

step();
```





**整体代码实现如下**

利用 then 和 **递归** 实现：

```js
function red(){
    console.log('red');
}
function green(){
    console.log('green');
}
function yellow(){
    console.log('yellow');
}

var light = function(timmer, cb){
    return new Promise(function(resolve, reject) {
        setTimeout(function() {
            cb();
            resolve();
        }, timmer);
    });
};

var step = function() {
    Promise.resolve().then(function(){
        return light(3000, red);
    }).then(function(){
        return light(2000, green);
    }).then(function(){
        return light(1000, yellow);
    }).then(function(){
        step();
    });
}

step();
```



### async，await实现

```js
async function timer(color,delay){
  return new Promise((res,rej)=>{
      console.log(color)
      setTimeout(() => {
          res()
      }, delay);
  })
}

async function light(){
  await timer('green',1000)
  await timer('yellow',2000)
  await timer('red',3000)
  await light()

}
light()
```



## 面试题：使用Promise实现每隔1秒输出1,2,3

### setTimeout实现

```js
let arr = [1, 2, 3]
function timeout(count = 0){
  if(count === arr.length) return;
  setTimeout(() => {
    console.log(arr[count]);
    timeout(++count);
  }, 1000);
}
timeout()
```



### async实现

```js
let arr = [1,2,3]
async function timer(){
  for(let i = 0; i < arr.length; i++){
    console.log(await _promise(arr[i]))
  }
}
function _promise(data){
  return new Promise((resolve,reject) => {
    setTimeout(() => {
      resolve(data);
    }, 1000);
  })
}
timer();
```



### promise实现

```js
let arr = [1, 2, 3]
Promise.resolve()
  .then(() => {
    return new Promise(resolve => { 
      setTimeout(() => { 
        console.log(arr[0]); 
        resolve() 
      }, 1000) 
    })
  })
  .then(() => {
    return new Promise(resolve => { 
      setTimeout(() => { 
        console.log(arr[1]); 
        resolve() 
      }, 1000) 
    })
  })
  .then(() => {
    return new Promise(resolve => { 
      setTimeout(() => { 
        console.log(arr[2]); 
        resolve() 
      }, 1000) 
    })
  })
```



**使用reduce实现**

```js
let arr = [1, 2, 3]
arr.reduce((p,x) => {
  return p.then(() => {
    return new Promise(resolve => {
      setTimeout(() => {
        // console.log(x);
        // resolve();
        resolve(console.log(x));
      },1000)
    })
  })
},Promise.resolve())
```



**foreach实现**

```js
let arr = [1, 2, 3]
let p = Promise.resolve();
arr.forEach(item => {
    p = p.then(() => {
      return new Promise(resolve => {
        setTimeout(() => {
          console.log(item);
          resolve();
        }, 1000);
      })
    })
})
```



## 代码输出题：then中存在promise.then

```js
new Promise((resolve, reject) => {
  console.log("外部promise");
  resolve();
})
  .then(() => {
    console.log("外部第一个then");
    new Promise((resolve, reject) => {
      console.log("内部promise");
      resolve();
    })
      .then(() => {
        console.log("内部第一个then");
      })
      .then(() => {
        console.log("内部第二个then");
      });
  })
  .then(() => {
    console.log("外部第二个then");
  });
```

输出结果：

```js
外部promise
外部第一个then
内部promise
内部第一个then
外部第二个then
内部第二个then
```

**解释**

then并不是一下将全部的then放入微任务队列，而是当第一个then有了返回值后再将第二个then放入微任务队列。

**外部的第二个 then 的注册，需要等待 外部的第一个 then 的同步代码执行完成**

- 当执行内部的 new Promise 的时候，然后碰到 resolve，resolve 执行完成，代表此时的该 Promise 状态已经扭转，之后开始内部的第一个 .then 的微任务的注册，此时同步执行完成。

- 这个时候，外部的第一个 then 的同步操作已经完成了，然后开始注册外部的第二个 then，此时外部的同步任务也都完成了。

- 同步操作完成之后，那么开始执行微任务，我们发现 内部的第一个 then 是优先于外部的第二个 then 的注册，所以会执行完内部的第一个 then 之后，然后注册内部的第二个 then ，然后执行外部的第二个 then ,然后再执行内部的第二个 then。



## Promise/A+ 和 webkit 的 Promise 的实现差异

```js
Promise.resolve().then(() => {
    console.log(0);
    return Promise.resolve(4);
}).then((res) => {
    console.log(res)
})

Promise.resolve().then(() => {
    console.log(1);
}).then(() => {
    console.log(2);
}).then(() => {
    console.log(3);
}).then(() => {
    console.log(5);
}).then(() =>{
    console.log(6);
})
```

// 输出：0 1 2 3 4 5 6

这里 4 的位置显示，then 内部在处理 `return Promise.resolve(4)` 方法的时候，很可能是产生了类似 2 次微任务的现象；



> Js引擎为了让microtask尽快的输出，做了一些优化，连续的多个then(3个)如果没有reject或者resolve会交替执行then而不至于让一个堵太久完成用户无响应，不单单v8这样其他引擎也是这样，因为其实promuse内部状态已经结束了。这块在v8源码里有完整的体现



Promise最新规范，onFulfilled中返回一个Promise，会用微任务把Promise再包装一层



这里说明 `return Promise.resolve(4)` 与 `new Promise(resolve => { reolve(4) })` 的方式并无差异；

`return Promise.reolve(4)` 与

```js
return new Promise(resolve => {
    resolve(4)
  })
  .then(res => {
    return res
  })
```

产生的效果是相同的，



**参考文章**

[ES6 系列之我们来聊聊 Promise](https://github.com/mqyqingfeng/Blog/issues/98)

[(2.4w字,建议收藏)😇原生JS灵魂之问(下), 冲刺🚀进阶最后一公里(附个人成长经验分享)](https://juejin.cn/post/6844904004007247880#heading-43)

[【建议星星】要就来45道Promise面试题一次爽到底(1.1w字用心整理)](https://juejin.cn/post/6844904077537574919#heading-56)