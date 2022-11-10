/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-06 19:53:19
 * @LastEditTime: 2022-11-06 19:54:36
 */
let arr=[1,2,3,4,5,6,7,8,9,10]

let sum = arr.reduce((total,i) => total+i, 0)

//递归实现
function add(arr){
  if(arr.length === 1) return arr[0]
  return arr[0] + add(arr.slice(1))
}


