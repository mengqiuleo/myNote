[TOC]



### 一.绑定方式

1.`this`的5种绑定方式：

- 默认绑定(非严格模式下this指向全局对象, 严格模式下`this`会绑定到`undefined`)

​		**独立函数调用**

- 隐式绑定(当函数引用有**上下文对象**时, 如 `obj.foo()`的调用方式, `foo`内的`this`指向`obj`)
- 显示绑定(通过`call()`或者`apply()`方法直接指定`this`的绑定对象, 如`foo.call(obj)`)
- new绑定 (使用`new`来调用一个函数，会构造一个新对象并把这个新对象绑定到调用函数中的`this`。)
- 箭头函数绑定(`this`的指向由外层作用域决定的)

2.根据函数的调用方式的不同，this 会指向不同的对象：

- 以函数的形式（包括普通函数、定时器函数、立即执行函数）调用时，this 的指向永远都是 window。比如`fun();`相当于`window.fun();`

- 以方法的形式调用时，this 指向调用方法的那个对象

- 以构造函数的形式调用时，this 指向实例对象

- 以事件绑定函数的形式调用时，this 指向**绑定事件的对象**

- 使用 call 和 apply 调用时，this 指向指定的那个对象

  总结：

  如何确定this的值?

  ​      test(): window

  ​      p.test(): p

  ​      new test(): 新创建的对象

  ​      p.call(obj): obj



### 二.一些函数的this分析

##### 1.setTimeout

```js
setTimeout(function () {
   console.log(this); //Window
}, 1000);
```



##### 2.div的点击

```js
<div class="box">123</div>
<script>
   const boxDiv = document.querySelector(".box");
   boxDiv.onclick = function () {
      console.log(this);
       //<div class="box">123</div>
   };
</script>
```



##### 3.数组的forEach

```js
      var names = ["abc", "cba", "nba"];
      names.forEach(function (item) {
        console.log(item, this);
      });
```

![](E:\note\前端\笔记\js\this\数组.jpg)



```js
      var names = ["abc", "cba", "nba"];
      names.forEach(function (item) {
        console.log(item, this);
      }, "abc");
```

![](E:\note\前端\笔记\js\this\数组2.jpg)

### 三.this绑定优先级规则

#### 1.默认规则的优先级最低
毫无疑问，默认规则的优先级是最低的，因为存在其他规则时，就会通过其他规则的方式来绑定this



#### 2.显示绑定优先级高于隐式绑定

**call()，apply() **

```js
var obj = {
  name: "obj",
  foo: function() {
    console.log(this);
  }
}

obj.foo.call('abc') //[String: 'abc']
obj.foo.apply('abc')//[String: 'abc']
```



**bind()**

```js
function foo() {
  console.log(this);
}

var obj = {
  name: "obj",
  foo: foo.bind("aaa")
}

obj.foo() //[String: 'aaa']
```



#### 3.new绑定优先级高于隐式绑定

一个函数可以通过`new`关键字调用。

```js
var obj = {
  name: "obj",
  foo: function() {
    console.log(this);
  }
}

var f = new obj.foo() //foo {}
```

如果`new`优先级更高，那么就是打印`foo`，如果`obj`优先级更高，就会打印`obj`.



#### 4.new绑定优先级高于bind

new绑定和call、apply是不允许同时使用的，所以不存在谁的优先级更高
new绑定可以和bind一起使用，new绑定优先级更高

```js
function foo() {
  console.log(this);
}

var bar = foo.bind("aaa")

var obj = new bar() //foo {}
```



#### 5.this规则之外– 忽略显示绑定

**apply/call/bind：当传入null/undefined时，自动将this绑定成全局对象**

```js
      function foo() {
        console.log(this);
      }

      foo.apply("abc"); //String:"abc"
      foo.apply({}); //Object

      foo.apply(null); //window
      foo.call(undefined); //window

      var bar = foo.bind(null);
      bar(); //window
```



#### 6.this规则之外- 间接函数引用

```js
function foo() {
  console.log(this);
};

var obj1 = {
  name: "obj1",
  foo: foo
};

var obj2 = {
  name: "obj2"
};

obj1.foo(); //obj1
(obj2.foo = obj1.foo)(); //window
```



#### 7.箭头函数

##### 简介

箭头函数不会绑定this、arguments属性；
箭头函数不能作为构造函数来使用（不能和new一起来使用，会抛出错误）；

箭头函数简写：

1.如果函数执行体只有返回一个对象, 那么需要给这个对象加上()

```js
var bar = () => ({name: "ha", age: 17})
```

2.如果函数执行体中只有一行代码, 那么可以省略大括号

```js
nums.forEach(item => console.log(item))
```



##### this绑定规则

> 箭头函数中没有 this 绑定，必须通过查找作用域链来决定其值，如果箭头函数被非箭头函数包含，则 this 绑定的是最近一层非箭头函数的 this，否则，this 为 undefined。

```js
var name = "ha"

var foo = () => {
  console.log(this);
}

foo() //window
var obj = {foo: foo}
obj.foo() //window
foo.call("bac") //window
```

不论通过什么方式调用，this 绑定的是最近一层非箭头函数的 this



**应用场景**

```js
var obj = {
  data: [],
  getData: function() {
    setTimeout(function() {
      var result = ["abc","cba","nba"]
      this.data = result
    },2000)
  }
}

obj.getData()
console.log(obj.data);//Array(0)
//此时obj拿不到result数组，
//因为this指向出了问题：setTimeout的this指向是window，此时obj的data仍是空数组
```

改进：

我们需要在外层定义：`var _this = this`
在setTimeout的回调函数中使用_this就代表了obj对象

```js
var obj = {
  data: [],
  getData: function() {
    var _this = this
    setTimeout(function() {
      var result = ["abc","cba","nba"]
      _this.data = result
    },1000)
  }
}

obj.getData()
console.log(obj);
```

使用箭头函数：

```js
var obj = {
  data: [],
  getData: function() {
    setTimeout(() => {
      var result = ["abc","cba","nba"];
      this.data = result;
    },1000)
  }
}

obj.getData();
console.log(obj);
/*data: Array(3)
0: "abc"
1: "cba"
2: "nba"
length: 3
*/
```



如果getData也是一个箭头函数，那么setTimeout中的回调函数中的this指向谁呢？

**window**

```js
var obj = {
  data: [],
  getData: () => {
    setTimeout(() => {
      console.log(this); //window
    }, 1000);
  },
};
obj.getData();
```



### 四.面试题

```js
var name = "window"
var person = {
  name: "person",
  sayName: function() {
    console.log(this.name);
  }
}

function sayName() {
  var sss = person.sayName;
  sss();//window
  person.sayName();//person
  (person.sayName)();//person:这里的括号加与不加都是一样的
  (b = person.sayName)();//window:间接函数引用
}
sayName()
```



**总结**

**定义对象不产生作用域，对象不是作用域，函数是作用域**

```js
var name = "window"
var person1 = {
  name: "person",
  foo2: () => console.log(this.name);
  foo4: function() {
    return () => {
      console.log(this.name)
    }
  }
}

var person2 = {name: 'person2'}

person1.foo2()//window
person1.foo2.call(person2)//window

person1.foo4()()//person1
person1.foo4.call(person2)()//person2
person1.foo4().call(person2)//person1
```

```js
var name = "window"
function Person(name) {
  this.name = name
  this.foo2 = () => console.log(this.name)
  this.foo4 = function() {
    return () => {
      console.log(this.name)
    }
  }
}
var person1 = new Person('person1')
var person2 = new Person('person2')

person1.foo2()//person1
person1.foo2.call(person2)//person1

person1.foo4()()//person1
person1.foo4.call(person2)()//person2
person1.foo4().call(person2)//person1
```

