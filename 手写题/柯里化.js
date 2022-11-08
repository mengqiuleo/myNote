/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-06 14:11:58
 * @LastEditTime: 2022-11-06 14:14:32
 */
function currying(fn, ...args){
  const length = fn.length;

  let allArgs = [...args];

  const res = (...newArgs) => {
    allArgs = [...allArgs, ...newArgs];

    if(allArgs.length === length){
      return fn(...allArgs);
    }else{
      return res;
    }
  } 
  return res;
}

//test
const add = (a,b,c) => a+b+c;

const a = currying(add,1);
console.log(a(2,3));