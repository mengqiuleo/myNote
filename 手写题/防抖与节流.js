/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-06 20:06:27
 * @LastEditTime: 2022-11-06 20:17:47
 */
function debounce(fn,wait){
  let timer = null

  return function(){
    let context = this, args = arguments

    // 如果此时存在定时器的话，则取消之前的定时器重新记时
    if(timer){
      clearTimeout(timer)
      timer = null
    }

    // 设置定时器，使事件间隔指定事件后执行
    timer = setTimeout(() => {
      fn.apply(context, args) // 改变this指向为调用debounce所指的对象
    }, wait);
  }
}

//节流
//连续点击的话，第一下点击会立即执行一次 然后每过 wait 秒执行一次
function throttle(fn,wait){
  let date = Date.now()
  return function(){
    let now = Date.now()
    // 用当前时间 减去 上一次点击的时间 和 传进来的时间作对比
    if(now - date > wait){
      fn.call(this, arguments)
      date = Date.now()
    }
  }
}
