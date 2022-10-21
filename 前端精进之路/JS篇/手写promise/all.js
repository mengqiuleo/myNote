/*
 * @Author: Pan Jingyi
 * @Date: 2022-10-19 16:34:17
 * @LastEditTime: 2022-10-21 19:45:31
 */
function isPromise(val){
  return val && (typeof val.then == 'function')
}

Promise.all = function(promises){
  return new Promise((resolve, reject) => {
    let result = [] //结果数组
    let times = 0 //解决多个异步并发问题 要使用计数器
    function processData(index, val){
      result[index] = val //下标要与结果对应
      if(++times === promises.length){ //只有成功的时候才会times++，如果此时全部成功
        resolve(result) //那就调用要返回的新promise的resolve
      }
    }
    for(let i=0; i<promises.length; i++){
      let p = promises[i]
      if(isPromise(p)){ 
        p.then((data) => { //如果当前promise成功，我们需要将该promise的值放入结果数组
          processData(i, data)
        },reject) //这个reject是用的外层的promise：如果失败全部失败
      }else{
        processData(i,p) //普通值
      }
    }
  })
}