function myInstanceOf(left, right){
  if(typeof left !== 'object' || left === null){
    return false;
  }
  let proto = Object.getPrototypeOf(left);
  while(true){
    if(proto === null){
      return false;
    }
    if(proto === right.prototype){
      return true;
    }
    proto = Object.getPrototypeOf(proto);
  }
}

//test
let obj = {}
console.log(myInstanceOf(123, Number)); //false
console.log(myInstanceOf(new Number(123), Number)); //true
console.log(myInstanceOf(obj, Object)); //true