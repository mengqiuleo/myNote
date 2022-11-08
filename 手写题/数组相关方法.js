/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-07 15:11:25
 * @LastEditTime: 2022-11-07 15:13:25
 */
const arr = [1,[2,3,[4,5]]]

//flat
Array.prototype.flat = function(deep = 1){
  let res = []
  deep--;
  for(let p of this){
    if(Array.isArray(p) && deep>=0){
      res = res.concat(p.flat(deep))
    }else{
      res.push(p)
    }
  }
  return res
}