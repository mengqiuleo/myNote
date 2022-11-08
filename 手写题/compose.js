/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-06 14:05:38
 * @LastEditTime: 2022-11-06 14:08:25
 */
function compose(...fns){
  if(!fns.length) return (arg) => arg
  if(fns.length === 1) return fns[0]
  return arg => fns.reduceRight((prev, fn) => {
    return fn(prev)
  },arg)
}

//test
function fn1(x){
  return x+1;
}
function fn2(x){
  return x+2;
}
function fn3(x){
  return x+3;
}
function fn4(x){
  return x+4;
}
const a = compose(fn1, fn2, fn3, fn4)
console.log(a(1)) //11