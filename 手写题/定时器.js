/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-07 21:35:53
 * @LastEditTime: 2022-11-07 21:53:02
 */
function mySettimeout(fn, t) {
  let timer = null;
  function interval() {
    fn();
    timer = setTimeout(interval, t);
  }
  setTimeout(interval, t);
  // interval()
  return {
    cancel:()=>{
      clearTimeout(timer)
    }
  }
}

function mySetInterval(fn, timeout) {
  // 控制器，控制定时器是否继续执行
  var timer = {
    flag: true
  };
  // 设置递归函数，模拟定时器执行。
  function interval() {
    if (timer.flag) {
      fn();
      setTimeout(interval, timeout);
    }
  }
  // 启动定时器
  setTimeout(interval, timeout);
  // 返回控制器
  return timer;
}

// var flag = false;
let b=mySetInterval(() => {
  console.log(222);
  flag = true;
}, 1000)
b.flag = false

// var count = 0;
// let a=mySettimeout(()=>{
//   console.log(111);
//   count++;
// },1000)
// a.cancel()