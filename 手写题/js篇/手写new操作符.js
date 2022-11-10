/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-06 13:07:34
 * @LastEditTime: 2022-11-06 13:10:28
 */
function myNew(fn,...args){
  let obj = Object.create(fn.prototype);
  let res = fn.call(obj,...args);
  if(res && (typeof res === 'object' || typeof res === 'function')){
    return res;
  }
  return obj;
}

//test
function Person(name,age){
  this.name = name;
  this.age = age;
}
Person.prototype.say = function(){
  console.log(this.age)
}

let p1 = myNew(Person, 'zs', 18);
console.log(p1);
console.log(p1.age);