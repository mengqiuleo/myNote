[TOC]



## 写在前面

这里是小飞侠Pan🥳，立志成为一名优秀的前端程序媛！！！

本篇文章同时收录于我的[github](https://github.com/mengqiuleo)前端笔记仓库中，持续更新中，欢迎star~

👉[https://github.com/mengqiuleo/myNote](https://github.com/mengqiuleo/myNote)



## cookie在前后端项目中的简单实践

自己在学习cookie时，只是知道理论知识，理解还停留于“纸上谈兵”的阶段。

所以在这里开了一个小demo，来实践在项目中使用cookie。

**这个demo：后端使用原生nodejs，前端并没有使用页面，前端发送请求使用postman**

整个项目的源码收录于我的仓库中：[https://github.com/mengqiuleo/myNote](https://github.com/mengqiuleo/myNote)

## 项目搭建

项目目录：

```
├─ package-lock.json
├─ package.json
└─ src
   ├─ app.js
   ├─ main.js
   └─ routes
      └─ user.js
```



### package.json

首先，

```
npm init -y
```

初始化项目。

然后，下载npm包：`npm install nodemon --save`

在package.json文件中加入一行调试：`"dev": "nodemon src/main.js"` 来启动项目



### main.js

创建根目录src，然后在根目录下创建`main.js`，这是整个项目的入口。在 main.js 文件中，搭建一个服务器，代码如下：

```js
const http = require('http')
const serverHandler = require('./app')

const server = http.createServer(serverHandler)

server.listen(3000)
```

解释上述代码：

如果不会使用原生nodejs搭建http服务器，请移步至此👉：[【Nodejs】学习之常用内置模块](https://blog.csdn.net/weixin_52834435/article/details/125689142)

用原生nodejs代码搭建一个服务器，所有关于response 的返回语句，封装在 app.js 中。

所以在根目录下创建一个app.js



### app.js

首先，搭建最基础的判断语句：

```js
const querystring = require('querystring')

const serverHandler = (req,res) => {
  res.setHeader('Content-Type', 'application/json') //设置返回数据的格式
  const url = req.url // /api/user/login?username=zs&password=123

  req.path = url.split('?')[0] // /api/user/login
  req.query =  querystring.parse(url.split('?')[1]) // { username: 'zs', password: '123' }

  console.log("cookie: ",req.headers.cookie)

  // 改变cookie的格式：key-value(即对象形式)
  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if(!item){
      return
    }
    const arr = item.split('=')
    const key = arr[0].trim()//trim用来去除空格
    const val = arr[1].trim()
    req.cookie[key] = val 
  });

  //在这里对请求的不同路由(即不同页面)进行处理，然后拿到处理结果 userResult
  // ...

  res.end(userResult)//将处理结果返回
}

module.exports = serverHandler
```



**解释：**

- 首先引入内置模块：querystring，用来分离参数。

  比如：`/api/user/login?username=zs&password=123`，这样的url传递过来的参数是一个字符串，那么我们就可以使用这个内置模块将参数转换成对象

  `{ username: 'zs', password: '123' }`

- 先用 req.url 拿到请求路径的参数

- 然后我们给res添加两个属性：path 和 query。

  - path 用来存放路径，比如`/api/user/login`
  - query 用来存放参数，比如`{ username: 'zs', password: '123' }`。并且我们在这个使用querystring内置模块将参数转换成对象形式

- 前端传过来的cookie是存放在`req.headers.cookie`中

- 因为cookie的格式并不方便处理，我们这里对cookie的格式进行处理（cookie的格式，我们可以在控制台中打印：`document.cookie`）

  可以看到cookie的格式如下：

  ```
  ttcid=634f732d8a2046cabe641599776836ee30; _tea_utm_cache_2608={%22utm_source%22:%22infinitynewtab.com%22}; MONITOR_WEB_ID=5a6a0411-a419-4333-815f-116842e0c588; 
  ```

  可以看到，每个cookie之间用 ==`;`== 分开，然后每个cookie的格式都是：`key=value`

- 我们这里把cookie转换成对象(key-value)的形式：

  ```js
  req.cookie = {}
  const cookieStr = req.headers.cookie || '' //拿到所有的cookie
  cookieStr.split(';').forEach(item => { // 使用 ; 将每个cookie分开
    if(!item){
    	return
    }
    const arr = item.split('=')
    const key = arr[0].trim()//trim用来去除空格
    const val = arr[1].trim()
    req.cookie[key] = val 
  });
  ```

- 接下来是对不同页面的处理，我们将处理路由的这部分代码单独放在一个文件`routes/user.js`中

- 然后在这个文件中引入`routes/user.js`，

- **那么这个文件(app.js)的整体代码如下**

  ```js
  const querystring = require('querystring')
  const handleUserRouter = require('./routes/user')
  
  const serverHandler = (req,res) => {
    res.setHeader('Content-Type', 'application/json') //设置返回数据的格式
    const url = req.url // api/user/login?username=zs&password=123
  
    req.path = url.split('?')[0] // /user/login
    req.query =  querystring.parse(url.split('?')[1]) // { username: 'zs', password: '123' }
  
    console.log("cookie: ",req.headers.cookie)
  
    req.cookie = {}
    const cookieStr = req.headers.cookie || ''
    cookieStr.split(';').forEach(item => {
      if(!item){
        return
      }
      const arr = item.split('=')
      const key = arr[0].trim()//trim用来去除空格
      const val = arr[1].trim()
      req.cookie[key] = val 
    });
  
    const userResult = handleUserRouter(req,res)//引入处理路由的 routes/user.js 文件
  
    res.end(userResult)
  }
  
  module.exports = serverHandler
  ```

  



### routes/user.js

这个文件用来根据不同的请求路由，返回不同的结果

```js
const handleUserRouter = function(req,res) {
  const method = req.method
  if(method === 'GET' && req.path === '/api/user/login'){
    const { username, password } = req.query
    const loginResult = loginTest(username,password) // loginTest是一个自己封装的函数，用来判断登录用户名和密码是否正确
    if(loginResult){
      res.setHeader('Set-Cookie', `username=${username}; path=/; expires=${setCookieExpireTime()}`)
      return {
        errorCode: 0,
        data: 'cookie设置成功'
      }
    }
    return {
      errorCode: -1,
      msg: '用户名或密码错误'
    }
  } else {
    if(req.cookie.username){
      return {
        errorCode: 0,
        msg: '已查询到cookie'
      }
    }
    return {
      errorCode: -1,
      msg: '请登录'
    }
  }
}

module.exports = handleUserRouter
```

**解释：**

- 首先我们要拿到请求的方法：`req.method`

- 我们要分不同的路由进行判断：

  - 如果请求的是登录页：`/api/user/login` 那么我们需要先取出来拼接在路径后面的参数：

    `/api/user/login?username=zs&password=123`

    ```js
    const { username, password } = req.query
    const loginResult = loginTest(username,password) // loginTest是一个自己封装的函数，用来判断登录用户名和密码是否正确
    ```

    拿到用户名和密码后，使用loginTest函数进行校验，拿到校验的结果

  - 身份校验函数的封装：

    这里我们只是简单模拟，所以不会引入数据库，在这里将登录名和密码写成固定的

    ```js
    // 判断用户名密码是否正确的函数
    const loginTest = function(username,password){
      if(username === 'zs' && password === '123'){//注意：因为参数的传递是字符串形式，所以即使密码是数字，也要用字符串的形式判断
        return true
      }
      return false
    }
    ```

    

  - 然后根据校验结果分情况讨论：

    ```js
    if(method === 'GET' && req.path === '/api/user/login'){
      // ...
      //进行用户名和密码的校验，拿到校验结果：loginResult
      
      if(loginResult){ // 如果校验成功：那么就设置cookie，并且返回状态码为0，表示成功
        res.setHeader('Set-Cookie', `username=${username}; path=/; expires=${setCookieExpireTime()}`)
        return {
          errorCode: 0,
          data: 'cookie设置成功'
        }
      }
    
      //否则校验失败，返回状态码-1
      return {
          errorCode: -1,
          msg: '用户名或密码错误'
        }
      }
    
    }
    ```

- 上面的代码中，我们在设置cookie时，可以对cookie设置过期时间：

  我们自定义封装一个过期时间的函数：

  ```js
  //设置cookie过期时间的函数
  const setCookieExpireTime = function() {
    const date = new Date()
    date.setTime(date.getTime() + 10*1000)
    return date.toGMTString()
  }
  ```

- 如果我们请求的是别的页面，那就需要判断是否存在cookie，如果有cookie，就允许放行，否则返回错误的状态码

  ```js
  else { // else是对别的页面的请求
      if(req.cookie.username){ //如果存在这个cookie，允许放行
        return {
          errorCode: 0,
          msg: '已查询到cookie'
        }
      }
      return { //不存在这个cookie，那么就要先登录，设置cookie
        errorCode: -1,
        msg: '请登录'
      }
   }
  ```

  

**routes/user.js 完整代码如下：**

```js
// 判断用户名密码是否正确的函数
const loginTest = function(username,password){
  if(username === 'zs' && password === '123'){//注意：因为参数的传递是字符串形式，所以即使密码是数字，也要用字符串的形式判断
    return true
  }
  return false
}

//设置cookie过期时间的函数
const setCookieExpireTime = function() {
  const date = new Date()
  date.setTime(date.getTime() + 10*1000)
  return date.toGMTString()
}

const handleUserRouter = function(req,res) {
  const method = req.method
  if(method === 'GET' && req.path === '/api/user/login'){
    const { username, password } = req.query //从参数中取出用户名和密码
    const loginResult = loginTest(username,password) // loginTest是一个自己封装的函数，用来判断登录用户名和密码是否正确
    if(loginResult){ // 如果校验成功：那么就设置cookie，并且返回状态码为0，表示成功
      res.setHeader('Set-Cookie', `username=${username}; path=/; expires=${setCookieExpireTime()}`)
      return { 
        errorCode: 0,
        data: 'cookie设置成功'
      }
    }
    return { //否则校验失败，返回状态码-1
      errorCode: -1,
      msg: '用户名或密码错误'
    }
  } else { // else是对别的页面的请求
    if(req.cookie.username){ //如果存在这个cookie，允许放行
      return {
        errorCode: 0,
        msg: '已查询到cookie'
      }
    }
    return { //不存在这个cookie，那么就要先登录，设置cookie
      errorCode: -1,
      msg: '请登录'
    }
  }
}

module.exports = handleUserRouter
```

