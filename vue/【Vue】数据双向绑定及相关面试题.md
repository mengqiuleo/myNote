# 【Vue】数据双向绑定相关面试题

[TOC]

## 前置知识：

实现一个vue的简易数据双向绑定:

[【vue】双向数据绑定（一）--发布订阅模式](https://blog.csdn.net/weixin_52834435/article/details/124537952?spm=1001.2014.3001.5501)

[【vue】双向数据绑定（二）-- 实现vue的数据劫持与发布订阅](https://blog.csdn.net/weixin_52834435/article/details/124537907?spm=1001.2014.3001.5501)



## 数据的双向绑定：

1、实现一个监听器 `Observer` ，用来劫持并监听所有属性，如果属性发生变化，就通知订阅者；

2、实现一个订阅器 `Dep`，用来收集订阅者，对监听器 `Observer` 和 订阅者 `Watcher` 进行统一管理；

3、实现一个订阅者 `Watcher`，可以收到属性的变化通知并执行相应的方法，从而更新视图；

4、实现一个解析器 `Compile`，可以解析每个节点的相关指令，对模板数据和订阅器进行初始化。


![](E:\note\前端\笔记\vue\双向数据绑定\流程图.jpg)



### 监听器 Observer

每次数据读或写时，我们能感知到数据被读取了或数据被改写了。要使数据变得“可观测”，`Vue 2.0` 源码中用到 `Object.defineProperty()` 来劫持各个数据属性的 `setter / getter`。



将 `Object.defineProperty()` 来劫持各个数据属性的 `setter / getter` 封装在 `defineReactive()` 函数中

```js
/**
  * 循环遍历数据对象的每个属性
  */
function observable(obj) {
    if (!obj || typeof obj !== 'object') {
        return;
    }
    let keys = Object.keys(obj);
    keys.forEach((key) => {
        defineReactive(obj, key, obj[key])
    })
    return obj;
}


/**
 * 将对象的属性用 Object.defineProperty() 进行设置
 */
function defineReactive(obj, key, val) {
    Object.defineProperty(obj, key, {
        get() {
            console.log(`${key}属性被读取了...`);
            return val;
        },
        set(newVal) {
            console.log(`${key}属性被修改了...`);
            val = newVal;
        }
    })
}
```



### 订阅器 Dep

- 负责进行**依赖收集**
- 首先，有个**数组**，专门来存放所有的订阅信息
- 其次，还要提供一个向数组中追加订阅信息的方法 --> addSub()
- 然后，还要提供一个循环，循环触发数组中的每个订阅信息 --> notify()



### 订阅者 Watcher

订阅者 `Watcher` 在初始化的时候需要将自己添加进订阅器 `Dep` 中，

负责**订阅一些事件**，将自己的一些行为交给了 Dep类，放在 Dep数组中。

当以后到了一定时机， Dep类负责对每一个行为进行循环，然后触发。此时 Watcher类就可以收到通知。



### 解析器 Compile

实现一个解析器 `Compile` 来做解析和绑定 Dom,

- 解析模板指令，并替换模板数据，初始化视图；
- 将模板指令对应的节点绑定对应的更新函数，初始化相应的订阅器；



### 总结 --> 如何实现数据双向绑定：

Vue 主要通过以下 4 个步骤来实现数据双向绑定的：

- 实现一个`监听器 Observer`：对数据对象进行遍历，包括子属性对象的属性，利用 Object.defineProperty() 对属性都加上 setter 和 getter。这样的话，给这个对象的某个值赋值，就会触发 setter，那么就能监听到了数据变化。

- 实现一个`解析器 Compile`：解析 Vue 模板指令，将模板中的变量都替换成数据，然后初始化渲染页面视图，并将每个指令对应的节点绑定更新函数，添加监听数据的订阅者，一旦数据有变动，收到通知，调用更新函数进行数据更新。

- 实现一个`订阅者 Watcher`：每个组件实例都对应一个 watcher 实例，Watcher 订阅者是 Observer 和 Compile 之间通信的桥梁 ，主要的任务是订阅 Observer 中的属性值变化的消息，当收到属性值变化的消息时，触发解析器 Compile 中对应的更新函数。

  Watcher 主要做的事情是： ① 在自身实例化时往属性订阅器(dep)里面添加自己； ② 自身必须有一个update()方法； ③ 待属性变动dep.notice()通知时，能调用自身的update()方法，并触发Compile中绑定的回调，则功成身退。

- 实现一个`订阅器 Dep`：订阅器采用 发布-订阅 设计模式，用来收集订阅者 Watcher，对监听器 Observer 和 订阅者 Watcher 进行统一管理。




## 相关题目一：Vue 如何检测数组变化

### 为什么只对对象劫持，而要对数组进行方法重写？

因为对象最多也就几十个属性，拦截起来数量不多，但是数组可能会有几百几千项，拦截起来非常耗性能，所以直接重写数组原型上的方法，是比较节省性能的方案

> 数组考虑性能原因没有用 defineProperty 对数组的每一项进行拦截，而是选择对 7 种数组（push,shift,pop,splice,unshift,sort,reverse）方法进行重写

举例：

```js
    //！！！对数组方法进行重写：
    //原来的 oldArrayProto用来执行数组上的方法(比如 push,pop,shift)
    //新的 newArrProto 用来体现视图的更新
    const oldArrayProto = Array.prototype;
    const newArrProto = Object.create(oldArrayProto);
    ['push','pop','shift','unshift','splice','reverse','sort'].forEach(methodName => {
      newArrProto[methodName] = function() {
        console.log('更新视图 --> 数组');
        oldArrayProto[methodName].call(this,...arguments);        
      }
    })
```

并且在 observer() 函数中，监测是否为数组

```js
      //判断是否是数组！！！
      if(Array.isArray(target)) {
        target.__proto__ = newArrProto;
      }
```



完整代码：

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <h1>Vue响应式</h1>

  <script>
    const data = {
      name:'zs',
      age:18,
      friend:{
        friendName:'ls'
      },
      colors:['red','orange','green']
    }

    //！！！对数组方法进行重写：
    //原来的 oldArrayProto用来执行数组上的方法(比如 push,pop,shift)
    //新的 newArrProto 用来体现视图的更新
    const oldArrayProto = Array.prototype;
    const newArrProto = Object.create(oldArrayProto);
    ['push','pop','shift','unshift','splice','reverse','sort'].forEach(methodName => {
      newArrProto[methodName] = function() {
        console.log('更新视图 --> 数组');
        oldArrayProto[methodName].call(this,...arguments);        
      }
    })

    //变成响应式数据
    observer(data);

    function observer(target) {
      if(typeof target !== 'object' || target === null) {
        return target;
      }

      //判断是否是数组！！！
      if(Array.isArray(target)) {
        target.__proto__ = newArrProto;
      }

      for(let key in target) {
        defineReactive(target, key, target[key]);
      }
    }

    function defineReactive(target, key, value) {
      //深度观察
      observer(value);

      Object.defineProperty(target, key, {
        get(){
          return value;
        },
        set(newValue){
          observer(newValue);
          if(newValue !== value) {
            value = newValue;
            console.log('更新视图 --> 对象');
          }
        }
      })
    }

    data.age = { number: 20 };//监测对象
    data.colors.push('blue');//监测数组
    console.log(data.colors);
  </script>
</body>

</html>
```



## 相关面试题二：Vue3.0 和 2.0 的响应式原理区别

Vue3.x 改用 Proxy 替代 Object.defineProperty。因为 Proxy 可以直接监听对象和数组的变化，并且有多达 13 种拦截方法。

在对一些属性进行操作时，使用 Object.defineProperty 这种方法无法拦截，比如通过下标方式修改数组数据或者给对象新增属性，这都不能触发组件的重新渲染，因为 Object.defineProperty 不能拦截到这些操作。更精确的来说，对于数组而言，大部分操作都是拦截不到的，只是 Vue 内部通过重写函数的方式解决了这个问题。

在 Vue3.0 中已经不使用这种方式了，而是通过使用 Proxy 对对象进行代理，从而实现数据劫持。使用Proxy 的好处是它可以完美的监听到任何方式的数据改变，唯一的缺点是兼容性的问题，因为 Proxy 是 ES6 的语法。



## 相关面试题三：Proxy 与 Object.defineProperty 优劣对比

在 Vue2 中， 0bject.defineProperty 会改变原始数据，而 Proxy 是创建对象的虚拟表示，并提供 set 、get 和 deleteProperty 等处理器，这些处理器可在访问或修改原始对象上的属性时进行拦截。



**Proxy 的优势如下:**

- Proxy 可以直接监听对象而非属性；
- Proxy 可以直接监听数组的变化；
- Proxy 有多达 13 种拦截方法,不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的；
- Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改；

**Object.defineProperty 的优势如下:**

- 兼容性好，支持 IE9，而 Proxy 的存在浏览器兼容性问题