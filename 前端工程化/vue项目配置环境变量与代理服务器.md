# vue项目配置环境变量与代理服务器

[TOC]



## 环境变量

### 方式一：

**使用一个config.js文件**

或者是：./config/index.js 文件

```js
//根据 process.env.NODE_ENV

let BASE_URL = ""
let BASE_NAME = ""

if(process.env.NODE_ENV === 'development'){
  BASE_URL = "http://..."
  BASE_NAME = "pan"
} else if(process.env.NODE_ENV === 'production'){
  BASE_URL = "http://..."
  BASE_NAME = "123465"
} else {
	BASE_URL = "http://..."
  BASE_NAME = "hhh"
}

export { BASE_URL, BASE_NAME }
```



### 方式二：

直接在根目录下创建对应的环境变量

创建一个 `.env` 文件，但是这个文件是在任何环境变量中使用的



为了区分环境，我们需要创建：

- `.env.development`
- `.env.production`
- `.env.test`

创建上面的三个文件

里面我们注入的变量格式要求如下：

- 首先以 `VUE_APP_随便写`

```
VUE_APP_BASE_URL = http://...
VUE_APP_BASE_NAME = pan
```

三个环境中的url和name可能不同

然后我们就可以在 main.js 中拿到我们定义的环境变量

```js
//main.js
console.log(process.env.VUE_APP_BASE_URL)
console.log(process.env.VUE_APP_BASE_NAME)
```



## 配置代理服务器

### 跨域问题

1、什么是跨域问题？

浏览器从一个域名的网页去请求另一个域名的资源时，域名、端口、协议任一不同，都会导致跨域问题。即前端接口去调用不在同一个域内的后端服务器而产生的问题。

2、如何解决跨域问题？ --- 代理服务器

代理服务器的主要思想是通过建立一个端口号和前端相同的代理服务器进行中转，从而解决跨域问题。因为代理服务器与前端处于同一个域中，不会产生跨域问题；而且代理服务器与服务器之间的通信是后端之间的通信，不会产生跨域问题。



具体流程如下图所示，红色框代表浏览器，粉色框代表代理服务器，蓝色框代表后端的服务器。

![](./图片/代理.webp)

3、如何实现代理服务器？-- 用vue-cli来实现



## vue-cli配置代理的两种方法

### 方法一：在Vue.config.js中添加如下配置：

```js
devServer:{
    proxy:"http://localhost:5000"
}
```

说明：

1、优点：配置简单，请求资源时直接发给前端(8080)即可

2、缺点：不能配置多个代理，不能灵活的控制请求是否走代理

3、工作方式：若按照上述配置代理，当请求了不存在的资源时，那么该请求就会转发给服务器（有限匹配前端资源）



### 方法二：编写vue.config.js配置具体代理规则

#### 具体规则

```js
  devServer: {
    // open: true,    //是否自动打开浏览器
    port: 8080,      //启动端口号
    https: false,    //是否开启https
    hotOnly: false,
    proxy: {
      // 配置跨域
      '/api': {
        target: 'http://www.xxxx/app',
        ws: true,
        changOrigin: true,    //是否开启代理
        pathRewrite: { //  /api开头的请求会去到target下请求
          '^/api': ''        //   替换/api 为空字符
        }
      }
    },
  },
```

- eg:

```csharp
import axios from 'axios';
axios.get('/api/versionInfo.json').then()
// 实际访问的是  http://www.xxxx/app/versionInfo.json
```



#### demo

```js
module.exports = {
    devServer: {
        proxy: {
            '/api1': { // 匹配所有以'/api1' 开头的请求路径
                target: 'http://localhost:5000', // 代理目标的基础路径
                changeOrigin: true,
                pathRewrite: {'^/api1':''}
            },
            '/api2': { // 匹配所有以'/api2' 开头的请求路径
                target: 'http://localhost:5001',// 代理目标的基础路径
                changeOrigin: true,
                pathRewrite: {'^/api2':''}
            },
        }
    }
}

/*
    changeOrigin设置为true时，服务器收到的请求头中的host为：localhost:5000
    changeOrigin设置为false时，服务器收到的请求头中的host为：localhost:8080
    changeOrigin默认值为true
*/
```

说明：

1、优点：可以配置多个代理，并且可以灵活的控制请求是否走代理

2、缺点：配置略微繁琐，请求资源时必须加前缀。




相关文章：

[【vue基础篇】一看就懂的vue环境变量配置](https://juejin.cn/post/6844903859878363149)