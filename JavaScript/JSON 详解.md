# JSON 详解

JSON是一种非常重要的数据格式，它并不是编程语言，而是一种可以在服务器和客户端之间传输的数据格式。

[TOC]



## 一、JSON基本语法

JSON的顶层支持三种类型的值：

- 简单值：数字（Number）、字符串（String，不支持单引号）、布尔类型（Boolean）、null类型；
- 对象值：由key、value组成，key是字符串类型，并且必须添加双引号，值可以是简单值、对象值、数组值；
- 数组值：数组的值可以是简单值、对象值、数组值；

```json
{
  "name": "hhh",
  "age": 18,
  "friend": {
    "name": "sam"
  }
}

[
  234,
  "abc",
  {
    "name": "amy"
  }
]
```



1. 复合类型的值只能是数组或对象，不能是函数、正则表达式对象、日期对象。
2. 原始类型的值只有四种：字符串、数值（必须以十进制表示）、布尔值和`null`（不能使用`NaN`, `Infinity`, `-Infinity`和`undefined`）。
3. 字符串**必须使用双引号表示**，不能使用单引号。
4. 对象的键名必须放在双引号里面。
5. 数组或对象最后一个成员的后面，不能加逗号。



## 二、JSON序列化

某些情况下我们希望将JavaScript中的复杂类型转化成JSON格式的字符串，这样方便对其进行处理：

- 比如我们希望将一个对象保存到localStorage中；
- 但是如果我们直接存放一个对象，这个对象会被转化成[object Object] 格式的字符串，并不是我们想要的结果；



### JSON序列化方法

在ES5中引用了JSON全局对象，该对象有两个常用的方法：

- stringify方法：将JavaScript类型转成对应的JSON字符串；
- parse方法：解析JSON字符串，转回对应的JavaScript类型；

```js
const obj = {
  name: "why",
  age: 18,
  friend: {
    name: "kobe"
  },
  hobbies: ["123","456","789"]
}


//转换成字符串保存
const objString = JSON.stringify(obj)
localStorage.setItem("info",objString)

//获取字符串转回对象
const itemString = localStorage.getItem("info")
const info = JSON.parse(itemString)
console.log(info);
```



## 三、Stringify方法

> JSON.stringify(value[, replacer [, space]])

- value：将要序列化成 一个JSON字符串的JavaScript对象或值。
- replacer 可选，用于处理将要序列化的值。
- space 可选，指定缩进用的空白字符串，用于美化输出。

**返回值：** 一个表示给定值的JSON格式字符串。



### replacer参数

replacer参数可以以下三种情况：

1. 如果是null、undefined或其他类型，则被忽略，不做处理；

```js
JSON.stringify({key: 'json'}, null, null) // '{"key":"json"}'
JSON.stringify({key: 'json'}, true) // '{"key":"json"}'
复制代码
```

​	2.如果是一个数组，则只有包含在这个数组中的属性名，才会最终被序列化到结果字符串中。
 **只对对象的属性有效，对数组无效。**

```js
const obj = {
  json: 'JSON',
  parse: 'PARSE',
  stringify: 'STRINGIFY'
}
JSON.stringify(obj, ['parse', 'stringify'])
// '{"parse":"PARSE","stringify":"STRINGIFY"}'
```

​	3.如果是一个函数，被序列化的值的每个属性都会经过该函数的转换和处理；

处理过程：

- 函数有两个参数，属性名(key)和属性值(value)，都会被序列化；
- 第一次调用时，key为空字符串，value则为需要序列化的整个对象；
- 第二次处理时，会把第一次的的结果传过来，后续的每一次的处理都将接收上一次处理的结果；
- 后面，将依次处理每个属性名和属性值，完成后返回。



JSON.stringify() 方法将一个JavaScript 对象或值转换为JSON 字符串：

- 如果指定了一个replacer 函数，则可以选择性地替换值；
- 如果指定的replacer 是数组，则可选择性地仅包含数组指定的属性；

```js
const obj = {
  name: "why",
  age: 18,
  friend: {
    name: "kobe"
  },
  hobbies: ["123","456","789"]
}


//1.直接转化
const jsonString1 = JSON.stringify(obj)
console.log(jsonString1);
//{"name":"why","age":18,"friend":{"name":"kobe"},"hobbies":["123","456","789"]}


//# 2.stringify第二个参数replacer
//2.1 第二个参数replacer 为：传入数组，设定哪些是需要转换
const jsonString2 = JSON.stringify(obj,["name","friend"])
console.log(jsonString2);
//{"name":"why","friend":{"name":"kobe"}}


//2.2 第二个参数replacer 为：传入回调函数
const jsonString3 = JSON.stringify(obj,(key, value) => {
  if(key === "age") {
    return value + 1
  }
  return value
})
console.log(jsonString3);
//{"name":"why","age":19,"friend":{"name":"kobe"},"hobbies":["123","456","789"]}


//# 3.stringify第三个参数 space
const jsonString4 = JSON.stringify(obj, null, "---")
//如果第二个参数不需要，传入null
//JSON.stringify(obj, null, 2),最后一个参数为 2(数字)时,默认以空格区分
console.log(jsonString4)
// {
// ---"name": "why",
// ---"age": 18,
// ---"friend": {
// ------"name": "kobe"
// ---},
// ---"hobbies": [
// ------"123",
// ------"456",
// ------"789"
// ---]
// }
```



## 四、parse方法

> JSON.parse(text[, reviver])

- text：要被解析成的字符串。
   如果传入数字则会转换成十进制数字输出。
   如果传入布尔值则直接输出。
   如果传入null则输出null。
   不支持其他类型的值，否则报错。
- reviver： 可选，转换器, 可以用来修改解析生成的原始值。

**返回值：** JavaScript对象/值, 对应给定JSON文本的对象/值。



JSON.parse() 方法用来解析JSON字符串，构造由字符串描述的JavaScript值或对象。
提供可选的reviver 函数用以在返回之前对所得到的对象执行变换(操作)。

```js

const JSONString = '{"name":"why","age":18,"friend":{"name":"kobe"},"hobbies":["123","456","789"]}'

const info = JSON.parse(JSONString,(key,value) => {
  if(value === "age") {
    return value - 1
  }
  return value
})
console.log(info);
// {
//   name: 'why',
//   age: 18,
//   friend: { name: 'kobe' },
//   hobbies: [ '123', '456', '789' ]
// }
```



## 五、使用JSON序列化深拷贝

生成的新对象和之前的对象并不是同一个对象：
相当于是进行了一次深拷贝；

```js
const obj = {
  name: 'why',
  age: 18,
  friend: {
    name: 'kobe'
  }
}

const objString = JSON.stringify(obj)
const info = JSON.parse(objString)

console.log(info);
//{ name: 'why', age: 18, friend: { name: 'kobe' } }

console.log(info === obj)//false
info.friend.name = "james"
console.log(obj.friend.name)//kobe
```

注意：这种方法它对函数是无能为力的
创建出来的info中是没有foo函数的，这是因为stringify并不会对函数进行处理；

举例：

```js
const obj = {
  name: 'why',
  age: 18,
  friend: {
    name: 'kobe'
  },
  eating() {
    console.log("eating~")
  }
}

const objString = JSON.stringify(obj)
const info = JSON.parse(objString)

console.log(info);
//{ name: 'why', age: 18, friend: { name: 'kobe' } }

console.log(info === obj)//false
info.friend.name = "james"
console.log(obj.friend.name)//kobe
```

这里在obj对象中添加了方法，但是转换后的info对象中没有函数