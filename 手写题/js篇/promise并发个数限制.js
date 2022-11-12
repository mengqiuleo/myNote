let request = function (id) {
  return new Promise((resolve, reject) => {
    //随机一个执行时间
    let time = Math.floor(10000 * Math.random());
    console.log(`id为${id}开始请求,预计执行时间${time/1000}`)
    setTimeout(() => {
      resolve(id);
    }, time)
  }).then((id) => {
    console.log(`id为${id}的请求进行逻辑处理`)
    return id;
  })
}
let idArray = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
let pool = []

async function run() {
  for (let i = 0; i < idArray.length; i++) {
    let promise = request(idArray[i]);
    promise.then((res) => {
      console.log(`id${res}的请求已经处理完毕,当前并发为${pool.length}`);
      pool.splice(pool.indexOf(promise), 1);
    })
    pool.push(promise);
    //利用Promise.race方法来获得并发池中某任务完成的信号
    //跟await结合当有任务完成才让程序继续执行,让循环把并发池塞满
    if (pool.length == 3) {
      console.log('pool已满，等待~~')
      await Promise.race(pool);
    }
  }
}
run();