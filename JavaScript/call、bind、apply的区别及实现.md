[TOC]



### 一.作用

#### call() 方法

call() 方法的作用：可以**调用**一个函数，与此同时，它还可以改变这个函数内部的 this 指向。

call() 方法的另一个应用：**可以实现继承**。之所以能实现继承，其实是利用了上面的作用。

语法：

```js
fn1.call(想要将this指向哪里, 函数实参1, 函数实参2);
```

注：第一个参数中，如果不需要改变 this 指向，则传 null。

​		当第一个参数为`null`、`undefined`的时候，默认指向`window`(在浏览器中)。

​		改变`this`指向后原函数会立即执行，且此方法只是临时改变`this`指向一次。

举例1：

```js
const obj1 = {
    nickName: 'qianguyihao',
    age: 28,
};
function fn1() {
    console.log(this);
    console.log(this.nickName);
}
fn1.call(this); // this的指向并没有被改变，此时相当于 fn1();
```

打印结果：

```js
window
undefined
```

举例2：

通过 call() 改变 this 指向：

```js
var obj1 = {
    nickName: 'xiaofeixiaPan',
    age: 19,
};

function fn1(a, b) {
    console.log(this);
    console.log(this.nickName);
    console.log(a + b);
}

fn1.call(obj1, 2, 4); // 先将 this 指向 obj1，然后执行 fn1() 函数
```

打印结果：

```js
obj1
xiaofeixiaPan 
6
```

举例3：

通过 call() 实现继承：

```js
// 给 Father 增加 name 和 age 属性
function Father(myName, myAge) {
    this.name = myName;
    this.age = myAge;
}

function Son(myName, myAge) {
    // !!!!!!
    // 通过这一步，将 father 里面的 this 修改为 Son 里面的 this；另外，给 Son 加上相应的参数，让 Son 自动拥有 Father 里的属性。最终实现继承
    Father.call(this, myName, myAge);
}

const son1 = new Son('xioafeixia', 19);
console.log(JSON.stringify(son1));//{"myName":"xiafeixia","myAge":19}
```

举例4：

类数组借用数组的方法：

类数组因为不是真正的数组所有没有数组类型上自带的种种方法，所以需要去借用数组的方法。

比如借用数组的push方法：

```js
var arrayLike = {
  0: 'zero',
  1: 'one',
  length: 2
}
Array.prototype.push.call(arrayLike, '添加元素1', '添加元素2');
console.log(arrayLike);
// {"0":"zero","1":"one","2":"添加元素1","3":"添加元素2","length":4}
```



#### apply() 方法

apply() 方法的作用：可以**调用**一个函数，与此同时，它还可以改变这个函数内部的 this 指向。这一点，和 call()类似。

apply() 方法的应用：  call() 和 apply() 方法的作用是相同的。唯一的区别在于，apply() 里面传入的**实参，必须是数组（或者二维数组）**。

语法：

```js
fn1.apply(想要将this指向哪里, [函数实参1, 函数实参2]);
```

备注：第一个参数中，如果不需要改变 this 指向，则传 null。

​			当第一个参数为`null`、`undefined`的时候，默认指向`window`(在浏览器中)。

​			改变`this`指向后原函数会立即执行，且此方法只是临时改变`this`指向一次。

举例1：

通过 apply() 改变 this 指向：

```js
var obj1 = {
    nickName: 'xiaofeixa',
    age: 19,
};

function fn1(a) {
    console.log(this);
    console.log(this.nickName);
    console.log(a);
}

fn1.apply(obj1, ['hello']); // 先将 this 指向 obj1，然后执行 fn1() 函数
```

注意，上方代码中，call() 里面传实参时，需要以数组的形式。即便是传一个实参，也需要传数组。

打印结果：

```js
obj1
xiaofeixa
hello
```



**apply() 方法的巧妙应用：求数组的最大值**

如果想要求数组中元素的最大值的时候，数组本身是没有自带方法的

虽然数组里没有获取最大值的方法，但是数值里面有 `Math.max(数字1，数字2，数字3)` 方法，可以获取**多个数值中的最大值**。 另外，由于 apply() 方法在传递实参时，必须要以数组的形式，所以通过 Math.max() 和 apply() 实现。

**举例**：求数组中多个元素的最大值：

```js
const arr1 = [3, 7, 10, 8];

// 下面这一行代码的目的，无需改变 this 指向，所以：第一个参数填 null，或者填 Math，或者填 this 都可以。严格模式中，不让填null。
const maxValue = Math.max.apply(Math, arr1); // 求数组 arr1 中元素的最大值
console.log(maxValue);

const minValue = Math.min.apply(Math, arr1); // 求数组 arr1 中元素的最小值
console.log(minValue);
```

打印结果：

```text
10
3
```

#### bind() 方法

bind() 方法的作用：

bind() 方法**不会立即调用函数**，但是可以改变函数内部的 this 指向。会返回一个新函数。

语法：

```js
新函数 = fn1.bind(想要将this指向哪里, 函数实参1, 函数实参2);
```

参数：

- 第一个参数：在 fn1 函数运行时，指定 fn1 函数的this 指向。如果不需要改变 this 指向，则传 null。
- 其他参数：fn1 函数的实参。
- 这个参数列表(其他参数)可以分多次传入。

解释：它不会调用 fn1 函数，但会返回 由指定this 和指定实参的**原函数拷贝**。可以看出， bind() 方法是有返回值的。

注：bind是复制函数行为，会返回一个**新的函数**。

举例1：

返回一个**新的函数**.

```js
let a = function() {};
let b = a;
console.log(a === b); //true
//bind是新复制函数
let c = a.bind();
console.log(a == c); //false
```

举例2：

绑定参数注意事项

```js
function fun(a, b) {
  return this.f + a + b;
}

//使用bind会生成新函数
let newFunc = fun.bind({ f: 1 }, 3);

//1+3+2 参数2赋值给b即 a=3,b=2
console.log(newFunc(2));
```



**当 bind 返回的函数作为构造函数的时候，bind 时指定的 this 值会失效，但传入的参数依然生效。**

> 一个绑定函数也能使用new操作符创建对象：这种行为就像把原函数当成构造器。提供的 this 值被忽略，同时调用时的参数被提供给模拟函数。

```js
var value = 2;

var foo = {
    value: 1
};

function bar(name, age) {
    this.habit = 'shopping';
    console.log(this.value);
    console.log(name);
    console.log(age);
}

bar.prototype.friend = 'kevin';

var bindFoo = bar.bind(foo, 'daisy');

var obj = new bindFoo('18');
// undefined
// daisy
// 18
console.log(obj.habit);
console.log(obj.friend);
// shopping
// kevin
```

尽管在全局和 foo 中都声明了 value 值，最后依然返回了 undefind，说明绑定的 this 失效了.



#### 小结

`apply`、`call`、`bind`三者：

###### 1.区别

- 三者都可以改变函数的`this`对象指向
- 三者第一个参数都是`this`要指向的对象，如果如果没有这个参数或参数为`undefined`或`null`，则默认指向全局`window`
- 三者都可以传参，但是`apply`是数组，而`call`是参数列表，且`apply`和`call`是一次性传入参数，而`bind`可以分为多次传入
- `bind`是返回绑定this之后的函数，`apply`、`call` 则是立即执行



###### 2.联系

 - 语法：

```js
fun.call(thisArg, param1, param2, ...)
fun.apply(thisArg, [param1,param2,...])
fun.bind(thisArg, param1, param2, ...)
```

 - 返回值：

​		call/apply：`fun`执行的结果 

​		bind：返回`fun`的拷贝，并拥有指定的`this`值和初始参数

 - 参数:

​		`thisArg`(可选):

1. ​		**`fun`的`this`指向`thisArg`对象**
2. ​		非严格模式下：当thisArg为null，undefined，fun中的this指向window对象.
3. ​		严格模式下：`fun`的`this`为`undefined`
4. ​		值为原始值(数字，字符串，布尔值)的this会指向该原始值的自动包装对象，如 String、			Number、Boolean

​		`param1,param2`(可选): 传给`fun`的参数。

1. ​         如果param不传或为 null/undefined，则表示不需要传入任何参数.
2. ​         apply第二个参数为数组，数组内的值为传给`fun`的参数。



###### 调用 call/apply/bind 的必须是个函数

call、apply和bind是挂在Function对象上的三个方法,只有函数才有这些方法。

只要是函数就可以，比如: `Object.prototype.toString`就是个函数，我们经常看到这样的用法：`Object.prototype.toString.call(data)`

### 二.模拟实现

#### call( )

举例：

```js
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call(foo); // 1
```

当调用 call 的时候，可以把 foo 对象改造成如下：

```js
var foo = {
    value: 1,
    bar: function() {
        console.log(this.value)
    }
};

foo.bar(); // 1
```

把bar函数变成foo对象的一个属性。

1.模拟的步骤可以分为：

1. 将函数设为对象的属性
2. 执行该函数
3. 删除该函数

最初的版本：

```js
// 第一版
Function.prototype.call2 = function(context) {
    //context就是this最终要指向的对象，在模拟实现时，要在这个对象上添加一个属性，这个属性就是那个调用call的函数
    // 首先要获取调用call的函数，用this可以获取
    //fn是属性名，可以任意取值
    context.fn = this;
    context.fn();
    delete context.fn;
}

// 测试一下
var foo = {
    value: 1
};

function bar() {
    console.log(this.value);
}

bar.call2(foo); // 1
```

**解决若干小问题**

2.解决call传入的形参：

​			从 Arguments 对象中取值，取出第二个到最后一个参数，然后放到一个数组里。

```js
// 假设此时的arguments为：
// arguments = {
//      0: foo,
//      1: 'xiaofexia',
//      2: 18,
//      length: 3
// }
// 因为arguments是类数组对象，所以可以用for循环
var args = [];
for(var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
}

// 执行后 args为 [foo, 'xiaofexia', 18]
```

3.把这个参数数组放到要执行的函数的参数里面去:

​			用 eval 方法拼成一个函数，这里 args 会自动调用 Array.toString() 这个方法。

```js
var args = [];
for(var i = 1, len = arguments.length; i < len; i++) {
    args.push('arguments[' + i + ']');
}
eval('context.fn(' + args +')');
```

注：

eval函数：

eval()是一个函数，有且只有一个参数string，为字符串类型

```js
eval(string)
```

特点：若string为js代码时，会直接解析执行，若是普通字符串，则返回原字符串。

举例1：

```js
eval("var  a =1;var b=4; alert(a+b)");

//执行结果是：在浏览器界面：alert出一个5 
```

举例2：

```js
eval("alert('hello')");

//在浏览器界面：alert出hello
```

4.call函数的**this 参数可以传 null，当为 null 的时候，视为指向 window**。

```js
 var context = context || window;
```

this将要指向context对象，但context可以为null，此时this指向window。

5.**函数是可以有返回值的**

比如：

```js

var obj = {
    value: 1
}

function bar(name, age) {
    return {
        value: this.value,
        name: name,
        age: age
    }
}

console.log(bar.call(obj, 'xiaofeixia', 18));
// Object {
//    value: 1,
//    name: 'xiaofeixia',
//    age: 19
// }
```

解决方法：

```js
var result = eval('context.fn(' + args +')');

    delete context.fn
    return result;
```

将context对象的fn方法执行完了以后的结果用一个变量result接收，最后返回result。



**实现call() 的代码**

```js
// 第三版
Function.prototype.call2 = function (context) {
    var context = context || window;
    context.fn = this;

    var args = [];
    for(var i = 1, len = arguments.length; i < len; i++) {
        args.push('arguments[' + i + ']');
    }

    var result = eval('context.fn(' + args +')');

    delete context.fn
    return result;
}

// 测试一下
var value = 2;

var obj = {
    value: 1
}

function bar(name, age) {
    console.log(this.value);
    return {
        value: this.value,
        name: name,
        age: age
    }
}

bar.call(null); // 2

console.log(bar.call2(obj, 'kevin', 18));
// 1
// Object {
//    value: 1,
//    name: 'kevin',
//    age: 18
// }
```



#### apply( )

apply 的实现跟 call 类似

```js
Function.prototype.apply = function (context, arr) {
    if (typeof this !== 'function') {
    	throw new TypeError('not funciton')
  	}

    //这两行代码将函数设置为context的一个方法
    var context = context || window;
    context.fn = this;

    //result用来接收上面的方法执行后的返回值
    var result;
    //如果没有参数，只有this要指向的对象，那就不用传递arguments中的参数
    if (!arr) {
        result = context.fn();
    }
    else {
        //如果除了this要指向的对象，还有参数
        var args = [];
        for (var i = 0, len = arr.length; i < len; i++) {
            args.push('arr[' + i + ']');
        }
        result = eval('context.fn(' + args + ')')
    }

    delete context.fn
    return result;
}
```



