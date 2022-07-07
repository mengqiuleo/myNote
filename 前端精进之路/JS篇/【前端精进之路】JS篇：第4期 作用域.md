[TOC]



## 写在前面

这里是小飞侠Pan🥳，立志成为一名优秀的前端程序媛！！！

本篇文章收录于我的专栏：[前端精进之路](https://blog.csdn.net/weixin_52834435/category_11886356.html?spm=1001.2014.3001.5482)

同时收录于我的[github](https://github.com/mengqiuleo)前端笔记仓库中，持续更新中，欢迎star~

👉[https://github.com/mengqiuleo/myNote](https://github.com/mengqiuleo/myNote)

<hr/>

## 作用域(Scope)

### 1.什么是作用域

> 作用域其实就是一个变量绑定的有效范围。就是说在这个作用域中，这个**变量绑定**是有效的，出了这个作用域**变量绑定**就无效了。

**作用域就是一个独立的地盘，让变量不会外泄、暴露出去**。也就是说**作用域最大的用处就是隔离变量，不同作用域下同名变量不会有冲突。**

**ES6 之前 JavaScript 没有块级作用域,只有全局作用域和函数作用域**。ES6的到来，为我们提供了‘块级作用域’,可通过新增命令let和const来体现。



### 2.全局作用域和函数作用域

- 最外层函数 和在最外层函数外面定义的变量拥有全局作用域

- 所有末定义直接赋值的变量自动声明为拥有全局作用域

- 所有window对象的属性拥有全局作用域

一般情况下，window对象的内置属性都拥有全局作用域，例如window.name、window.location、window.top等等。

全局作用域有个弊端：如果我们写了很多行 JS 代码，变量定义都没有用函数包括，那么它们就全部都在全局作用域中。这样就会 污染全局命名空间, 容易引起命名冲突。



函数作用域,是指声明在函数内部的变量，和全局作用域相反，局部作用域一般只在固定的代码片段内可访问到，最常见的例如函数内部。



### 3.块级作用域

块级作用域可通过新增命令let和const声明，所声明的变量在指定块的作用域外无法被访问。块级作用域在如下情况被创建：

1. 在一个函数内部
2. 在一个代码块（由一对花括号包裹）内部

**let/const 声明并不会被提升到当前代码块的顶部**

使用块级作用域可以很好地解决 for循环用var声明变量的问题





## 作用域链

> 作用域链和原型继承有点类似，但又有点小区别：如果去查找一个普通对象的属性时，在当前对象和其原型中都找不到时，会返回undefined；但查找的属性在作用域链中不存在的话就会抛出ReferenceError。

首先认识一下什么叫做 **自由变量** 。如下代码中，`console.log(a)`要得到a变量，但是在当前的作用域中没有定义a（可对比一下b）。当前作用域没有定义的变量，这成为 自由变量 。自由变量的值如何得到 —— 向父级作用域寻找。如果父级也没呢？再一层一层向上寻找，直到找到全局作用域还是没找到，就宣布放弃。这种一层一层的关系，就是 作用域链 。

```js
var a = 100
function fn() {
    var b = 200
    console.log(a) // 这里的a在这里就是一个自由变量
    console.log(b)
}
fn()
```



## 作用域链的创建

函数的作用域在函数定义的时候就决定了。

这是因为函数有一个内部属性 [[scope]]，**当函数创建的时候，就会保存所有父变量对象到其中，可以理解为 [[scope]] 就是所有父变量对象的层级链，但是注意：[[scope]] 并不代表完整的作用域链！**

举个例子：

```
function foo() {
    function bar() {
        ...
    }
}
```

函数创建时，各自的[[scope]]为：

```
foo.[[scope]] = [
  globalContext.VO
];

bar.[[scope]] = [
    fooContext.AO,
    globalContext.VO
];
```



## 作用域与执行上下文

作用域是在声明时就已经确定了，但是执行上下文是在运行的时候才能确定的。比如函数声明时其中this的指向是不确定的，由它最终的调用时环境确定。

执行上下文是函数执行之前创建的。执行上下文最明显的就是this的指向是执行时确定的。而作用域访问的变量是编写代码的结构确定的。

> 作用域和执行上下文之间最大的区别是： **执行上下文在运行时确定，随时可能改变；作用域在定义时就确定，并且不会改变**。

**总结：**

在js代码执行时，首先会创建执行上下文，然后遇到变量，函数，进行声明，此时会进行作用域的创建。然后当函数被调用时（此时就是在运行时），执行上下文才被确定（此时包括this指向被确定）。



## 静态作用域与动态作用域

**JavaScript 采用词法作用域(lexical scoping)，也就是静态作用域。**

JavaScript 采用的是词法作用域(静态作用域)，函数的作用域在函数定义的时候就决定了。

而与词法作用域相对的是动态作用域，函数的作用域是在函数调用的时候才决定的。

**一个demo**

```js
var value = 1;

function foo() {
    console.log(value);
}

function bar() {
    var value = 2;
    foo();
}

bar();
```

假设采用静态作用域，执行代码，声明了一个变量value，声明了两个函数foo和bar，然后执行函数bar。bar里面声明了一个变量value，然后执行foo函数，foo函数里面要求打印value，因为采用静态作用域，当前作用域中没有value，所以向上层作用域查找，查找到上层作用域为全局作用域，全局作用域中的value为1，最终打印结果1。

采用动态作用域，执行 foo 函数，依然是从 foo 函数内部查找是否有局部变量 value。如果没有，就从调用函数的作用域，也就是 bar 函数内部查找 value 变量，所以结果会打印 2。



## 总结

> Like most modern programming languages, JavaScript uses lexical scoping. This means that functions are executed using the variable scope that was in effect when they were defined, not the variable scope that is in effect when they are invoked. In order to implement lexical scoping, the internal state of a JavaScript function object must in- clude not only the code of the function but also a reference to the current scope chain. (Before reading the rest of this section, you may want to review the material on variable scope and the scope chain in §3.10 and §3.10.3.) This combination of a function object and a scope (a set of variable bindings) in which the function’s variables are resolved is called a closure in the computer science literature. (This is an old term that refers to the fact that the function’s variables have bindings in the scope chain and that therefore the function is “closed over” its variables.)
>
> Technically, all JavaScript functions are closures: they are objects, and they have a scope chain associated with them. Most functions are invoked using the same scope chain that was in effect when the function was defined, and it doesn’t really matter that there is a closure involved. Closures become interesting when they are invoked under a different scope chain than the one that was in effect when they were defined. This happens most commonly when a nested function object is returned from the function within which it was defined. There are a number of powerful programming techniques that involve this kind of nested function closures, and their use has become relatively common in JavaScript programming. Closures may seem confusing when you first en- counter them, but it is important that you understand them well enough to use them comfortably.
>
> *JavaScript, The Definite Guide*

翻译成中文的话也许是这样：

和大多数的现代化编程语言一样，`JavaScript`是采用词法作用域的，这就意味着函数的执行依赖于函数定义的时候所产生（而不是函数调用的时候产生的）的变量作用域。为了去实现这种词法作用域，`JavaScript`函数对象的内部状态不仅包含函数逻辑的代码，除此之外还包含当前作用域链的引用。函数对象可以通过这个作用域链相互关联起来，如此，函数体内部的变量都可以保存在函数的作用域内，这在计算机的文献中被称之为闭包。

从技术的角度去将，所有的`JavaScript`函数都是闭包：他们都是对象，他们都有一个关联到他们的作用域链。绝大多数函数在调用的时候使用的作用域链和他们在定义的时候的作用域链是相同的，但是这并不影响闭包。当调用函数的时候闭包所指向的作用域链和定义函数时的作用域链不是同一个作用域链的时候，闭包become interesting。这种interesting的事情往往发生在这样的情况下： 当一个函数嵌套了另外的一个函数，外部的函数将内部嵌套的这个函数作为对象返回。一大批强大的编程技术都利用了这类嵌套的函数闭包，当然，`javascript`也是这样。可能你第一次碰见闭包觉得比较难以理解，但是去明白闭包然后去非常自如的使用它是非常重要的。



**用童话故事解释闭包**

建议看一下，很有意思👍🏻。

> **Once upon a time:**
>
> There was a princess...
>
> ```js
> function princess() {
> ```
>
> She lived in a wonderful world full of adventures. She met her Prince Charming, rode around her world on a unicorn, battled dragons, encountered talking animals, and many other fantastical things.
>
> ```js
>     var adventures = [];
> 
>     function princeCharming() { /* ... */ }
> 
>     var unicorn = { /* ... */ },
>         dragons = [ /* ... */ ],
>         squirrel = "Hello!";
> 
>     /* ... */
> ```
>
> But she would always have to return back to her dull world of chores and grown-ups.
>
> ```js
>     return {
> ```
>
> And she would often tell them of her latest amazing adventure as a princess.
>
> ```js
>         story: function() {
>             return adventures[adventures.length - 1];
>         }
>     };
> }
> ```
>
> But all they would see is a little girl...
>
> ```js
> var littleGirl = princess();
> ```
>
> ...telling stories about magic and fantasy.
>
> ```js
> littleGirl.story();
> ```
>
> And even though the grown-ups knew of real princesses, they would never believe in the unicorns or dragons because they could never see them. The grown-ups said that they only existed inside the little girl's imagination.
>
> But we know the real truth; that the little girl with the princess inside...
>
> ...is really a princess with a little girl inside.
>
> 
>
> [原文链接](https://stackoverflow.com/questions/111102/how-do-javascript-closures-work/6472397#6472397)



**参考文章**

[深入理解JavaScript作用域和作用域链](https://juejin.cn/post/6844903797135769614#heading-1)

[JavaScript之闭包相关](https://github.com/rccoder/blog/issues/3)

[JavaScript深入之作用域链](https://github.com/mqyqingfeng/Blog/issues/6)