## JavaScript柯里化

只传递给函数一部分参数来调用它，让它返回一个函数去处理剩余的参数。这个过程就称之为柯里化

核心思想是把多参数传入的函数拆成单参数（或部分）函数，内部再返回调用下一个单参数（或部分）函数，依次处理剩余的参数。



举例：

```js
function  add1(x, y, z) {
  return x + y +z;
}
console.log(add1(10,20,30));

//柯里化处理函数
function add2(x) {
  return function(y) {
    return function(z) {
      return x+y+z;
    }
  }
}

console.log(add2(10)(20)(30));

var add3 = x => y => z => {
  return x + y + z
}
console.log(add3(10)(20)(30))
```



### 为什么需要有柯里化呢？
- 在函数式编程中，我们其实往往希望一个函数处理的问题尽可能的单一，而不是将一大堆的处理过程交给一个函数来处理；
- 那么我们是否就可以将每次传入的参数在单一的函数中进行处理，处理完后在下一个函数中再使用处理后的结果；
- 另外一个使用柯里化的场景是可以帮助我们可以复用参数逻辑：
  makeAdder函数要求我们传入一个num（并且如果我们需要的话，可以在这里对num进行一些修改）；
  在之后使用返回的函数时，我们不需要再继续传入num了；

```js
function makeAdder(num) {
  return function(count) {
    return num + count
  }
}

var add5 = makeAdder(5)
console.log(add5(10));

var add10 = makeAdder(10)
console.log(add10(10))
```



### 实现函数柯里化

```js
function currying(fn, ...args) {
  const length = fn.length;
  let allArgs = [...args];
  const res = (...newArgs) => {
    allArgs = [...allArgs, ...newArgs];
    if (allArgs.length === length) {
      return fn(...allArgs);
    } else {
      return res;
    }
  };
  return res;
}

// 用法如下：
// const add = (a, b, c) => a + b + c;
// const a = currying(add, 1);
// console.log(a(2,3))

```

