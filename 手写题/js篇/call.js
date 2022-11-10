/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-06 13:32:04
 * @LastEditTime: 2022-11-06 13:35:17
 */
Function.prototype.myCall = function(context, ...args){
  if(!context || context==null){
    context = window;
  }
  let fn = Symbol();
  context[fn] = this;
  return context[fn](...args);
}

//test
let obj = { value: 1 }
function bar(name, age){
  console.log(this.value);
  return {
    value: this.value,
    name: name,
    age: age
  }
}
bar.myCall(obj, 'zs',18);