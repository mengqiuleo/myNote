## cookie封装

```js
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
```

对应的测试代码

```html
<script type="module">
    import { set, get } from './test.js';

    console.log("1321546")
    set("username","zs")
    set("age",18)
    set("用户名","张三",{
      maxAge:50
    })

    console.log(get("username"))
</script>
```



## localstorage封装

```js
const Storage = window.localStorage
const set = (name,value) => {
  Storage.setItem(name,JSON.stringify(value))
}

const get = (name) => {
  return JSON.parse(Storage.getItem(name))
}

const remove = (name) => {
  Storage.removeItem(name)
}

const clear = () => {
  Storage.clear()
}

export {set,get,remove,clear}
```

对应的测试代码

```html
<script type="module">
    import { set,get,remove,clear} from './localstorage封装.js'

    set("user1",{
      a:1,
      school: "456464"
    })

    console.log(get("user1"))
 </script>
```

