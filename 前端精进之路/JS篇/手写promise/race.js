/*
 * @Author: Pan Jingyi
 * @Date: 2022-10-19 16:42:24
 * @LastEditTime: 2022-10-19 16:44:05
 */
Promise.race = function(promises){
  return new Promise((resolve, reject) => {
    for(let i=0;i<promises.length; i++){
      let currentVal = promises[i]
      if(currentVal && typeof currentVal.then == 'function'){
        currentVal.then(resolve, reject)
      } else {
        resolve(currentVal)
      }
    }
  })
}