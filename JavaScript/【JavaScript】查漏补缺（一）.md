# 【JS】查漏补缺 --> 具体面试题目✍🏻

[TOC]

## 前言

这篇文章是用来记录自己在JavaScript复习过程中遇见的不太常见或比较细的问题，对于像原型链，this指向，闭包，作用域，promise等在这里不做记录（因为那些知识点，每一个都可以写很多东西）。

**参考并推荐文章：**

[(建议精读)原生JS灵魂之问(中)，检验自己是否真的熟悉JavaScript？](https://juejin.cn/post/6844903986479251464#heading-43)

[(建议收藏)原生JS灵魂之问, 请问你能接得住几个？(上)](https://juejin.cn/post/6844903974378668039)

[(2.4w字,建议收藏)😇原生JS灵魂之问(下), 冲刺🚀进阶最后一公里(附个人成长经验分享)](https://juejin.cn/post/6844904004007247880#heading-10)

[「万字总结」熬夜总结50个JS的高级知识点，全都会你就是神！！！](https://juejin.cn/post/7022795467821940773#heading-37)

[工作中遇到的50个JavaScript的基础知识点](https://juejin.cn/post/7020940475133591566#heading-36)

[读《三元-JS灵魂之问》总结,给自己的一份原生JS补给(上)](https://juejin.cn/post/6844904118453010445#heading-30)





## 一、数据类型相关

### 1.null 是对象吗？

typeof null 为 object。

null 不是对象，null属于基本数据类型之一，Object属于引用数据类型，null这种数据类型的值只有一个，就是null，undefined也类似。



### 2.0.1+0.2为什么不等于0.3？

这个答案适用于面试时回答，我也搜索过其他答案，但是他们的答案都篇幅较长，可以理解，但记不住😂

0.1和0.2在转换成二进制后会无限循环，由于标准位数的限制后面多余的位数会被截掉，此时就已经出现了精度的损失，相加后因浮点数小数位的限制而截断的二进制数字在转换为十进制就会变成0.30000000000000004。



### 3.BigInt 注意点

- 不允许在bigint和 Number 之间进行混合操作

- 不能将BigInt传递给Web api和内置的 JS 函数，这些函数需要一个 Number 类型的数字。尝试这样做会报TypeError错误。

  ```js
  Math.max(2n,4n,6n); //TypeError
  ```

- 当 Boolean 类型与 BigInt 类型相遇时，BigInt的处理方式与Number类似

  ```js
  if(0n){//条件判断为false
  
  }
  if(3n){//条件为true
  
  }
  ```

- 元素都为BigInt的数组可以进行sort。

- BigInt可以正常地进行位运算，如|、&、<<、>>和^



### 4. [] == ![]结果是什么？为什么？

== 中，左右两边都需要转换为数字然后进行比较。

- []转换为数字为0。
- ![] 首先是转换为布尔值，由于[]作为一个引用类型转换为布尔值为true,
- 因此![]为false，进而在转换成数字，变为0。
- 0 == 0 ， 结果为true



### 5.JS中类型转换有哪几种,以及对应的Object转换规则

JS中，类型转换只有三种：

- 转换成数字
- 转换成布尔值
- 转换成字符串

Object转为布尔值：为`true`

Object转为字符串： 

​	对普通对象来说，除非自行定义 toString() 方法，

​	否则会调用 toString()（Object.prototype.toString()）来返回内部属性 [[Class]] 的值，	如"[object Object]"。如果对象有自己的 toString() 方法，字符串化时就会调用该方法并使用其	返回值。

Obejct转为数值：

​	对象转原始类型，会调用内置的[ToPrimitive]函数，对于该函数而言，其逻辑如下：

​		1.如果Symbol.toPrimitive()方法，优先调用再返回

​		2.调用valueOf()，如果转换为原始类型，则返回

​		3.调用toString()，如果转换为原始类型，则返回

​		4.如果都没有返回原始类型，会报错

```js
var obj = {
  value: 3,
  valueOf() {
    return 4;
  },
  toString() {
    return '5'
  },
  [Symbol.toPrimitive]() {
    return 6
  }
}
console.log(obj + 1); // 输出7
```



### 6.如何让if(a == 1 && a == 2)条件成立

巧妙运用了对象转换为数值的转换规则。

```js
var a = {
  value: 0,
  valueOf: function() {
    this.value++;
    return this.value;
  }
};
console.log(a == 1 && a == 2);//true
```



### 7.JS判断数组中是否包含某个值

#### 方法一：array.indexOf

> 此方法判断数组中是否存在某个值，如果存在，则返回数组元素的下标，否则返回-1。

```js
var arr=[1,2,3,4];
var index=arr.indexOf(3);
console.log(index);
```



#### 方法二：array.includes()

> 此方法判断数组中是否存在某个值，如果存在返回true，否则返回false

```js
var arr=[1,2,3,4];
if(arr.includes(3))
    console.log("存在");
else
    console.log("不存在");
```



#### 方法三：array.find()

> 返回数组中满足条件的**第一个元素的值**，如果没有，返回undefined

```js
var arr=[1,2,3,4];
var result = arr.find(item =>{
    return item > 3
});
console.log(result);
```



#### 方法四：array.findeIndex()

> 返回数组中满足条件的第一个元素的下标，如果没有找到，返回`-1`]

```js
var arr=[1,2,3,4];
var result = arr.findIndex(item =>{
    return item > 3
});
console.log(result);
```



### 8.数组中的高阶函数

> `一个函数`就可以接收另一个函数作为参数或者返回值为一个函数，`这种函数`就称之为高阶函数。

数组中的高阶函数有：map,reduce,filter,sort,every,some



### 9.数组的splice 与 slice 的区别？

| 方法   | 参数                                  | 描述                                                         |
| ------ | ------------------------------------- | ------------------------------------------------------------ |
| splice | splice(start, num, item1, item2, ...) | 从start索引开始，截取num个元素，并插入item1、item2到原数组里，影响原数组 |
| slice  | slice(start, end)                     | 从start开始，截取到end - 1，如果没有end，则截取到最后一个元素，不影响原数组 |




#### slice --> 提取（不改变原数组）

使用 slice 方法从数组中截取部分元素组合成新数组（并不会改变原数组），不传第二个参数时截取到数组的最后元素。

```js
let arr = [0, 1, 2, 3, 4, 5, 6];
console.log(arr.slice(1, 3)); // [1,2]

console.log(arr);//[0, 1, 2, 3, 4, 5, 6]
```


不设置参数是为获取所有元素:

```js
let arr = [0, 1, 2, 3, 4, 5, 6];
console.log(arr.slice()); //[0, 1, 2, 3, 4, 5, 6]
```



#### splice --> 添加、删除、替换原数组元素

使用 splice 方法可以`添加、删除、替换`数组中的元素，会对原数组进行改变，返回值为删除的元素。

删除数组元素第一个参数为从哪开始删除，第二个参数为删除的数量。

```js
let arr = [0, 1, 2, 3, 4, 5, 6];
console.log(arr.splice(1, 3)); //返回删除的元素 [1, 2, 3] 
console.log(arr); //删除数据后的原数组 [0, 4, 5, 6]
```


通过修改length删除最后一个元素：

```js
let arr = ["aaa", "bbb"];
arr.length = arr.length - 1;
console.log(arr);//[ 'aaa' ]
```


通过指定第三个参数来设置在删除位置添加的元素:

```js
let arr = [0, 1, 2, 3, 4, 5, 6];
console.log(arr.splice(1, 3, 'aaa', 'bbb')); //[1, 2, 3]
console.log(arr); //[ 0, 'aaa', 'bbb', 4, 5, 6 ]
```


向末尾添加元素:

```js
let arr = [0, 1, 2, 3, 4, 5, 6];
console.log(arr.splice(arr.length, 0, 'aaa', 'bbb')); //[]
console.log(arr); // [0, 1, 2, 3, 4, 5, 6, "aaa", "bbb"]
```


向数组前添加元素:

```js
let arr = [0, 1, 2, 3];
console.log(arr.splice(0, 0, 'aaa', 'bbb')); //[]
console.log(arr); // [ 'aaa', 'bbb', 0, 1, 2, 3 ]
```

向数组中间位置添加元素：

注意：是向起始位置的下标前面添加元素

```js
let arr = [0, 1, 2, 3];
console.log(arr.splice(2, 0, 'aaa', 'bbb')); //[]
console.log(arr); // [ 0, 1, 'aaa', 'bbb', 2, 3 ]
```



### 10.字符串方法：substr 和 substring 的区别？

| 方法      | 参数                 | 描述                                            |
| --------- | -------------------- | ----------------------------------------------- |
| substr    | substr(start,length) | 返回从start位置开始length长度的子串             |
| substring | substring(start,end) | 返回从start位置开始到end位置的子串（不包含end） |



#### substring() --> 第二个参数：结束索引

语法：

```
新字符串 = str.substring(开始索引, 结束索引); //两个参数都是索引值。包左不包右。
```


解释：从字符串中截取指定的内容。和slice()类似。

substring()和slice()是类似的。但不同之处在于：

- substring()不能接受负值作为参数。如果传递了一个负值，则默认使用 0。

- substring()还会自动调整参数的位置，如果第二个参数小于第一个，则自动交换。比如说， substring(1, 0)相当于截取的是第一个字符。




#### substr() --> 第二个参数：截取长度

语法：

```
字符串 = str.substr(开始索引, 截取的长度);
```


解释：从字符串中截取指定的内容。不会修改原字符串，而是将截取到的内容返回。

> 注意，这个方法的第二个参数截取的长度，不是结束索引。

参数举例：

- (2,4) 从索引值为 2 的字符开始，截取 4 个字符。

- (1) 从指定位置开始，截取到最后。

- (-3) 从倒数第几个开始，截取到最后。
  

### 11.undefined >= undefined 为什么是 false 

按照`隐式转换规则`，可转换成`NaN >= NaN`，NaN 不等于 NaN，也不大于，所以是`false`



### 12.null >= null 为什么是 true？

按照`隐式转换规则`，可转换成`0 >= 0`，0 等于 0，所以是`true`



### 13.为什么可以使用new Number却不能使用new Symbol?

```js
var num = new Number(1) // Number{1}
var str = new String('1') // String{'1'}
var bol = new Boolean(true) // Boolean{true}

var symbol = new Symbol(1) // TypeError
```

像上面这种使用`new Number、new String`等创建的基本数据类型被称之为：**围绕原始数据类型创建一个显式包装器对象**。

通俗点说就是：用`new`来创建基本类型的包装类。

而这种做法在`ES6`之后就不被支持了，从`new Symbol(1)`报错就可以看出来，现在使用的是不带`new`的方式：`var symbol = Symbol(1)`，所以它作为构造函数来说是不完整的。

但是因为历史遗留的原因，`new Number`仍然可以这样用，不过并不推荐。

如果你真的想创建一个 Symbol 包装器对象 (`Symbol wrapper object`)，你可以使用 `Object()` 函数：

```js
var sym = Symbol(1)
console.log(typeof sym) // "symbol"
var symObj = Object(sym)
console.log(typeof symObj) // "object"
```



### 14. 伪数组转为数组的方式

常见的类数组：

- 函数的arguments
- 用getElementsByTagName/ClassName()获得的HTMLCollection
- 用querySelector获得的nodeList

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



### 15.合并数组的方法

#### contact

```js
var a = [1,2,3];
var b = [4,5,6];
var c = a.concat(b);//c=[1,2,3,4,5,6];
```

#### for循环

```js
for(var i in b){
  a.push(b[i]);
}
```

#### apply

```js
a.push.apply(a,b);
```

#### 扩展运算符

```js
var a = [1,2,3];
var b = [4,5,6];
var newA = [...a,...b]
```



### 16.Object.is 和 === 的区别

Object.is() 除了+0 不等于 -0 和 NaN 等于 NaN 之外，其他表现与 === 一致。



### 17.判断一个变量是数组还是对象

#### instanceof

`instanceof`运算符用于通过查找原型链来检查某个变量是否为某个类型数据的实例，使用instanceof运算符可以判断一个变量是数组还是对象。

```js
  var a = [1, 2, 3];
  console.log(a instanceof Array); // true
  console.log(a instanceof Object); // true
  //可以看出a既是数组，也是对象

  var userInfo = { userName: "zhangsan" };
  console.log(userInfo instanceof Array); // false
  console.log(userInfo instanceof Object); // true
  //userInfo只是对象，而不是数组
```

封装函数，用于判断变量是数组类型还是对象类型

```js
var a = [1,2,3]
function getType(obj){
   if(obj instanceof Array){
       returen 'Array'//如果是数组，则返回数组类型
   }else if(obj instanceof Object){
       return 'Object'
   }else{
       return '既不是Array也不是Object'
   }
}
console.log(getType(a))
```



#### 通过构造函数来判断

```js
 var a = [1, 2, 3];
 console.log(a.__proto__.constructor === Array); //true
 console.log(a.__proto__.constructor === Object); // false
```

封装函数

```js
  function getType(o) {
        //获取构造函数
        var constructor = o.__proto__.constructor;
        if (constructor === Array) {
          return "Array";
        } else if (constructor === Object) {
          return "Object";
        } else {
          return "参数类型不是Array也不是Object";
        }
      }
      var a = [1, 2, 3];
      console.log(getType(a));
```



#### 通过toString()函数来判断

```js
var arr = [1, 2, 3];
var obj = { userName: "zhangsan" };
console.log(Object.prototype.toString.call(arr)); //[object Array]
console.log(Object.prototype.toString.call(obj)); // [object Object]
console.log(arr.toString()); // 1,2,3
```



#### 通过Array.isArray()函数来判断

```js
      var arr = [1, 2, 3];
      var obj = { name: "zhangsan" };
      console.log(Array.isArray(1)); //false
      console.log(Array.isArray(arr)); //true
      console.log(Array.isArray(obj)); //false
```



### 18.forEach和map方法有什么区别

这两个方法都是用来遍历数组的，两者区别如下：

- forEach()方法会针对每一个元素执行提供的函数，对数据的操作会改变原数组，该方法没有返回值；
- map()方法不会改变原数组的值，返回一个新数组，新数组中的值为原数组调用函数处理之后的值；



### 19.for...in和for...of的区别

- for…of 遍历获取的是对象的键值，for…in 获取的是对象的键名；
- for… in 会遍历对象的整个原型链，性能非常差不推荐使用，而 for … of 只遍历当前对象不会遍历原型链；
- 对于数组的遍历，for…in 会返回数组中所有可枚举的属性(包括原型链上可枚举的属性)，for…of 只返回数组的下标对应的属性值；

**总结：** for...in 循环主要是为了遍历对象而生，不适用于遍历数组；for...of 循环可以用来遍历数组、类数组对象，字符串、Set、Map 以及 Generator 对象。



### 20.forEach 的中断

在js中有`break` `return` `continue` 对函数进行中断或跳出循环的操作，我们在 `for`循环中会用到一些中断行为，对于优化数组遍历查找是很好的，但由于`forEach`属于迭代器，只能按序依次遍历完成，所以不支持上述的中断行为。

在 forEach 里面使用`return`并不会跳出，只会被当做`continue`.

可以利用 `try catch` 实现循环中断

```js
　　function getItemById(arr, id) {
        var item = null;
        try {
            arr.forEach(function (curItem, i) {
                if (curItem.id == id) {
                    item = curItem;
                    throw Error();
                }
            })
        } catch (e) {
        }
        return item;
    }
```



### 21.isNaN和Number.isNaN()的区别？

点击这里👉 [isNaN 和 Number.isNaN 函数的区别？](https://blog.csdn.net/weixin_52834435/article/details/124374875?spm=1001.2014.3001.5501)

函数 isNaN 接收参数后，会尝试将这个参数转换为数值，任何不能被转换为数值的的值都会返回 true，因此非数字值传入也会返回 true ，会影响 NaN 的判断。

函数 Number.isNaN 会首先判断传入参数是否为数字，如果是数字再继续判断是否为 NaN ，不会进行数据类型的转换，这种方法对于 NaN 的判断更为准确。



## 二、事件，DOM, BOM相关

### 1.常见鼠标事件有哪些？

> 鼠标事件可以分为：鼠标点击事件 和 鼠标滑过事件

| 鼠标点击事件 | 描述                                   |
| ------------ | -------------------------------------- |
| `click`      | 鼠标左键单击事件                       |
| `dblclick`   | 鼠标左键双击事件                       |
| `mousedown`  | 鼠标左键按下的时候触发的事件           |
| `mouseup`    | 鼠标左键按下，然后松开的时候触发的事件 |

执行顺序：

```
mousedown => mouseup => click
```



| 鼠标滑过事件 | 描述                                                         |
| ------------ | ------------------------------------------------------------ |
| `mouseover`  | 鼠标刚滑入绑定元素的时候触发的事件                           |
| `mouseenter` | 鼠标刚滑入绑定元素的时候触发的事件，触发时机在`mouseover`之后 |
| `mouseout`   | 鼠标滑出绑定元素的时候触发的事件                             |
| `mouseleave` | 鼠标滑出绑定元素的时候触发的事件，触发时机在`mouseout`之后   |
| `mousemove`  | 鼠标在滑入绑定元素后，在里面移动触发的事件，稍微移动就会触发多次 |

执行顺序：

滑入时：

`mouseover` => `mouseenter` => `mousemove`（内部滑动会执行多次）

滑出时：

`mouseout` => `mouseleave`



结论：

- `mouseover`和`mouseout`是一对，滑入/滑出绑定元素和后代元素都会触发
- `mouseenter`和`mouseleave`是一对，滑入/滑出绑定元素才会触发，滑入/滑出后代元素不会重复触发



### 2.键盘事件有哪些？

> js的键盘事件有3种，它们是`keydown`事件,`keypress`事件,`keyup`事件

键盘事件

- `keydown`事件是按键按下去时候会触发
- `keypress`事件是按键按压的时候触发，一般是紧跟着`keydown`之后
- `keyup`事件是按键按下去后，然后松开的时候触发



**注意**

如果我们想阻止键盘的默认输入行为，一定要在`keydown`事件或者`keypress`事件阻止，不能在`keyup`里面阻止。

因为`keyup`是键盘抬起的时候，这时浏览器已经收到了键盘输入的信息了，这时候就无法阻止了。



### 3.关于 element,window,MouseEvent 的坐标和距离的属性

点击这里👉[【JavaScript】关于坐标和距离的属性](https://blog.csdn.net/weixin_52834435/article/details/124551223?spm=1001.2014.3001.5501)



### 4.DOM 的 location 对象

#### 定义

> `Location`对象是浏览器提供的原生对象，提供 URL 相关的信息和操作方法。
>
> 通过`window.location`和`document.location`属性，可以拿到这个对象。



#### 属性

`Location`对象提供以下属性。

- `Location.href`：整个 URL。
- `Location.protocol`：当前 URL 的协议，包括冒号（`:`）。
- `Location.host`：主机。如果端口不是协议默认的`80`和`433`，则还会包括冒号（`:`）和端口。
- `Location.hostname`：主机名，不包括端口。
- `Location.port`：端口号。
- `Location.pathname`：URL 的路径部分，从根路径`/`开始。
- `Location.search`：查询字符串部分，从问号`?`开始。
- `Location.hash`：片段字符串部分，从`#`开始。
- `Location.username`：域名前面的用户名。
- `Location.password`：域名前面的密码。
- `Location.origin`：URL 的协议、主机名和端口。

这些属性里面，只有`origin`属性是只读的，其他属性都可写。



注意，如果对`Location.href`写入新的 URL 地址，浏览器会立刻跳转到这个新地址。

```javascript
// 跳转到新网址
document.location.href = 'http://www.example.com';
```

这个特性常常用于让网页自动滚动到新的锚点。

```javascript
document.location.href = '#top';
// 等同于
document.location.hash = '#top';
```

直接改写`location`，相当于写入`href`属性。

```javascript
document.location = 'http://www.example.com';
// 等同于
document.location.href = 'http://www.example.com';
```

另外，`Location.href`属性是浏览器唯一允许跨域写入的属性，即非同源的窗口可以改写另一个窗口（比如子窗口与父窗口）的`Location.href`属性，导致后者的网址跳转。`Location`的其他属性都不允许跨域写入。



#### 方法

**（1）Location.assign()**

`assign`方法接受一个 URL 字符串作为参数，使得浏览器立刻跳转到新的 URL。如果参数不是有效的 URL 字符串，则会报错。

```javascript
// 跳转到新的网址
document.location.assign('http://www.example.com')
```



**（2）Location.replace()**

`replace`方法接受一个 URL 字符串作为参数，使得浏览器立刻跳转到新的 URL。如果参数不是有效的 URL 字符串，则会报错。

它与`assign`方法的差异在于，`replace`会在浏览器的浏览历史`History`里面删除当前网址，也就是说，一旦使用了该方法，后退按钮就无法回到当前网页了，相当于在浏览历史里面，使用新的 URL 替换了老的 URL。它的一个应用是，当脚本发现当前是移动设备时，就立刻跳转到移动版网页。

```javascript
// 跳转到新的网址
document.location.replace('http://www.example.com')
```



**（3）Location.reload()**

`reload`方法使得浏览器重新加载当前网址，相当于按下浏览器的刷新按钮。

它接受一个布尔值作为参数。如果参数为`true`，浏览器将向服务器重新请求这个网页，并且重新加载后，网页将滚动到头部（即`scrollTop === 0`）。如果参数是`false`或为空，浏览器将从本地缓存重新加载该网页，并且重新加载后，网页的视口位置是重新加载前的位置。

```javascript
// 向服务器重新请求当前网址
window.location.reload(true);
```



**（4）Location.toString()**

`toString`方法返回整个 URL 字符串，相当于读取`Location.href`属性。



### 5.addEventListener 和 onClick() 的区别 

- addEventListener 可以给一个事件注册多个listener，而on在同一时间只能指向唯一对象。
- onclick 只会执行第二个事件，前面定义的事件会被覆盖。
- addEventListener绑定的两个listener会依次执行，其中，第三个参数 true 为捕获，false为冒泡，其中false为默认值。
- addEventListener对任何DOM都是有效的，而onclick仅限于HTML。
- on 事件解绑需要将其置为none，而addEventListener需要使用removeEventListener。

```js
// on 绑定
window.onresize = function () { // ... }
// on 解绑
window.onresize = none

// addEventListener 绑定
window.addEventListener('resize', function () { // ... }, false)
// addEventListener 解绑
window.removeEventListener('resize', function () { // ... }, false)
```



### 6.document 和 window 的区别

> DOM 是为了操作文档出现的 API，document 是其的一个对象；
>
> BOM 是为了操作浏览器出现的 API，window 是其的一个对象。

#### document对象

- 每个载入浏览器的HTML文件都是一个document对象。
- window对象包含了document对象，可以通过window.document来访问。
- document对象定义了许多和HTML节点相关的属性和方法，让我们可以通过脚本来对这些节点进行访问和修改。



#### window对象

- window对象在客户端充当JavaScript中的全局对象，代表浏览器目前打开的窗口。
- window对象下存在一个window属性，指向自身。(环引用)
- 若HTML文档中包含框架（如frame和iframe），则浏览器会在为整个文档创建一个window对象的基础上，为每个框架都新创建一个window对象。
- 由于window对象是全局对象，故其下定义的属性和方法可以访问，不必在前面加window。如要访问document对象，直接写document即可，不必写为window.document。



#### 总结：

- window 指窗体。document 指页面。document 是 window 的一个子对象。
- 用户不能改变 document.location(因为这是当前显示文档的位置)。但是可以改变 window.location (用其它文档取代当前文档)window.location 本身也是一个对象, 而 document.location 不是对象。



### 7.document.documentElement 和 document.body 区别

**document是文档对象，document.documentElement是整个文档节点树的根节点元素，即`<html>`元素**

**documentElement 对应的是 html 标签，而 body 对应的是 body 标签。**

> - document是没有html的节点属性的。
> - document.documentElement是有html节点属性的。
> - 所以我们通过window.document获取到的对象只是一个文档对象，但document.documentElement才是一个真正的html节点对象。

```js
document === document.documentElement
//false
document.getElementsByTagName('html')[0] === document.documentElement  
//true
```



### 8.e.target和e.currentTarget的区别？

- `e.target`：**触发**事件的元素
- `e.currentTarget`：**绑定**事件的元素

elemet.addEventListener('click',function(){}) 这里的 elemet 就是绑定事件的元素(即事件目标)。

> **currentTarget始终是监听事件者，而target是事件的真正触发者（当你鼠标点击某个元素，这个元素就是target）**。

举例：

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=edge">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
  <style>
    #parent{
      width: 200px;
      height: 200px;
      background-color: blueviolet;
    }
    #child1{
      width: 100px;
      height: 100px;
      background-color: aqua;
    }
    #child2{
      width: 100px;
      height: 100px;
      background-color: aliceblue;
    }
  </style>
</head>
<body>
  <div id="parent">
    <div id="child1">child1</div>
    <div id="child2">child2</div>
  </div>
  <script>
    let parent = document.getElementById('parent');
    parent.addEventListener('click', (e) => {
      const {
        target,
        currentTarget
      } = e
      console.log("target: ",target.id);
      console.log("currentTarget: ",currentTarget.id);
    });
  </script>
  
</body>
</html>
```

控制台输出：

```js
target:  child1
currentTarget:  parent

target:  child2
currentTarget:  parent
```



### 9.HTMLCollection和NodeList的区别？

#### HTMLCollection

> **HTMLCollection** 接口表示一个包含了元素（元素顺序为文档流中的顺序）的通用集合（generic collection），还提供了用来从该集合中选择元素的方法和属性。HTML DOM 中的 HTMLCollection 是即时更新的（live）；当其所包含的文档结构发生改变时，它会自动更新。
>
>
> 以上内容摘自MDN，我看得不是很懂🙃



#### JS中返回为HTMLCollection对象的方法

文档结构发生改变时，如document.createElement()方法增加节点，返回结果会动态更新，即每次都是取到最新的结果

1. document.getElementsByTagName()
2. document.getElementsByClassName()



#### NodeList 

> **NodeList** 对象是节点的集合，通常是由属性，如Node.childNodes 和 方法，如document.querySelectorAll 返回的。NodeList**大部分情况下**是静态集合。

- 在一些旧版本浏览器中的方法，比如 `getElementsClassName()` 方法，返回的是 `NodeList` 对象，而不是 `HTMLCollection` 对象。
- 所有浏览器的 `Node.childNodes` 属性返回的都是 `NodeList` 对象。



#### JS中返回为NodeList对象的方法

文档结构发生改变时，如document.createElement()方法增加节点，返回结果不会变化

1. document.querySelectorAll()方法，当**文档中节点更新后重新调用该方法**，返回结果才会是最新的结果。
2. document.getElementsByName()方法



#### JS中返回DOM对象本身的方法

1. 通过id获取的getElementById()方法
2. 通过选择器获取的document.querySelector()方法



#### HTMLCollection 与 NodeList 的区别

|              | HTMLCollection                                               | NodeList                                                     |
| ------------ | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 集合         | **元素**的集合                                               | **节点**的集合                                               |
| 静态和动态   | HTMLCollection 是**动态绑定**的，是一个**动态集合**。DOM 树发生变化，HTMLCollection  也会随之变化，说明其节点的增删是敏感的 | NodeList 是一个**静态集合**，其不受 DOM 树元素变化的影响；相当于是 DOM 树、节点数量和类型的快照，也就是说对节点进行**增删操作**时，NodeList 是感觉不到的。但是对节点内部内容修改，是可以感觉得到的，比如修改 innerHTML |
| 节点         | 不包含属性节点和文本节点                                     | 只有 NodeList 对象有包含**属性节点**和**文本节点**           |
| 元素获取方式 | HTMLCollection 元素可以通过 name，id 或 index 索引来获取     | NodeList 只能通过 index 索引来获取                           |
| 伪数组       | HTMLCollection 和 NodeList 都是**类数组**，不是数组，只是长得像数组而已。所以无法使用数组的方法，比如： pop()，push()，或 join() 等等 | 与 HTMLCollection 一样                                       |

注：

- 文字、标签之间的空格和换行也被当作文本节点

- ```
   <span name="it666"></span>
  ```

  - 在编写HTML代码时，在HTML标签（span）中添加的属性（name）就是属性节点

- 使用元素的 attributes 属性、getAttributeNode() 方法可以返回对应属性节点。

  ```js
  <div id="red">红盒子</div>
  <div id="blue">蓝盒子</div>
  <script>
      var red = document.getElementById("red");  //获取红色盒子
      console.log(red.getAttribute("id"));  //显示红色盒子的id属性值 --> 属性节点
      var blue = document.getElementById("blue");  //获取蓝色盒子
      console.log(blue.getAttribute("id"));  //显示蓝色盒子的id属性值
  </script>
  ```



> `HTMLCollection` 是动态集合，当 `DOM` 树发生变化时， `HTMLCollection` 也会随之改变。
>
> 而 `NodeList` 是静态集合，当 `DOM` 树发生变化时， `NodeList` 不会受到 `DOM` 树变化的影响



### 10.document.ready和window.onload的区别

JavaScript文档加载完成事件 页面加载完成有两种事件：

- 一是ready，表示文档结构已经加载完成（不包含图片等非文字媒体文件）；

- 二是onload，指示页面包含图片等文件在内的所有元素都加载完成。

- window.onload同时编写多个，在执行程序时只会执行最后一个window.onload，而document.ready()则会执行多个。

  

> document.ready()加载的速度较快，只需要等待dom树的加载，无需等待图片以及媒体资源。
>
> 而window.onload不仅要等DOM结构加载完，还要加载图片，视频，音频在内的所有文件都加载完毕，如果在加载图片和媒体资源上花费了大量时间的话，用户就会明显感觉到网速明显的卡顿。

举例：

```js
window.onload = function(){
  alert(3) 
} 
window.onload = function(){
  alert(5) 
}
//这里只会弹出5

document.ready=function(){
  alert("ready"); 
}
document.ready=function(){
  alert("ready"); 
}
document.ready=function(){
  alert("ready"); 
}
//会弹出三次
```



## 三、对象相关

### 1.Object.create()、new Object()和 var obj = {} 的区别

- 字面量和`new`关键字创建的对象是`Object`的实例，原型指向`Object.prototype`，继承内置对象`Object`
- `Object.create(arg, pro)`创建的对象的原型取决于`arg`，`arg`为`null`，新对象是空对象，没有原型，不继承任何对象；`arg`为指定对象，新对象的原型指向指定对象arg，继承arg



### 2.Object.defineProperty()的使用

点击这里👉[JavaScript中的Object.defineProperty](https://blog.csdn.net/weixin_52834435/article/details/123303297)



### 3.遍历对象属性的方法

Object的常见方法：[JavaScript中的Object常用方法](https://blog.csdn.net/weixin_52834435/article/details/123314488)



#### 遍历对象，获取key或value

1.Object.keys()获取到对象上的所有key

2.Object.values()获取到对象上的所有value

3.Object.entries()获取到对象上的key和value，返回的是一个二维数组，比如：[[a,‘aaa’],[b,‘bbb’]]

4.Object.fromEntries()，把键值对列表转换为对象

> 注意，上面的这些方法都只能获取到自己本身，可枚举的key或value，原型链上的是获取不到的，这就是它们与for in的区别，使用for in会把原型链上可枚举的属性也获取到。
>
> 但是包括上面的方法以及for in，都是只能获取到可枚举的属性，不可枚举、和Symbol属性都是获取不到的



#### 获取所有的key，包括不可枚举、和symbol

- Object.getOwnPropertyNames()获取到自身的所有属性的key，包括不可枚举的属性，只包含字符串属性，不包括Symbol属性
- Object.getOwnPropertySymbols()获取到自身的所有Symbol属性的key，如果对象没有Symbol属性，会返回一个空数组



#### for in

> for...in语句以任意顺序遍历一个对象的除Symbol以外的可枚举属性，包括继承的可枚举属性。

```js
const obj = {
  name: "nordon",
  age: 12
};

for (const key in obj) {
  console.log(key, '---', obj[key]);
}

//控制台输出
name --- nordon
age --- 12
```



### 4.点运算符（.）和中括号运算符（[]）

- 一般都习惯用点操作符
- 如果属性名为一个变量，只能使用中括号运算符
- 当key为数字时，使用中括号运算符

```js
let obj = {
  1:10,
  2:20,
  first:"zs"
}
let myFirst = "first"

console.log(obj[1]);//数字
console.log(obj.myFirst);//undefined
console.log(obj[myFirst]);//属性为变量
```



### 5.Object.assign()

**用于克隆**

只会拷贝源对象自身的并且可枚举的属性到目标对象，属于`浅拷贝`。如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖。

```js
var first = {name : 'kong'};
var last = {age : 18};
var person = Object.assign(first, last);
console.log(person);//{name : 'kong', age : 18}
```



### 6.{}的原型链

```js
let obj = new Object();
console.log(obj);//{}

console.log(obj.__proto__ === Object.prototype);//true

console.log(Object.prototype.__proto__ === null)//true

console.log(Object.prototype.constructor === Object)//true

console.log(Object.prototype === obj.__proto__)//true
```



## 四、ES6

### 1.扩展运算符与rest运算符的区别

#### rest 参数

> rest运算符也是三个点号，不过其功能与扩展运算符恰好相反，把逗号隔开的值序列组合成一个数组。

ES6 引入 rest 参数（形式为`...变量名`）, 用于获取函数的多余参数, 这样就不需要使用`arguments`对象了. rest 参数搭配的变量是一个数组, 该变量将多余的参数放入数组中.

```js
//举例1：
function add(...values) {
  let sum = 0;
  for (var val of values) {
    sum += val;
  }
  return sum;
}
  
add(2, 5, 3) // 10

//举例2：
// arguments变量的写法
function sortNumbers() {
  return Array.prototype.slice.call(arguments).sort();
}
  
// rest参数的写法
const sortNumbers = (...numbers) => numbers.sort();
```

> `arguments`对象不是数组, 而是一个类似数组的对象. 所以为了使用数组的方法, 必须使用`Array.prototype.slice.call`先将其转为数组. 
>
> `rest 参数就不存在这个问题, 它就是一个真正的数组, 数组特有的方法都可以使用`.

注意 , rest 参数之后不能再有其他参数（即只能是最后一个参数）, 否则会报错. 

```js
// 报错
function f(a, ...b, c) {
	// ...
}
```



#### 扩展运算符

> 扩展运算符（spread运算符）用三个点号（...）表示，==功能是把数组或类数组对象展开成一系列用逗号隔开的值==。



### 2.严格模式

**设立"严格模式"的目的，主要有以下几个：**

- 消除Javascript语法的一些不合理、不严谨之处，减少一些怪异行为;
- 消除代码运行的一些不安全之处，保证代码运行的安全；
- 提高编译器效率，增加运行速度；



#### 严格模式的使用

**为脚本开启严格模式**

为整个脚本文件开启严格模式，需要在所有语句之前放一个特定语句 `"use strict"`; （或 `'use strict'`;）

```js
// 整个脚本都开启严格模式的语法
"use strict";
var v = "Hi!  I'm a strict mode script!";
复制代码
```



**为函数开启严格模式**

给某个函数开启严格模式，得把 `"use strict"`; （或 `'use strict'`;）声明一字不漏地放在函数体所有语句之前。

```js
function strict() {
  // 函数级别严格模式语法
  'use strict';
  function nested() { 
    return "And so am I!"; 
  }
  return "Hi!  I'm a strict mode function!  " + nested();
}

function notStrict() { 
  return "I'm not strict."; 
}
```



#### 严格模式的规范

##### 变量

严格模式下，使用变量的规则

1. 不允许意外创建全局变量，也就是要先进行声明
2. 不能使用 `delete` 操作符删除声明变量
3. 不用使用保留字（例如 ：implements、interface、let、package、 private、protected、public、static 和 yield 标识符）作为变量名



##### 对象

严格模式下，使用对象的规则

1. 为只读属性赋值会抛出TypeError
2. 对不可配置的（nonconfigurable）的属性使用 delete 操作符会抛出TypeError
3. 为不可扩展的（nonextensible）的对象添加属性会抛出TypeError
4. 使用对象字面量时, 属性名必须唯一

```js
//举例

// 给只读属性赋值
var obj2 = { get x() { return 17; } };
obj2.x = 5; // 抛出TypeError错误

// 给不可写属性赋值
var obj1 = {};
Object.defineProperty(obj1, "x", { value: 42, writable: false });
obj1.x = 9; // 抛出TypeError错误

delete Object.prototype; // 抛出TypeError错误

// 给不可扩展对象的新属性赋值
var fixed = {};
Object.preventExtensions(fixed);
fixed.newProp = "ohai"; // 抛出TypeError错误

var o = { p: 1, p: 2 }; // !!! 语法错误
```



##### 函数

1. 要求命名函数的参数必须唯一
2. 参数的值不会随 arguments 对象的值的改变而变化
3. 禁止使用arguments.callee



##### this指向

1. 全局作用域的函数中的this不再指向全局而是undefined。
2. 如果使用构造函数时，如果忘了加new，this不再指向全局对象，而是undefined报错

```js
// 规则1
function bar() {
  console.log(this)
}
bar() // undefined


// 规则2
function Person() {
  this.name = "Vincent" // Uncaught TypeError: Cannot set property 'name' of undefined
}

Person() // 报错，使用构造函数时，如果忘了加new，this不再指向全局对象，而是undefined.name。
```



### 3.Set和WeakSet,Map和WeakMap的区别

#### Set和WeakSet的区别

1. 里面的元素都唯一，Set的元素可以是任何值，而WeakSet的元素只能是对象。
2. 对于基本类型的值，只要“===”为真，则这两个值相等（无法加入Set中）。对于引用类型（Set和WeakSet中），只有地址相同，它们才不唯一，而值相同的两个不同对象，它们是不同的。
3. NaN被视为同一个值。
4. WeakSet中的元素是弱引用，即随时会消失（被回收）。
5. Set可以遍历，而WeakSet不可以遍历。



#### Set 中的特殊值

`Set` 对象存储的值总是唯一的，所以需要判断两个值是否恒等。有几个特殊值需要特殊对待：

- +0 与 -0 在存储判断唯一性的时候是恒等的，所以只能存在一个
- `undefined` 与 `undefined` 是恒等的，所以只能存在一个
- `NaN` 与 `NaN` 是不恒等的，但是在 `Set` 中认为 `NaN` 与 `NaN` 相等，所有只能存在一个，不重复。





#### Map和WeakMap的区别

1. Map的键和值都可以是任意类型，而WeakMap的键只能是对象。
2. Map和WeakMap的键必须唯一，判断方式是“===”和是否地址相同。
3. Map认为NaN为同一个键。
4. WeakMap中的键值对的键是弱引用，WeakMap中的成员随时会消失。
5. Map可以遍历，而WeakMap不可以遍历。



### 4. Map和普通对象的区别

|          | Map                                                          | Object                                                       |
| -------- | ------------------------------------------------------------ | ------------------------------------------------------------ |
| 意外的键 | Map默认情况不包含任何键，只包含显式插入的键。                | Object 有一个原型, 原型链上的键名有可能和自己在对象上的设置的键名产生冲突。 |
| 键的类型 | Map的键可以是任意值，包括函数、对象或任意基本类型。          | Object 的键必须是 String 或是Symbol。                        |
| 键的顺序 | Map 中的 key 是有序的。因此，当迭代的时候， Map 对象以插入的顺序返回键值。 | Object 的键是无序的                                          |
| Size     | Map 的键值对个数可以轻易地通过size 属性获取                  | Object 的键值对个数只能手动计算                              |
| 迭代     | Map 是 iterable 的，所以可以直接被迭代。                     | 迭代Object需要以某种方式获取它的键然后才能迭代。             |
| 性能     | 在频繁增删键值对的场景下表现更好。                           | 在频繁添加和删除键值对的场景下未作出优化。                   |



### 5.模块加载方案比较（CommonJS和ES6的Module）

简单介绍AMD,CMD,CommonJS,ES6 Moudle👉 [【JavaScript】模块化规范](https://blog.csdn.net/weixin_52834435/article/details/123896045)

#### CommonJS

1. 对于基本数据类型，属于复制。即会被模块缓存。同时，在另一个模块可以对该模块输出的变量重新赋值。
2. 对于复杂数据类型，属于浅拷贝。由于两个模块引用的对象指向同一个内存空间，因此对该模块的值做修改时会影响另一个模块。
3. 当使用require命令加载某个模块时，就会运行整个模块的代码。
4. 当使用require命令加载同一个模块时，不会再执行该模块，而是取到缓存之中的值。也就是说，CommonJS模块无论加载多少次，都只会在第一次加载时运行一次，以后再加载，就返回第一次运行的结果，除非手动清除系统缓存。
5. 脚本代码在require的时候，就会全部执行。一旦出现某个模块被"循环加载"，就只输出已经执行的部分，还未执行的部分不会输出。
6. CommonJS加载模块是同步的：
   - 同步的意味着只有等到对应的模块加载完毕，当前模块中的内容才能被运行；



#### ES6模块

1. ES6模块中的值属于【动态只读引用】。
2. 对于只读来说，即不允许修改引入变量的值，import的变量是只读的，不论是基本数据类型还是复杂数据类型。当模块遇到import命令时，就会生成一个只读引用。等到脚本真正执行时，再根据这个只读引用，到被加载的那个模块里面去取值。
3. 对于动态来说，原始值发生变化，import加载的值也会发生变化。不论是基本数据类型还是复杂数据类型。
4. 循环加载时，ES6模块是动态引用。只要两个模块之间存在某个引用，代码就能够执行。



**理解：CommonJS 模块是运行时加载，ES6 模块是编译时输出接口。**

> 1.运行时加载: CommonJS 模块就是对象；即在输入时是先加载整个模块，生成一个对象，然后再从这个对象上面读取方法，这种加载称为“运行时加载”。

> 2.编译时加载: ES6 模块不是对象，而是通过 export 命令显式指定输出的代码，import时采用静态命令的形式。即在import时可以指定加载某个输出值，而不是加载整个模块，这种加载称为“编译时加载”。



#### 总结：

1、Commonjs是拷贝输出，ES6模块化是引用输出

2、Commonjs是运行时加载，ES6模块化是编译时输出接口

3、Commonjs是单个值导出，ES6模块化可以多个值导出

4、Commonjs是动态语法可写在函数体中，ES6模块化静态语法只能写在顶层

5、Commonjs的this是当前模块化，ES6模块化的this是undefined





### 6.为什么Commonjs不适用于浏览器

(1) CommonJS加载模块是同步的：

- 同步的意味着只有等到对应的模块加载完毕，当前模块中的内容才能被运行；

- 这个在服务器不会有什么问题，因为服务器加载的js文件都是本地文件，加载速度非常快；

如果将它应用于浏览器呢？

浏览器加载js文件需要先从服务器将文件下载下来，之后再加载运行；那么采用同步的就意味着后续的js代码都无法正常运行，即使是一些简单的DOM操作；等待时间取决于网速的快慢，可能要等很长时间，浏览器处于"假死"状态。
因此，浏览器端的模块，不能采用"同步加载"（synchronous），只能采用"异步加载"（asynchronous）。这就是AMD规范诞生的背景。

(2) 在早期为了可以在浏览器中使用模块化，通常会采用AMD或CMD：

- 但是目前一方面现代的浏览器已经支持ES Modules，另一方面借助于webpack等工具可以实现对CommonJS或者ESModule代码的转换；
- AMD和CMD已经使用非常少了



### 7.对AMD和CMD的理解，它们有什么区别

AMD和CMD都是为了解决浏览器端模块化问题而产生的，AMD规范对应的库函数有 Require.js，CMD规范是在国内发展起来的，对应的库函数有Sea.js

`AMD和CMD最大的区别是对依赖模块的执行时机处理不同`

1、AMD推崇依赖前置，在定义模块的时候就要声明其依赖的模块，它采用的是**异步加载模块**。

​	CMD的依赖可以就近书写，但是AMD的依赖必须一开始就写

2、CMD推崇就近依赖，只有在用到某个模块的时候再去require。AMD是**预加载**，在并行加载js文件同时，还	会解析执行该模块（因为还需要执行，所以在加载某个模块前，这个模块的依赖模块需要先加载完成）；而	CMD是**懒加载**，虽然会一开始就并行加载js文件，但是不会执行，而是在需要的时候才执行。



> 异步加载，就是指同时并发加载所依赖的模块，当所有依赖模块都加载完成之后，再执行当前模块的回调函数。这种加载方式和浏览器环境的性能需求刚好吻合。

举例：

```js
//AMD
define(['./a', './b'], function(a, b) {
    //运行至此，a.js和b.js已经下载完成
    //a模块和b模块已经执行完
    a.doing();
    b.doing();
});

//CMD
define(function(require, exports, module) {
    var a = require("./a");
    //等待a.js下载、执行完
    a.doing();
    var b = require("./b");
    //等待b.js下载、执行完
    b.doing();
});
```

