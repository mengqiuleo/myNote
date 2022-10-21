/*
 * @Author: Pan Jingyi
 * @Date: 2022-10-19 16:42:24
 * @LastEditTime: 2022-10-21 20:12:42
 */
Promise.race = function(promises){
  return new Promise((resolve, reject) => {
    for(let i=0;i<promises.length; i++){
      let currentVal = promises[i]
      if(currentVal && typeof currentVal.then == 'function'){
        currentVal.then(resolve, reject) //所有的同时执行，如果当前成功或失败就立即通知调用外层promise的resolve/reject
      } else {
        resolve(currentVal) //普通值
      }
    }
  })
}