/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-06 14:11:58
 * @LastEditTime: 2022-11-27 21:22:32
 */
function currying(fn, ...args){
  const length = fn.length;

  let allArgs = [...args];

  return function proxyFn(...newArgs){
    allArgs = [...allArgs, ...newArgs]
    if(allArgs.length === length){
      return fn.apply(this, allArgs)
    }else {
      return proxyFn
    }
  }
}

//test
const add = (a,b,c) => a+b+c;

const a = currying(add,1);
console.log(a(2,3));