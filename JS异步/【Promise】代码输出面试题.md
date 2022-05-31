# 【Promise】代码输出面试题

[TOC]



## promise相关

### 1.1

```js
const promise = new Promise((resolve, reject) => {
  console.log(1);
  setTimeout(() => {
    console.log("timerStart");
    resolve("success");
    console.log("timerEnd");
  }, 0);
  console.log(2);
});
promise.then((res) => {
  console.log(res);
});
console.log(4);
```

执行结果为：

```
1
2
4
"timerStart"
"timerEnd"
"success"
```

**分析：**

- 先遇到promise，输出`1`，碰到了定时器，将`setTimeout`放到下一个宏任务队列中，输出`2`

- 跳出promise，遇到`promise.then`，但其状态还是为`pending`，这里`认为先不执行`

- 输出`4`

- 一轮循环过后，进入第二次宏任务，执行`setTimeout`，输出`timeStart`，然后遇到了`resolve`，改变promise的状态，`此时将 promise.then 推入微任务队列`

- 继续输出`timerEnd`

- 宏任务执行完毕，执行微任务，执行`promise.then`

  

### 1.2

```js
const promise = new Promise((resolve, reject) => {
  reject("error");
  resolve("success2");
});
promise
    .then(res => {
    console.log("then1: ", res);
  }).then(res => {
    console.log("then2: ", res);
  }).catch(err => {
    console.log("catch: ", err);
  }).then(res => {
    console.log("then3: ", res);
  })
```

结果：

```
"catch: " "error"
"then3: " undefined
```

分析：

- `catch`不管被连接到哪里，都能捕获上层未捕捉过的错误。
- 下面的then3也会被执行，因为catch的返回值是undefined



### 1.3

```js
Promise.resolve().then(() => {
  return new Error('error!!!')
}).then(res => {
  console.log("then: ", res)
}).catch(err => {
  console.log("catch: ", err)
})
```

结果：

```
"then: " "Error: error!!!"
```

分析：

return 一个非 `promise` 的值都会被包裹成 `promise` 对象，因此这里的`return new Error('error!!!')`也被包裹成了`return Promise.resolve(new Error('error!!!'))`。

> 这里要注意区 return error 和 throw new error
>
> - 对于 return error，会将它包裹成一个promise返回，是成功的状态
> - 而 throw new error，会返回失败

```js
// 举例
Promise.resolve().then(() => {
  throw new Error('error!!!')
}).then(res => {
  console.log("then: ",res)
}).catch(err => {
  console.log("catch: ",err) //catch:  Error: error!!!
})
```



### 1.4

```js
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .then(console.log)
```

结果：

```
1
```

分析：

`.then` 或者 `.catch` 的参数期望是函数，传入非函数则会发生值透传。

第一个`then`和第二个`then`中传入的都不是函数，一个是数字类型，一个是对象类型，因此发生了透传，将`resolve(1)` 的值直接传到最后一个`then`里。

如果传入的不是函数，那么最开始的值并不会在它们中改变，而是会继续向下传递。



### 1.5 --> finally

> - `.finally()`方法不管`Promise`对象最后的状态如何都会执行
>
> - `.finally()`方法的回调函数不接受任何的参数，也就是说你在`.finally()`函数中是没法知道`Promise`最终的状态是`resolved`还是`rejected`的
>
> - 它最终返回的默认会是一个**上一次的Promise对象值**，不过如果抛出的是一个异常则返回异常的`Promise`对象。
>
> - 在finally中，return 值 不起作用，参照上面的第三条
>
> - finally 如果抛出的是一个异常则返回异常的`Promise`对象
>
>   ```js
>   Promise.resolve('1')
>     .finally(() => {
>       console.log('finally1')
>       throw new Error('我是finally中抛出的异常')
>     })
>     .then(res => {
>       console.log('finally后面的then函数', res)
>     })
>     .catch(err => {
>       console.log('捕获错误', err)
>     })
>   ```
>
>   执行结果为：
>
>   ```
>   'finally1'
>   '捕获错误' Error: 我是finally中抛出的异常
>   ```
>
>   但是如果改为`return new Error('我是finally中抛出的异常')`，打印出来的就是`'finally后面的then函数 1'`
>
> 

```js
Promise.resolve('1')
  .then(res => {
    console.log(res)
  })
  .finally(() => {
    console.log('finally')
  })
Promise.resolve('2')
  .finally(() => {
    console.log('finally2')
  	return '我是finally2返回的值
  })
  .then(res => {
    console.log('finally2后面的then函数', res)
  })
```

结果：

```
'1'
'finally2'
'finally'
'finally2后面的then函数' '2'
```

分析：

`要注意：finally2 会在 finally 之前输出`。

- 首先将第一个promise的then加入微任务队列，这里要注意，代码并不会接着往链式调用的下面走，也就是不会先将`.finally`加入微任务列表，那是因为`.then`本身就是一个微任务，它链式后面的内容必须得等当前这个微任务执行完才会执行，因此这里我们先不管`.finally()`
- 再向下遇到了第二个promise，将它的finally加入微任务队列，并且它后面的then不会加入微任务队列，和第一个promise相同。
- 此时，本轮的宏任务全部执行完毕，执行微任务队列，输出`1`，然后遇到了第一个promise的finally，将它加入微任务队列，再取出微任务队列中的第二个任务（即第二个promise的finally），输出`finally2`，然后向下遇到了then，并将第二个promise的then加入微任务队列。
- 此时，本轮已全部执行完，开启新一轮的任务，执行微任务队列，分别输出`finally`和`'finally2后面的then函数' '2'`



### 1.6

```js
function promise1 () {
  let p = new Promise((resolve) => {
    console.log('promise1');
    resolve('1')
  })
  return p;
}
function promise2 () {
  return new Promise((resolve, reject) => {
    reject('error')
  })
}
promise1()
  .then(res => console.log(res))
  .catch(err => console.log(err))
  .finally(() => console.log('finally1'))

promise2()
  .then(res => console.log(res))
  .catch(err => console.log(err))
  .finally(() => console.log('finally2'))
```

结果：

```
'promise1'
'1'
'error'
'finally1'
'finally2'
```

分析：

- 首先定义了两个函数`promise1`和`promise2`，先不管接着往下看。
- promise1`函数先被调用了，然后执行里面`new Promise`的同步代码打印出`promise1
- 之后遇到了`resolve(1)`，将`p`的状态改为了`resolved`并将结果保存下来。
- 此时`promise1`内的函数内容已经执行完了，跳出该函数
- 碰到了`promise1().then()`，由于`promise1`的状态已经发生了改变且为`resolved`因此将`promise1().then()`这条微任务加入本轮的微任务列表(**这是第一个微任务**)
- 这时候要注意了，代码并不会接着往链式调用的下面走，也就是不会先将`.finally`加入微任务列表，那是因为`.then`本身就是一个微任务，它链式后面的内容必须得等当前这个微任务执行完才会执行，因此这里我们先不管`.finally()`
- 再往下走碰到了`promise2()`函数，其中返回的`new Promise`中并没有同步代码需要执行，所以执行`reject('error')`的时候将`promise2`函数中的`Promise`的状态变为了`rejected`
- 跳出`promise2`函数，遇到了`promise2().catch()`，将其加入当前的微任务队列(**这是第二个微任务**)，且链式调用后面的内容得等该任务执行完后才执行，和`.then()`一样。
- OK， 本轮的宏任务全部执行完了，来看看微任务列表，存在`promise1().then()`，执行它，打印出`1`，然后遇到了`.finally()`这个微任务将它加入微任务列表(**这是第三个微任务**)等待执行
- 再执行`promise2().catch()`打印出`error`，执行完后将`finally2`加入微任务加入微任务列表(**这是第四个微任务**)
- OK， 本轮又全部执行完了，但是微任务列表还有两个新的微任务没有执行完，因此依次执行`finally1`和`finally2`。



### 1.7

```js
const first = () => (new Promise((resolve, reject) => {
    console.log(3);
    let p = new Promise((resolve, reject) => {
        console.log(7);
        setTimeout(() => {
            console.log(5);
            resolve(6);
            console.log(p)
        }, 0)
        resolve(1);
    });
    resolve(2);
    p.then((arg) => {
        console.log(arg);
    });
}));
first().then((arg) => {
    console.log(arg);
});
console.log(4);
```

结果：

```
3
7
4
1
2
5
Promise{<resolved>: 1}
```

分析：

- 首先执行first函数，它的返回值是一个promise。先输出`3`，接着输出`7`，遇到一个定时器，将它放入宏任务队列。接着遇到了`resolve(1)`，这里就把`p`的状态改为了`resolved`，且返回值为`1`，不过这里也先不执行
- 跳出`p`，碰到了`resolve(2)`，这里的`resolve(2)`，表示的是把`first`函数返回的那个`Promise`的状态改了。
- 然后碰到了`p.then`，将它加入本次循环的微任务列表，等待执行。
- 跳出`first`函数，遇到了`first().then()`，将它加入本次循环的微任务列表(`p.then`的后面执行)。这里要将`first().then()`加入队列的原因是：first函数返回值是一个promise，并且`resolve(2)`，把`first`函数返回的那个`Promise`的状态改了。
- 然后执行同步代码`4`
- 本轮的同步代码全部执行完毕，查找微任务列表，发现`p.then`和`first().then()`，依次执行，打印出`1和2`
- 然后执行宏任务中的定时器，执行同步代码`5`，然后又遇到了一个`resolve(6)`，它是放在`p`里的，但是`p`的状态在之前已经发生过改变了，因此这里就不会再改变，也就是说`resolve(6)`相当于没任何用处，因此打印出来的`p`为`Promise{<resolved>: 1}`。注意：promise的状态只会改变一次。



### 1.8

```js
const p1 = new Promise((resolve) => {
  setTimeout(() => {
    resolve('resolve3');
    console.log('timer1')
  }, 0)
  resolve('resovle1');
  resolve('resolve2');
}).then(res => {
  console.log(res)
  setTimeout(() => {
    console.log(p1)
  }, 1000)
}).finally(res => {
  console.log('finally', res)
})
```

结果：

```
'resolve1'
'finally' undefined
'timer1'
Promise{<resolved>: undefined}
```

分析：

- `Promise`的状态一旦改变就无法改变

- `finally`不管`Promise`的状态是`resolved`还是`rejected`都会执行，且它的回调函数是接收不到`Promise`的结果的，所以`finally()`中的`res`是一个迷惑项。
- 最后一个定时器打印出的`p1`其实是`.finally`的返回值，我们知道`.finally`的返回值如果在没有抛出错误的情况下默认会是上一个`Promise`的返回值, 而这道题中`.finally`上一个`Promise`是`.then()`，但是这个`.then()`并没有返回值，所以`p1`打印出来的`Promise`的值会是`undefined`，如果你在定时器的**下面**加上一个`return 1`，则值就会变成`1`



## 关于promise.then.then

### 2.1

```js
Promise.resolve()
  .then(() => { 
    Promise.resolve().then(() => {
      console.log(1);
    }).then(() => {
      console.log(2);
    })
  })
  .then(() => { 
    console.log(3)
  })
```

结果：

```
1 3 2
```

分析：

先将外层第一个 then 压入微任务列表，等待这个 then 执行完返回一个 promise 之后再将外层第二个 then 压入微任务队列，第一个then里面的逻辑同样如此。

对每一个then标号，便于表述

```js
Promise.resolve()
  .then(() => {  //1.0
    Promise.resolve().then(() => { //1.1
      console.log(1);
    }).then(() => { //1.2
      console.log(2);
    })
  })
  .then(() => { //2.0
    console.log(3)
  })
```

- 首先将then1.0放入微任务队列，本轮宏任务执行完毕，取出then1.0，执行发现里面是then1.1，所以将then1.1加入微任务队列
- 在第二轮，取出then1.1，执行输出`1`，此时then1.0就有了返回值，返回值是then1.1 里return的undefined。根据优先级，优先将then2.0加入队列，然后将then1.2加入队列。
- 在新的一轮，取出then2.0，输出`3`，再取出then1.2，输出`2`



### 2.2

```js
Promise.resolve()
  .then(() => { 
    Promise.resolve().then(() => {
      console.log(1);
    }).then(() => {
      console.log(2);
    })
  })
  .then(() => { 
    Promise.resolve().then(() => {
      console.log(3);
    }).then(() => {
      console.log(4);
    }).then(() => {
      console.log(5)
    })
  })
```

结果：

```
1 2 3 4 5
```

分析：

```js
Promise.resolve()
  .then(() => { //1.0
    Promise.resolve().then(() => { //1.1
      console.log(1);
    }).then(() => { //1.2
      console.log(2);
    })
  })
  .then(() => { //2.0
    Promise.resolve().then(() => { //2.1
      console.log(3);
    }).then(() => { //2.2
      console.log(4);
    }).then(() => { //2.3
      console.log(5)
    })
  })
```

- 先将then1.0加入微任务队列，本轮宏任务执行完毕，取出then1.0，执行发现是then1.1，放入微任务队列
- 下一轮，取出then1.1执行，输出`1`，此时then1.0已经有了返回值，返回值是then1.1的return undefined。那么根据优先级，先将then2.0加入队列，然后加入then1.2
- 取出then2.0，执行发现是一个then2.1，放入队列，取出then1.2，执行输出`2`。
- 下一轮，取出then2.1，输出`3`，然后将then2.2加入队列，下一轮取出输出`4`，再将then2.3加入队列...



### 2.3

```js
Promise.resolve()
  .then(() => { 
    Promise.resolve().then(() => {
      console.log(1);
    }).then(() => {
      console.log(2);
    }).then(() => {
      console.log(6)
    })
  })
  .then(() => { 
    console.log(3)
  })
  .then(() => {
    Promise.resolve().then(() => {
      console.log(4);
    }).then(() => {
      console.log(5);
    })
  })
```

结果：

```
1 3 2 6 4 5
```

分析：

```js
Promise.resolve()
  .then(() => { //1.0
    Promise.resolve().then(() => { //1.1
      console.log(1);
    }).then(() => { //1.2
      console.log(2);
    }).then(() => { //1.3
      console.log(6)
    })
  })
  .then(() => { //2.0
    console.log(3)
  })
  .then(() => { //3.0
    Promise.resolve().then(() => { //3.1
      console.log(4);
    }).then(() => { //3.2
      console.log(5);
    })
  })
```

- then1.0加入队列，下一轮取出，then1.1加入队列，下一轮取出，执行then1.1，输出`1`，此时then1.0已经有了返回值，根据优先级，先将then2.0加入队列，然后将then1.2加入队列。
- 新的一轮，取出then2.0，输出`3`，此时then2.0已经有了返回值，返回值为return的undefined，那么将then3.0加入队列。然后取出then1.2，输出`2`，然后将then1.3加入队列。
- 新的一轮，取出then3.0，执行发现是then3.1，将then3.1加入队列。取出then1.3，输出`6`。
- 新的一轮，取出then3.1，输出`4`，再将then3.2加入队列，最后输出`5`。



### 2.4

```js
Promise.resolve()
  .then(() => { 
    Promise.resolve().then(() => {
      console.log(1);
    }).then(() => {
      console.log(2);
    })
  })
  .then(() => {
    Promise.resolve().then(() => {
      console.log(4);
    }).then(() => {
      console.log(5);
    })
  })
  .then(() => { 
    console.log(3)
  })
```

结果：

```
1 2 4 3 5
```

分析：

```js
Promise.resolve()
  .then(() => { //1.0
    Promise.resolve().then(() => { //1.1
      console.log(1);
    }).then(() => { //1.2
      console.log(2);
    })
  })
  .then(() => { //2.0
    Promise.resolve().then(() => { //2.1
      console.log(4);
    }).then(() => { //2.2
      console.log(5);
    })
  })
  .then(() => { //3.0
    console.log(3)
  })
```

- then1.0入队列，然后取出执行发现是then1.1，then1.1入队列，取出执行输出`1`。此时then1.0有了返回值，将then2.0加入队列，再将then1.2加入队列。
- 新的一轮，取出then2.0，执行发现是then2.1，加入队列，再取出then1.2，输出`2`。
- 新的一轮，取出then2.1，输出`4`，此时then2.0有了返回值，将then3.0加入队列，再将then2.2加入队列
- 新的一轮，取出then3.0，输出`3`，然后取出then2.2，输出`5`。



### 2.5

```js
new Promise((resolve, reject) => {
  console.log(1)
  resolve()
})
  .then(() => {  
    console.log(2)
    new Promise((resolve, reject) => {
      console.log(3)
      resolve()
    }).then(() => { 
      console.log(4)
    }).then(() => {  
      console.log(5)
    })
  })
  .then(() => {  
    console.log(6)
  })

new Promise((resolve, reject) => {
  console.log(7)
  resolve()
}).then(() => { 
  console.log(8)
})
```

结果：

```
1 7 2 3 8 4 6 5
```

分析：

```js
new Promise((resolve, reject) => {
  console.log(1)
  resolve()
})
  .then(() => {  //1.0
    console.log(2)
    new Promise((resolve, reject) => {
      console.log(3)
      resolve()
    }).then(() => {  //1.1
      console.log(4)
    }).then(() => { //1.2
      console.log(5)
    })
  })
  .then(() => {  //2.0
    console.log(6)
  })

new Promise((resolve, reject) => {
  console.log(7)
  resolve()
}).then(() => {  //3.0
  console.log(8)
})
```

- 首先输出同步代码，输出`1`，看见solve，将then1.0加入队列。then2.0暂时先不管，只有当then1.0有了返回的promise时，then2.0才会入队列。
- 继续向下执行，输出`7`，看见resolve，将then3.0加入队列。
- 新的一轮，取出then1.0，输出`2`，然后输出`3`，看见resolve，将then1.1加入队列。然后取出then3.0，输出`8`。
- 新的一轮，取出then1.1，输出`4`，此时then1.0已经有了返回值，根据优先级，先将then2.0加入队列，然后将then1.2加入队列。
- 新的一轮，取出then2.0，输出`6`，然后取出then1.2，输出`5`。



### 2.6

从 2.1~2.5，他们的返回值都出现在then返回的值，这个题是自己手动返回一个promise。

> then方法会自动返回一个新的Promise，相当于return new Promise，
>
> 但是如果你手动写了return Promise，那return的就是你手动写的这个Promise

```js
new Promise((resolve, reject) => {
  console.log(1)
  resolve()
})
  .then(() => {
    console.log(2)
    // 这里多了个return,是自己返回的promise
    return new Promise((resolve, reject) => {
      console.log(3)
      resolve()
    }).then(() => {
      console.log(4)
    }).then(() => { // 相当于return了这个then的执行返回Promise
      console.log(5)
    })
  })
  .then(() => {
    console.log(6) 
  })
```

结果：

```
1 2 3 4 5 6
```

分析：

```js
new Promise((resolve, reject) => {
  console.log(1)
  resolve()
})
  .then(() => { //1.0
    console.log(2)

    return new Promise((resolve, reject) => {
      console.log(3)
      resolve()
    }).then(() => { //1.1
      console.log(4)
    }).then(() => {  //1.2
      console.log(5)
    })
  })
  .then(() => { //2.0
    console.log(6) 
  })
```

- 首先输出`1`，遇到了resolve，将then1.0加入队列，then2.0先不管
- 取出then1.0，输出`2`，因为这个then1.0的返回值是自己手动返回的一个promise，所以只有当这个promise执行结束的返回值时，才会将then2.0加入队列。
- 然后输出`3`，然后遇到了resolve，将then1.1加入队列。下一轮取出输出`4`，然后将then1.2加入队列，新的一轮，输出`5`。
- 此时then1.0的最终返回值为undefined，然后将then2.0加入队列，下一轮取出，并输出`6`。



为了验证then2.0拿到的是我们自己手动返回的promise的最终的值，我们对代码进行改动来验证。

```js
new Promise((resolve, reject) => {
  console.log(1)
  resolve()
})
  .then(() => {
    console.log(2)
    // 多了个return
    return new Promise((resolve, reject) => {
      console.log(3)
      resolve()
    }).then(() => {
      console.log(4)
    }).then(() => { // 相当于return了这个then的执行返回Promise
      console.log(5)
      return "then1.0" //我们自己返回的值是"then1.0"
    })
  })
  .then((res) => {
    console.log(res) //将从then1.0拿到的值进行输出
  })
```

结果：

```
1
2
3
4
5
then1.0
```



## async,await相关

> 可以理解为「紧跟着await后面的语句相当于放到了new Promise中，下一行及之后的语句相当于放在Promise.then中」。

### 3.1

```js
async function async1 () {
  console.log('async1 start');
  await new Promise(resolve => {
    console.log('promise1')
  })
  console.log('async1 success');
  return 'async1 end'
}
console.log('script start')
async1().then(res => console.log(res))
console.log('script end')
```

结果：

```js
'script start'
'async1 start'
'promise1'
'script end'
```

分析：

- 是先输出`script start`，因为async1函数虽然是同步执行，但是要先调用async1函数，才能执行，这里开始的时候并没有调用
- 在输出完`promise1`后，这个promise并没有返回值，也就是它的状态始终是`pending`状态，因此相当于一直在`await`，`await`，`await`却始终没有响应...
- 所以await下面的代码不会进入微任务队列，.then也不会



### 3.2

这里给await 的promise加上resolve，使它的状态发生变化

```js
async function async1 () {
  console.log('async1 start');
  await new Promise(resolve => {
    console.log('promise1')
    resolve('promise1 resolve')
  }).then(res => console.log(res))
  console.log('async1 success');
  return 'async1 end'
}
console.log('srcipt start')
async1().then(res => console.log(res))
console.log('srcipt end')
```

结果：

```
'script start'
'async1 start'
'promise1'
'script end'
'promise1 resolve'
'async1 success'
'async1 end'
```

分析：

- 现在`Promise`有了返回值了，因此`await`后面的内容将会被执行

- 那么await后面的promise的.then会被加入微任务队列，然后await下面的代码会当做promise.then加入队列。

- 在`async1().then(res => console.log(res))`，的.then也会被加入队列

  

### 3.3 --> try catch

`await`后面跟着的是一个状态为`rejected`的`promise`。

**如果在async函数中抛出了错误，则终止错误结果，不会继续向下执行。**

如果想要使得错误的地方不影响`async`函数后续的执行的话，可以使用`try catch`

```js
async function async1 () {
  await async2();
  console.log('async1');
  return 'async1 success'
}
async function async2 () {
  return new Promise((resolve, reject) => {
    console.log('async2')
    reject('error')
  })
}
async1().then(res => console.log(res))
```

结果：

```
'async2'
Uncaught (in promise) error
```





```js
async function async1 () {
  try {
    await Promise.reject('error!!!')
  } catch(e) {
    console.log(e)
  }
  console.log('async1');
  return Promise.resolve('async1 success')
}
async1().then(res => console.log(res))
console.log('script start')
```

结果：

```
'script start'
'error!!!'
'async1'
'async1 success'
```

分析：

- 首先执行async1函数，在try中等到一个reject，因为有await，那么await下面的代码被看成promise.then，放入微任务队列。
- 向下执行，.then放入微任务队列，继续向下，输出`script start`
- 本轮循环结束，在下一轮循环中，依次取出两个微任务进行执行



### 3.4

```js
let p = new Promise((resolve, reject) => {
  setTimeout(() => {
      resolve(10)  
  }, 1000)
}).then(() => {
     throw Error("1123")
}).catch((err) => {
  console.log(err);
})
.then(() => {
  console.log('异常捕获后可以继续.then');
})

/**
 *  Error: 1123
    at e:\note\前端\代码\vue\promise\6.js:6:12
    异常捕获后可以继续.then
 */
```



### 3.5

```js
const async1 = async () => {
  console.log('async1');
  setTimeout(() => {
    console.log('timer1')
  }, 2000)
  await new Promise(resolve => {
    console.log('promise1')
  })
  console.log('async1 end')
  return 'async1 success'
} 
console.log('script start');
async1().then(res => console.log(res));
console.log('script end');
Promise.resolve(1)
  .then(2)
  .then(Promise.resolve(3))
  .catch(4)
  .then(res => console.log(res))
setTimeout(() => {
  console.log('timer2')
}, 1000)
```

结果：

```
'script start'
'async1'
'promise1'
'script end'
1
'timer2'
'timer1'
```

分析：

- `async`函数中`await`的`new Promise`要是没有返回值的话则不执行后面的内容
- `.then`函数中的参数期待的是函数，如果不是函数的话会发生透传
- 注意定时器的延迟时间



### 3.6

```js
let a;

const b = new Promise((resolve, reject) => {
  console.log('promise1');
  resolve();
}).then(() => { //then1
  console.log('promise2');
}).then(() => { //then2
  console.log('promise3');
}).then(() => { //then3
  console.log('promise4');
});

a = new Promise(async (resolve, reject) => {
  console.log(a);
  await b;
  console.log(a);
  console.log('after1');
  await a;
  resolve(true);
  console.log('after2');
})

console.log('end');
```

结果：

```
promise1
undefined
end
promise2
promise3
promise4
Promise { <pending> }
after1
```

分析：

- 首先执行promise中的同步代码，输出`promise1`，然后遇到了resolve，将then1加入微任务队列，后面的then2和then3不用管。

- 继续向下执行，遇到`console.log(a) `，这里是在promise里的代码，所以会同步输出，此时主代码还未执行完毕，所以a还未赋值，那么a的值为undefined。输出`undefined`。然后向下执行，同步执行`await b`。

- 在b中，then是异步代码，先跳过，继续向下执行。

- 输出同步代码`end`，此时主代码执行完毕，那么a也被赋值了，因为a的值是一个promise，而这个promise并没有指定状态，所以a的值为`pending`。

- 接下来执行异步代码，取出then1，输出`promise2`，then1的返回值为undefined，将then2加入队列，下一轮取出并执行，输出`promise3`，然后将then3加入队列，下一轮输出`promise4`。

- 此时`await b`已执行完，将await b下面的代码作为微任务加入队列。

- 下一轮取出，执行输出a,在前面的代码中，并没有给再次a赋值，所以此时a的值仍为`pending`，所以输出`Promise { <pending> }`。

- 然后继续输出`after1`。接下来执行`await a`，因为a一直为pending状态，所以相当于一直在`await`，`await`，`await`却始终没有响应...那么后序代码也不会执行。

  

## 关于 Promise.resolve

- Promise.resolve的状态由（）里面决定，如果里面是reject，那么即使是Promise.resolve，也会返回reject
- reject不管传入的是什么值，都会按reject处理

```js
const promise = Promise.resolve(new Promise((resolve,reject) => {
  reject("111");
}))

promise.then(res => {
  console.log("res: ",res)
},err => {
  console.log("err: ",err)//err:  111
})
```

```js
const p = Promise.reject("222")
//如果是一个常量，返回值是一个reject

p.then(res => {
  console.log("res: ",res)
},err => {
  console.log("err: ",err)//err: 222
})

//# reject不管传入的是什么值，都会按reject处理
const p1 = Promise.reject(new Promise((resolve,reject) => {
   resolve("333")
}))

p1.then(res => {
  console.log("res: ",res)
},err => {
  console.log("err: ",err)//err:  Promise { '333' }
}).catch(err => {
  console.log("catch err:",err)
})
```



### 4.1

```js
let p1 = new Promise((resolve, reject) => {
  setTimeout(() => {
    reject('400');
  }, 3000)
});

let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve(p1);  
  }, 1000)
})


p2.then(res => console.log(res))
  .catch(err => console.log('error:'+err)); //error:400

//这里如果想看p1,p2的状态，不能立即输出，得用setTimeout
setTimeout(() => {
  console.log("p1: ",p1)//Promise { <rejected> '400' }
  console.log("p2: ",p2)//Promise { <rejected> '400' }
}, 5000);
```

分析：
当 promise 状态存在依赖时，它的状态与自身无关了，由依赖来决定，对于上述代码，就是 p2 的状态由依赖 p1 来决定，而p1是 reject，所以p2也是 reject

这里很像 Promise.resolve



## 总结：

1.对于`promise.then`，将它推入微任务队列的时机为`promise状态发生变化时`(即出现resolve或reject或抛出异常时)，而不是遇到了就把它推入队列。eg: 1.1

2.要注意区分 return new Error 和 throw new Error。eg: 1.3

3.对于一个promise.then.then，它并不会一次将这两个then都加入微任务队列，而是只会加入第一个then，跳过第二个，等到第二轮循环时，取出第一个then并执行后，才会加入第二个then。eg: 1.5

4.promise并没有返回值，也就是它的状态始终是`pending`状态，因此相当于一直在`await`，`await`，`await`却始终没有响应... eg: 2.1

