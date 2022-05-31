# 【JavaScript】EventLoop

[TOC]



## 一、浏览器中的事件循环

### 执行栈与任务队列

JS在解析一段代码时，会将同步代码按顺序排在执行栈中，然后依次执行里面的函数。当遇到异步任务时就交给其他线程处理，待当前执行栈所有同步代码执行完成后，会从一个队列中去取出已完成的异步任务的[回调](https://so.csdn.net/so/search?q=回调&spm=1001.2101.3001.7020)加入执行栈继续执行，遇到异步任务时又交给其他线程，…，如此循环往复。而其他异步任务完成后，将回调放入任务队列中待执行栈来取出执行。

> 在一个事件循环中，异步事件返回结果后会被放到一个任务队列中。然而，根据这个异步事件的类型，这个事件实际上会被对应的宏任务队列或者微任务队列中去。并且在当前执行栈为空的时候，主线程会 查看微任务队列是否有事件存在。如果不存在，那么再去宏任务队列中取出一个事件并把对应的回到加入当前执行栈；如果存在，则会依次执行队列中事件对应的回调，直到微任务队列为空，然后去宏任务队列中取出最前面的一个事件，把对应的回调加入当前执行栈…如此反复，进入循环。

![](E:\note\前端\笔记\js\eventloop\执行栈.jpg)



![](E:\note\前端\笔记\js\eventloop\事件轮询.png)

### 一个🌰

```js
$.on('button', 'click', function onClick() {
  setTimeout(function timer() {
      console.log('You clicked the button!');    
  }, 2000);
});

console.log("Hi!");

setTimeout(function timeout() {
  console.log("Click the button!");
}, 5000);

console.log("Welcome to loupe.");
```

分析一下这个执行的过程：

- 首先是，注册了点击事件，异步执行，这个时候会将它放在 `Web Api` 中
- console.log("Hi!") 入栈，直接执行，输出 Hi
- 执行 `setTimeout`，异步执行，将其挂载起来
- 执行 console.log("Welcome to loupe.")， 输出 Welcome to loupe.
- 5 秒钟后，`setTimeout` 执行回调，将回调放入到事件队列中，一旦主线程空闲，则取出运行
- 我点击了按钮，触发了点击事件，将点击事件的回调放入到事件队列中，一旦主线程空闲，则取出运行
- 运行点击事件回调中的 `setTimeout`
- 2 秒钟后，`setTimeout` 执行回调，将回调放入到事件队列中，一旦主线程空闲，则取出运行



**注：**

Web Api 中会存放一些异步事件，并且也会有一些事件放在其中（比如鼠标点击事件）。

和Web Api 相关的线程是 事件触发线程，定时器触发线程。

在上面这个例子中，点击事件放在Web Api中，setTimeout也放在里面。然后定时器触发线程会监测时间，当时间到了之后会将setTimeout的回调送入宏任务事件队列中。而对于点击事件，当你点击了按钮会触发点击事件，此时事件触发线程会将点击事件对应的回调送入宏任务队列中，等待JS引擎线程从任务队列中调取。

![](E:\note\前端\笔记\js\eventloop\进程.jpg)



### 宏任务和微任务

事件循环的过程中，执行栈在同步代码执行完成后，优先检查微任务队列是否有任务需要执行，如果没有，再去宏任务队列检查是否有任务执行，如此往复。微任务一般在当前循环就会优先执行，而宏任务会等到下一次循环，因此，**微任务一般比宏任务先执行，并且微任务队列只有一个，宏任务队列可能有多个**。

**当前执行栈执行完毕时会立刻先处理所有微任务队列中的事件，然后再去宏任务队列中取出一个事件。同一次事件循环中，微任务永远在宏任务之前执行**



#### 宏任务

- setTimeout()
- setInterval()
- setImmediate()
- 常见的点击和键盘等事件
- 主代码块（script）
- I/O操作
- UI交互事件



#### 微任务

- promise.then()、promise.catch()、promise.finally()
- new MutaionObserver()
- process.nextTick()
- async/await（实际上是promise的语法糖）



#### 执行过程：

在浏览器的异步回调队列中，宏任务和微任务的执行过程如下：

宏任务队列一次只从队列中取一个任务执行，执行完后就去执行微任务队列中的任务。
微任务队列中所有的任务都会被依次取出来执行，直到微任务队列为空。

若微任务在执行过程中产生了新的微任务，则继续执行微任务。

**在执行完所有的微任务之后，执行下一个宏任务之前，浏览器会执行 UI 渲染操作、更新界面（此时将权利交给GUI线程）。渲染完毕后，JS线程继续接管，开启下一个宏任务...**

![](E:\note\前端\笔记\js\eventloop\组成.jpg)



### async/await(微任务)执行顺序

> async/await成对出现，async标记的函数会返回一个Promise对象，可以使用then方法添加回调函数。在await之前的语句，await后面的语句会同步执行。但 await 下面的语句会被当成**微任务**添加到当前任务队列的末尾异步执行。

#### 一个🌰

```js
async function async1(){
    console.log('async1 start')
    await async2()
    console.log('async1 end')
}
async function async2(){
    console.log('async2')
}
console.log('script start')
setTimeout(function(){
    console.log('setTimeout') 
},0)  
async1();
new Promise(function(resolve){
    console.log('promise1')
    resolve();
}).then(function(){
    console.log('promise2')
})
console.log('script end')
```

打印结果为：

```
script start --> async1 start --> async2 --> promise1 --> script end --> async1 end
--> promise2 --> setTimeout
```

分析：

- 先定义函数async1，async2。输出同步代码 `script start`
- 将`setTimeout`里面的回调函数(宏任务)添加到下一轮任务队列。因为这段代码前面没有执行任何的异步操作且等待时间为0s。所以回调函数会被立刻放到下一轮任务队列的开头。
- 执行`async1`，因为async函数里面await标记之前的语句和 await 后面的语句是同步执行的，所以这里先后输出`async1 start`，`async2`。
- 这时暂停执行下面的语句，相当于变成一个promise.then，下面的语句被放到当前队列的最后。
- 继续执行同步任务。
- 输出`Promise1`。将then里面的函数放在当前队列的最后。
- 然后输出`script end`，此时同步任务执行完毕，微任务队列中有两个微任务。队列是先进先出的结构，所以这里先输出`async1 end`，再输出`Promise2`。
- 然后执行下一个宏任务，执行`setTimeout`里面的异步函数。输出`setTimout`。



#### 另一个🌰

```js
console.log('script start')

async function async1() {
    await async2()
    console.log('async1 end')
}
async function async2() {
    console.log('async2 end')
    return Promise.resolve().then(()=>{
        console.log('async2 end1')
    })
}
async1()

setTimeout(function() {
    console.log('setTimeout')
}, 0)

new Promise(resolve => {
    console.log('Promise')
    resolve()
})
.then(function() {
    console.log('promise1')
})
.then(function() {
    console.log('promise2')
})

console.log('script end')
```

打印结果：

```
script start
async2 end
Promise
script end
async2 end1
promise1
promise2
async1 end
setTimeout
```



#### 二者对比

分析：

这个例子和上面的第一个例子的区别是：

- 第一个例子的await 后面跟的是一个直接变量，这种情况直接相当于`把await下面的代码注册为promise.then(一个微任务)`。然后跳出async1函数，继续向下执行其他代码。
- 第二个例子是await后面跟的是一个异步函数的调用，此时`将这个异步函数放入微任务队列`，然后`保留async1函数的上下文（ 这里并不会动 await 下面的代码，也就是不会将它变成一个微任务 ）`，执行其他同步代码，当同步代码执行完毕后，此时微任务队列中第一个是async2函数里的异步，取出并执行，然后执行promise放入的两个微任务。目前微任务队列已经空了，然后`回到async1函数，并将await后面的代码注册为微任务并执行`。最后执行那个宏任务。





## 二、NodeJS 中的异步方法

NodeJS 中还有一些其他常见异步形式。

- 文件 I/O：异步加载本地文件。
- setImmediate()：与 setTimeout 设置 0ms 类似，在某些同步任务完成后立马执行。
- process.nextTick()：在某些同步任务完成后立马执行。
- server.close、socket.on(‘close’,…）等：关闭回调。



### 事件循环各阶段

在 NodeJS 中 JS 的执行，主要需要关心的过程分为以下几个阶段，下面每个阶段都有自己单独的任务队列，当执行到对应阶段时，就判断当前阶段的任务队列是否有需要处理的任务。

- **timers 阶段**：执行所有 setTimeout() 和 setInterval() 的回调。
- **pending callbacks 阶段**：某些系统操作的回调，如 TCP 链接错误。除了 timers、close、setImmediate 的其他大部分回调在此阶段执行。
- **poll 阶段**：轮询等待新的链接和请求等事件，执行 I/O 回调等。V8 引擎将 JS 代码解析并传入 Libuv 引擎后首先进入此阶段。如果此阶段任务队列已经执行完了，则进入 check 阶段执行 setImmediate 回调（如果有 setImmediate），或等待新的任务进来（如果没有 setImmediate）。在等待新的任务时，如果有 timers 计时到期，则会直接进入 timers 阶段。此阶段可能会阻塞等待。
- **check 阶段**：`setImmediate` 回调函数执行。
- **close callbacks 阶段**：关闭回调执行，如 socket.on(‘close’, …)。

![](E:\note\前端\笔记\js\eventloop\nodejs2.jpg)

上面每个阶段都会去执行完当前阶段的任务队列，然后继续执行当前阶段的微任务队列，只有当前阶段所有微任务都执行完了，才会进入下个阶段。



### poll

如果当前已经存在定时器，而且有定时器到时间了，拿出来执行，eventLoop 将回到 timers 阶段。

如果没有定时器, 会去看回调函数队列。

- 如果 poll 队列不为空，会遍历回调队列并同步执行，直到队列为空或者达到系统限制
- 如果 poll 队列为空时，会有两件事发生
  - 如果有 setImmediate 回调需要执行，poll 阶段会停止并且进入到 check 阶段执行回调
  - 如果没有 setImmediate 回调需要执行，会等待回调被加入到队列中并立即执行回调，这里同样会有个超时时间设置防止一直等待下去,一段时间后自动进入 check 阶段。




### process.nextTick()

process.nextTick()比 promise.then() 的执行还早，在同步任务之后，其他所有异步任务之前，会优先执行 nextTick。可以想象是把 nextTick 的任务放到了当前循环的后面，与 promise.then() 类似，但比 promise.then() 更前面。

意思就是在当前同步代码执行完成后，不管其他异步任务，先尽快执行 nextTick。

> process.nextTick 是一个独立于 eventLoop 的任务队列。
>
> 在每一个 eventLoop 阶段完成后会去检查 nextTick 队列，如果里面有任务，会让这部分任务优先于微任务执行。



### 一个🌰

```js
async function async1() {
  console.log('async start')
  await async2()
  console.log('async1 end')
}

async function async2() {
  console.log('async2')
}

console.log('script start')

setTimeout(function () {
  console.log('setTimeout0')
},0)

setTimeout(function () {
  console.log('setTimeout2')
},300)

setImmediate(() => console.log('setImmediate'))

process.nextTick(() => console.log('nextTick1'))

async1()

process.nextTick(() => console.log('nextTick2'))

new Promise(function (resolve) {
  console.log('promise1')
  resolve()
  console.log('promise2')
}).then(function () {
  console.log('promise3')
})

console.log('script end')
```

打印结果：

```
script start
async start
async2
promise1
promise2
script end
nextTick1
nextTick2
async1 end
promise3
setTimeout0
setImmediate
setTimeout2
```

**分析**：

对应的队列有：

```
 ① main script      ② nextTick        ③ other micro         ④ timers         ⑤ check
```

timers里面主要放setTimeout() 和 setInterval() --> 宏任务

check里面放setImmediate() --> 宏任务

注意：**setTimeout() 和 setInterval() 在 setImmediate() 之前执行**



- 首先定义async1() 和 async2()，然后执行同步代码`script start`。
- 然后将`setTimeout0`加入timers队列，而对于`setTimeout2`会先进行定时器执行300ms,此时还没有进入timers队列。
- 然后将`setImmediate`放入check队列。
- 接下来将`nextTick1`放入nextTick队列。
- 执行async1(),输出`async1 satrt`,然后跳到async2()中，输出`async2`,再回到async1()中，将`async1 end`放入other micro队列中。
- 接下来将`nextTick2`放入nextTick队列。
- 此时执行Promsie中的同步代码`promise1`，将then的`promise3`放入other micro队列中，继续输出`promise2`。
- 接下来输出`script end`。此时同步代码已经执行完毕。
- 因为nextTick的优先级高，所以依次执行`nextTick1`和`nextTick2`。
- 然后执行other micro队列中的代码，输出`async1 end`,再输出`promise3`。
- 此时微任务队列已为空，执行宏任务队列，先输出`setTimeout0`，然后执行check队列，输出`setImmediate`
- `注意，此时setTimeout2的定时器执行完毕后，将它加入timers队列`，然后取出执行，输出`setTimeout2`。



## 三、node 和 浏览器 eventLoop的主要区别

两者最主要的区别在于浏览器中的微任务是在每个相应的宏任务中执行的，而nodejs中的微任务是在不同阶段之间执行的。