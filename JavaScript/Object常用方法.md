## Object常用方法

[TOC]



### Object.getPrototypeOf()

`Object.getPrototypeOf`方法返回参数对象的原型。这是获取原型对象的标准方法。

```js
var F = function () {};
var f = new F();
Object.getPrototypeOf(f) === F.prototype // true
```

几种特殊对象的原型

```js
// 空对象的原型是 Object.prototype
Object.getPrototypeOf({}) === Object.prototype // true

// Object.prototype 的原型是 null
Object.getPrototypeOf(Object.prototype) === null // true

// 函数的原型是 Function.prototype
function f() {}
Object.getPrototypeOf(f) === Function.prototype // true

```



### Object.setPrototypeOf()

`Object.setPrototypeOf`方法为参数对象设置原型，返回该参数对象。它接受两个参数，第一个是现有对象，第二个是原型对象。

```js
var a = {};
var b = {x: 1};
Object.setPrototypeOf(a, b);

Object.getPrototypeOf(a) === b // true
a.x // 1

```

`Object.setPrototypeOf`方法将对象`a`的原型，设置为对象`b`，因此`a`可以共享`b`的属性。



### Object.create()

该方法接受一个对象作为参数，然后以它为原型，返回一个实例对象。该实例完全继承原型对象的属性。

```js
// 原型对象
var A = {
  print: function () {
    console.log('hello');
  }
};

// 实例对象
var B = Object.create(A);

Object.getPrototypeOf(B) === A // true
B.print() // hello
B.print === A.print // true

```

`Object.create()`方法以`A`对象为原型，生成了`B`对象。`B`继承了`A`的所有属性和方法。

```js
  Object.create = function (obj) {
    function F() {}
    F.prototype = obj;
    return new F();
  };
```

上面代码表明，`Object.create()`方法的实质是新建一个空的构造函数`F`，然后让`F.prototype`属性指向参数对象`obj`，最后返回一个`F`的实例，从而实现让该实例继承`obj`的属性。



`Object.create()`方法还可以接受第二个参数。该参数是一个属性描述对象，它所描述的对象属性，会添加到实例对象，作为该对象自身的属性。

```js
var obj = Object.create({}, {
  p1: {
    value: 123,
    enumerable: true,
    configurable: true,
    writable: true,
  },
  p2: {
    value: 'abc',
    enumerable: true,
    configurable: true,
    writable: true,
  }
});

// 等同于
var obj = Object.create({});
obj.p1 = 123;
obj.p2 = 'abc';

```



### Object.prototype.isPrototypeOf()

实例对象的`isPrototypeOf`方法，用来判断该对象是否为参数对象的原型。

```js
var o1 = {};
var o2 = Object.create(o1);
var o3 = Object.create(o2);

o2.isPrototypeOf(o3) // true
o1.isPrototypeOf(o3) // true

```

`o1`和`o2`都是`o3`的原型。这表明只要实例对象处在参数对象的原型链上，`isPrototypeOf`方法都返回`true`。

```js
Object.prototype.isPrototypeOf({}) // true
Object.prototype.isPrototypeOf([]) // true
Object.prototype.isPrototypeOf(/xyz/) // true
Object.prototype.isPrototypeOf(Object.create(null)) // false

```

上面代码中，由于`Object.prototype`处于原型链的最顶端，所以对各种实例都返回`true`，只有直接继承自`null`的对象除外。



### Object.assign()

**用于克隆**

只会拷贝源对象自身的并且可枚举的属性到目标对象，属于浅拷贝。如果目标对象中的属性具有相同的键，则属性将被源对象中的属性覆盖。

```js
var first = {name : 'kong'};
var last = {age : 18};
var person = Object.assign(first, last);
console.log(person);//{name : 'kong', age : 18}

```

**同名属性的替换**

对于这种嵌套的对象, 一旦遇到同名属性,  [ Object.assign() ] 的处理方法是替换, 而不是添加. 

```javascript
const target = { a: { b: 'c', d: 'e' } }
const source = { a: { b: 'hello' } }
Object.assign(target, source)
// { a: { b: 'hello' } }
```

上面代码中, `target`对象的`a`属性被`source`对象的`a`属性整个替换掉了, 而不会得到 **{ a: { b: 'hello', d: 'e' } }** 的结果. 这通常不是开发者想要的, 需要特别小心. 

### Object.is()

**用于判断两个值是否相同**

```js
Object.is(a, b); //返回true或false
//注意，该函数与==运算符不同，不会强制转换任何类型，
//应该更加类似于===，但值得注意的是它会将+0和-0视作不同
Object.is(+0, -0)  // false
Object.is(NaN, NaN)  // true
Object.is(NaN, 0/0)  // true
+0 === -0 // true
NaN === NaN // false

```



### Object.keys()

**用于返回对象可枚举的属性和方法的名称**

```js
var a = {name : 'kong', age : 18, func : function(){}};
Object.keys(a); //['name', 'age', 'func']

```



### Object.entries()

返回一个给定对象自身可枚举属性的键值对数组，关键词是 **自身**，其排列与使用 [`for...in`]循环遍历该对象时返回的顺序一致（区别在于 for-in 循环还会枚举原型链中的属性）。

```js
let obj1 = {
    a: 'aaa',
    b: 'bbb'
}

console.log(Object.entries(obj1)); // [ [ 'a', 'aaa' ], [ 'b', 'bbb' ] ]

// 所以可以很方便的将对象转换为一个map
let map = new Map(Object.entries(obj1))
console.log(map); // Map(2) { 'a' => 'aaa', 'b' => 'bbb' }

```



### Object.freeze()

冻结一个对象，被冻结后的对象不能被修改。

1. 不能添加新属性
2. 不能删除已有属性
3. 不能修改对象已有属性的可枚举性、可配置性、可写性
4. 不能修改已有的属性值（浅 不能修改，只管一层，第二次以后的对象还是可以修改）
5. 冻结的对象原型也不能修改

严格模式执行上述操作会报错，非严格模式会忽略。

```js
let obj1 = {
    a: 'aaa',
    b: 'bbb',
    c: {
        d: 'cccc'
    }
}

let obj2 = Object.freeze(obj1)

console.log(obj1 === obj2); // true 返回的仍旧是原对象

// 但是修改是无效的

obj2.a = 'hhh'
console.log(obj2); // { a: 'aaa', b: 'bbb', c: { d: 'cccc' } }

obj2.c.d = 'cheny'
console.log(obj2); // { a: 'aaa', b: 'bbb', c: { d: 'cheny' } } 只管一层，深层的对象还是能修改

```



###  Object.getOwnPropertyNames(obj)

**返回一个由指定对象的所有自身属性的属性名（包括不可枚举属性但不包括Symbol值作为名称的属性）组成的数组**

```js
var obj = { 0: "a", 1: "b", 2: "c"};
console.log(Object.getOwnPropertyNames(obj).sort()); // ["0", "1", "2"]

```



### Object.prototype.hasOwnProperty()

hasOwnProperty()方法用来判断某个对象是否含有指定的自身属性

```
obj.hasOwnProperty("属性名");//实例obj是否包含有圆括号中的属性,是则返回true,否则是false
```

所有继承了`Object.prototype`的对象都会从原型链上继承到`hasOwnProperty`方法，这个方法检测一个对象是否包含一个特定的属性，
和`in`不同，这个方法会忽略那些从原型链上继承的属性。

此方法无法检查该对象的原型链中是否具有该属性，该属性必须是对象本身的一个成员。

```js
var o =new Object();
o.prop="exists";

function change(){
  o.newprop=o.prop;
  delete o.prop;
}

o.hasOwnProperty("prop")//true
change()//删除o的prop属性
o.hasOwnProperty("prop")//false
//删除后在使用hasOwnProperty()来判断是否存在，返回已不存在了
```



### propertyIsEnumerable()

判断指定的属性是否可枚举。（只考虑自己本身的属性，原型链上的不考虑）

```js
let obj1 = {
    a: 'aaa',
    b: 'bbb'
}

let obj2 = {
    c: 'ccc',
    d: 'ddd',
    __proto__: obj1
}
Object.defineProperty(obj2, 'e', {
    enumerable: false,
    value: 'eee'
})

console.log(obj2.e); // eee

console.log(obj2.propertyIsEnumerable('c')); // 自己的可枚举属性 true
console.log(obj2.propertyIsEnumerable('a')); // 继承的可枚举属性 不考虑。所以返回false
console.log(obj2.propertyIsEnumerable('e')); // 自己的不可枚举属性 false

```



### Object.getOwnPropertyDescriptor()

返回对象自有属性的属性描述符。

```js
let obj = {}
Object.defineProperty(obj, 'name', {
    configurable: true,
    value: 'cheny',
    writable: true,
    enumerable: true
})

console.log(obj.name); // cheny
let desc = Object.getOwnPropertyDescriptor(obj, 'name')
console.log(typeof desc); // object
console.log(desc);
/*
{
  value: 'cheny',
  writable: true,
  enumerable: true,
  configurable: true
}
*/

```



### Object.getOwnPropertyDescriptors()

用来获取一个对象的所有自身属性的描述符。

```js
let obj = {}
Object.defineProperties(obj, {
    'name': {
        value: 'John',
        writable: true,
    },
    'age': {
        value: '18',
        writable: false,
    }
})

console.log(obj.name);// John
console.log(obj.age);// 18

let desc = Object.getOwnPropertyDescriptors(obj)
console.log(desc);
/*
{
  name: {
    value: 'John',
    writable: true,
    enumerable: false,
    configurable: false
  },
  age: {
    value: '18',
    writable: false,
    enumerable: false,
    configurable: false
  }
}
*/

```



### Object.seal()

封闭一个对象，阻止添加新属性并将所有现有属性标记为不可配置。当前属性的值只要原来是可写的就可以改变。

通常，一个对象是[可扩展的](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2FisExtensible)（可以添加新的属性）。密封一个对象会让这个对象变的不能添加新属性，且所有已有属性会变的不可配置。属性不可配置的效果就是属性变的不可删除，以及一个数据属性不能被重新定义成为访问器属性，或者反之。但属性的值仍然可以修改。尝试删除一个密封对象的属性或者将某个密封对象的属性从数据属性转换成访问器属性，结果会静默失败或抛出[`TypeError`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FTypeError)（在[严格模式](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FStrict_mode) 中最常见的，但不唯一）。

不会影响从原型链上继承的属性。但 [`__proto__`](https://link.juejin.cn?target=https%3A%2F%2Fdeveloper.mozilla.org%2Fzh-CN%2Fdocs%2FWeb%2FJavaScript%2FReference%2FGlobal_Objects%2FObject%2Fproto) ( ) 属性的值也会不能修改。

返回被密封对象的引用。

```js
let obj1 = {
    a: 'aaa',
    b: 'bbb'
}

// 让对象变为封闭的
let obj2 = Object.seal(obj1)
console.log(obj1 === obj2); // true

// 变为封闭的对象所有属性不可配置，所以当尝试删除一个属性时，严格模式就会报错
delete obj1.a
console.log(obj1); // { a: 'aaa', b: 'bbb' } 并没有删除成功

```





### 遍历对象，获取key或value

1.`Object.keys()`获取到对象上的所有key

2.`Object.values()`获取到对象上的所有value

3.Object.entries()`获取到对象上的`key和value`，返回的是一个二维数组，比如：`[[a,'aaa'],[b,'bbb']]

4.`Object.fromEntries()`，把键值对列表转换为对象

> 注意，上面的这些方法都只能获取到自己本身，可枚举的key或value，原型链上的是获取不到的，这就是它们与`for in`的区别，使用`for in`会把原型链上可枚举的属性也获取到。
>
> 但是包括上面的方法以及`for in`，都是只能获取到可枚举的属性，不可枚举、和Symbol属性都是获取不到的



### 获取所有的key，包括不可枚举、和symbol

1. `Object.getOwnPropertyNames()`获取到自身的所有属性的key，包括不可枚举的属性，只包含字符串属性，不包括Symbol属性
2. `Object.getOwnPropertySymbols()`获取到自身的所有Symbol属性的key，如果对象没有Symbol属性，会返回一个空数组



### for in

> **`for...in`语句**以任意顺序遍历一个对象的除`Symbol`以外的**可枚举**属性，包括继承的可枚举属性。

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

