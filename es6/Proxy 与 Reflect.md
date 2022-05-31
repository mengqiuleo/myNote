# Proxy 与 Reflect

[TOC]

## Proxy

Object.defineProperty设计的初衷，不是为了去监听截止一个对象中所有的属性的。

- 我们在定义某些属性的时候，初衷其实是定义普通的属性，但是后面我们强行将它变成了数据属性描述符。
- p 其次，如果我们想监听更加丰富的操作，比如新增属性、删除属性，那么Object.defineProperty是无能为力的。

所以我们要知道，存储数据描述符设计的初衷并不是为了去监听一个完整的对象。



### 定义：

`Proxy`类，是用于帮助我们创建一个代理的：

- 也就是说，如果我们希望监听一个对象的相关操作，那么我们可以先创建一个代理对象（Proxy对象）；
- 之后对该对象的所有操作，都通过代理对象来完成，代理对象可以监听我们想要对原对象进行哪些操作；



### 举例 set 与 get：

- 首先，我们需要new Proxy对象，并且传入需要侦听的对象以及一个处理对象，可以称之为handler；

  ```
  const p = new Proxy(target, handler)
  ```

  

- 其次，我们之后的操作都是直接对Proxy的操作，而不是原有的对象，因为我们需要在handler里面进行侦听；

- 如果我们想要侦听某些具体的操作，那么就可以在handler中添加对应的捕捉器（Trap）：

  set和get分别对应的是函数类型；

  - set函数有四个参数：
    - target：目标对象（侦听的对象）；
    - property：将被设置的属性key；
    - value：新属性值；
    - receiver：调用的代理对象；
  - get函数有三个参数：
    - target：目标对象（侦听的对象）；
    - property：被获取的属性key；
    - receiver：调用的代理对象；

```js
const obj = {
  name:'zs',
  age:18
}

const objProxy = new Proxy(obj,{
  //获取值时的捕获器
  get:function(target, key, receiver) {
    console.log(`监听到${target}对象的${key}属性被访问了`,target);
    return target[key];
  },

  //设置值时的捕获器
  set: function(target, key, newValue, receiver) {
    console.log(`监听到${target}对象的${key}属性被设置值`,target);
    target[key] = newValue;
  },

  //监听in的捕获器:判断有还是没有
  has(target, key) {
    console.log(`监听到${target}对象的${key}属性in操作`,target);
    return key in target;
  },

  //监听delete的捕获器
  deleteProperty(target, key) {
    console.log(`监听到${target}对象的${key}属性delete操作`,target);
    delete target[key];
  }
})

console.log(objProxy.name);
console.log(objProxy.age);

objProxy.name = 'ls';
objProxy.age = 30;

//in操作符
console.log("name" in objProxy);//true

// delete操作
delete objProxy.name;
```





### Proxy共有13个捕获器

- handler.getPrototypeOf()
  Object.getPrototypeOf 方法的捕捉器。
- handler.setPrototypeOf()
  Object.setPrototypeOf 方法的捕捉器。
- handler.isExtensible()
  Object.isExtensible 方法的捕捉器。
- handler.preventExtensions()
  Object.preventExtensions 方法的捕捉器。
- handler.getOwnPropertyDescriptor()
  Object.getOwnPropertyDescriptor 方法的捕捉器。
- handler.defineProperty()
  Object.defineProperty 方法的捕捉器。
- handler.ownKeys()
  Object.getOwnPropertyNames 方法和Object.getOwnPropertySymbols 方法的捕捉器。
- handler.has()
  in 操作符的捕捉器。
- handler.get()
  属性读取操作的捕捉器。
- handler.set()
  属性设置操作的捕捉器。
- handler.deleteProperty()
  delete 操作符的捕捉器。
- handler.apply()
  函数调用操作的捕捉器。
- handler.construct()
  new 操作符的捕捉器。



### Proxy的construct和apply：

```js
function foo() {
  console.log("foo函数被调用了",this, arguments);
  return "foo";
}

const fooProxy = new Proxy(foo, {
  apply: function(target, thisArg, otherArgs) {
    console.log("函数的apply侦听");
    return target.apply(thisArg, otherArgs);
  },
  construct(target, argArray, newTarget) {
    console.log(target, argArray, newTarget);
    return new target();
  }
})

fooProxy.apply({},["abc","cba"]);
new foo("abc","cba");
```





## Reflect

### Reflect有什么用呢？

- 它主要提供了很多操作JavaScript对象的方法，有点像Object中操作对象的方法；
  - 比如 Reflect.getPrototypeOf(target) 类似于 Object.getPrototypeOf()；
  - 比如 Reflect.defineProperty(target, propertyKey, attributes) 类似于Object.defineProperty() ；
- 如果我们有Object可以做这些操作，那么为什么还需要有Reflect这样的新增对象呢？
  - 这是因为在早期的ECMA规范中没有考虑到这种对对象本身的操作如何设计会更加规范，所以将这些API放到了Object上面；
  - 但是Object作为一个构造函数，这些操作实际上放到它身上并不合适；
  - 另外还包含一些类似于in、delete操作符，让JS看起来是会有一些奇怪的；
  - 所以在ES6中新增了Reflect，让我们这些操作都集中到了Reflect对象上；
- 那么Object和Reflect对象之间的API关系，可以参考MDN文档：

​	[比较 Reflect 和 Object 方法](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect/Comparing_Reflect_and_Object_methods)



> Reflect 和 Proxy是一一对应的，也是13个方法



### 用 Reflect 对原来的 Proxy 进行改写

```js
const objProxy = new Proxy(obj,{
  //获取值时的捕获器
  get:function(target, key, receiver) {
    console.log(`监听到${target}对象的${key}属性被访问了`,target);
    return Reflect.get(target, key);
  },

  //设置值时的捕获器
  set: function(target, key, newValue, receiver) {
    console.log(`监听到${target}对象的${key}属性被设置值`,target);
    return Reflect.set(target, key, value);
  },

  //监听in的捕获器:判断有还是没有
  has(target, key) {
    console.log(`监听到${target}对象的${key}属性in操作`,target);
    return Reflect.has(target, key);
  },

  //监听delete的捕获器
  deleteProperty(target, key) {
    console.log(`监听到${target}对象的${key}属性delete操作`,target);
    //delete target[key];
    return Reflect.deleteProperty(target, key);
  }
})
```



### Receiver的作用

> 如果我们的源对象（obj）有setter、getter的访问器属性，那么可以通过receiver来改变里面的this；