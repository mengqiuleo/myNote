function myNew(fn, ...args){
  let obj = Object.create(fn.prototype)
  let res = fn.call(obj, ...args)
  if(res && (typeof res === 'object' && res !== null)){
    return res
  }
  return obj
}