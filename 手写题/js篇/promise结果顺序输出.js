/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-11 12:36:06
 * @LastEditTime: 2022-11-11 13:37:12
 */
let p1 = new Promise((resolve, reject) => {
  resolve("ok");
}).then((res) => {
  console.log('执行成功')
})

let p2 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('p2: 2000')
  }, 2000);
})

let p3 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('p3: 3000')
  }, 3000);
})

let p4 = new Promise((resolve, reject) => {
  setTimeout(() => {
    resolve('p4: 4000')
  }, 4000);
})

//并发执行异步事件，按顺序输出结果,总耗时为数组中最大的数
const order = async (nums) => {
  const promises = nums.map(async num => {
    return await num
  })
  for (const data of promises) {
    console.log(data)
  }
}


const nums = [p1, p3, p2, p4]
order(nums)
