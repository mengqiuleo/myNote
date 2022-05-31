## Object.defineProperty

在前面我们的属性都是直接定义在对象内部，或者直接添加到对象内部的：
但是这样来做的时候我们就不能对这个属性进行一些限制：比如这个属性是否是可以通过delete删除的？这个属性是否在for-in遍历的时候被遍历出来呢？

```js
var obj = {
  name: "hhh",
  age: 18,
  height: 1.65
}
```

如果我们想要对一个属性进行比较精准的操作控制，那么我们就可以使用属性描述符。

- 通过属性描述符可以精准的添加或修改对象的属性；
- 属性描述符需要使用Object.defineProperty 来对属性进行添加或者修改；



### 一、介绍 Object.defineProperty

Object.defineProperty() 方法会直接在一个对象上定义一个新属性，或者修改一个对象的现有属性，并返回此对象。

```js
Object.defineProperty(obj, prop, descriptor)
```

- 可接收三个参数：
  - obj要定义属性的对象；
  - prop要定义或修改的属性的名称或Symbol；
  - descriptor要定义或修改的属性描述符；

- 返回值：
  被传递给函数的对象。



**属性描述符分类**

属性描述符的类型有两种：

- 数据属性（Data Properties）描述符（Descriptor）；
- 存取属性（Accessor访问器Properties）描述符（Descriptor）；

![](E:\note\前端\笔记\js\对象\属性描述符.jpg)



#### 数据属性描述符

数据数据描述符有如下四个特性：

- [[Configurable]]：表示属性是否可以通过delete删除属性，是否可以修改它的特性，或者是否可以将它修改为存取属性描述符；
  - 当我们直接在一个对象上定义某个属性时，这个属性的[[Configurable]]为true；
  - 当我们通过属性描述符定义一个属性时，这个属性的[[Configurable]]默认为false；
- [[Enumerable]]：表示属性是否可以通过for-in或者Object.keys()返回该属性；
  - 当我们直接在一个对象上定义某个属性时，这个属性的[[Enumerable]]为true；
  - 当我们通过属性描述符定义一个属性时，这个属性的[[Enumerable]]默认为false；
-  [[Writable]]：表示是否可以修改属性的值；
  - 当我们直接在一个对象上定义某个属性时，这个属性的[[Writable]]为true；
  - 当我们通过属性描述符定义一个属性时，这个属性的[[Writable]]默认为false；
-  [[value]]：属性的value值，读取属性时会返回该值，修改属性时，会对其进行修改；
  - 默认情况下这个值是undefined；



```js
var obj = {
  name: "hhh",
  age: 18
}

Object.defineProperty(obj, "address", {
  value: "北京市",
  configurable: false,
  enumerable: false,
  writable: false
})
```



#### 存取属性描述符

数据数据描述符有如下四个特性：

- [[Configurable]]：表示属性是否可以通过delete删除属性，是否可以修改它的特性，或者是否可以将它修改为存取属性描述符；
  - 和数据属性描述符是一致的；
  - 当我们直接在一个对象上定义某个属性时，这个属性的[[Configurable]]为true；
  - 当我们通过属性描述符定义一个属性时，这个属性的[[Configurable]]默认为false；
-  [[Enumerable]]：表示属性是否可以通过for-in或者Object.keys()返回该属性；
  - 和数据属性描述符是一致的；
  - 当我们直接在一个对象上定义某个属性时，这个属性的[[Enumerable]]为true；
  - 当我们通过属性描述符定义一个属性时，这个属性的[[Enumerable]]默认为false；
- [[get]]：获取属性时会执行的函数。默认为undefined
-  [[set]]：设置属性时会执行的函数。默认为undefined



```js
"use strict"

var obj = {
  name: "hhh",
  age: 18
}

var address = "北京市"

Object.defineProperty(obj, "address", {
  configurable: true,
  enumerable: true,
  get: function() {
    return address
  },
  set: function(value) {
    address = value
  }
})

console.log(obj.address);
obj.address = "广州市"
console.log(obj.address)
```



### 二、Object.defineProperties()

同时定义多个属性：

Object.defineProperties() 方法直接在一个对象上定义多个新的属性或修改现有属性，并且返回该对象。

```js
var obj = {
  _age: 18
}

Object.defineProperties(obj, {
  name: {
    writable: true,
    value: "hhhh"
  },
  age: {
    get: function() {
      return this._age
    }
  }
})
```

