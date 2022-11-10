/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-08 21:58:48
 * @LastEditTime: 2022-11-08 22:04:24
 */
function sleep1(wait, callback) {
  setTimeout(callback, wait)
}
//sleep 1s
sleep1(1000, () => {
  console.log(1000)
})


const sleep2 = time => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve()
    }, time);
  })
}
sleep2(1000).then(() => {
  console.log(1)
})

function sleep(time) {
  return new Promise(resolve =>
    setTimeout(resolve, time)
  )
}
async function output() {
  await sleep(1000);
  console.log(111);
}
output();