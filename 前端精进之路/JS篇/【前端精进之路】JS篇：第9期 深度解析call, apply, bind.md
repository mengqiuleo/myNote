[TOC]



## 写在前面

这里是小飞侠Pan🥳，立志成为一名优秀的前端程序媛！！！

本篇文章收录于我的专栏：[前端精进之路](https://blog.csdn.net/weixin_52834435/category_11886356.html?spm=1001.2014.3001.5482)

同时收录于我的[github](https://github.com/mengqiuleo)前端笔记仓库中，持续更新中，欢迎star~

👉[https://github.com/mengqiuleo/myNote](https://github.com/mengqiuleo/myNote)

<hr>

call，apply，bind 这三个函数是 Function原型上的方法 `Function.prototype.call()`，`Function.prototype.apply`，`Function.prototype.bind()`，所有的函数都是 `Funciton` 的实例，因此所有的函数可以调用call，apply，bind 这三个方法。



## call 与 apply

第一个参数都是`this`要指向的对象，如果如果没有这个参数或参数为`undefined`或`null`，则默认指向全局`window`

如果你使用的时候不关心 this是谁的话，可以直接设置为 null

都可以传参，但是`apply`是数组，而`call`是参数列表，且`apply`和`call`是一次性传入参数

`apply`、`call` 则是立即执行



### 实现一个call

- 将函数设置为对象的属性
- 指定this到函数并传入给定参数执行函数
- 执行&删除这个函数，返回函数执行结果

```js
Function.prototype.myCall = function(thisArg = window) {
    thisArg = thisArg ? Object(thisArg) : window;
    // this指向当前函数，thisArg是要绑定的对象，这里给对象绑定了属性fn，属性值是要执行的函数
    thisArg.fn = this;
    // 第一个参数为 this，所以要取剩下的参数
    const args = [...arguments].slice(1);
    // 执行函数
    const result = thisArg.fn(...args);
    // thisArg上并不存在fn，所以需要移除
    delete thisArg.fn;
    return result;
}

function foo() {
    console.log(this.name);
}
const obj = {
    name: 'litterStar'
}
const bar = function() {
    foo.myCall(obj);
}
bar();
// litterStar
```



### 实现一个apply

实现一个apply 过程很call类似，只是参数不同，

```js
Function.prototype.myApply = function(thisArg = window) {
    thisArg.fn = this;
    let result;
    // 判断是否有第二个参数
    if(arguments[1]) {
        // apply方法调用的时候第二个参数是数组，所以要展开arguments[1]之后再传入函数
        result = thisArg.fn(...arguments[1]);
    } else {
        result = thisArg.fn();
    }
    delete thisArg.fn;
    return result;
}
```



## bind

bind() 方法创建一个新的函数，在 bind() 被调用时，这个新函数的 this 被指定为 bind() 的第一个参数，而其余参数将作为新函数的参数，供调用时使用。

```js
Function.prototype.myBind = function(thisArg) {
    thisArg = thisArg ? Object(thisArg) : window;
    // 保存当前函数的this
    const fn = this;
    // 保存原先的参数
    const args = [...arguments].slice(1);
    // 返回一个新的函数
    return function() {
        // 再次获取新的参数
        const newArgs = [...arguments];
        /**
         * 1.修改当前函数的this为thisArg
         * 2.将多次传入的参数一次性传入函数中
        */
        return fn.apply(thisArg, args.concat(newArgs))
    }
}

const obj1 = {
    name: 'litterStar',
    getName() {
        console.log(this.name)
    }
}
const obj2 = {
    name: 'luckyStar'
}

const fn = obj1.getName.myBind(obj2)
fn(); // luckyStar
```

