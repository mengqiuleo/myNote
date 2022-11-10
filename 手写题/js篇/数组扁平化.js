/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-06 20:00:22
 * @LastEditTime: 2022-11-06 20:05:00
 */
//递归实现
function flatten(arr){
  let res = []
  for(let i=0;i<arr.length;i++){
    if(Array.isArray(arr[i])){
      res = res.concat(flatten(arr[i]))
    }else{
      res.push(arr[i])
    }
  }
  return res;
}

//迭代实现
function flatten1(arr){
  return arr.reduce((prev,next) => {
    return prev.concat(Array.isArray(next) ? flatten1(next) : next)
  }, [])
}

//扩展运算符实现
function flatten2(arr){
  while(arr.some(item => Array.isArray(item))){
    arr = [].concat(...arr)
  }
  return arr
}