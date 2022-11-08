/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-06 19:43:40
 * @LastEditTime: 2022-11-06 19:48:56
 */
const array = [1,2,3,5,4,1,2,3]

//set去重
Array.from(new Set(array))

//hasOwnProperty
function uniqueArray(array){
  let map = {} //空对象 let obj =｛｝利用对象属性不能重复的特性
  let res = []
  for(let i=0;i<array.length;i++){
    if(!map.hasOwnProperty(array[i])){
      map[array[i]] = 1
      res.push(array[i])
    }
  }
  return res
}

//map去重
let unique = arr => {
  let map = new Map()
  let res = []
  arr.forEach(item => {
    if(!map.has(item)){
      map.set(item,true)
      arr.push(item)
    }
  }) 
  return arr
}