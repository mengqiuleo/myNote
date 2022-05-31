## 【JavaScript】类数组详解

[TOC]

### 什么是类数组

> 类数组对象，就是指可以**通过索引属性访问元素**并且**拥有 length** 属性的对象。

![](E:\note\前端\笔记\js\拉钩教育\异同点.jpg)



JavaScript 中有哪些情况下的对象是类数组呢？

- 函数里面的参数对象 arguments；

- 用 getElementsByTagName/ClassName/Name 获得的 HTMLCollection；

- 用 querySelector 获得的 NodeList。



举例：

一个类数组：

```js
function foo(name, age, sex) {

  console.log(arguments);

  console.log(typeof arguments);

  console.log(Object.prototype.toString.call(arguments));

}

foo('jack', '18', 'male');
```



控制台的输出结果：

```
[Arguments] { '0': 'jack', '1': '18', '2': 'male' }
object
[object Arguments]
```



类数组对象与数组的区别是**类数组对象不能直接使用数组的方法。**

那么我们希望类数组对象能够和数组一样使用数组的方法，应该怎么做呢？我们一般是通过 Function.call 或者 Function.apply 方法来间接调用。

举例1：

```js
var arrayLike = {0: 'name', 1: 'age', 2: 'sex', length: 3 }

Array.prototype.join.call(arrayLike, '&'); // name&age&sex
```



举例2：

```js
var arrayLike = { 

  0: 'java',

  1: 'script',

  length: 2

} 

Array.prototype.push.call(arrayLike, 'jack', 'lily'); 

console.log(typeof arrayLike); // 'object'

console.log(arrayLike);

// {0: "java", 1: "script", 2: "jack", 3: "lily", length: 4}

```

arrayLike 其实是一个对象，模拟数组的一个类数组，从数据类型上说它是一个对象，新增了一个 length 的属性。从代码中还可以看出，用 typeof 来判断输出的是 'object'，它自身是不会有数组的 push 方法的，这里我们就用 call 的方法来借用 Array 原型链上的 push 方法，可以实现一个类数组的 push 方法，给 arrayLike 添加新的元素。



### 类数组转换成数组

```js
//转化方式一：
var length = arguments.length
var arr = []
for(var i = 0; i < length; i++) {
  arr.push(arguments[i])
}
console.log(arr);

//转化方式二
var arr1 = Array.prototype.slice.call(arguments)
var arr2 = [].slice.call(arguments)
console.log(arr1)
console.log(arr2)

//转化方式三：ES6之后
const arr3 = Array.from(arguments)
const arr4 = [...arguments]
console.log(arr3)
console.log(arr4)
```



#### ES6 的方法转数组

ES6 新增的 Array.from 方法以及展开运算符的方法。

```js
function sum(a, b) {

  let args = Array.from(arguments);

  console.log(args.reduce((sum, cur) => sum + cur));

}

sum(1, 2);    // 3

function sum(a, b) {

  let args = [...arguments];

  console.log(args.reduce((sum, cur) => sum + cur));

}

sum(1, 2);    // 3

function sum(...args) {

  console.log(args.reduce((sum, cur) => sum + cur));

}

sum(1, 2);    // 3

```

从代码中可以看出，Array.from 和 ES6 的展开运算符，都可以把 arguments 这个类数组转换成数组 args，从而实现调用 reduce 方法对参数进行累加操作。其中第二种和第三种都是用 ES6 的展开运算符，虽然写法不一样，但是基本都可以满足多个参数实现累加的效果。



### callee属性

**并不是所有类数组都有 callee 属性，只有 arguments 有这个属性**

`callee`获取当前arguments所在的函数

```js
function foo(num1,num2){
  console.log(arguments.callee);//[Function: foo]
}
foo(10,20)
```



### 箭头函数没有arguments

箭头函数是不绑定arguments的，

所以我们在箭头函数中使用arguments会去上层作用域查找：

```js
function bar(m,n) {
  return (x,y,z) => {
    console.log(arguments);
  }
}

var fn = bar(20,30)
fn(10,20,30)//[Arguments] { '0': 20, '1': 30 }
```



### HTMLCollection

HTMLCollection 简单来说是 HTML DOM 对象的一个接口，这个接口包含了获取到的 DOM 元素集合，返回的类型是类数组对象，如果用 typeof 来判断的话，它返回的是 'object'。它是及时更新的，当文档中的 DOM 变化时，它也会随之变化。

举例：

找一个页面中**有 form 表单**的页面，在控制台中执行下述代码。

```js
var elem1, elem2;

// document.forms 是一个 HTMLCollection

elem1 = document.forms[0];

elem2 = document.forms.item(0);

console.log(elem1);

console.log(elem2);

console.log(typeof elem1);

console.log(Object.prototype.toString.call(elem1));

```

控制台输出结果：

这里打印出来了页面第一个 form 表单元素，同时也打印出来了判断类型的结果，说明打印的判断的类型和 arguments 返回的也比较类似，typeof 返回的都是 'object'，和上面的类似。

![](E:\note\前端\笔记\js\拉钩教育\表单.png)



注意：**HTML DOM 中的 HTMLCollection 是即时更新的，当其所包含的文档结构发生改变时，它会自动更新。**



### NodeList

NodeList 对象是节点的集合，通常是由 querySlector 返回的。NodeList 不是一个数组，也是一种类数组。虽然 NodeList 不是一个数组，但是可以使用 for...of 来迭代。在一些情况下，NodeList 是一个实时集合，也就是说，如果文档中的节点树发生变化，NodeList 也会随之变化。

```js
var list = document.querySelectorAll('input[type=checkbox]');

for (var checkbox of list) {

  checkbox.checked = true;

}

console.log(list);

console.log(typeof list);

console.log(Object.prototype.toString.call(list));

```

控制台输出结果：

![](E:\note\前端\笔记\js\拉钩教育\结果2.1.png)



#### 
