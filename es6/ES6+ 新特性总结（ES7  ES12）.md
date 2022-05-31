# ES6+ 新特性总结（ES7 ~ ES12）

[TOC]



## ES7（ES2016）

### Array Includes

- 在ES7之前，如果我们想判断一个数组中是否包含某个元素，需要通过indexOf 获取结果，并且判断是否为-1。
- 在ES7中，我们可以通过includes来判断一个数组中是否包含一个指定的元素，根据情况，如果包含则返回true，否则返回false。

```js
let names = ["abc","why","cba","nab",NaN];
if(names.includes("why")){
  console.log("包含why");//输出
}

if(names.includes("why",1)){
  console.log("包含why");//输出和
}

if(names.includes("why",2)){
  console.log("包含why");//未输出
}

console.log(names.includes(NaN));//true
console.log(names.indexOf(NaN));//-1
```



### 指数(乘方) exponentiation运算符

- 在ES7之前，计算数字的乘方需要通过Math.pow 方法来完成。
-  在ES7中，增加了** 运算符，可以对数字来计算乘方。

```js
const result1 = Math.pow(3,3);
const result2 = 3 ** 4;
console.log(result1,result2);//27 81
```



## ES8（ES2017）

### Object values

之前我们可以通过Object.keys 获取一个对象所有的key，在ES8中提供了Object.values 来获取所有的value值：

```js
const obj = {
  name: "why",
  age: 18,
  height: 1.88
}

console.log(Object.values(obj));//[ 'why', 18, 1.88 ]

console.log(Object.values("abc"));//[ 'a', 'b', 'c' ]
```



### Object entries

通过Object.entries 可以获取到一个数组，数组中会存放可枚举属性的键值对数组。

```js
const obj = {
  name: "why",
  age: 18,
  height: 1.88
}

console.log(Object.entries(obj));
//[ [ 'name', 'why' ], [ 'age', 18 ], [ 'height', 1.88 ] ]

console.log(Object.entries(["abc","cba","nab"]));
//[ [ '0', 'abc' ], [ '1', 'cba' ], [ '2', 'nab' ] ]

console.log(Object.entries("abc"));
//[ [ '0', 'a' ], [ '1', 'b' ], [ '2', 'c' ] ]
```



### String Padding：padStart、padEnd

某些字符串我们需要对其进行前后的填充，来实现某种格式化效果，ES8中增加了padStart 和padEnd 方法，分别是对字符串的首尾进行填充的。

```js
const message = "hello world";

console.log(message.padEnd(15,'a'));//hello worldaaaa
console.log(message.padStart(15,'a'));//aaaahello world
```

一个应用场景：比如需要对身份证、银行卡的前面位数进行隐藏：

```js
const cardNumber = "141029256845681156";
const lastFourNumber = cardNumber.slice(-4);
const finalCardNumber = lastFourNumber.padStart(cardNumber.length,'*');
console.log(finalCardNumber);// **************1156
```



### Trailing Commas

在ES8中，我们允许在函数定义和调用时多加一个逗号：

```js
function foo(a,b,){
  console.log(a,b)
}
foo(10,20,)
```



### Object Descriptors

ES8中增加了另一个对对象的操作是`Object.getOwnPropertyDescriptors`

在这里👉[JavaScript中的Object.defineProperty](https://blog.csdn.net/weixin_52834435/article/details/123303297)





## ES9（ES2018）

### Async iterators

`await`可以和`for...of`循环一起使用，以串行的方式运行异步操作。例如：

```js
async function process(array) {
  for await (let i of array) {
    doSomething(i);
  }
}
```



### 对象扩展运算符（...）

**扩展运算符(...)**：转换对象为用逗号分隔的参数序列(`{ ...obj }`

- 合并对象：`const obj = { ...obj1, ...obj2 }`

- 转换字符串为对象：`{ ..."hello" }`

- 转换数组为对象：`{ ...[1, 2] }`

- 与对象解构赋值结合：`const { x, ...rest/spread } = { x: 1, y: 2, z: 3  }`(不能复制继承自原型对象的属性)

- 修改现有对象部分属性：`const obj = { x: 1, ...{ x: 2 } }`



### Promise finally

finally()方法用于指定不管 Promise 对象最后状态如何，都会执行的操作。该方法是 ES2018 引入标准的。

```
promise
.then(result => {···})
.catch(error => {···})
.finally(() => {···});
```


上面代码中，不管promise最后的状态，在执行完then或catch指定的回调函数以后，都会执行finally方法指定的回调函数。

> finally方法的回调函数不接受任何参数，这意味着没有办法知道，前面的 Promise 状态到底是fulfilled还是rejected。这表明，finally方法里面的操作，应该是与状态无关的，不依赖于 Promise 的执行结果。



## ES10（ES2019）

### flat 与 flatMap

- flat() 方法会按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

- flatMap() 方法首先使用映射函数映射每个元素，然后将结果压缩成一个新数组。

  - 注意一：flatMap是先进行map操作，再做flat的操作；
  - 注意二：flatMap中的flat相当于深度为1；

  

```js
const nums = [10,20,[5,8],[[2,3],[9,22],100]]

const newNums1 = nums.flat(1);

const newNums2 = nums.flat(2);

console.log(newNums1);//[ 10, 20, 5, 8, [ 2, 3 ], [ 9, 22 ], 100 ]

console.log(newNums2);//[ 10, 20,  5,   8, 2, 3,  9, 22, 100 ]
```



```js
const message = ["hello world","hhh","my name is why"];

const newMessage = message.flatMap(item => {
  return item.split(" ")
})

console.log(newMessage)//['hello', 'world','hhh',   'my','name',  'is','why']
```



### Object fromEntries

我们可以通过Object.entries 将一个对象转换成entries，那么如果我们有一个entries了，如何将其转换成对象呢？
ES10提供了Object.formEntries来完成转换：

```js
const obj = {
  name: "why",
  age: 18,
  height: 1.88
}

const entries = Object.entries(obj)
console.log(entries);
//[ [ 'name', 'why' ], [ 'age', 18 ], [ 'height', 1.88 ] ]

const info = Object.fromEntries(entries);
console.log(info)
//{ name: 'why', age: 18, height: 1.88 }
```



**应用场景**

```js
const paramsString = 'name=why&&age=18&&height=1.88';

const searchParams = new URLSearchParams(paramsString);

for(const param  of searchParams){
  console.log(param);
}
/**
    [ 'name', 'why' ]
    [ 'age', '18' ]
    [ 'height', '1.88' ]
 */

const searchObj = Object.fromEntries(searchParams)

console.log(searchObj)
//{ name: 'why', age: '18', height: '1.88' }
```



### trimStart trimEnd

去除一个字符串首尾的空格，我们可以通过trim方法，如果单独去除前面或者后面呢？
ES10中给我们提供了trimStart和trimEnd；

```js
const message = "  hello  world      ";

console.log(message.trim());

console.log(message.trimStart());

console.log(message.trimEnd());
```



### Symbol description：

-  **description**：返回`Symbol值`的描述

[ES2019](https://github.com/tc39/proposal-Symbol-description) 提供了一个实例属性`description`, 直接返回 Symbol 的描述.

```js
const sym = Symbol('123');
sym.description // "123"
```



## ES11（ES2020）

### BigInt

- 在早期的JavaScript中，我们不能正确的表示过大的数字：
  大于MAX_SAFE_INTEGER的数值，表示的可能是不正确的

- 那么ES11中，引入了新的数据类型BigInt，用于表示大的整数：
  **`BitInt`的表示方法是在数值的后面加上n**

```js
const maxInt = Number.MAX_SAFE_INTEGER
console.log(maxInt);//9007199254740991

const bigInt = 9007199254740991n;

console.log(bigInt + 1n);//9007199254740992n
console.log(bigInt + 2n);//9007199254740993n
```



### 空值合并操作符：？？

ES11，Nullish Coalescing Operator增加了空值合并操作符：

以前，当某个变量等于" "，undefined，null，0 时，会自动赋值默认值。但我们并不想让他们赋值为默认值。



```js
const foo = "";

const result1 = foo || "默认值";
const result2 = foo ?? "默认值";
console.log(result1);//默认值
console.log(result2);//""

```

```js
const foo = 0

const bar = foo ?? "default value";

console.log(bar);// 0
```



### Optional Chaining

可选链也是ES11中新增一个特性，主要作用是让我们的代码在进行null和undefined判断时更加清晰和简洁：

```js
const obj = {
  friend: {
    girlFriend: {
      name: "lucy"
    }
  }
}

if(obj.friend && obj.friend.girlFriend){
  console.log(obj.friend.girlFriend.name)//lucy
}

//可选链的方式
console.log(obj.friend?.girlFriend?.name)//lucy
```



### Global This

- 在之前我们希望获取JavaScript环境的全局对象，不同的环境获取的方式是不一样的
  - 比如在浏览器中可以通过this、window来获取；
  - 比如在Node中我们需要通过global来获取；
-  那么在ES11中对获取全局对象进行了统一的规范：globalThis

```js
console.log(globalThis);

console.log(this);//浏览器上

console.log(global);//Node中
```



## ES12

### WeakRefs

如果我们默认将一个对象赋值给另外一个引用，那么这个引用是一个强引用：
如果我们希望是一个弱引用的话，可以使用WeakRef；

```js
let obj = {name: "why"};

let info = new WeakRef(obj);
```



### logical assignment operators: ||=，&&=，??=

```js
//1.逻辑或运算符
let message = ""
//message = message || "hello world"
message ||= "hello world"

console.log(message)

let obj = {
  name: "why"
}

//2.逻辑与操作符
// obj = obj && obj.foo()
obj &&= obj.name

console.log(obj)

//3.逻辑空运算符
let foo = null
foo ??= "默认值"
console.log(foo)
```

