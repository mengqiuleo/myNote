const set = (name, value, {maxAge, domain, path, secure} ={}) => {
  let cookieText = `${encodeURIComponent(name)}=${encodeURIComponent(value)}` //进行编码，防止出现乱码

  if(typeof maxAge === 'number'){
    cookieText += `; max-age=${maxAge}`
  }

  if(domain){
    cookieText += `; domain=${domain}`
  }

  if(path){
    cookieText += `; path=${path}`
  }

  if(secure){
    cookieText += `; secure`
  }

  document.cookie = cookieText
}

const get = (name) => {
  name = `${encodeURIComponent(name)}`

  const cookies = document.cookie.split("; ")

  for(const item of cookies){
    const [cookieName, cookieValue] = item.split("=")
    if(cookieName === name){
      return decodeURIComponent(cookieValue)
    }
  }
  return;
}

// 根据name,domain,path 删除 cookie: 将maxAge设为-1就删除了cookie
const remove = (name,{domain,path} = {}) => {
  set(name,"",{
    domain,
    path,
    maxAge:-1
  })
}

export { set, get, remove }