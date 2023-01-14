/*
 * @Author: Pan Jingyi
 * @Date: 2023-01-14 16:38:55
 * @LastEditTime: 2023-01-14 16:39:02
 */
const p1 = Promise.resolve(1);
const p2 = Promise.resolve(Promise.resolve(2));
const p3 = Promise.resolve(Promise.reject(3));
const p4 = new Promise((resolve) => {
  setTimeout(() => {
    resolve(4);
  }, 1000);
});

Promise.all = function(promises){
  return new Promise((resolve,reject) => {
    let count = 0;
    let arr = [];

    for(let i=0;i<promises.length;i++){
      promises[i].then(v => {
        count++;
        arr[i] = v;
        if(count === promises.length){
          resolve(arr)
        }
      }, r => {
        reject(r)
      })
    }
  })
}


Promise.all([p1, p2, p3, p4]).then(
  (value) => {
    console.log('res2 value:', value);
  },
  (reason) => {
    console.log('res2 reason:', reason);
  },
);

Promise.race = function(promises){
  return new Promise((resolve,reject) => {
    for(let i=0;i<promises.length;i++){
      promises[i].then(v => {
        resolve(v);
      }, r => {
        reject(r)
      })
    }
  })
}

Promise.race([p4, p1, p3, p2]).then(
  (value) => {
    console.log('res3 value:', value);
  },
  (reason) => {
    console.log('res3 reason:', reason);
  },
);