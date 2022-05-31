# 【JavaScript】实现数组扁平化

[TOC]



## 一、扁平化的实现

数组的扁平化其实就是将一个嵌套多层的数组 array（嵌套可以是任何层数）转换为只有一层的数组。

其实就是把多维的数组“拍平”，输出最后的一维数组。

```
[1,[2,[3,4,5]]] --> [1,2,3,4,5]
```



## 二、实现扁平化的六种方法

### 方法一：普通递归实现

在遍历过程中发现数组元素还是数组的时候进行递归操作，把数组的结果通过数组的 concat 方法拼接到最后要返回的 result 数组上，那么最后输出的结果就是扁平化后的数组。

```js
let arr = [1,[2,[3,4,5]]];

function flatten(arr) {
  let result = [];
  for(let i = 0; i < arr.length; i++) {
    if(Array.isArray(arr[i])) {
      result = result.concat(flatten(arr[i]));
    } else {
      result.push(arr[i]);
    }
  }
  return result;
}

console.log(flatten(arr));//[ 1, 2, 3, 4, 5 ]
```



### 方法二：利用 reduce 函数迭代

```js
let arr = [1,[2,[3,4,5]]];

function flatten(arr) {
  return arr.reduce(function(prev,next) {
    return prev.concat(Array.isArray(next)?flatten(next):next)
  },[]) 
}

console.log(flatten(arr));//[ 1, 2, 3, 4, 5 ]
```



### 方法三：扩展运算符实现

这个方法的实现，采用了扩展运算符和 some 的方法。

先用数组的 some 方法把数组中仍然是组数的项过滤出来，然后执行 concat 操作，利用 ES6 的展开运算符，将其拼接到原数组中，最后返回原数组。

```js
let arr = [1,[2,[3,4,5]]];

function flatten(arr) {
  while(arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
  }
  return arr;
}

console.log(flatten(arr));//[ 1, 2, 3, 4, 5 ]
```

**解释：**

该方法是每次将原数组解构一次，利用some方法判断，如果数组中还有数组，就继续解构

```js
let arr = [1,[2,[3,5]],[8,[10,[15]]]];

function flatten(arr) {
  while(arr.some(item => Array.isArray(item))) {
    arr = [].concat(...arr);
    console.log(arr);//打印每次变化后的数组
  }
  return arr;
}

console.log(flatten(arr));//[ 1, 2, 3, 5, 8, 10, 15 ]
```

可以将过程打印出来，更清楚的看到js过程：

```js
[ 1, 2, [ 3, 5 ], 8, [ 10, [ 15 ] ] ]

[1, 2, 3, 5, 8, 10, [ 15 ] ]

[ 1, 2, 3, 5, 8, 10, 15 ]
```



### 方法四：split 和 toString 共同处理

由于数组会默认带一个 toString 的方法，所以可以把数组直接转换成逗号分隔的字符串，然后再用 split 方法把字符串重新转换为数组。

```js
let arr = [1, [2, [3, 4]]];

function flatten(arr) {
  return arr.toString().split(',');
}

console.log(flatten(arr));//[ '1', '2', '3', '4' ]

```



### 方法五：调用 ES6 中的 flat

```
arr.flat([depth])
```

其中 depth 是 flat 的参数，depth 是可以传递数组的展开深度（默认不填、数值是 1），即展开一层数组。那么如果多层的该怎么处理呢？参数也可以传进 Infinity，代表不论多少层都要展开。

```js
let arr = [1, [2, [3, 4]]];

function flatten(arr) {
  return arr.flat(Infinity);
}

console.log(flatten(arr));//[ 1, 2, 3, 4 ]

```



### 方法六：正则和 JSON 方法共同处理

将用 JSON.stringify 的方法先转换为字符串，然后通过正则表达式过滤掉字符串中的数组的方括号，最后再利用 JSON.parse 把它转换成数组。

```js
let arr = [1, [2, [3, 4]]];

function flatten(arr) {
  let str = JSON.stringify(arr);
  str = str.replace(/(\[|\])/g, '');
  str = '[' + str + ']';
  return JSON.parse(str);
}

console.log(flatten(arr));//[ 1, 2, 3, 4 ]
```

