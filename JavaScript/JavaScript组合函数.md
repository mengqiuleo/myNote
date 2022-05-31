## JavaScript组合函数

组合（Compose）函数是在JavaScript开发过程中一种对函数的使用技巧、模式：

- 比如我们现在需要对某一个数据进行函数的调用，执行两个函数fn1和fn2，这两个函数是依次执行的；
- 那么如果每次我们都需要进行两个函数的调用，操作上就会显得重复；
- 那么是否可以将这两个函数组合起来，自动依次调用呢？
- 这个过程就是对函数的组合，我们称之为组合函数（Compose Function）；



举例：

```js
function double(num) {
  return num*2
}

function square(num) {
  return num**2
}

function compose(fn1, fn2) {
  return function(x) {
    return fn2(fn1(x))
  }
}
var calcFn = compose(double, square)
console.log(calcFn(20));
```



**compose函数的实现**

```js
function compose(...fns){
    //遍历所有的原生如果不是函数，那么直接报错
    var length = fns.length;
    for(var i = 0 ;i < length; i++){
        var fn = fns[i];
        if(typeof fn !== 'function'){
            throw new TypeError('Expected a function');
        }
    }

    //取出所有的函数一次调用，最终返回一个函数
    return function(...args){
        //先获取到第一次执行的结果
        var index = 0;
        var result = length ? fns[index].apply(this,args): args;
        while(++index<length){
            result = fns[index].call(this,result);
        }
        return result;
    }
    return compose;
}

```



版本二：

```js
function compose(...fn) {
  if (!fn.length) return (v) => v;
  if (fn.length === 1) return fn[0];
  return fn.reduce(
    (pre, cur) =>
      (...args) =>
        pre(cur(...args))
  );
}
```

