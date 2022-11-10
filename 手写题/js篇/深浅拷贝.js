/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-06 20:29:57
 * @LastEditTime: 2022-11-06 20:32:02
 */
//浅拷贝
function shallowClone(target){
  if(typeof target === 'object' && typeof target !== 'null'){
    const cloneTarget = Array.isArray(target) ? [] : {}

    for(let prop in target){
      if(target.hasOwnProperty(prop)){
        cloneTarget[prop] = target[prop]
      }
    }
    return cloneTarget
  }else{
    return target
  }
}