/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-06 13:42:55
 * @LastEditTime: 2022-11-06 13:48:34
 */
Function.prototype.myBind = function(context,...argArray){
  let fn = this;

  context = (context===undefined||context===null) ? window : Object(context);

  function proxyFn(...args){
    context.fn = fn;
    let finalArgs = [...argArray, ...args];
    let result = context.fn(...finalArgs);

    delete context.fn;

    return result;
  }
  return proxyFn;
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
let object = bar.myBind(obj, 'zs',18);
object();