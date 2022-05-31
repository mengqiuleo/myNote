# 【ES6】再学Class

[TOC]

参考并推荐文章：

[阮一峰文档](https://es6.ruanyifeng.com/#docs/class)

[💦【何不三连】做完这48道题彻底弄懂JS继承(1.7w字含辛整理-返璞归真)](https://juejin.cn/post/6844904098941108232#heading-50)

[🔥【何不三连】比继承家业还要简单的JS继承题-封装篇(牛刀小试)](https://juejin.cn/post/6844904094948130824#heading-22)





## 一、弄懂在类中定义属性或方法的几种方式

```js
class Cat {
  constructor () {
    var heart = '❤️' //只会存在于constructor这个构造函数中，外部无法直接访问
    this.name = 'cat' //使用this定义的属性和方法会被定义到实例上  
    this.jump = function () {}  
  }  
  color = 'white'  //使用 = 定义的属性和方法也会被定义到实例上
  cleanTheBody = function () {
    console.log('我会用唾液清洁身体')  
  }  
  hideTheShit () { //直接定义的方法会被添加到原型对象prototype上
    console.log('我在臭臭完之后会把它藏起来') 
  }
}
var c = new Cat()
console.log(c) //Cat {color: "white", name: "cat", cleanTheBody: ƒ, jump: ƒ}
console.log(Object.keys(c)) //[ 'color', 'cleanTheBody', 'name', 'jump' ]
c.cleanTheBody()
c.hideTheShit()
```

### 总结：

- 在`constructor`中`var`一个变量，它只存在于`constructor`这个构造函数中
- 在`constructor`中使用`this`定义的属性和方法会被定义到实例上
- 在`class`中使用`=`来定义一个属性和方法，效果与第二点相同，会被定义到实例上
- 在`class`中直接定义一个方法，会被添加到`原型对象prototype`上



### 注意点：

> `Object.assign()`方法可以很方便地一次向类添加多个方法。

```js
class Point {
  constructor(){
    // ...
  }
}

Object.assign(Point.prototype, {
  toString(){},
  toValue(){}
});
```



> `prototype`对象的`constructor()`属性，直接指向“类”的本身，这与 ES5 的行为是一致的。

```js
Point.prototype.constructor === Point // true
```



> 类的内部所有定义的方法，都是不可枚举的

```js
class Point {
  constructor(x, y) {
    // ...
  }

  toString() {
    // ...
  }
}

Object.keys(Point.prototype)
// []
Object.getOwnPropertyNames(Point.prototype)
// ["constructor","toString"]
```



## 二、在 class 中定义静态属性和方法

```js
class Cat {  
  static description = '我这个类是用来生产出一只猫的'  
  static actingCute () {    
    console.log('一听到猫我就想到了它会卖萌')  
  }	
  static run = function() {
    console.log("running~")
  }
}
```

> 在`class`中使用了`static`修饰符定义的属性和方法被认为是静态的，被添加到类本身，不会添加到实例上



## 三、类却不存在提升机制

```js
var a = new A()
function A () {}
console.log(a)

var b = new B()
class B {}
console.log(b)
```

结果：

```js
A {}
Uncaught ReferenceError: Cannot access 'B' before initialization
```

函数`A`是会被提升至作用域的最顶层，所以可以在定义函数`A`之前使用`new A()`

**但是类却不存在这种提升机制**，所以当你执行`new B()`的时候它就会告诉你在`B`没有初始化之前不能使用它。

尽管我们知道，`class`它的本质也是一个函数：

```
console.log(typeof B) // function
```



一个🌰

```js
class Cat {  
  constructor () {    
    this.name = 'cat'    
    var type = 'constructor'  
  }  
  type = 'class'  
  getType = function () {    
    console.log(this.type)    
    console.log(type)  
  }
}
var type = 'window'
var c = new Cat()
c.getType()
```

答案：

```
'class'
'window'
```

解释：

- 调用`getType`函数的是`c`，所以里面的`this`指向了`c`，而`c`上的`type`为`class`
- 当要打印出`type`的时候，发现`getType`函数中并没有这个变量，所以就向外层查找，找到了`window`中存在这个变量，因此打印出`window`。(`var type = 'constructor'`是函数`constructor`中的变量, 你也可以理解为是`constructor`函数的私有变量)
- 注意：`var type = 'constructor'`是一个私有变量，无法直接访问



### 注意点：

#### （1）严格模式

类和模块的内部，默认就是严格模式，所以不需要使用`use strict`指定运行模式。

#### （2）name属性

由于本质上，ES6 的类只是 ES5 的构造函数的一层包装，所以函数的许多特性都被`Class`继承，包括`name`属性。

```javascript
class Point {}
Point.name // "Point"
```

`name`属性总是返回紧跟在`class`关键字后面的类名。



## 四、同名的属性或方法会被 constructor 中的覆盖

```js
class Cat {  
  constructor () {    
    this.name = 'cat1'  
  }  
  name = 'cat2'  
  getName = function  () {    
    console.log(this.name)  
  }
}
var cat = new Cat()
cat.getName()
```

结果：

```
cat1
```

> 同名的属性或方法会被 constructor 中的覆盖，constructor 中的优先



## 五、实现私有方法和私有属性

### 方法一：在命名上加以区别

```js
class Cat {  
  //私有属性
  _name = "catt";

  //公有方法
  getName(){
    console.log(this._name);
  }
}
var cat = new Cat()
cat.getName()//catt
```

_name属性前面加下划线，表示这是一个 `只限于内部使用的私有方法`。但是，这种命名是不保险的，在类的外部，还可以调用这个方法。



### 方法二：将私有方法移出类

**另一种方法就是索性将私有方法移出类，因为类内部的所有方法都是对外可见的。**

```js
class Cat {
  constructor(name) {
    this.name = name
  }  
  getName(){
    myName.call(this)
  }
}
//私有方法
function myName() {
  console.log(this.name);
}

var cat = new Cat("catt")
cat.getName()//catt
```



### 方法三：利用`Symbol`值的唯一性，将私有方法的名字命名为一个`Symbol`值

```js
const bar = Symbol('bar');
const a = Symbol('aaa');

class myClass{

  // 公有方法
  foo() {
    let s = this[bar]();
    console.log("私有方法：",s);
    console.log("私有属性：",[a]);
  }

  // 私有方法
  [bar]() {
    return "私有方法";
  }

  [a] = "私有属性";

};

var test = new myClass();
test.foo();
// 私有方法： 私有方法
// 私有属性： [ Symbol(aaa) ]
```

一般情况下无法获取到它们，因此达到了私有方法和私有属性的效果。但是也不是绝对不行，`Reflect.ownKeys()`依然可以拿到它们。

```js
let arr = Reflect.ownKeys(myClass.prototype);
console.log(arr);
//[ 'constructor', 'foo', Symbol(bar) ]
```



### 方法四：在属性名之前，使用`#`表示

```js
class IncreasingCounter {
  #count = 0;
  get value() {
    console.log('Getting the current value!');
    return this.#count;
  }
  increment() {
    this.#count++;
  }
}

const counter = new IncreasingCounter();
counter.#count // 报错
counter.#count = 42 // 报错
```

上面代码中，`#count`就是私有属性，只能在类的内部使用（`this.#count`）。如果在类的外部使用，就会报错。



#### 一个🌰

```js
class Foo {
  #a;
  #b;
  constructor(a, b) {
    this.#a = a;
    this.#b = b;
  }
  #sum() {
    return this.#a + this.#b;
  }
  printSum() {
    console.log(this.#sum());
  }
}

let test = new Foo(1,3);
test.printSum();//4
```



#### 私有属性也可以设置 getter 和 setter 方法

```js
class Counter {
  #xValue = 0;

  constructor() {
    super();
    // ...
  }

  get #x() { return #xValue; }
  set #x(value) {
    this.#xValue = value;
  }
}
```



### in 运算符

```js
class A {
  use(obj) {
    if (#foo in obj) {
      // 私有属性 #foo 存在
    } else {
      // 私有属性 #foo 不存在
    }
  }
}
```

```js
class A {
  #foo = 0;
  m() {
    console.log(#foo in this); // true
    console.log(#bar in this); // false
  }
}
```



## 六、类的继承

> 类通过`extends`和`super`实现继承。

`extends`的作用：

- `class`可以通过`extends`关键字实现继承父类的所有属性和方法
- 若是使用了`extends`实现继承的子类内部没有`constructor`方法，则会被默认添加`constructor`和`super`。



### 为什么子类的构造函数，一定要调用`super()`？

> 子类必须在`constructor()`方法中调用`super()`，否则就会报错

原因就在于 ES6 的继承机制，与 ES5 完全不同。

- 在`ES5`中的继承(例如**构造继承、寄生组合继承**) ，实质上是先创造子类的实例对象`this`，然后再将父类的属性和方法添加到这个实例对象`this`上(使用的是`Parent.call(this)`)，即“实例在前，继承在后”。
- 在`ES6`中却不是这样的，它实质是**先创造父类的实例对象`this`(也就是使用`super()`)，并且将创造出来的父类的属性和方法加到一个空对象上，然后再将该对象作为子类的实例(用子类的构造函数去修改`this`)**。即“继承在前，实例在后”。

通俗理解就是，子类必须得在`constructor`中调用`super`方法，否则新建实例就会报错，因为子类自己没有自己的`this`对象，而是继承父类的`this`对象，然后对其加工，如果不调用`super`的话子类就得不到`this`对象。



#### 注意1：

> 注意，这意味着新建子类实例时，父类的构造函数必定会先运行一次。

```js
class Foo {
  constructor() {
    console.log(1);
  }
}

class Bar extends Foo {
  constructor() {
    super();
    console.log(2);
  }
}

const bar = new Bar();
// 1
// 2
```

上面示例中，子类 Bar 新建实例时，会输出1和2。原因就是子类构造函数调用`super()`时，会执行一次父类构造函数。



#### 注意2：

> 另一个需要注意的地方是，在子类的构造函数中，只有调用`super()`之后，才可以使用`this`关键字，否则会报错。这是因为子类实例的构建，必须先完成父类的继承，只有`super()`方法才能让子类实例继承父类。

```js
class Point {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }
}

class ColorPoint extends Point {
  constructor(x, y, color) {
    this.color = color; // ReferenceError
    super(x, y);
    this.color = color; // 正确
  }
}
```



#### 注意3：

> 如果子类没有定义`constructor()`方法，这个方法会默认添加，并且里面会调用`super()`。也就是说，不管有没有显式定义，任何一个子类都有`constructor()`方法。

```js
class ColorPoint extends Point {
}

// 等同于
class ColorPoint extends Point {
  constructor(...args) {
    super(...args);
  }
}
```





## 七、super 关键字

`super`这个关键字，既可以当作函数使用，也可以当作对象使用。



### `super`作为函数调用 --> 代表父类的构造函数

> `super`作为函数调用时，代表父类的构造函数。ES6 要求，子类的构造函数必须执行一次`super`函数。

注意，`super`虽然代表了父类`A`的构造函数，但是返回的是子类`B`的实例，即`super`内部的`this`指的是`B`的实例，因此`super()`在这里相当于`A.prototype.constructor.call(this)`。

```js
class A {
  constructor() {
    console.log(new.target.name);
  }
}
class B extends A {
  constructor() {
    super();
  }
}
new A() // A
new B() // B
```

上面代码中，`new.target`指向当前正在执行的函数。可以看到，在`super()`执行时，它指向的是子类`B`的构造函数，而不是父类`A`的构造函数。也就是说，`super()`内部的`this`指向的是`B`。

> 作为函数时，`super()`只能用在子类的构造函数之中，用在其他地方就会报错。
>
> 子类`constructor`中如果要使用`this`的话就必须放到`super()`之后
>
> **原因**：`super`的作用:在`constructor`中必须得有`super()`，它就是用来产生实例`this`的，那么再调用它之前，肯定是访问不到`this`的。

```javascript
class A {}

class B extends A {
  m() {
    super(); // 报错
  }
}
```



### `super`作为对象调用

> `super`作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。
>
> 这里需要注意，由于`super`指向父类的原型对象，所以定义在父类实例上的方法或属性，是无法通过`super`调用的。
>
> 如果属性定义在父类的原型对象上，`super`就可以取到。

```js
class A {
  constructor() {
    this.p = 2;
  }
  foo() {
    return "foo";
  }
}
A.prototype.x = 2

class B extends A {
  constructor() {
    super();
    console.log(super.foo()) //foo
    console.log(super.x)//2
  }
  get m() {
    return super.p;
  }
}

let b = new B();
console.log(b.m); // undefined
```





#### 普通方法调用 --> 指向父类的原型对象

> `super`作为对象时，在普通方法中，指向父类的原型对象；在静态方法中，指向父类。
>
> ES6 规定，在子类普通方法中通过`super`调用父类的方法时，方法内部的`this`指向当前的子类实例。

> 由于`this`指向子类实例，所以如果通过`super`对某个属性赋值，这时`super`就是`this`，赋值的属性会变成子类实例的属性。

```js
class A {
  constructor() {
    this.x = 1;
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
    super.x = 3;//！！！，这里的super指的是子类（赋值时）
    console.log(super.x); // undefined （调用时）
    console.log(this.x); // 3
  }
}

let b = new B();
```

上面代码中，`super.x`赋值为`3`，这时等同于对`this.x`赋值为`3`。而当读取`super.x`的时候，读的是`A.prototype.x`，所以返回`undefined`。



#### 静态方法调用 --> 指向父类

```js
class Parent {
  static myMethod(msg) {
    console.log('static', msg);
  }

  myMethod(msg) {
    console.log('instance', msg);
  }
}

class Child extends Parent {
  static myMethod(msg) {
    super.myMethod(msg);
  }

  myMethod(msg) {
    super.myMethod(msg);
  }
}

Child.myMethod(1); // static 1

var child = new Child();
child.myMethod(2); // instance 2
```

上面代码中，`super`在静态方法之中指向父类，在普通方法之中指向父类的原型对象。



> 在子类的静态方法中通过`super`调用父类的方法时，方法内部的`this`指向当前的子类，而不是子类的实例。

```javascript
class A {
  constructor() {
    this.x = 1;
  }
  static print() {
    console.log(this.x);
  }
}

class B extends A {
  constructor() {
    super();
    this.x = 2;
  }
  static m() {
    super.print();
  }
}

B.x = 3;
B.m() // 3
```

上面代码中，静态方法`B.m`里面，`super.print`指向父类的静态方法。这个方法里面的`this`指向的是`B`，而不是`B`的实例。



> 使用`super`的时候，必须显式指定是作为函数、还是作为对象使用，否则会报错。

```javascript
class A {}

class B extends A {
  constructor() {
    super();
    console.log(super); // 报错
  }
}
```



## 八、类的 `prototype属性` 和 `__proto__属性`

（1）子类的`__proto__`属性，表示构造函数的继承，总是指向父类。

（2）子类`prototype`属性的`__proto__`属性，表示方法的继承，总是指向父类的`prototype`属性。

```javascript
class A {
}

class B extends A {
}

B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```



（3）子类实例的`__proto__`属性的`__proto__`属性，指向父类实例的`__proto__`属性。也就是说，子类的原型的原型，是父类的原型。

```javascript
var p1 = new Point(2, 3);
var p2 = new ColorPoint(2, 3, 'red');

p2.__proto__ === p1.__proto__ // false
p2.__proto__.__proto__ === p1.__proto__ // true
```

上面代码中，`ColorPoint`继承了`Point`，导致前者原型的原型是后者的原型。





### 总结：

#### ES6中的继承：

- 主要是依赖`extends`关键字来实现继承，且继承的效果类似于**寄生组合继承**
- 使用了`extends`实现继承不一定要`constructor`和`super`，因为没有的话会默认产生并调用它们
- `extends`后面接着的目标不一定是`class`，只要是个有`prototype`属性的函数就可以了



#### super相关：

- 在实现继承时，如果子类中有`constructor`函数，必须得在`constructor`中调用一下`super`函数，因为它就是用来产生实例`this`的。
- `super`有两种调用方式：当成函数调用和当成对象来调用。
- `super`当成函数调用时，代表父类的构造函数，且返回的是子类的实例，也就是此时`super`内部的`this`指向子类。在子类的`constructor`中`super()`就相当于是`Parent.constructor.call(this)`。
- `super`当成对象调用时，普通函数中`super`对象指向父类的原型对象，静态函数中指向父类。且通过`super`调用父类的方法时，`super`会绑定子类的`this`，就相当于是`Parent.prototype.fn.call(this)`。

> `super`不管是当成函数调用，还是当成对象调用，内部的`this`都是指向子类
