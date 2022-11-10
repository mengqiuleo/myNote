/*
 * @Author: Pan Jingyi
 * @Date: 2022-11-06 14:15:55
 * @LastEditTime: 2022-11-06 14:26:52
 */
const server_url = './server'

let xhr = new XMLHttpRequest();
xhr.open('GET', server_url, true);
xhr.onreadystatechange = function(){
  if(xhr.readyState !== 4) return;
  if(xhr.status === 200 || xhr.status === 304){
    console.log(xhr.responseText)
  }else{
    console.error(xhr.statusText)
  }
}

xhr.send()


//promise封装
const getJSON = function(url){
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open('GET', url, false);
    xhr.setRequestHeader('Content-Type', 'application/json')
    xhr.onreadystatechange = function(){
      if(xhr.readyState !== 4) return;
      if(xhr.status === 200 || xhr.status === 304){
        resolve(xhr.responseText)
      }else{
        reject(new Error(xhr.statusText))
      }
    }
    xhr.send()
  })
}