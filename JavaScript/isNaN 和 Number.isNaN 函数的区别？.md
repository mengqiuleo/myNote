## isNaN 和 Number.isNaN 函数的区别？

[TOC]



### isNaN

该函数接收一个参数，可以是任意数据类型，然后判断这个参数是否“不是数值”。

把一个值传给isNaN()后，该函数会尝试把它转换为数值。某些非数值的值可以直接转换成数值，如字符串"10"或布尔值。任何不能转换为数值的值都会导致这个函数返回true。

```js
console.log(isNaN(NaN)); // true
console.log(isNaN(10)); // false，10 是数值
console.log(isNaN("10")); // false，可以转换为数值10
console.log(isNaN("blue")); // true，不可以转换为数值
console.log(isNaN(true)); // false，可以转换为数值1
```



### Number.isNaN

函数 Number.isNaN 会首先判断传入参数是否为数字，如果是数字再继续判断是否为 NaN，不会进行数据类型的转换，这种方法对于 NaN 的判断更为准确。

```js
console.log(Number.isNaN(NaN));//true
console.log(Number.isNaN("10"));//false
console.log(Number.isNaN(10));//false

```



### 二者对比

```js
console.log(Number.isNaN("blue"))//false
console.log(isNaN("blue"));//true
```

对于字符串blue，本质上我们是想判断传入的参数是否为NaN，但是用 isNaN 函数，判断结果为真，所以说 isNaN函数判断 NaN不够准确。