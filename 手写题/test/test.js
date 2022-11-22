// apply原理一致  只是第二个参数是传入的数组
Function.prototype.myApply = function (context, args) {
  if (!context || context === null) {
    context = window;
  }
  // 创造唯一的key值  作为我们构造的context内部方法名
  let fn = Symbol();
  context[fn] = this;
  // 执行函数并返回结果
  return context[fn](...args);
};

//test
let obj = { value: 1 }
function bar(name,age){
  console.log(this.value);
  return {
    value: this.value,
    name: name,
    age: age
  }
}
let object = bar.myApply(obj,['zs',18])
console.log(object)