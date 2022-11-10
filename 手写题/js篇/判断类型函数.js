/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-10 22:41:08
 * @LastEditTime: 2022-11-10 22:49:49
 */
const myType = (value) => {
  if (value === null) {
    return value + ''
  }
  if (typeof value === 'object') {
    let arr = Object.prototype.toString.call(value) // [object Array]
    // console.log('arr: ', arr)
    let mid = arr.slice(8, -1)
    // console.log('引用类型mid：', mid)
    return mid.toLowerCase()
  } else {
    return typeof value
  }
}


console.log(myType(null)); // null
console.log(myType(1)); // number
console.log(myType('1')); // string
console.log(myType(true)); // boolean
console.log(myType(undefined)); // undefined
console.log(myType(function f() { })); // function
console.log(myType([1, 2, 3])); // array
console.log(myType(Symbol(1))); // symbol
console.log(myType({ name: 'tom' })); // object
