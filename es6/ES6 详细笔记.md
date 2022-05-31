# ES6 详细笔记

**ES6中的特性**

- let 和 const
- 变量的赋值解构
- 字符串的扩展
- 正则的扩展
- 数值的扩展
- 函数的扩展
- 对象的扩展
- 运算符的扩展
- Symbol
- Set 和 Map
- Proxy
- Reflect
- Promise
- Iterator
- for ... of
- Generator
- async
- Class
- Module



**这里按照ES6标准入门的目录顺序写的笔记，只写了一部分，后序的部分分成了好几篇笔记写的。**



[TOC]





## 1.let/const

> 注意:`不存在变量提升`
>
> `var`命令会发生“变量提升”现象, 即变量可以在声明之前使用, 值为 **undefined** . 这种现象多多少少是有些奇怪的, 按照一般的逻辑, 变量应该在声明语句之后才可以使用. 
>
> 为了纠正这种现象, `let`、`const`命令改变了语法行为, 它所声明的变量一定要在声明后使用, 否则报错

### Ⅰ-概括与总结

**声明**

-  **const命令**: 声明常量
-  **let命令**: 声明变量

**作用范围**

  - `var命令`在全局代码中执行
  - `const命令`和`let命令`只能在代码块中执行

**赋值使用**

  - `const命令`声明常量后必须立马赋值
  - `let命令`声明变量后可立马赋值或使用时赋值

​	注：声明方法: `var`、`const`、`let`、`function`、`class`、`import`

**重点难点**

- 不允许重复声明
- 未定义就使用会报错: `const命令`和`let命令`不存在变量提升
- 暂时性死区: 在代码块内使用`const命令`和`let命令`声明变量之前, 该变量都不可用



### Ⅱ-let关键字

let 关键字用来声明变量, 使用 let 声明的变量有几个特点:  

- 不允许重复声明 
- 块级作用域 
- 不存在变量提升 
- 不影响作用域链



### Ⅲ-const关键字

const 关键字用来声明常量 , const 声明有以下特点:

- 不允许重复声明 
- `值不允许修改`
- 不存在变量提升 
- 块级作用域 
- 声明必须赋初始值
- 标识符一般为大写

**注意: `对象属性修改和数组元素变化不会触发 const 错误`** 

> `const`实际上保证的, `并不是变量的值不得改动, 而是变量指向的那个内存地址所保存的数据不得改动`
>
> 对于简单类型的数据（数值、字符串、布尔值）, 值就保存在变量指向的那个内存地址, 因此等同于常量. 但对于复合类型的数据（主要是对象和数组）, 变量指向的内存地址, 保存的只是一个指向实际数据的指针, `const`只能保证这个指针是固定的（即总是指向另一个固定的地址）, 至于它指向的数据结构是不是可变的, 就完全不能控制了. 因此, 将一个对象声明为常量必须非常小心. 



### Ⅳ-块级作用域

#### ① 为什么需要块级作用域？

ES5 只有全局作用域和函数作用域, 没有块级作用域, 这带来很多不合理的场景. 

**第一种场景, 内层变量可能会覆盖外层变量.** 

```js
var tmp = new Date();
function f() {
	console.log(tmp);
	if (false) { var tmp = 'hhhh'; }
}
f(); // undefined

/*********** 上面写法实际上等于这样 **********************/
var tmp = new Date();
function f() {
var tmp = undefined;
	console.log(tmp); //所以这里打印是undefined
	if (false) {  tmp = 'hhhh'; }
}
```

上面代码的原意是, `if`代码块的外部使用外层的`tmp`变量, 内部使用内层的`tmp`变量. 但是, 函数 [ `f` ] 执行后, 输出结果为 **undefined** , 原因在于变量提升, 导致内层的`tmp`变量覆盖了外层的`tmp`变量. 



**第二种场景, 用来计数的循环变量泄露为全局变量.** 

```js
var s = 'hhhhhh';
for (var i = 0; i < s.length; i++) { console.log(s[i]);}
console.log(i); // 6

```



#### ② ES6 的块级作用域

**`let`实际上为 JavaScript 新增了块级作用域.** 

```js
function f1() {
	let n = 5;
	if (true) { let n = 10; }
	console.log(n); // 5
}
```

上面的函数有两个代码块, 都声明了变量`n`, 运行后输出 5. 这表示外层代码块不受内层代码块的影响. 如果两次都使用`var`定义变量`n`, 最后输出的值才是 10. 

**ES6 允许块级作用域的任意嵌套.** 

```js
{{{{
	{let insane = 'Hello World'}
	console.log(insane); // 报错 因为外层不能取到内层数据
}}}};
```

上面代码使用了一个五层的块级作用域, 每一层都是一个单独的作用域. `第四层作用域无法读取第五层作用域的内部变量`. 

**内层作用域可以定义外层作用域的同名变量.** 

```js
{{{{
	let insane = 'Hello World';
	{let insane = 'Hello World'} //可以这样命名,不会报错
}}}};
```

块级作用域的出现, 实际上使得获得广泛应用的匿名立即执行函数表达式（匿名 IIFE）不再必要了.

```js
// IIFE 写法
(function () {
	var tmp ;
  ...
}());

// 块级作用域写法
{
	let tmp ;
  ...
}
```



#### ③ 块级作用域与函数声明

ES6 引入了块级作用域, 明确允许在块级作用域之中声明函数. ES6 规定, 块级作用域之中, 函数声明语句的行为类似于`let`, 在块级作用域之外不可引用. 

举例：

```js
function f() { console.log('我在外面!'); }
(function () {
	// 重复声明一次函数f
	if (false) { function f() { console.log('我在里面!'); }}
	f();
}());
```

如果在 ES6 浏览器中运行一下上面的代码, 是会报错的, 这是为什么呢？

```js
// 浏览器的 ES6 环境
function f() { console.log('我在外面!'); }
(function () {
// 重复声明一次函数f
	if (false) { function f() { console.log('我在里面!'); } }
	f();
}());
// Uncaught TypeError: f is not a function
```

原来, 如果改变了块级作用域内声明的函数的处理规则, 显然会对老代码产生很大影响. 为了减轻因此产生的不兼容问题 , ES6 在[附录 B](http://www.ecma-international.org/ecma-262/6.0/index.html#sec-block-level-function-declarations-web-legacy-compatibility-semantics)里面规定, 浏览器的实现可以不遵守上面的规定, 有自己的[行为方式](http://stackoverflow.com/questions/31419897/what-are-the-precise-semantics-of-block-level-functions-in-es6). 

- 允许在块级作用域内声明函数. 
- 函数声明类似于`var`, 即会提升到全局作用域或函数作用域的头部. 
- 同时, 函数声明还会提升到所在的块级作用域的头部. 

注意, 上面三条规则只对 ES6 的浏览器实现有效, 其他环境的实现不用遵守, 还是将块级作用域的函数声明当作`let`处理. 

根据这三条规则, 浏览器的 ES6 环境中, 块级作用域内声明的函数, 行为类似于`var`声明的变量. 上面的栗子实际运行的代码如下. 

```js
// 浏览器的 ES6 环境
function f() { console.log('我在外面!'); }
(function () {
 	var f = undefined;
 	if (false) { function f() { console.log('我在里面!'); }}
 	f();
}());
// Uncaught TypeError: f is not a function
```

考虑到环境导致的行为差异太大, 应该避免在块级作用域内声明函数. 如果确实需要, 也应该写成函数表达式, 而不是函数声明语句. 

```js
// 块级作用域内部的函数声明语句, 建议不要使用
{
 let a = 'secret';
 function f() {  return a; }
}

// 块级作用域内部, 优先使用函数表达式
{
 let a = 'secret';
 let f = function () {
   return a;
 };
}
```

另外, 还有一个需要注意的地方. ES6 的块级作用域必须有大括号, 如果没有大括号 , JavaScript 引擎就认为不存在块级作用域. 

```js
// 第一种写法, 报错
if (true) let x = 1;

// 第二种写法, 不报错
if (true) {
 let x = 1;
}
```





## 2.赋值解构

> ES6 允许按照一定模式, `从数组和对象中提取值, 对变量进行赋值`, 这被称为解构（Destructuring）. 
>
> 本质上, 这种写法属于“`模式匹配`”, 只要等号两边的模式相同, 左边的变量就会被赋予对应的值

### Ⅰ-概括总结

> ```javascript
> let [a, b, c] = [1, 2, 3];
> let [foo, [[bar], baz]] = [1, [[2], 3]];
> foo // 1
> bar // 2
> baz // 3
> 
> let [ , , third] = ["foo", "bar", "baz"];
> third // "baz"
> 
> let [x, , y] = [1, 2, 3];
> x // 1
> y // 3
> 
> let [head, ...tail] = [1, 2, 3, 4];
> head // 1
> tail // [2, 3, 4]
> 
> let [x, y, ...z] = ['a'];
> x // "a"
> y // undefined
> z // []
> 
> ```

**如果解构不成功，变量的值就等于`undefined`。**

```javascript
let [foo] = [];
let [bar, foo] = [1];
```

以上两种情况都属于解构不成功，`foo`的值都会等于`undefined`。

**undefined 和 null 无法转为对象, 因此无法进行解构**

- 匹配模式: 只要等号两边的模式相同, 左边的变量就会被赋予对应的值
- 解构赋值规则: 只要等号右边的值不是对象或数组, 就先将其转为对象



### Ⅱ-基本用法

#### ① 默认值

解构赋值允许指定默认值. 

```js
let [foo = true] = [];//foo = true
let [x, y = 'b'] = ['a']; // x='a', y='b'
let [x, y = 'b'] = ['a', undefined]; // x='a', y='b'
```

**如果默认值是一个表达式, 那么这个表达式是惰性求值的, 即只有在用到的时候, 才会求值.** 

```js
function f() { console.log('aaa');}
let [x = f()] = [1]; //1
```

上面代码中, 因为`x`能取到值, 所以函数 [ f ] 根本不会执行. 上面的代码其实等价于下面的代码. 

```js
let x;
if ([1] === undefined) { x = f()} 
else { x = [1]; }
```

默认值可以引用解构赋值的其他变量, 但该变量必须已经声明. 

```javascript
let [x = 1, y = x] = [];     // x=1; y=1
let [x = 1, y = x] = [2];    // x=2; y=2
let [x = 1, y = x] = [1, 2]; // x=1; y=2
let [x = y, y = 1] = [];     // ReferenceError: y is not defined
```

注：**默认值生效的条件是，对象的属性值严格等于`undefined`。**

上面最后一个表达式之所以会报错, 是因为`x`用`y`做默认值时, `y`还没有声明. 

解释：`let [x = 1, y = x] = [2];    // x=2; y=2`

因为右边的 2 不严格等于 undefined，所以默认值（x=1）不生效，所以 x 取值为右边的 2.



### Ⅲ-对象的赋值解构

对象的解构与数组有一个重要的不同. `数组的元素是按次序排列的, 变量的取值由它的位置决定；而对象的属性没有次序, 变量必须与属性同名, 才能取到正确的值`

```js
let { foo, bar } = { foo: 'aaa', bar: 'bbb' };//foo = "aaa"; bar = "bbb"
```

如果解构失败, 变量的值等于 **undefined** . 

```js
let {foo} = {bar: 'baz'};//foo = undefined
```



### Ⅳ-字符串的赋值结构

字符串也可以解构赋值. 这是因为此时, 字符串被转换成了一个类似数组的对象. 

```js
const [a, b, c, d, e] = 'hello';
//a == "h" ;b  == "e" ; c == "l" ; d == "l" ;e == "o"
```

类似数组的对象都有一个`length`属性, 因此还可以对这个属性解构赋值. 

```js
let {length : len} = 'hello';//len == 5
```



### Ⅴ-函数参数的解构赋值

```js
[[1, 2], [3, 4]].map(([a, b]) => a + b);
// [ 3, 7 ]
```

函数参数的解构也可以使用默认值. 

```js
function move({x = 0, y = 0} = {}) {  return [x, y];}
move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, 0]
move({}); // [0, 0]
move(); // [0, 0]
```

注意, 下面的写法会得到不一样的结果. 

```js
function move({x, y} = { x: 0, y: 0 }) {
return [x, y];
}

move({x: 3, y: 8}); // [3, 8]
move({x: 3}); // [3, undefined]
move({}); // [undefined, undefined]
move(); // [0, 0]
```

上面代码是为函数`move`的参数指定默认值, 而不是为变量`x`和`y`指定默认值, 所以会得到与前一种写法不同的结果. 

**undefined** 就会触发函数参数的默认值. 

```js
[1, undefined, 3].map((x = 'yes') => x);
// [ 1, 'yes', 3 ]
```



### Ⅶ-具体应用场景举例

#### ① 交换变量的值

```js
let x = 1;
let y = 2;
[x, y] = [y, x];
```

上面代码交换变量`x`和`y`的值, 这样的写法不仅简洁, 而且易读, 语义非常清晰. 



#### ② 从函数返回多个值

函数只能返回一个值, 如果要返回多个值, 只能将它们放在数组或对象里返回. 有了解构赋值, 取出这些值就非常方便. 

```js
// 返回一个数组
function example() {  return [1, 2, 3]; }
let [a, b, c] = example();

// 返回一个对象
function example() {
return { foo: 1,bar: 2};
}
let { foo, bar } = example();
```



#### ③ 函数参数的定义

解构赋值可以方便地将一组参数与变量名对应起来. 

```js
// 参数是一组有次序的值
function f([x, y, z]) { ... }
f([1, 2, 3]);

// 参数是一组无次序的值
function f({x, y, z}) { ... }
f({z: 3, y: 2, x: 1});
```



#### ④  提取 JSON 数据

解构赋值对提取 JSON 对象中的数据, 尤其有用. 

```js
let jsonData = {
id: 42,
status: "OK",
data: [867, 5309]
};
let { id, status, data: number } = jsonData;
console.log(id, status, number);
// 42, "OK", [867, 5309]
```



#### ⑤  函数参数的默认值

```js
jQuery.ajax = function (url, {
  async = true,
  beforeSend = function () {},
  cache = true,
  complete = function () {},
  crossDomain = false,
  global = true,
  // ... more config
} = {}) {
  // ... do stuff
};
```

指定参数的默认值，就避免了在函数体内部再写`var foo = config.foo || 'default foo';`这样的语句。



## 3.字符串的拓展

#### Ⅰ-概括总结

- **字符串遍历**: 可通过 [ for-of ] 遍历字符串

- **字符串模板**: 可单行可多行可插入变量的增强版字符串

- **标签模板**: 函数参数的特殊调用

- **repeat()**: 把字符串重复n次, 返回`新字符串`

- **matchAll()**: 返回正则表达式在字符串的所有匹配

- **includes()**: 是否存在指定字符串

- **startsWith()**: 是否存在字符串头部指定字符串

- **endsWith()**: 是否存在字符串尾部指定字符串

  

#### Ⅱ-模板字符串

```js
$('#result').append(
  'There are <b>' + basket.count + '</b> ' +
  'items in your basket, ' +
  '<em>' + basket.onSale +
  '</em> are on sale!'
);
```

上面这种写法相当繁琐不方便，ES6 引入了模板字符串解决这个问题。

```js
$('#result').append(`
  There are <b>${basket.count}</b> items
   in your basket, <em>${basket.onSale}</em>
  are on sale!
`);
```

举例：

```js
// 普通字符串
`In JavaScript '\n' is a line-feed.`

// 多行字符串
`In JavaScript this is
 not legal.`

console.log(`string text line 1
string text line 2`);

// 字符串中嵌入变量
let name = "Bob", time = "today";
`Hello ${name}, how are you ${time}?`
```



## 4.函数的拓展

### Ⅰ-函数参数的默认值

ES6 之前，不能直接为函数的参数指定默认值，只能采用变通的方法。

```js
function log(x, y) {
  y = y || 'World';
  console.log(x, y);
}

log('Hello') // Hello World
log('Hello', 'China') // Hello China
log('Hello', '') // Hello World
```

上面代码检查函数`log`的参数`y`有没有赋值，如果没有，则指定默认值为`World`。这种写法的缺点在于，如果参数`y`赋值了，但是对应的布尔值为`false`，则该赋值不起作用。就像上面代码的最后一行，参数`y`等于空字符，结果被改为默认值。

为了避免这个问题，通常需要先判断一下参数`y`是否被赋值，如果没有，再等于默认值。

```js
if (typeof y === 'undefined') {
  y = 'World';
}
```

ES6 允许为函数的参数设置默认值，即直接写在参数定义的后面。

#### ①参数默认值的位置

通常情况下, 定义了默认值的参数, 应该是函数的尾参数. 因为这样比较容易看出来, 到底省略了哪些参数. 如果非尾部的参数设置默认值, 实际上这个参数是没法省略的. 

```js
// 例一
function f(x = 1, y) { return [x, y];}

f() // [1, undefined]
f(2) // [2, undefined]
f(, 1) // 报错
f(undefined, 1) // [1, 1]

// 例二
function f(x, y = 5, z) { return [x, y, z];}

f() // [undefined, 5, undefined]
f(1) // [1, 5, undefined]
f(1, ,2) // 报错
f(1, undefined, 2) // [1, 5, 2]
```

上面代码中, 有默认值的参数都不是尾参数. 这时, 无法只省略该参数, 而不省略它后面的参数, 除非显式输入 **undefined** . 

如果传入 **undefined** , 将触发该参数等于默认值,  **null** 则没有这个效果. 

```js
function foo(x = 5, y = 6) { console.log(x, y); }
foo(undefined, null)
// 5 null
```

上面代码中, `x`参数对应 **undefined** , 结果触发了默认值, `y`参数等于 **null** , 就没有触发默认值. 

#### ② 函数的 length 属性

指定了默认值以后, 函数的`length`属性, 将返回没有指定默认值的参数个数. 也就是说, `指定了默认值后 , length属性将失真`. 

```js
(function (a) {}).length // 1
(function (a = 5) {}).length // 0
(function (a, b, c = 5) {}).length // 2
```

```js
(function(...args) {}).length // 0
```

如果设置了`默认值的参数不是尾参数`, 那么[ length ]属性也不再计入后面的参数了. 

```js
(function (a = 0, b, c) {}).length // 0
(function (a, b = 1, c) {}).length // 1
```

### Ⅲ - 箭头函数 

箭头函数有几个使用注意点. 

（1）函数体内的 [ this ] 对象, 就是定义时所在的对象, 而不是使用时所在的对象. 

（2）不可以当作构造函数, 也就是说, 不可以使用`new`命令, 否则会抛出一个错误. 

（3）不可以使用`arguments`对象, 该对象在函数体内不存在. 如果要用, `可以用 rest 参数代替`. 

（4）不可以使用`yield`命令, 因此箭头函数`不能用作 Generator 函数`. 

#### ①不适用场合

由于箭头函数使得 [ this ] 从“动态”变成“静态”, 下面两个场合不应该使用箭头函数. 

第一个场合是定义对象的方法, 且该方法内部包括 [ this ] . 

```js
const cat = {
  lives: 9,
  jumps: () => { this.lives--;}
}
```

上面代码中, `cat.jumps()`方法是一个箭头函数, 这是错误的. 调用`cat.jumps()`时, 如果是普通函数, 该方法内部的 [ this ] 指向`cat`；如果写成上面那样的箭头函数, 使得 [ this ] 指向全局对象, 因此不会得到预期结果. 这是`因为对象不构成单独的作用域`, 导致`jumps`箭头函数定义时的作用域就是全局作用域. 

第二个场合是需要动态 [ this ] 的时候, 也不应使用箭头函数. 

```js
var button = document.getElementById('press');
button.addEventListener('click', () => {
	this.classList.toggle('on');
});
```

上面代码运行时, 点击按钮会报错, 因为`button`的监听函数是一个箭头函数, 导致里面的 [ this ] 就是全局对象. 如果改成普通函数,  [ this ] 就会动态指向被点击的按钮对象. 

### Ⅳ - rest 参数

ES6 引入 rest 参数（形式为`...变量名`）, 用于获取函数的多余参数, 这样就不需要使用`arguments`对象了. rest 参数搭配的变量是一个数组, 该变量将多余的参数放入数组中. 

```js
function add(...values) {
let sum = 0;
for (var val of values) {
sum += val;
}
return sum;
}

add(2, 5, 3) // 10
```

注意 , rest 参数之后不能再有其他参数（即只能是最后一个参数）, 否则会报错. 

```js
// 报错
function f(a, ...b, c) {
// ...
}
```

函数的`length`属性, 不包括 rest 参数

```js
(function(a) {}).length  // 1
(function(...a) {}).length  // 0
(function(a, ...b) {}).length  // 1
```

### Ⅴ - 严格模式

ES2016 做了一点修改, `规定只要函数参数使用了默认值、解构赋值、或者扩展运算符, 那么函数内部就不能显式设定为严格模式, 否则会报错`. 

```js
// 报错
function doSomething(a, b = a) {
'use strict';
// code
}

// 报错
const doSomething = function ({a, b}) {
'use strict';
// code
};

// 报错
const doSomething = (...a) => {
'use strict';
// code
};

const obj = {
// 报错
doSomething({a, b}) {
'use strict';
// code
}
};
```

这样规定的原因是, 函数内部的严格模式, 同时适用于函数体和函数参数. 但是, 函数执行的时候, 先执行函数参数, 然后再执行函数体. 这样就有一个不合理的地方, 只有从函数体之中, 才能知道参数是否应该以严格模式执行, 但是参数却应该先于函数体执行. 

```js
// 报错
function doSomething(value = 070) {
'use strict';
return value;
}
```

上面代码中, 参数`value`的默认值是八进制数`070`, 但是严格模式下不能用前缀`0`表示八进制, 所以应该报错. 但是实际上 , JavaScript 引擎会先成功执行`value = 070`, 然后进入函数体内部, 发现需要用严格模式执行, 这时才会报错. 

虽然可以先解析函数体代码, 再执行参数代码, 但是这样无疑就增加了复杂性. 因此, 标准索性禁止了这种用法, 只要参数使用了默认值、解构赋值、或者扩展运算符, 就不能显式指定严格模式. 

两种方法可以规避这种限制. 第一种是设定全局性的严格模式, 这是合法的. 

```js
'use strict';

function doSomething(a, b = a) {
// code
}
```

第二种是把函数包在一个无参数的立即执行函数里面. 

```js
const doSomething = (function () {
	'use strict';
	return function(value = 42) {
		return value;
	};
}());
```

### Ⅵ - name 属性

函数的`name`属性, 返回该函数的函数名. 

```js
function foo() {}
foo.name // "foo"
```

需要注意的是 , ES6 对这个属性的行为做出了一些修改. 如果将一个匿名函数赋值给一个变量 , ES5 的`name`属性, 会返回空字符串, 而 ES6 的`name`属性会返回实际的函数名. 

```js
var f = function () {};

// ES5
f.name // ""

// ES6
f.name // "f"
```

如果将一个具名函数赋值给一个变量, 则 ES5 和 ES6 的`name`属性都返回这个具名函数原本的名字. 

```js
const bar = function baz() {};

// ES5
bar.name // "baz"

// ES6
bar.name // "baz"
```

`Function`构造函数返回的函数实例, `name`属性的值为`anonymous`. 

```js
(new Function).name // "anonymous"
```



## 5.数组的拓展

### Ⅰ- 概括与总结

**新增的拓展**

-  **扩展运算符(...)**: 转换数组为用逗号分隔的参数序列(`[...arr]`, 相当于`rest/spread参数`的逆运算)
-  **Array.from()**: 转换具有 [ Iterator接口 ] 的数据结构为真正数组, 返回新数组
   1. 类数组对象: `包含length的对象`、`Arguments对象`、`NodeList对象`
   2. 可遍历对象: `String`、`Set结构`、`Map结构`、`Generator函数`
-  **Array.of()**: 转换一组值为真正数组, 返回新数组
-  **实例方法**
   1. **copyWithin()**: 把指定位置的成员复制到其他位置, 返回原数组
   2. **find()**: 返回第一个符合条件的成员
   3. **findIndex()**: 返回第一个符合条件的成员索引值
   4. **fill()**: 根据指定值填充整个数组, 返回原数组
   5. **keys()**: 返回以索引值为遍历器的对象
   6. **values()**: 返回以属性值为遍历器的对象
   7. **entries()**: 返回以索引值和属性值为遍历器的对象
   8. **其他**:毕竟只是概述,不过多列举,详细看下方
-  **数组空位**: ES6明确将数组空位转为 **undefined** (空位处理规不一, 建议避免出现)

**扩展运算符在数组中的应用**

- 克隆数组: `const arr = [...arr1]`
- 合并数组: `const arr = [...arr1, ...arr2]`
- 拼接数组: `arr.push(...arr1)`
- 代替apply: `Math.max.apply(null, [x, y])` => `Math.max(...[x, y])`
- 转换字符串为数组: `[..."hello"]`
- 转换类数组对象为数组: `[...Arguments, ...NodeList]`
- 转换可遍历对象为数组: `[...String, ...Set, ...Map, ...Generator]`
- 与数组解构赋值结合: `const [x, ...rest/spread] = [1, 2, 3]`
- 计算Unicode字符长度: `Array.from("hello").length` => `[..."hello"].length`



### Ⅱ - 扩展运算符

#### ①  含义

扩展运算符（spread）是三个点（`...`）. 它好比 `rest 参数的逆运算`, 将一个数组转为用逗号分隔的参数序列. 

#### ② 替代函数的 apply 方法

由于扩展运算符可以展开数组, 所以不再需要`apply`方法, 将数组转为函数的参数了. 

```js
// ES5 的写法
function f(x, y, z) {
// ...
}
var args = [0, 1, 2];
f.apply(null, args);

// ES6的写法
function f(x, y, z) {
// ...
}
let args = [0, 1, 2];
f(...args);
```

下面是扩展运算符取代`apply`方法的一个实际的栗子, 应用`Math.max`方法, 简化求出一个数组最大元素的写法. 

```js
// ES5 的写法
Math.max.apply(null, [14, 3, 77])

// ES6 的写法
Math.max(...[14, 3, 77])

// 等同于
Math.max(14, 3, 77);
```

上面代码中, 由于 JavaScript 不提供求数组最大元素的函数, 所以只能套用`Math.max`函数, 将数组转为一个参数序列, 然后求最大值. 有了扩展运算符以后, 就可以直接用`Math.max`了. 

另一个栗子是通过`push`函数, 将一个数组添加到另一个数组的尾部. 

```js
// ES5的 写法
var arr1 = [0, 1, 2];
var arr2 = [3, 4, 5];
Array.prototype.push.apply(arr1, arr2);

// ES6 的写法
let arr1 = [0, 1, 2];
let arr2 = [3, 4, 5];
arr1.push(...arr2);
```

上面代码的 ES5 写法中, `push`方法的参数不能是数组, 所以只好通过`apply`方法变通使用`push`方法. 有了扩展运算符, 就可以直接将数组传入`push`方法. 

#### ③ 扩展运算符的应用

##### a) 复制数组

数组是复合的数据类型, 直接复制的话, 只是复制了指向底层数据结构的指针, 而不是克隆一个全新的数组 [` 浅拷贝`]. 

```js
const a1 = [1, 2];
const a2 = a1;

a2[0] = 2;
a1 // [2, 2]
```

上面代码中, `a2`并不是`a1`的克隆, 而是指向同一份数据的另一个指针. 修改`a2`, 会直接导致`a1`的变化. 

ES5 只能用变通方法来复制数组. 

```js
const a1 = [1, 2];
const a2 = a1.concat();

a2[0] = 2;
a1 // [1, 2]
```

上面代码中, `a1`会返回原数组的克隆, 再修改`a2`就不会对`a1`产生影响. 

扩展运算符提供了复制数组的简便写法.  -->这样就不会造成影响

```js
const a1 = [1, 2];
// 写法一
const a2 = [...a1];
// 写法二
const [...a2] = a1;
```

上面的两种写法, `a2`都是`a1`的克隆. 

##### b) 合并数组

扩展运算符提供了数组合并的新写法. 

```js
const arr1 = ['a', 'b'];
const arr2 = ['c'];
const arr3 = ['d', 'e'];

// ES5 的合并数组
arr1.concat(arr2, arr3);
// [ 'a', 'b', 'c', 'd', 'e' ]

// ES6 的合并数组
[...arr1, ...arr2, ...arr3]
// [ 'a', 'b', 'c', 'd', 'e' ]
```

不过, 这两种方法都是浅拷贝 ( 指的是内部数据如 { foo: 1 } 是存地址 ) , 使用的时候需要注意. 

```js
const a1 = [{ foo: 1 }];
const a2 = [{ bar: 2 }];

const a3 = a1.concat(a2);
const a4 = [...a1, ...a2];

a3[0] === a1[0] // true
a4[0] === a1[0] // true
```

上面代码中, `[ a3 ] 和 [ a4 ] 是用两种不同方法合并而成的新数组, 但是它们的成员都是对原数组成员的引用, 这就是浅拷贝`. 如果修改了引用指向的值, 会同步反映到新数组. 

##### c) 与解构赋值结合

扩展运算符可以与解构赋值结合起来, 用于生成数组. 

```js
const [first, ...rest] = [1, 2, 3, 4, 5];
//first == 1
//rest  == [2, 3, 4, 5]

const [first, ...rest] = [];
//first == undefined
//rest  == []

const [first, ...rest] = ["foo"];
//first  == "foo"
//rest   == []
```

如果将扩展运算符用于数组赋值, 只能放在参数的最后一位, 否则会报错. 

```js
const [...butLast, last] = [1, 2, 3, 4, 5];
// 报错

const [first, ...middle, last] = [1, 2, 3, 4, 5];
// 报错
```

##### d) 字符串

扩展运算符还可以将字符串转为真正的数组. 

```js
[...'hello']
// [ "h", "e", "l", "l", "o" ]
```

##### e) 实现了 Iterator 接口的对象

任何定义了遍历器（Iterator）接口的对象, 都可以用扩展运算符转为真正的数组. 

```js
let nodeList = document.querySelectorAll('div');
let array = [...nodeList];
```

##### f) Map 和 Set 结构，Generator 函数

扩展运算符内部调用的是数据结构的 Iterator 接口, 因此只要具有 Iterator 接口的对象, 都可以使用扩展运算符, 比如 Map 结构. 

```js
let map = new Map([
[1, 'one'],
[2, 'two'],
[3, 'three'],
]);

let arr = [...map.keys()]; // [1, 2, 3]
```



### Ⅲ - Array.from()

> 对于还没有部署该方法的浏览器, 可以用`Array.prototype.slice`方法替代. 

#### ① 简单举例

`Array.from`方法用于将两类对象转为真正的数组: 类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）. 

```js
let arrayLike = {
'0': 'a',
'1': 'b',
'2': 'c',
length: 3
};

```

```js
// ES5的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']
// ES6的写法
let arr2 = Array.from(arrayLike); // ['a', 'b', 'c']
```

#### ② 实际应用场景举栗

实际应用中, 常见的类似数组的对象是 DOM 操作返回的 NodeList 集合, 以及函数内部的`arguments`对象. `Array.from`都可以将它们转为真正的数组. 

```javascript
// NodeList对象
let ps = document.querySelectorAll('p');
Array.from(ps).filter(p => {
return p.textContent.length > 100;
});

// arguments对象
function foo() {
var args = Array.from(arguments);
// ...
}
```

上面代码中, `querySelectorAll`方法返回的是一个类似数组的对象, 可以将这个对象转为真正的数组, 再使用`filter`方法

只要是部署了 Iterator 接口的数据结构, `Array.from`都能将其转为数组. 

```js
Array.from('hello')
// ['h', 'e', 'l', 'l', 'o']

let namesSet = new Set(['a', 'b'])
Array.from(namesSet) // ['a', 'b']
```

上面代码中, 字符串和 Set 结构都具有 Iterator 接口, 因此可以被`Array.from`转为真正的数组. 

如果参数是一个真正的数组, `Array.from`会返回一个一模一样的新数组. 

```js
Array.from([1, 2, 3])
// [1, 2, 3]
```

#### ③ 第二个参数的作用

`Array.from`还可以接受第二个参数, 作用类似于数组的`map`方法, 用来对每个元素进行处理, 将处理后的值放入返回的数组. 

```js
Array.from(arrayLike, x => x * x);
// 等同于
Array.from(arrayLike).map(x => x * x);

Array.from([1, 2, 3], (x) => x * x)
// [1, 4, 9]
```

下面的栗子将数组中布尔值为`false`的成员转为`0`. 

```js
Array.from([1, , 2, , 3], (n) => n || 0)
// [1, 0, 2, 0, 3]
```

另一个栗子是返回各种数据的类型. 

```js
function typesOf () {
return Array.from(arguments, value => typeof value)
}
typesOf(null, [], NaN)
// ['object', 'object', 'number']
```

### Ⅳ- Array.of ( )

#### ① 基本使用

[ Array.of ]方法用于将一组值, 转换为数组. 

```js
Array.of(3, 11, 8) // [3,11,8]
Array.of(3) // [3]
Array.of(3).length // 1
```

这个方法的主要目的, 是弥补数组构造函数`Array()`的不足. 因为参数个数的不同, 会导致`Array()`的行为有差异. 

```js
Array() // []
Array(3) // [, , ,]
Array(3, 11, 8) // [3, 11, 8]
```

上面代码中, `Array`方法没有参数、一个参数、三个参数时, 返回结果都不一样. 只有当参数个数不少于 2 个时, `Array()`才会返回由参数组成的新数组. 参数个数只有一个时, 实际上是指定数组的长度. 

### Ⅴ- 数组的实例方法

#### ①  数组实例的 copyWithin()

数组实例的 [ copyWithin() ] 方法, 在当前数组内部, 将指定位置的成员复制到其他位置（会覆盖原有成员）, 然后返回当前数组. 也就是说, 使用这个方法, `会修改当前数组`. 

```javascript
Array.prototype.copyWithin(target, start = 0, end = this.length)
```

它接受三个参数. 

- target（必需）: 从该位置开始替换数据. 如果为负值, 表示倒数. 
- start（可选）: 从该位置开始读取数据, 默认为 0. 如果为负值, 表示从末尾开始计算. 
- end（可选）: 到该位置前停止读取数据, 默认等于数组长度. 如果为负值, 表示从末尾开始计算. 

这三个参数都应该是数值, 如果不是, 会自动转为数值. 

```javascript
[1, 2, 3, 4, 5].copyWithin(0, 3)
// [4, 5, 3, 4, 5]
```

上面代码表示将从 3 号位直到数组结束的成员（4 和 5）, 复制到从 0 号位开始的位置, 结果覆盖了原来的 1 和 2. 

下面是更多栗子. 

```js
// 将3号位复制到0号位
[1, 2, 3, 4, 5].copyWithin(0, 3, 4) //从三号位开始读取,到四号位结束,得到[4],将其替换到0号位
// [4, 2, 3, 4, 5]

// -2相当于3号位, -1相当于4号位
[1, 2, 3, 4, 5].copyWithin(0, -2, -1) //从倒数2号位开始读取,到倒数一号位结束,得到[4],将其替换到0号位
// [4, 2, 3, 4, 5]

// 将3号位复制到0号位
[].copyWithin.call({length: 5, 3: 1}, 0, 3)
// {0: 1, 3: 1, length: 5}

// 将2号位到数组结束, 复制到0号位
let i32a = new Int32Array([1, 2, 3, 4, 5]);
i32a.copyWithin(0, 2);
// Int32Array [3, 4, 5, 4, 5]

// 对于没有部署 TypedArray 的 copyWithin 方法的平台
// 需要采用下面的写法
[].copyWithin.call(new Int32Array([1, 2, 3, 4, 5]), 0, 3, 4);
// Int32Array [4, 2, 3, 4, 5]
```

#### ② 数组实例的 find() 和 findIndex()

数组实例的 [ find ] 方法, 用于找出第一个符合条件的数组成员. 它的参数是一个回调函数, 所有数组成员依次执行该回调函数, 直到找出第一个返回值为`true`的成员, 然后返回该成员. 如果没有符合条件的成员, 则返回 **undefined** . 

```javascript
[1, 4, -5, 10].find((n) => n < 0)
// -5
```

上面代码找出数组中第一个小于 0 的成员. 

```javascript
[1, 5, 10, 15].find(function(value, index, arr) {
return value > 9;
}) // 10
```

上面代码中, [ find ] 方法的回调函数可以接受三个参数, 依次为`当前的值、当前的位置和原数组`. 

数组实例的 [ findIndex] 方法的用法与 [ find ] 方法非常类似, 返回第一个符合条件的数组成员的位置, 如果所有成员都不符合条件, 则返回`-1`. 

```javascript
[1, 5, 10, 15].findIndex(function(value, index, arr) {
return value > 9;
}) // 2
```

这两个方法都可以接受第二个参数, 用来绑定回调函数的`this`对象. 

```javascript
function f(v){
return v > this.age;
}
let person = {name: 'John', age: 20};
[10, 12, 26, 15].find(f, person);    // 26
```

上面的代码中,  [ find ] 函数接收了第二个参数`person`对象, 回调函数中的`this`对象指向`person`对象. 

另外, 这两个方法都可以发现`NaN`, 弥补了数组的 [ indexOf ] 方法的不足. 

```javascript
[NaN].indexOf(NaN) // -1
[NaN].findIndex(y => Object.is(NaN, y)) // 0
```

上面代码中,  [ indexOf ] 方法无法识别数组的`NaN`成员, 但是 [ findIndex] 方法可以借助 [ Object.is ] 方法做到. 

#### ③ 数组实例的 entries()，keys() 和 values()

ES6 提供三个新的方法——[ entries() ], [ keys() ] 和 [ values() ]——用于遍历数组. 它们都返回一个遍历器对象.可以用`for...of`循环进行遍历, 唯一的区别是[ keys() ]是对键名的遍历、[ values() ]是对键值的遍历, [ entries() ]是对键值对的遍历. 

```js
for (let index of ['a', 'b'].keys()) { console.log(index);}
// 0
// 1
for (let elem of ['a', 'b'].values()) { console.log(elem);}
// 'a'
// 'b'
for (let [index, elem] of ['a', 'b'].entries()) {  console.log(index, elem);}
// 0 "a"
// 1 "b"
```

如果不使用`for...of`循环, 可以手动调用遍历器对象的`next`方法, 进行遍历. 

```js
let letter = ['a', 'b', 'c'];
let entries = letter.entries();
console.log(entries.next().value); // [0, 'a']
console.log(entries.next().value); // [1, 'b']
console.log(entries.next().value); // [2, 'c']
```

#### ④ 数组实例的 includes()

[ Array.prototype.includes ] 方法返回一个布尔值, 表示某个数组是否包含给定的值, 与字符串的 [ includes ] 方法类似. ES2016 引入了该方法. 

```js
[1, 2, 3].includes(2)     // true
[1, 2, 3].includes(4)     // false
[1, 2, NaN].includes(NaN) // true
```

该方法的第二个参数表示搜索的起始位置, 默认为`0`. 如果第二个参数为负数, 则表示倒数的位置, 如果这时它大于数组长度（比如第二个参数为`-4`, 但数组长度为`3`）, 则会重置为从`0`开始. 

```js
[1, 2, 3].includes(3, 3);  // false
[1, 2, 3].includes(3, -1); // true
```

没有该方法之前, 我们通常使用数组的 [ indexOf ] 方法, 检查是否包含某个值. 

```javascript
if (arr.indexOf(el) !== -1) {
// ...
}
```

[ indexOf ] 方法有两个缺点, 一是不够语义化, 它的含义是找到参数值的第一个出现位置, 所以要去比较是否不等于`-1`, 表达起来不够直观. 二是, 它内部使用严格相等运算符（`===`）进行判断, 这会导致对`NaN`的误判. 

```javascript
[NaN].indexOf(NaN)
// -1
```

[ includes ] 使用的是不一样的判断算法, 就没有这个问题. 

```javascript
[NaN].includes(NaN)
// true
```

下面代码用来检查当前环境是否支持该方法, 如果不支持, 部署一个简易的替代版本. 

```javascript
const contains = (() =>
Array.prototype.includes
? (arr, value) => arr.includes(value)
: (arr, value) => arr.some(el => el === value)
)();
contains(['foo', 'bar'], 'baz'); // => false
```

另外，Map 和 Set 数据结构有一个`has`方法, 需要注意与 [ includes ] 区分. 

- Map 结构的`has`方法, 是用来查找键名的, 比如 [ Map.prototype.has(key) ] 、 [ WeakMap.prototype.has(key) ] 、 [ Reflect.has(target, propertyKey) ] . 
- Set 结构的`has`方法, 是用来查找值的, 比如 [ Set.prototype.has(value) ] 、 [ WeakSet.prototype.has(value) ] . 

#### ⑤ 数组实例的 flat()，flatMap()

数组的成员有时还是数组, `Array.prototype.flat()`用于将嵌套的数组“拉平”, 变成一维的数组. 该方法返回一个新数组, 对原数据没有影响. 

```javascript
[1, 2, [3, 4]].flat()
// [1, 2, 3, 4]
```

上面代码中, 原数组的成员里面有一个数组,  [ flat() ] 方法将子数组的成员取出来, 添加在原来的位置. 

[ flat() ] 默认只会“拉平”一层, 如果想要“拉平”多层的嵌套数组, 可以将 [ flat() ] 方法的参数写成一个整数, 表示想要拉平的层数, 默认为1. 

```javascript
[1, 2, [3, [4, 5]]].flat()
// [1, 2, 3, [4, 5]]
[1, 2, [3, [4, 5]]].flat(2)
// [1, 2, 3, 4, 5]
```

上面代码中,  [ flat() ] 的参数为2，表示要“拉平”两层的嵌套数组. 

如果不管有多少层嵌套, 都要转成一维数组, 可以用`Infinity`关键字作为参数. 

```javascript
[1, [2, [3]]].flat(Infinity)
// [1, 2, 3]
```

`如果原数组有空位,  [ flat() ] 方法会跳过空位`.  --> 这个可以用作去除数组中空位,特殊场景好用

```javascript
[1, 2, , 4, 5].flat()
// [1, 2, 4, 5]
```

[ flatMap() ] 方法对原数组的每个成员执行一个函数（相当于执行`Array.prototype.map()`）, 然后对返回值组成的数组执行 [ flat() ] 方法. 该方法返回一个新数组, 不改变原数组. 

```javascript
// 相当于 [[2, 4], [3, 6], [4, 8]].flat()
[2, 3, 4].flatMap((x) => [x, x * 2])
// [2, 4, 3, 6, 4, 8]
```

[ flatMap() ] 只能展开一层数组. 

```javascript
// 相当于 [[[2]], [[4]], [[6]], [[8]]].flat()
[1, 2, 3, 4].flatMap(x => [[x * 2]])
// [[2], [4], [6], [8]]
```

上面代码中, 遍历函数返回的是一个双层的数组, 但是默认只能展开一层, 因此 [ flatMap() ] 返回的还是一个嵌套数组. 

[ flatMap() ] 方法的参数是一个遍历函数, 该函数可以接受三个参数, 分别是当前数组成员、当前数组成员的位置（从零开始）、原数组. 

```javascript
arr.flatMap(function callback(currentValue[, index[, array]]) {
// ...
}[, thisArg])
```

[ flatMap() ] 方法还可以有第二个参数, 用来绑定遍历函数里面的`this`. 

### Ⅵ - 数组的空位

数组的空位指, 数组的某一个位置没有任何值. 比如, `Array`构造函数返回的数组都是空位. 

```javascript
Array(3) // [, , ,]
```

上面代码中, `Array(3)`返回一个具有 3 个空位的数组. 

注意, 空位不是**undefined**, 一个位置的值等于**undefined**, 依然是有值的. `空位是没有任何值`, [ in ]运算符可以说明这一点. 

```javascript
0 in [undefined, undefined, undefined] // true
0 in [, , ,] // false
```

上面代码说明, 第一个数组的 0 号位置是有值的, 第二个数组的 0 号位置没有值. 

ES5 对空位的处理, 已经很不一致了, **大多数情况下会忽略空位**. 

- forEach(), filter(), reduce(),  every()  和 some() 都会跳过空位. 
- map() 会跳过空位, 但会保留这个值
- join()  和 toString() 会将空位视为 undefined , 而 **undefined** 和 **null**会被处理成空字符串. 

```javascript
// forEach方法
[,'a'].forEach((x,i) => console.log(i)); // 1

// filter方法
['a',,'b'].filter(x => true) // ['a','b']

// every方法
[,'a'].every(x => x==='a') // true

// reduce方法
[1,,2].reduce((x,y) => x+y) // 3

// some方法
[,'a'].some(x => x !== 'a') // false

// map方法
[,'a'].map(x => 1) // [,1]

// join方法
[,'a',undefined,null].join('#') // "#a##"

// toString方法
[,'a',undefined,null].toString() // ",a,,"
```

ES6 则是明确将空位转为 **undefined**. 

`Array.from`方法会将数组的空位, 转为 **undefined**, 也就是说, 这个方法不会忽略空位. 

```javascript
Array.from(['a',,'b'])
// [ "a", undefined, "b" ]
```

扩展运算符（`...`）也会将空位转为 **undefined**. 

```javascript
[...['a',,'b']]
// [ "a", undefined, "b" ]
```

`copyWithin()`会连空位一起拷贝. 

```javascript
[,'a','b',,].copyWithin(2,0) // [,"a",,"a"]
```

`fill()`会将空位视为正常的数组位置. 

```javascript
new Array(3).fill('a') // ["a","a","a"]
```

`for...of`循环也会遍历空位. 

```javascript
let arr = [, ,];
for (let i of arr) {
 console.log(1);
}
// 1
// 1
```

上面代码中, 数组`arr`有两个空位, `for...of`并没有忽略它们. 如果改成`map`方法遍历, 空位是会跳过的. 

[ entries() ]、[ keys() ]、[ values() ]、`find()`和`findIndex()`会将空位处理成 **undefined**. 

```javascript
// entries()
[...[,'a'].entries()] // [[0,undefined], [1,"a"]]

// keys()
[...[,'a'].keys()] // [0,1]

// values()
[...[,'a'].values()] // [undefined,"a"]

// find()
[,'a'].find(x => true) // undefined

// findIndex()
[,'a'].findIndex(x => true) // 0
```

由于空位的处理规则非常不统一, 所以建议避免出现空位. 

### Ⅶ - Array.prototype.sort() 的排序稳定性

常见的排序算法之中, 插入排序、合并排序、冒泡排序等都是稳定的, 堆排序、快速排序等是不稳定的. 不稳定排序的主要缺点是, 多重排序时可能会产生问题. 假设有一个姓和名的列表, 要求按照“姓氏为主要关键字, 名字为次要关键字”进行排序. 开发者可能会先按名字排序, 再按姓氏进行排序. 如果排序算法是稳定的, 这样就可以达到“先姓氏, 后名字”的排序效果. 如果是不稳定的, 就不行. 

早先的 ECMAScript 没有规定, `Array.prototype.sort()`的默认排序算法是否稳定, 留给浏览器自己决定, 这导致某些实现是不稳定的. [ES2019](https://github.com/tc39/ecma262/pull/1340) 明确规定, `Array.prototype.sort()`的默认排序算法必须稳定. 这个规定已经做到了, 现在 JavaScript 各个主要实现的默认排序算法都是稳定的. 



## 6.对象的拓展

### Ⅰ- 概括总结

>> **对象的新增方法与用法**
>
>1. **简洁表示法**: 直接写入变量和函数作为对象的属性和方法(`{ prop, method() {} }`)
>2. **属性名表达式**: 字面量定义对象时使用`[]`定义键(`[prop]`, 不能与上同时使用)
>3. **方法的name属性**: 返回方法函数名 -->此处与函数很像,因为本质上函数就是一种特殊对象
>
>  - 取值函数(getter)和存值函数(setter): `get/set 函数名`(属性的描述对象在`get`和`set`上)
>  - bind返回的函数: `bound 函数名`
>  - Function构造函数返回的函数实例: `anonymous`
>
>4.  **属性的可枚举性和遍历**: 描述对象的`enumerable`
>5.  **super关键字**: 指向当前对象的原型对象(只能用在对象的简写方法中`method() {}`)
>6.  **Object.is()**: 对比两值是否相等
>7.  **Object.assign()**: 合并对象(浅拷贝), 返回原对象  (`常用`)
>8.  **Object.getPrototypeOf()**: 返回对象的原型对象
>9.  **Object.setPrototypeOf()**: 设置对象的原型对象
>10.  **__proto__**: 返回或设置对象的原型对象
>
>> **属性遍历**
>
>1. 描述: `自身`、`可继承`、`可枚举`、`非枚举`、`Symbol`
>2. 遍历
>
>  -  [ for-in ] : 遍历对象`自身可继承可枚举`属性
>  -  [Object.keys()] : 返回对象`自身可枚举`属性键 [ key ] 组成的数组
>  -  [Object.getOwnPropertyNames()] : 返回对象`自身非Symbol`属性键 [ key ] 组成的数组
>  -  `Object.getOwnPropertySymbols()`: 返回对象`自身Symbol`属性键 [ key ] 组成的数组
>  -  `Reflect.ownKeys()`: 返回对象`自身全部`属性键 [ key ] 组成的数组

### Ⅱ - 属性的简洁表示

#### ① 属性的简写

```js
function f(x, y) { return {x, y};}
// 等同于
function f(x, y) { return {x: x, y: y};}
f(1, 2) // Object {x: 1, y: 2}



const foo = 'bar';
const baz = {foo};
//baz == {foo: "bar"}

// 等同于
const baz = {foo: foo};
```

#### ② 方法的简写

```js
const o = {
method() {  return "Hello!";}
};

// 等同于
const o = {
method: function() {return "Hello!"; }
};
```

### Ⅲ  - 属性的可枚举性和遍历

#### ① 可枚举性

描述对象的` [ enumerable ] 属性, 称为“可枚举性”`, 如果该属性为 [ false ], 就表示某些操作会忽略当前属性. 

目前, 有四个操作会忽略`enumerable`为 [ false ] 的属性. 

1. **for...in循环**: 只遍历对象自身的和继承的可枚举的属性. 
2. **Object.keys()**: 返回对象自身的所有可枚举的属性的键名. 
3. **JSON.stringify()**: 只串行化对象自身的可枚举的属性. 
4. **Object.assign()**:  忽略`enumerable`为`false`的属性, 只拷贝对象自身的可枚举的属性. 

#### ② 属性的遍历方法

ES6 一共有 5 种方法可以遍历对象的属性. 

**（1）for...in**

`for...in`循环遍历对象自身的和继承的可枚举属性（不含 Symbol 属性）. 

**（2）Object.keys(obj)**

`Object.keys`返回一个数组, 包括对象自身的（不含继承的）所有可枚举属性（不含 Symbol 属性）的键名. 

**（3）Object.getOwnPropertyNames(obj)**

`Object.getOwnPropertyNames`返回一个数组, 包含对象自身的所有属性（不含 Symbol 属性, 但是包括不可枚举属性）的键名. 

**（4）Object.getOwnPropertySymbols(obj)**

`Object.getOwnPropertySymbols`返回一个数组, 包含对象自身的所有 Symbol 属性的键名. 

**（5）Reflect.ownKeys(obj)**

`Reflect.ownKeys`返回一个数组, 包含对象自身的（不含继承的）所有键名, 不管键名是 Symbol 或字符串, 也不管是否可枚举. 

以上的 5 种方法遍历对象的键名, 都遵守同样的属性遍历的次序规则. 

1. 首先遍历所有数值键, 按照数值升序排列. 
2. 其次遍历所有字符串键, 按照加入时间升序排列. 
3. 最后遍历所有 Symbol 键, 按照加入时间升序排列. 

```javascript
Reflect.ownKeys({ [Symbol()]:0, b:0, 10:0, 2:0, a:0 })
// ['2', '10', 'b', 'a', Symbol()]
```

上面代码中, `Reflect.ownKeys`方法返回一个数组, 包含了参数对象的所有属性. 这个数组的属性次序是这样的, 首先是数值属性`2`和`10`, 其次是字符串属性`b`和`a`, 最后是 Symbol 属性. 

### Ⅳ- super 关键字

ES6 又新增了另一个类似的关键字 [ super ], `指向当前对象的原型对象`. 

```js
const proto = { foo: 'hello'};

const obj = {
foo: 'world',
find() {
return super.foo;
}
};

Object.setPrototypeOf(obj, proto);
obj.find() // "hello"
```

注意, `super`关键字表示原型对象时, 只能用在对象的方法之中, 用在其他地方都会报错. 

```js
// 报错
const obj = {
foo: super.foo
}

// 报错
const obj = {
foo: () => super.foo
}

// 报错
const obj = {
foo: function () {
return super.foo
}
}
```

上面三种`super`的用法都会报错, 因为对于 JavaScript 引擎来说, 这里的`super`都没有用在对象的方法之中. 第一种写法是`super`用在属性里面, 第二种和第三种写法是`super`用在一个函数里面, 然后赋值给`foo`属性. 目前, 只有对象方法的简写法可以让 JavaScript 引擎确认, 定义的是对象的方法. 

### Ⅴ -  对象的拓展运算符  ( `...` )

####  ① 扩展运算符的解构赋值

 扩展运算符的解构赋值, 不能复制继承自原型对象的属性. 

```js
let o1 = { a: 1 };
let o2 = { b: 2 };
o2.__proto__ = o1;
let { ...o3 } = o2;
o3 // { b: 2 }
o3.a // undefined
```

上面代码中, 对象`o3`复制了`o2`, 但是只复制了`o2`自身的属性, 没有复制它的原型对象`o1`的属性. 

```js
const o = Object.create({ x: 1, y: 2 });
o.z = 3;

let { x, ...newObj } = o;
let { y, z } = newObj;
console.log(x,newObj,y,z);//1 { z: 3 } undefined 3
x // 1
y // undefined
z // 3
```

上面代码中, 变量`x`是单纯的解构赋值, 所以可以读取对象`o`继承的属性；变量`y`和`z`是扩展运算符的解构赋值, 只能读取对象`o`自身的属性, 所以变量`z`可以赋值成功, 变量`y`取不到值. 



## 7.Symbol

### Ⅰ- 概述与总结

ES6 引入了一种新的原始数据类型`Symbol`, 表示独一无二的值. 它是 JavaScript 语言的`第七种数据类型`, 前六种是: `undefined`、`null`、布尔值（Boolean）、字符串（String）、数值（Number）、对象（Object）. 

1. 定义: 独一无二的值,类似于一种标识唯一性的ID
2. 声明: `const set = Symbol(str)`
3. 入参: 字符串(可选)
4. 方法: 

 - **Symbol()**: 创建以参数作为描述的`Symbol值`(不登记在全局环境)
 - **Symbol.for()**: 创建以参数作为描述的`Symbol值`, 如存在此参数则返回原有的`Symbol值`(先搜索后创建, 登记在全局环境)
 - **Symbol.keyFor()**: 返回已登记的`Symbol值`的描述(只能返回`Symbol.for()`的`key`)
 - **Object.getOwnPropertySymbols()**: 返回对象中所有用作属性名的`Symbol值`的数组

5. 内置

 - **Symbol.hasInstance**: 指向一个内部方法, 当其他对象使用`instanceof运算符`判断是否为此对象的实例时会调用此方法
 - **Symbol.isConcatSpreadable**: 指向一个布尔, 定义对象用于`Array.prototype.concat()`时是否可展开
 - **Symbol.species**: 指向一个构造函数, 当实例对象使用自身构造函数时会调用指定的构造函数
 - **Symbol.match**: 指向一个函数, 当实例对象被`String.prototype.match()`调用时会重新定义`match()`的行为
 - **Symbol.replace**: 指向一个函数, 当实例对象被`String.prototype.replace()`调用时会重新定义`replace()`的行为
 - **Symbol.search**: 指向一个函数, 当实例对象被`String.prototype.search()`调用时会重新定义`search()`的行为
 - **Symbol.split**: 指向一个函数, 当实例对象被`String.prototype.split()`调用时会重新定义`split()`的行为
 - **Symbol.iterator**: 指向一个默认遍历器方法, 当实例对象执行 [ for-of ] 时会调用指定的默认遍历器
 - **Symbol.toPrimitive**: 指向一个函数, 当实例对象被转为原始类型的值时会返回此对象对应的原始类型值
 - **Symbol.toStringTag**: 指向一个函数, 当实例对象被`Object.prototype.toString()`调用时其返回值会出现在`toString()`返回的字符串之中表示对象的类型
 - **Symbol.unscopables**: 指向一个对象, 指定使用`with`时哪些属性会被`with环境`排除

> 数据类型

- **Undefined**
- **Null**
- **String**
- **Number**
- **Boolean**
- **Object**(包含`Array`、`Function`、`Date`、`RegExp`、`Error`)
- **Symbol**
- bigint,   -->**BigInt** 是一种数字类型的数据

> 重点难点

- `Symbol()`生成一个原始类型的值不是对象, 因此`Symbol()`前不能使用`new命令`
- `Symbol()`参数表示对当前`Symbol值`的描述, 相同参数的`Symbol()`返回值不相等
- `Symbol值`不能与其他类型的值进行运算
- `Symbol值`可通过`String()`或`toString()`显式转为字符串
- `Symbol值`作为对象属性名时, 此属性是公开属性, 但不是私有属性
- `Symbol值`作为对象属性名时, 只能用方括号运算符(`[]`)读取, 不能用点运算符(`.`)读取
- `Symbol值`作为对象属性名时, 不会被常规方法遍历得到, 可利用此特性为对象定义`非私有但又只用于内部的方法`

### Ⅱ - 举个简单的例子

注意, `Symbol`函数前不能使用`new`命令, 否则会报错. 这是因为生成的 Symbol 是一个原始类型的值, 不是对象. 也就是说, 由于 Symbol 值不是对象, 所以不能添加属性. 基本上, 它是一种`类似于字符串的数据类型`. 

`Symbol`函数可以接受一个字符串作为参数, 表示对 Symbol 实例的描述, 主要是为了在控制台显示, 或者转为字符串时, 比较容易区分. 

```js
let s1 = Symbol('123');
let s2 = Symbol('456');

s1 // Symbol(123)  注意:此处是 Symbol 值
s2 // Symbol(456)

s1.toString() // "Symbol(123)" 注意 此处是字符串
s2.toString() // "Symbol(456)"
```

如果 Symbol 的参数是一个对象, 就会调用该对象的`toString`方法, 将其转为字符串, 然后才生成一个 Symbol 值. 

```js
const obj = {
toString() {
 return 'abc';
}
};
const sym = Symbol(obj);
sym // Symbol(abc)  --> [ Symbol 值 ]
```

Symbol 值不能与其他类型的值进行运算, 会报错. 

但是，Symbol 值可以显式转为字符串. 

```js
let sym = Symbol('My symbol');

String(sym) // 'Symbol(My symbol)'
sym.toString() // 'Symbol(My symbol)'
```

另外，Symbol 值也可以转为布尔值, 但是不能转为数值. 

```js
let sym = Symbol();
Boolean(sym) // true
!sym  // false

if (sym) {}
Number(sym) // TypeError
sym + 2 // TypeError
```

### Ⅲ - Symbol.prototype.description

[ES2019](https://github.com/tc39/proposal-Symbol-description) 提供了一个实例属性`description`, 直接返回 Symbol 的描述. 

```js
const sym = Symbol('123');
sym.description // "123"
```

### Ⅳ - 作为属性名的 Symbol

#### ① 举个栗子:

由于每一个 Symbol 值都是不相等的, 这意味着 Symbol 值可以作为标识符, 用于对象的属性名, 就能保证不会出现同名的属性. 这对于一个对象由多个模块构成的情况非常有用, 能防止某一个键被不小心改写或覆盖. 

```javascript
let mySymbol = Symbol();

// 第一种写法
let a = {};
a[mySymbol] = 'Hello!';

// 第二种写法
let a = {
[mySymbol]: 'Hello!'
};

// 第三种写法
let a = {};
Object.defineProperty(a, mySymbol, { value: 'Hello!' });

// 以上写法都得到同样结果
a[mySymbol] // "Hello!"
```

上面代码通过方括号结构和 [ Object.defineProperty ] , 将对象的属性名指定为一个 Symbol 值. 

### Ⅴ - 属性名的遍历

Symbol 作为属性名, 遍历对象的时候, 该属性不会出现在`for...in`、`for...of`循环中, 也不会被 [Object.keys()] 、 [Object.getOwnPropertyNames()] 、`JSON.stringify()`返回. 

但是, 它也不是私有属性, 有一个`Object.getOwnPropertySymbols()`方法, 可以获取指定对象的所有 Symbol 属性名. 该方法返回一个数组, 成员是当前对象的所有用作属性名的 Symbol 值. 

```javascript
const obj = {};
let a = Symbol('a');
let b = Symbol('b');

obj[a] = 'Hello';
obj[b] = 'World';
const objectSymbols = Object.getOwnPropertySymbols(obj);

objectSymbols// [Symbol(a), Symbol(b)]
```

上面代码是`Object.getOwnPropertySymbols()`方法的示例, 可以获取所有 Symbol 属性名.

### Ⅵ - Symbol.for()，Symbol.keyFor()

#### ① Symbol.for()

有时, 我们希望重新使用同一个 Symbol 值, `Symbol.for()`方法可以做到这一点. 它接受一个字符串作为参数, 然后搜索有没有以该参数作为名称的 Symbol 值. 如果有, 就返回这个 Symbol 值, 否则就新建一个以该字符串为名称的 Symbol 值, 并将其注册到全局. 

```js
let s1 = Symbol.for('123');
let s2 = Symbol.for('123');
let h1 = Symbol('456');
let h2 = Symbol('456');
console.log(s1 === s2 ,h1 === h2)//true false
```

```js
let s1 = Symbol.for('123');
let s2 = Symbol.for('123');
let h1 = Symbol.for('456');
let h2 = Symbol('456');
console.log(s1 === s2 ,h1 === h2)//true false
```

必须两个变量同时用symbol.for()

`Symbol.for()`与`Symbol()`这两种写法, 都会生成新的 Symbol. 它们的区别是 : 

* 前者会被登记在全局环境中供搜索, 后者不会. 
* `Symbol.for()`不会每次调用就返回一个新的 Symbol 类型的值, 而是会先检查给定的`key`是否已经存在, 如果不存在才会新建一个值. 
* 如果你调用`Symbol.for("cat")`30 次, 每次都会返回同一个 Symbol 值;
* 但是调用`Symbol("cat")`30 次, 会返回 30 个不同的 Symbol 值. 

#### ② Symbol.keyFor()

`Symbol.keyFor()`方法返回一个已登记的 Symbol 类型值的`key`. 

```js
let s1 = Symbol.for("123");
console.log(Symbol.keyFor(s1)) // 123

let s2 = Symbol("456");
console.log(Symbol.keyFor(s2)) // undefined
```

注意, `Symbol.for()`为 Symbol 值登记的名字, 是全局环境的, 不管有没有在全局环境运行. 

```js
function foo() {
return Symbol.for('123'); //在函数内部:局部作用域中运行
}

const x = foo();
const y = Symbol.for('123');
console.log(x === y); // true
```

