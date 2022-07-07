[TOC]



## 写在前面

这里是小飞侠Pan🥳，立志成为一名优秀的前端程序媛！！！

本篇文章收录于我的专栏：[前端精进之路](https://blog.csdn.net/weixin_52834435/category_11886356.html?spm=1001.2014.3001.5482)

同时收录于我的[github](https://github.com/mengqiuleo)前端笔记仓库中，持续更新中，欢迎star~

👉[https://github.com/mengqiuleo/myNote](https://github.com/mengqiuleo/myNote)

<hr/>



**提问：**

1. 什么是闭包？
2. 闭包有哪些实际运用场景？
3. 闭包是如何产生的？
4. 闭包产生的变量如何被回收？

 

## 一、什么是闭包

闭包是指**有权访问另一个函数作用域中变量**的函数，创建闭包的最常见的方式就是在一个函数内创建另一个函数，创建的函数可以访问到当前函数的局部变量。

在 JS 中，闭包存在的意义就是让我们可以间接访问函数内部的变量。



## 二、产生闭包的条件

1.函数嵌套

2.内部函数引用了外部函数的数据(变量/函数)。

PS：还有一个条件是**外部函数被调用，内部函数被声明**。比如：

```javascript
    function fn1() {
        var a = 2
        var b = 'abc'

        function fn2() { //fn2内部函数被提前声明，就会产生闭包(不用调用内部函数)
            console.log(a)
        }

    }

    fn1();

    function fn3() {
        var a = 3
        var fun4 = function () {  //fun4采用的是“函数表达式”创建的函数，此时内部函数的声明并没有提前
            console.log(a)
        }
    }

    fn3();

```



## 三、闭包变量存储的位置

> 直接说明：**闭包中的变量存储的位置是堆内存。**

- 假如闭包中的变量存储在栈内存中，那么栈的回收 会把处于栈顶的变量自动回收。所以闭包中的变量如果处于栈中那么变量被销毁后，闭包中的变量就没有了。所以闭包引用的变量是出于堆内存中的。

### 画图理解闭包的存储位置

👉 [【JavaScript】闭包的存储位置](https://blog.csdn.net/weixin_52834435/article/details/123650442)



### JS 堆栈内存释放

- 堆内存：存储引用类型值，对象类型就是键值对，函数就是代码字符串。
- 堆内存释放：将引用类型的空间地址变量赋值成 `null`，或没有变量占用堆内存了浏览器就会释放掉这个地址
- 栈内存：提供代码执行的环境和存储基本类型值。
- 栈内存释放：一般当函数执行完后函数的私有作用域就会被释放掉。

> **但栈内存的释放也有特殊情况：① 函数执行完，但是函数的私有作用域内有内容被栈外的变量还在使用的，栈内存就不能释放里面的基本值也就不会被释放。② 全局下的栈内存只有页面被关闭的时候才会被释放**




## 四、常见的闭包

- 将一个函数作为另一个函数的返回值
- 将函数作为实参传递给另一个函数调用。

#### 闭包1：将一个函数作为另一个函数的返回值

```js
    function fn1() {
      var a = 2

      function fn2() {
        a++
        console.log(a)
      }
      return fn2
    }

    var f = fn1();   //执行外部函数fn1，返回的是内部函数fn2
    f() // 3       //执行fn2
    f() // 4       //再次执行fn2

```

当f()第二次执行的时候，a加1了，也就说明了：闭包里的数据没有消失，而是保存在了内存中。如果没有闭包，代码执行完倒数第三行后，变量a就消失了。

上面的代码中，虽然调用了内部函数两次，但是，闭包对象只创建了一个。

也就是说，要看闭包对象创建了一个，就看：**外部函数执行了几次**（与内部函数执行几次无关）。



#### 闭包2. 将函数作为实参传递给另一个函数调用

**使用回调函数就是在使用闭包**

```js
    function showDelay(msg, time) {
      setTimeout(function() {  //这个function是闭包，因为是嵌套的子函数，而且引用了外部函数的变量msg
        alert(msg)
      }, time)
    }
    showDelay('atguigu', 2000)
```

上面的代码中，闭包是里面的function，因为它是嵌套的子函数，而且引用了外部函数的变量msg。



#### 闭包3.函数作为参数

```js
var a = 'cba'
function foo(){
    var a = 'foo'
    function fo(){
        console.log(a)
    }
    return fo
}

function f(p){
    var a = 'f'
    p()
}
f(foo())
/* 输出
*   foo
/ 

```

> 使用 return `fo` 返回回来，`fo()` 就是闭包，`f(foo())` 执行的参数就是函数 `fo`，因为 `fo() 中的 a` 的上级作用域就是函数`foo()`，所以输出就是`foo`



#### 闭包4. IIFE（自执行函数）

```js
var n = 'cba';
(function p(){
    console.log(n)
})()
/* 输出
*   cba
/ 

```

同样也是产生了闭包`p()`，存在 `window`下的引用 `n`。



#### 闭包5. 循环赋值

```js
for(var i = 0; i<10; i++){
  (function(j){
       setTimeout(function(){
        console.log(j)
    }, 1000) 
  })(i)
}

```



#### 闭包6.节流防抖

```js
// 防抖
function debounce(fn, delay = 300) {
  //默认300毫秒
  let timer;
  return function () {
    const args = arguments;
    if (timer) {
      clearTimeout(timer);
    }
    timer = setTimeout(() => {
      fn.apply(this, args); // 改变this指向为调用debounce所指的对象
    }, delay);
  };
}

window.addEventListener(
  "scroll",
  debounce(() => {
    console.log(111);
  }, 1000)
);

// 节流
// 设置一个标志
function throttle(fn, delay) {
  let flag = true;
  return () => {
    if (!flag) return;
    flag = false;
    timer = setTimeout(() => {
      fn();
      flag = true;
    }, delay);
  };
}

window.addEventListener(
  "scroll",
  throttle(() => {
    console.log(111);
  }, 1000)
);

```







## 五、闭包的作用

- 作用1. 使用函数内部的变量在函数执行完后, 仍然存活在内存中(延长了局部变量的生命周期)

- 作用2. 让函数外部可以操作(读写)到函数内部的数据(变量/函数)



## 六、闭包的生命周期

1. 产生: 嵌套内部函数fn2被声明时就产生了(不是在调用)

2. 死亡: 嵌套的内部函数成为垃圾对象时。（比如f = null，就可以让f成为垃圾对象。意思是，此时f不再引用闭包这个对象了

#### 闭包何时被销毁？-垃圾回收机制

什么时候闭包被销毁？

最终结论-如果没有特殊的垃圾回收算法（暂时没有搜索到有这种算法）会造成闭包常驻！除非手动设置为null 否则就会造成内存泄露！



## 七、闭包的缺点及解决

缺点：函数执行完后, 函数内的局部变量没有释放，占用内存时间会变长，容易造成内存泄露。


解决：能不用闭包就不用，及时释放。比如：

```javascript
    f = null;  // 让内部函数成为垃圾对象 -->回收闭包
```

总而言之，你需要它，就是优点；你不需要它，就成了缺点。



## 八、内存溢出和内存泄露

#### 内存溢出

**内存溢出**：一种程序运行出现的错误。当程序运行**需要的内存**超过了剩余的内存时, 就出抛出内存溢出的错误。

代码举例：

```javascript
    var obj = {};
    for (var i = 0; i < 10000; i++) {
    obj[i] = new Array(10000000);  //把所有的数组内容都放到obj里保存，导致obj占用了很大的内存空间
    console.log("-----");
    }
```



#### 内存泄漏

**内存泄漏**：**占用的内存**没有及时释放。

注意，内存泄露的次数积累多了，就容易导致内存溢出。

**常见的内存泄露**：

- 1.意外的全局变量

- 2.没有及时清理的计时器或回调函数

- 3.闭包


情况1举例：

```javascript
    // 意外的全局变量
    function fn() {
        a = new Array(10000000);
        console.log(a);
    }

    fn();
```

情况2举例：

```javascript
    // 没有及时清理的计时器或回调函数
    var intervalId = setInterval(function () { //启动循环定时器后不清理
        console.log('----')
    }, 1000)

    // clearInterval(intervalId);  //清理定时器
```

情况3举例：

```html
<script type="text/javascript">
  function fn1() {
    var a = 4;
    function fn2() {
      console.log(++a)
    }
    return fn2
  }
  var f = fn1()
  f()

  // f = null //让内部函数成为垃圾对象-->回收闭包
</script>
```



## 九、经典面试题

### 例题一：

```js
for(var i = 0;i < 5;i++) {
  setTimeout(function() {
    console.log(i);
  },4000)
}
console.log(i)
```

当`console.log`被调用的时候，匿名函数保持对外部变量的引用，这个时候`for` 循环早就已经运行结束，输出的`i`值也就一直是`5`。

因为 setTimeout 是个异步函数，所以会先把循环全部执行完毕，这时候 i 就是 5 了，所以会输出一堆 5。



**解决办法**

- 第一种是使用闭包的方式

```js
for(var i=0;i<5;i++){
  (function(x) {
    setTimeout(function() {
      console.log(x++)
    },4000)
  })(i);
}
```

外部套着的这个函数不会像`setTimeout`一样延迟，而是直接立即执行，并且把`i`作为他的参数，这个时候`x`就是对`i`的一个拷贝。当时间达到后，传给`setTimeout`的时候，传递的是`x`的引用。这个值是不会被循环所改变的。

解释：

首先创建全局执行上下文，进入for循环，第一轮循环需要执行立即执行函数，于是创建立即执行函数的上下文，这里`i=0`，那么`x=0`，因为是异步，浏览器将处理的结果放入任务队列，也就是将数值0放入任务队列，此时立即执行函数的上下文从栈中弹出，回到全局执行上下文，进入第二次for循环，此时`i=1`,需要执行立即执行函数，创建立即执行函数的上下文，将数值1放入任务队列，立即执行函数的上下文从栈中弹出，后面的三次循环一样。

当全局的代码执行完毕后，执行异步代码，此时将任务队列里面的数值依次输出。



- 第二种就是使用 `setTimeout` 的第三个参数，这个参数会被当成 `timer` 函数的参数传入。

```js
for (var i = 1; i < 5; i++) {
  setTimeout(
    function timer(j) {
      console.log(j)
    },
    4000,
    i
  )
}
```



- 第三种就是使用 `let` 定义 `i` 了来解决问题了，这个也是最为推荐的方式

```js
for (let i = 1; i <5 5; i++) {
  setTimeout(function timer() {
    console.log(i)
  }, 4000)
}
```



### 例题二：

```js
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = function () {
    console.log(i);
  };
}

data[0]();//3
data[1]();//3
data[2]();//3
```

让我们分析一下原因：

此时data的数组的样子：

```js
data[0] = function(){console.log(i)}
data[1] = function(){console.log(i)}
data[2] = function(){console.log(i)}
```

而i是全局变量，循环结束后，i此时为3。

当执行到 data[0] 函数之前，此时全局上下文的 VO 为：

```
globalContext = {
    VO: {
        data: [...],
        i: 3
    }
}
```

当执行 data[0] 函数的时候，data[0] 函数的作用域链为：

```
data[0]Context = {
    Scope: [AO, globalContext.VO]
}
```

data[0]Context 的 AO 并没有 i 值，所以会从 globalContext.VO 中查找，i 为 3，所以打印的结果就是 3。

data[1] 和 data[2] 是一样的道理。

改造成闭包：

```js
var data = [];

for (var i = 0; i < 3; i++) {
  data[i] = (function (i) {
        return function(){
            console.log(i);
        }
  })(i);
}

data[0]();
data[1]();
data[2]();
```

当执行到 data[0] 函数之前，此时全局上下文的 VO 为：

```js
globalContext = {
    VO: {
        data: [...],
        i: 3 //因为for循环已经结束，i是全局变量
    }
}
```

跟没改之前一模一样。

当执行 data[0] 函数的时候，data[0] 函数的作用域链发生了改变：

```
data[0]Context = {
    Scope: [AO, 匿名函数Context.AO globalContext.VO]
}
```

匿名函数执行上下文的AO为：

```
匿名函数Context = {
    AO: {
        arguments: {
            0: 0,
            length: 1
        },
        i: 0
    }
}
```

data[0]Context 的 AO 并没有 i 值，所以会沿着作用域链从匿名函数 Context.AO 中查找，这时候就会找 i 为 0，找到了就不会往 globalContext.VO 中查找了，即使 globalContext.VO 也有 i 的值(值为3)，所以打印的结果就是0。

data[1] 和 data[2] 是一样的道理。



### 例题三：

我们要实现这样的一个需求: 点击某个按钮, 提示"点击的是第n个按钮",此处我们先不用事件代理:

```js
<button>测试1</button>
<button>测试2</button>
<button>测试3</button>
<script type="text/javascript">
   var btns = document.getElementsByTagName('button')
    for (var i = 0; i < btns.length; i++) {
      btns[i].onclick = function () {
        console.log('第' + (i + 1) + '个')
      }
    }
</script>  
```

万万没想到，点击任意一个按钮，后台都是弹出“第四个”,这是因为i是全局变量,执行到点击事件时，此时i的值为3。那该如何修改，最简单的是用let声明i

```
 for (let i = 0; i < btns.length; i++) {
      btns[i].onclick = function () {
        console.log('第' + (i + 1) + '个')
      }
    }
```

另外我们可以通过闭包的方式来修改:

```
   for (var i = 0; i < btns.length; i++) {
      (function (j) {
        btns[j].onclick = function () {
          console.log('第' + (j + 1) + '个')
        }
      })(i)
    }
```





## 总结

> Like most modern programming languages, JavaScript uses lexical scoping. This means that functions are executed using the variable scope that was in effect when they were defined, not the variable scope that is in effect when they are invoked. In order to implement lexical scoping, the internal state of a JavaScript function object must in- clude not only the code of the function but also a reference to the current scope chain. (Before reading the rest of this section, you may want to review the material on variable scope and the scope chain in §3.10 and §3.10.3.) This combination of a function object and a scope (a set of variable bindings) in which the function’s variables are resolved is called a closure in the computer science literature. (This is an old term that refers to the fact that the function’s variables have bindings in the scope chain and that therefore the function is “closed over” its variables.)
>
> Technically, all JavaScript functions are closures: they are objects, and they have a scope chain associated with them. Most functions are invoked using the same scope chain that was in effect when the function was defined, and it doesn’t really matter that there is a closure involved. Closures become interesting when they are invoked under a different scope chain than the one that was in effect when they were defined. This happens most commonly when a nested function object is returned from the function within which it was defined. There are a number of powerful programming techniques that involve this kind of nested function closures, and their use has become relatively common in JavaScript programming. Closures may seem confusing when you first en- counter them, but it is important that you understand them well enough to use them comfortably.
>
> *JavaScript, The Definite Guide*

翻译成中文的话也许是这样：

和大多数的现代化编程语言一样，`JavaScript`是采用词法作用域的，这就意味着函数的执行依赖于函数定义的时候所产生（而不是函数调用的时候产生的）的变量作用域。为了去实现这种词法作用域，`JavaScript`函数对象的内部状态不仅包含函数逻辑的代码，除此之外还包含当前作用域链的引用。函数对象可以通过这个作用域链相互关联起来，如此，函数体内部的变量都可以保存在函数的作用域内，这在计算机的文献中被称之为闭包。

从技术的角度去将，所有的`JavaScript`函数都是闭包：他们都是对象，他们都有一个关联到他们的作用域链。绝大多数函数在调用的时候使用的作用域链和他们在定义的时候的作用域链是相同的，但是这并不影响闭包。当调用函数的时候闭包所指向的作用域链和定义函数时的作用域链不是同一个作用域链的时候，闭包become interesting。这种interesting的事情往往发生在这样的情况下： 当一个函数嵌套了另外的一个函数，外部的函数将内部嵌套的这个函数作为对象返回。一大批强大的编程技术都利用了这类嵌套的函数闭包，当然，`javascript`也是这样。可能你第一次碰见闭包觉得比较难以理解，但是去明白闭包然后去非常自如的使用它是非常重要的。



**用童话故事解释闭包**

建议看一下，很有意思👍🏻。

> **Once upon a time:**
>
> There was a princess...
>
> ```js
> function princess() {
> ```
>
> She lived in a wonderful world full of adventures. She met her Prince Charming, rode around her world on a unicorn, battled dragons, encountered talking animals, and many other fantastical things.
>
> ```js
>  var adventures = [];
> 
>  function princeCharming() { /* ... */ }
> 
>  var unicorn = { /* ... */ },
>      dragons = [ /* ... */ ],
>      squirrel = "Hello!";
> 
>  /* ... */
> ```
>
> But she would always have to return back to her dull world of chores and grown-ups.
>
> ```js
>  return {
> ```
>
> And she would often tell them of her latest amazing adventure as a princess.
>
> ```js
>      story: function() {
>          return adventures[adventures.length - 1];
>      }
>  };
> }
> ```
>
> But all they would see is a little girl...
>
> ```js
> var littleGirl = princess();
> ```
>
> ...telling stories about magic and fantasy.
>
> ```js
> littleGirl.story();
> ```
>
> And even though the grown-ups knew of real princesses, they would never believe in the unicorns or dragons because they could never see them. The grown-ups said that they only existed inside the little girl's imagination.
>
> But we know the real truth; that the little girl with the princess inside...
>
> ...is really a princess with a little girl inside.
>
> 
>
> [原文链接](https://stackoverflow.com/questions/111102/how-do-javascript-closures-work/6472397#6472397)



**参考文章**

[JavaScript深入之闭包](https://github.com/mqyqingfeng/Blog/issues/9#)

[深入浅出Javascript闭包](https://github.com/ljianshu/Blog/issues/6#)