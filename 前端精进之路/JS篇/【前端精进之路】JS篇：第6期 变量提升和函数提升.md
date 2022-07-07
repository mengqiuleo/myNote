[TOC]



## 写在前面

这里是小飞侠Pan🥳，立志成为一名优秀的前端程序媛！！！

本篇文章收录于我的专栏：[前端精进之路](https://blog.csdn.net/weixin_52834435/category_11886356.html?spm=1001.2014.3001.5482)

同时收录于我的[github](https://github.com/mengqiuleo)前端笔记仓库中，持续更新中，欢迎star~

👉[https://github.com/mengqiuleo/myNote](https://github.com/mengqiuleo/myNote)

<hr/>

> **变量提升和函数提升发生在什么时候？**
>
> 上篇文章中我们介绍了JavaScript代码的执行过程，**在预编译阶段**，首先会创建执行上下文，此时对变量和函数进行声明，对var声明的变量赋值为undefined。此时会发生变量提升和函数提升。

## 变量提升

变量提升是将变量的声明提升到函数顶部的位置，而变量的赋值并不会被提升。需要注意的一点是，会产生提升的变量必须是通过var关键字定义的，而不通过var关键字定义的全局变量是不会产生变量提升的。



## 函数提升

使用函数声明方式定义的函数会出现提升，如下面一段代码所示。

```js
foo(); // 函数提升
function foo(){
  console.log('foo函数');
}
```

在上面的代码中，foo()函数的声明在调用之后，但是却可以调用成功，因为foo()函数被提升至作用域顶部，相当于如下所示代码。

```js
function foo(){
  console.log('foo函数');
}
foo(); 
```

**需要注意的是函数提升会将整个函数体一起进行提升，包括里面的执行逻辑。**

**而对于函数表达式，是不会进行函数提升的。**

```js
foo(); // TypeError: foo is not a function
var foo = function foo(){
  console.log('foo函数');
}
```

二者同时使用

```js
show();//hello
var show;
//函数声明，会被提升
function show(){
  console.log('hello');
}

//函数表达式，不会被提升
show = function(){
  console.log('hello world');
}
```



## 变量提升与函数提升的应用

### 1. 关于函数提升

```js
function foo(){
  function bar(){
    return 3;
  }

  return bar();

  function bar(){
    return 8;
  }
}
console.log(foo());//8
```

代码中使用函数声明定义了两个相同的bar()函数。由于变量提升的存在，两段代码都会被提升至foo()函数的顶部，而且后一个函数会覆盖前一个bar()函数，因此最后输出值为“8”。



### 2. 变量提升和函数提升同时使用

```js
var a = true;
foo();

function foo(){
  if(a){
    var a = 10;
  }
  console.log(a);//undefined
}
```

在foo()函数内部，首先判断变量a的值，由于变量a在函数内部重新通过var关键字声明了一次，因此a会出现变量提升，a会提升至foo()函数的顶部，此时a的值为undefined。那么通过if语句进行判断时，返回“false”，并未执行a = 10的赋值语句，因此最后输出“undefined”。

```js
var a;
a = true;
function foo(){
  var a;
  if(a) {
    a = 10;
  }
  console.log(a);//undefined
}
foo();
```



### 3. 变量提升和函数提升优先级⭐

```js
function fn(){
  console.log(typeof foo);//function
  //变量提升
  var foo = 'variable';

  //函数提升
  function foo(){
    return 'function';
  }

  console.log(typeof foo);//string
}

fn();
```

在上面的代码中，同时存在变量提升和函数提升，但是**变量提升的优先级要比函数提升的优先级高**，因此实际执行过程可以改写为以下代码段。

改写后的代码：

```js
function fn(){
  //变量提升至函数首部
  var foo;

  //函数提升，但是优先级低，出现在变量声明后面，则foo是一个函数
  function foo(){
    return 'function';
  }
  console.log(typeof foo);//function

  foo = 'variable';
  console.log(typeof foo);//string
}

fn();
```



**第二个🌰**

```js
foo();  // foo2
var foo = function() {
    console.log('foo1');
}

foo();  // foo1，foo重新赋值

function foo() {
    console.log('foo2');
}

foo(); // foo1
```

实际执行过程可以改写为以下代码段。

```js
var foo;//变量提升
function foo() { //函数提升：同名，函数覆盖变量
  console.log('foo2');
}
foo();  // foo2
foo = function() {
    console.log('foo1');
}

foo();  // foo1

foo(); // foo1
```



**注意：**

**上面说的变量提升的优先级要比函数提升的优先级高，指的是：同时出现变量提升和函数提升，会先进行变量提升然后进行函数提升。**

**在其他文章中可能也会出现`函数声明优先级高于变量声明`的说法，而它这里指的是对于同名的变量和函数，函数会覆盖变量。**

如果我们声明了同名的变量和函数，不管谁前谁后，最后都会是函数。

```js
// 同时声明同名函数和变量，下面的代码虽然是先声明的函数，按理说应该后面的变量覆盖函数，输出undefined
// 但是，变量提升的优先级要比函数提升的优先级高，var x 会被提升到最上面，然后才是函数声明，所以最后输出function
function x() {}
var x;
console.log(typeof x);  // function
```



### 4. 变量提升和函数提升整体应用

```js
function foo(){
  var a = 1;
  function b(){
    a = 10;
    return;
    function a(){}
  }
  b();
  console.log(a);//1
}
foo();
```

代码中首先定义了一个变量a并赋值为1，然后声明了一个b()函数，并在后面直接进行调用，最后输出变量a的值。

在b()函数中，在return语句之后出现了一个变量a的函数声明，则会进行提升，执行return语句后，变量a的值仍然为1，整体执行过程可以改写为以下代码段。

```js
function foo(){
  //变量a的提升
  var a;
  //函数声明b的提升
  function b(){
    //内部函数声明a的提升
    function a(){}
    a = 10;
    return;
  }
  a = 1;
  b();
  console.log(a);//1
}
foo();
```

**详细解释：**

在foo函数中，执行函数b，在b()函数内部，声明了一个函数a，然后又对a赋值10，**此时这里的a相当于函数b内部的自己的变量，外部无法访问。**所以输出a的值为1.

我们可以将代码继续改写成以下形式：

```js
function foo(){
  //变量a的提升
  var a;
  //函数声明b的提升
  function b(){
    function n(){}
    n = 10;
    console.log(n);//10
  }
  a = 1;
  b();
  console.log(a);//1
}
foo();
```

并且，其实在函数b中，声明了同名的函数和变量，对于`n = 10`，这里并不是声明了一个全局变量，我们可以尝试在最后打印一下`window.n`，结果为undefined。

对于这里的同名函数和变量，我们可以理解为：首先声明了一个变量n，n执行的是一个地址值（这个地址里存放的是一个函数），然后又对n赋值10，相当于n的指针又指向了基本数据类型。所以这里的n是函数b内部自己的变量，外部无法访问。

所以，我们又可以将代码进行改写：

```js
function foo(){
  //变量a的提升
  var a;
  //函数声明b的提升
  function b(){
    // function n(){}
    var n = function(){}
    n = 10;
    console.log(n);//10
  }
  a = 1;
  b();
  console.log(a);//1
}
foo();

console.log(window.n);//undefined
```

