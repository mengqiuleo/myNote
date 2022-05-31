## JS中的异常error处理

#### 1.错误的类型

* Error：所有错误的父类型

* ReferenceError：引用的变量不存在

```js
console.log(a) // ReferenceError:a is not defined
```



* TypeError：数据类型不正确

```js
let b
console.log(b.xxx)
// TypeError:Cannot read property 'xxx' of undefined

let c = {}
c.xxx()
// TypeError:c.xxx is not a function
```



* RangeError：数据值不在其所允许的范围内

```js
function fn() {
  fn()
}
fn()
// RangeError:Maximum call stack size exceeded
```



* SyntaxError：语法错误

```js
const c = """"
// SyntaxError:Unexpected string
```



#### 2.错误处理（捕获与抛出）
* 抛出错误：throw error

JavaScript已经给我们提供了一个Error类，我们可以直接创建这个类的对象：

Error包含三个属性：

- messsage：创建Error对象时传入的message；
- name：Error的名称，通常和类的名称一致；
- stack：整个Error的错误信息，包括函数的调用栈，当我们直接打印Error对象时，打印的就是stack；



```js
function something() {
  if (Date.now()%2===1) {
    console.log('当前时间为奇数，可以执行任务')
  } else { //如果时间为偶数抛出异常，由调用来处理
    throw new Error('当前时间为偶数，无法执行任务')
  }
}
```

* 捕获错误：try ... catch

```js
// 捕获处理异常
try {
  something()
} catch (error) {
  alert(error.message)
}
```



#### 3.错误对象

* massage 属性：错误相关信息

* stack 属性：函数调用栈记录信息

  ```js
  try {
    let d
    console.log(d.xxx)
  } catch (error) {
    console.log(error.message)
    console.log(error.stack)
  }
  console.log('出错之后')
  // Cannot read property 'xxx' of undefined
  // TypeError:Cannot read property 'xxx' of undefined
  // 出错之后
  ```

​		因为错误被捕获处理了，后面的代码才能运行下去，打印出‘出错之后’



#### 4.try...catch

**一个函数抛出了异常，调用它的时候程序会被强制终止**，

- 这是因为如果我们在调用一个函数时，这个函数抛出了异常，但是我们并没有对这个异常进行处理，那么这个异常会继续传递到上一个函数调用中；
- 而如果到了最顶层（全局）的代码中依然没有对这个异常的处理代码，这个时候就会报错并且终止程序的运行；

 但是很多情况下当出现异常时，我们并不希望程序直接推出，而是希望可以正确的处理异常：可以使用try catch。

`try ... catch `解释

```js
   try{
        console.log(b);
        console.log("不会输出的")
 
    }catch(error){
        console.log("发生错误了")
    }
    console.log("我try catch后面的代码")

```

说明：

1. 把有可能出的问题的代码放在 try 语句中。try语句中可以理论上可以写任何的代码，只要有一行代码出现问题，整个程序的执行流程就会立即调到catch语句中执行。
2. 一旦try中有一行代码发生异常，则这行出错代码的后面的try中的其他语句都不会再执行。比如上面代码中的`console.log(b);`这行代码会出错，则立即去执行catch中的代码。所以`console.log("不会输出的")`这行代码则不会再执行
3. 在执行catch中的代码之前，js引擎会首先根据错误类型自动创建一个错误，并通过catch后面的参数传递到catch中。不同的浏览器创建的error对象不一样，但是同创他们都包含一个message属性，值是这个错误的一些信息。
4. catch中的代码执行完毕之后，会继续执行后面的代码，程序不会停止下来。



#### 5.finally语句

```js
 	try{
        console.log(b);
        console.log("不会输出的")
 
   	}catch(error){
        console.log("发生错误了")
    }finally {
        console.log("必须执行的代码")
    }
    console.log("我try catch后面的代码")

```

**在 finally 中我们可以放置我们必须要执行的代码。**

注意：

1. 在js中，如果添加了 finally 语句，则 catch 语句可以省略。所以下面的代码也是正确的。
2. 如果没有 catch 语句，则一旦发生错误就无法捕获这个错误，所以在执行完 finally 中的语句后，程序就会立即停止了。
3. 所以，在实际使用中，最好一直带着 catch 语句。
4. finally表示最终一定会被执行的代码结构；
   注意：**如果try和finally中都有返回值，那么会使用finally当中的返回值；**

```js

    try{
        console.log(b);
        console.log("我不会输出的，不要找了")
 
    }finally {
        console.log("不管发生不发生错误，我都会执行")
    }
    console.log("我try catch后面的代码")

```

