[TOC]





## 一、Promise是什么

### Ⅰ基本理解

#### 1. 概念:

Promise是**异步编程的一种解决方案**，比传统的解决方案（回调函数和事件）更合理和更强大。

所谓Promise，简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果。



* Pending  正在做
* Resolved 完成这个承诺
* Rejected 这个承诺没有完成，失败了



Promise 用来预定一个不一定能完成的任务，要么成功，要么失败



Promise 是异步编程的一种解决方案，**主要用来解决回调地狱的问题，可以有效的减少回调嵌套**。真正解决需要配合`async/await`



#### 2. 特点:

- 对象的状态不受外界影响。Promise对象代表一个异步操作，有三种状态：Pending（进行中）、Resolved（已完成，又称Fulfilled）和Rejected（已失败）。只有异步操作的结果，可以决定当前是哪一种状态，任何其他操作都无法改变这个状态。

- 一旦状态改变，就不会再变，任何时候都可以得到这个结果。Promise对象的状态改变，只有两种可能：从Pending变为Resolved和从Pending变为Rejected。只要这两种情况发生，状态就凝固了，不会再变了，会一直保持这个结果。就算改变已经发生了，你再对Promise对象添加回调函数，也会立即得到这个结果。



#### 3. 缺点:

- 无法取消Promise，一旦新建它就会立即执行，无法中途取消。和一般的对象不一样，无需调用。

- 如果不设置回调函数，Promise内部抛出的错误，不会反应到外部。

- 当处于Pending状态时，无法得知目前进展到哪一个阶段（刚刚开始还是即将完成）





### Ⅱ Promise的状态

#### ① promise 的状态

>实例对象中的一个属性 『PromiseState』
>
>* pending  未决定的
>* resolved / fullfilled  成功
>* rejected  失败



#### ② promise 的状态改变

>1. pending 变为 resolved 
>
>2. pending 变为 rejected
>
>  说明: `只有这 2 种`, 且一个 promise 对象`只能改变一次` 无论变为成功还是失败, 都会有一个结果数据 成功的结果数据一般称为 value, 失败的结果数据一般称为 reason



### Ⅲ 基本流程

![](E:\note\前端\笔记\ajax、promise\promise图片\基本流程.png)



### Ⅳ promise基本使用

#### 1.使用 promise 封装基于定时器的异步

```js

 function doDelay(time) {
    // 1. 创建 promise 对象(pending 状态), 指定执行器函数
    return new Promise((resolve, reject) => {
      // 2. 在执行器函数中启动异步任务
      console.log('启动异步任务')
      setTimeout(() => {
        console.log('延迟任务开始执行...')
        const time = Date.now() // 假设: 时间为奇数代表成功, 为偶数代表失败
        if (time % 2 === 1) { // 成功了
          // 3. 1. 如果成功了, 调用 resolve()并传入成功的 value
          resolve('成功的数据 ' + time)
        } else { // 失败了
          // 3.2. 如果失败了, 调用 reject()并传入失败的 reason
          reject('失败的数据 ' + time)
        }
      }, time)
    })
  }

const promise = doDelay(2000)
promise.then(// promise 指定成功或失败的回调函数来获取成功的 vlaue 或失败的 reason
    value => {// 成功的回调函数 onResolved, 得到成功的 vlaue
      console.log('成功的 value: ', value)
    },
    reason => { // 失败的回调函数 onRejected, 得到失败的 reason
      console.log('失败的 reason: ', reason)
    }
  ) 

```



#### 2.使用 promise 封装 ajax 异步请求

```js

  /*
  可复用的发 ajax 请求的函数: xhr + promise
  */
function promiseAjax(url) {
    return new Promise((resolve, reject) => {
      const xhr = new XMLHttpRequest()
      xhr.onreadystatechange = () => {
        if (xhr.readyState !== 4) return
          
        const {
          status,
          response
        } = xhr
        
        // 请求成功, 调用 resolve(value)
        if (status >= 200 && status < 300) {
          resolve(JSON.parse(response))
        } else { // 请求失败, 调用 reject(reason)
          reject(new Error('请求失败: status: ' + status))
        }
      }
      xhr.open("GET", url)
      xhr.send()
    })
  }

promiseAjax('https://api.apiopen.top2/getJoke?page=1&count=2&type=vid
    eo ')
    .then(
      data => {
        console.log('显示成功数据', data)
      },
      error => {
        alert(error.message)
      }
    )
```



#### 3.fs模块使用Promise

```js
const fs = require('fs');

//回调函数 形式----------------------------------------------------
 fs.readFile('./resource/content.txt', (err, data) => {
     // 如果出错 则抛出错误
     if(err)  throw err;
     //输出文件内容
     console.log(data.toString());
 });

//Promise 形式-----------------------------------------------------------
/**
 * 封装一个函数 mineReadFile 读取文件内容
 * 参数:  path  文件路径
 * 返回:  promise 对象
 */
function mineReadFile(path){
    return new Promise((resolve, reject) => {
        //读取文件
        require('fs').readFile(path, (err, data) =>{
            //判断
            if(err) reject(err);
            //成功
            resolve(data);
        });
    });
}

mineReadFile('./resource/content.txt')
.then(value=>{
    //输出文件内容
    console.log(value.toString());
}, reason=>{
    console.log(reason);
});

```



## 二、为什么要用Promise

### ① 指定回调函数的方式更加灵活

1. 旧的: 必须在启动异步任务前指定 
2. promise: 启动异步任务 => 返回promie对象 => 给promise对象绑定回调函 数(甚至可以在异步任务结束后指定/多个)
3. 



### ② 支持链式调用, 可以解决回调地狱问题

#### 1. 什么是回调地狱

**回调函数嵌套调用, 外部回调函数异步执行的结果是嵌套的回调执行的条件**

![](E:\note\前端\笔记\ajax、promise\promise图片\回调地狱.jpg)



#### 2. 回调地狱的缺点?

不便于阅读 不便于异常处理



#### 3. 解决方案

promise `链式调用`,

用来解决回调地狱问题，但是`只是简单的改变格式`，并没有彻底解决上面的问题真正要解决上述问题，一定要利用promise再加上await和async关键字实现异步传同步

**终极解决方案**

> promise +async/await





以上笔记均来自b站尚硅谷的《promise从入门到精通》的视频学习。
