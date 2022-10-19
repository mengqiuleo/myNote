/*
 * @Author: Pan Jingyi
 * @Date: 2022-10-19 16:34:17
 * @LastEditTime: 2022-10-19 16:38:07
 */
function isPromise(val){
  return val && (typeof val.then == 'function')
}

Promise.all = function(promises){
  return new Promise((resolve, reject) => {
    let result = []
    let times = 0
    function processData(index, val){
      result[index] = val
      if(++times === promises.length){
        resolve(result)
      }
    }
    for(let i=0; i<promises.length; i++){
      let p = promises[i]
      if(isPromise(p)){
        p.then((data) => {
          processData(i, data)
        },reject) //这个reject是用的外层的promise
      }else{
        processData(i,p) //普通值
      }
    }
  })
}