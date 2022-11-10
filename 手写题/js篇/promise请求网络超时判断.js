/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-08 22:24:31
 * @LastEditTime: 2022-11-08 22:31:46
 */
const upLoadFile = (url, params) => {
  return Promise.race([
    upLoadFilePromise(url, params),
    upLoadFileTimeout(3000)
  ])

  function upLoadFilePromise(url, params) {
    return new Promise((resolve, reject) => {
      axios.post(url, params, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }, //以formData形式上传文件
      }).then(res => {
        if (res.status == 200 && res.data.code == 0) {
          resolve(res.data.result)
        } else {
          reject(res.data)
        }
      })
    })
  }

  function upLoadFileTimeout(time) {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        reject({
          timeoutMsg: '上传超时'
        })
      }, time);
    })
  }
}


