# 【JavaScript】基本数据类型注意点

[TOC]



## undefined

Undefined 只有一个值，就是 undefined.

#### ① 可以通过下面几种方式来得到 undefined：

- 引用已声明但未初始化的变量；
- 引用未定义的对象属性；
- 执行无返回值函数；
- 执行 void 表达式；
- 全局常量 window.undefined 或 undefined

```js
var a; // undefined

var o = {}

o.b // undefined

(() => {})() // undefined

void 0 // undefined

window.undefined // undefined

```



#### ② 如何判断一个变量的值是否为 undefined 呢？

下面的代码给出了 3 种方式来判断变量 x 是否为 undefined，你可以先思考一下哪一种可行。

方式 1 直接通过**逻辑取非**操作来将变量 x 强制转换为布尔值进行判断；

方式 2 通过 3 个等号将变量 x 与 undefined 做**真值比较**；

方式 3 通过 typeof 关键字获取变量 x 的类型，然后与 'undefined' 字符串做**真值比较：**

```js
// 方式1

if(!x) {

  ...

}

// 方式2

if(x===undefined) {

  ...

}

// 方式2

if(typeof x === 'undefined') {

  ...

}

```

方式 1 不可行，因为只要变量 x 的值为 undefined、空字符串、数值 0、null 时都会判断为真。

方式 2 也存在一些问题，虽然通过 “===” 和 undefined 值做比较是可行的，但如果 x 未定义则会抛出错误 “ReferenceError: x is not defined” 导致程序执行终止，这对于代码的健壮性显然是不利的。

方式 3 则解决了这一问题。

```js
console.log(typeof x === 'undefined');//true

console.log(typeof x);//undefined
```

**注**：

typeof 返回的是一个字符串

```js
let a;
console.log(a,typeof a,typeof a === "undefined",a === undefined);
//undefined undefined true true
```





## Number

Number 是数值类型，有 2 个特殊数值得注意一下，即 **NaN 和 Infinity**。

- NaN（Not a Number）通常在计算失败的时候会得到该值。要判断一个变量是否为 NaN，则可以通过 Number.isNaN 函数进行判断。
- Infinity 是无穷大，加上负号 “-” 会变成无穷小，在某些场景下比较有用，比如通过数值来表示权重或者优先级，Infinity 可以表示最高优先级或最大权重。



#### ① typeof NaN 的结果是什么？

NaN 指“不是一个数字”（not a number），NaN 是一个“警戒值”（sentinel value，有特殊用途的常规值），用于指出数字类型中的错误情况，即“执行数学运算没有成功，这是失败后返回的结果”。

```js
typeof NaN; // "number"
```

NaN 是一个特殊值，它和自身不相等，是唯一一个非自反（自反，reflexive，即 `x === x` 不成立）的值。而 `NaN !== NaN` 为 true。





#### ②  isNaN 和 Number.isNaN 函数的区别？

- 函数 isNaN 接收参数后，会尝试将这个参数转换为数值，任何不能被转换为数值的的值都会返回 true，因此非数字值传入也会返回 true ，会影响 NaN 的判断。
- 函数 Number.isNaN 会首先判断传入参数是否为数字，如果是数字再继续判断是否为 NaN ，不会进行数据类型的转换，这种方法对于 NaN 的判断更为准确。





#### ③ 精度问题

在进行浮点数运算时很容易碰到。比如我们执行简单的运算 0.1 + 0.2，得到的结果是 0.30000000000000004，如果直接和 0.3 作相等判断时就会得到 false。

```js
0.1 + 0.2 // 0.30000000000000004
```

出现这种情况的原因在于计算的时候，JavaScript 引擎会先将十进制数转换为二进制，然后进行加法运算，再将所得结果转换为十进制。在进制转换过程中如果小数位是无限的，就会出现误差。同样的，对于下面的表达式，将数字 5 开方后再平方得到的结果也和数字 5 不相等。

```js
Math.pow(Math.pow(5, 1/2), 2) // 5.000000000000001
```



对于这个问题的解决方法也很简单，那就是消除无限小数位。

- 一种方式是先转换成整数进行计算，然后再转换回小数，这种方式适合在小数位不是很多的时候。比如一些程序的支付功能 API 以“分”为单位，从而避免使用小数进行计算。
- 还有另一种方法就是舍弃末尾的小数位。比如对上面的加法就可以先调用 toPrecision 截取 12 位，然后调用 parseFloat 函数转换回浮点数。

```js
parseFloat((0.1 + 0.2).toPrecision(12)) // 0.3
```

