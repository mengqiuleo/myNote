/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-08 19:22:11
 * @LastEditTime: 2022-11-08 19:50:50
 */
/**
 * Hi I am Tony
 * 等待了5秒
 * I am eating lunch
 * I am eating dinner
 * 等待了3秒
 * I am eating hunk food
 */

class LazyManClass {
  constructor(name){
    console.log(`Hi I am ${name}`)
    this.taskList = []
    /**
     * 这里的定时器什么用？
     * 调用LazyMan的时候，先链式将所有方法放入任务队列，然后再异步取出每一个任务执行，使用next实现链式调用
     * 在这里调用定时器也算首次开启链式调用了
     */
    setTimeout(() => {
      this.next()
    }, 0);
  }
  eat(name){
    const that = this
    const fn = function(){
        console.log(`I am eating ${name}`)
        that.next() //实现调用下一次的方法
      }
    this.taskList.push(fn)
    return this; //返回this用来支持链式调用：this就是当前类，该类身上有方法
  }
  sleep(time){
    const that = this
    const fn = function(){
        setTimeout(() => {
          console.log(`等待了${time}秒...`)
          that.next() //实现调用下一次的方法
        }, time * 1000);
      }
    
    this.taskList.push(fn)
    return this
  }
  sleepFirst(time){
    const that = this
    const fn =  function(){
            setTimeout(() => {
              console.log(`等待了${time}秒...`)
              that.next() //实现调用下一次的方法
            }, time * 1000);
          }
    this.taskList.unshift(fn)//首先执行
    return this
  }
  //将所有方法链式调用起来
  next(){
    const fn = this.taskList.shift()
    fn && fn()
  }
}

function LazyMan(name){
  return new LazyManClass(name)
}

//test
LazyMan('Tony')
  .eat('lunch')
  .eat('dinner')
  .sleepFirst(5)
  .sleep(3)
  .eat('junk food')
/**
Hi I am Tony
等待了5秒...
I am eating lunch
I am eating dinner
等待了3秒...
I am eating junk food
 */