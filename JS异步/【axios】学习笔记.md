# 【axios】学习笔记

[TOC]



## 一、axios是什么

> 1. 前端最流行的 ajax 请求库 
> 2. react/vue 官方都推荐使用 axios 发 ajax 请求 

### axios 特点

1. 基于 xhr + promise 的异步 ajax 请求库 
2. 浏览器端/node 端都可以使用 
3. 支持请求／响应拦截器 
4. 支持请求取消 
5. 请求/响应数据转换 
6. 批量发送多个请求



### axios 常用语法及举例

1. axios(config): `通用/最本质`的发任意类型请求的方式  
2. axios(url[, config]): 可以只指定 url 发 get 请求 
3. axios.request(config): 等同于 axios(config) 
4. axios.get(url[, config]): 发 get 请求 
5. axios.delete(url[, config]): 发 delete 请求 
6. axios.post(url[, data, config]): 发 post 请求
7. axios.put(url[, data, config]): 发 put 请求 
8. axios.defaults.xxx: 请求的默认全局配置 
9. axios.interceptors.request.use(): 添加请求拦截器 
10. axios.interceptors.response.use(): 添加响应拦截器 
11. axios.create([config]): 创建一个新的 axios(它没有下面的功能) 
12. axios.Cancel(): 用于创建取消请求的错误对象 
13. axios.CancelToken(): 用于创建取消请求的 token 对象 
14. axios.isCancel(): 是否是一个取消请求的错误 
15. axios.all(promises): 用于批量执行多个异步请求 
16. axios.spread(): 用来指定接收所有成功数据的回调函数的方法



#### 一个🌰

**get请求**

```html
  <div class="container">
    <button id="get">get请求</button>
  </div>

  <script>
    const btn = document.getElementById("get")
    btn.onclick = function() {
      axios({
        //请求类型
        method: 'GET',
        //URL
        url: 'http://localhost:3000/posts'
      }).then(res => {
        console.log(res);
      })
    }
  </script>
```



**post请求**

```html
  <div class="container">
    <button id="post">post请求</button>
  </div>

  <script>
    const btn = document.getElementById("post")
    btn.onclick = function() {
      axios({
        //请求类型
        method: 'POST',
        //URL
        url: 'http://localhost:3000/posts',
        //设置请求体
        data: {
          title: '用post请求添加新数据',
          author: 'pjy'
        }
      }).then(res => {
        console.log(res);
      })
    }
  </script>
```



**put请求**

```html
  <div class="container">
    <button id="put">put请求</button>
  </div>

  <script>
    const btn = document.getElementById("put")
    btn.onclick = function() {
      axios({
        //请求类型
        method: 'PUT',
        //URL
        url: 'http://localhost:3000/posts/3',
        //设置请求体
        data: {
          title: '修改数据',
          author: 'Pan'
        }
      }).then(res => {
        console.log(res);
      })
    }
  </script>
```



**delete请求**

```html
  <div class="container">
    <button id="delete">delete请求:删除数据</button>
  </div>

  <script>
    const btn = document.getElementById("delete")
    btn.onclick = function() {
      axios({
        //请求类型
        method: 'delete',
        //URL
        url: 'http://localhost:3000/posts/4',
      }).then(res => {
        console.log(res);
      })
    }
  </script>
```



**axios.request()**

```html
  <div class="container">
    <button id="put">其他方法请求</button>
  </div>

  <script>
    const btn = document.getElementById("put")

    btn.onclick = function() {
      axios.request({
        method:'GET',
        url:'http://localhost:3000/posts'
      }).then(res => {
        console.log(res)
      })
    }
  </script>
```



**axios.post()**

```html
  <div class="container">
    <button id="put">其他方法请求</button>
  </div>

  <script>
    const btn = document.getElementById("put")

    btn.onclick = function() {
      axios.post(
        'http://localhost:3000/comments',
        {
          "body": "添加数据",
          "postId": 2
        }
      ).then(res => {
        console.log(res);
      })
    } 
  </script>
```



## 二、默认配置

```html
  <div class="container">
    <button id="put">default config(默认配置)</button>
  </div>

  <script>
    const btn = document.getElementById("put");

    // 进行默认配置!!！ 注意：默认配置要放在外面
    axios.default.method = 'GET';//设置默认的请求方式为GET
    axios.default.baseURL = 'http://localhost:3000';//设置基础URL
    axios.default.params = {id:100};//请求参数
    axios.default.timeout = 3000;//超时时间

    btn.onclick = function() {
      axios({
          url: '/comments'
        }).then(res => {
          console.log(res);
        })
    }
    
  </script>
```



## 三、原理图

![](E:\note\前端\笔记\ajax、promise\axios图片\Axios系统学习笔记原理图.png)



## 四、axios.create(config)

### 介绍

1. 根据指定配置创建一个新的 axios, 也就就每个新 axios 都有自己的配置 

2. 新 axios 只是没有取消请求和批量发请求的方法, 其它所有语法都是一致的 

3. 为什么要设计这个语法?

  (1) 需求: 项目中有部分接口需要的配置与另一部分接口需要的配置不太一样, 如何处理 

  (2) 解决: 创建 2 个新 axios, 每个都有自己特有的配置, 分别应用到不同要 求的接口请求中



### 一个🌰

```html
  <div class="container">
    <button id="get">get请求</button>
  </div>

  <script>
    const btn = document.getElementById("get")
    
    //创建axios实例对象
    const a = axios.create({
      baseURL: 'http://localhost:3000',
      timeout: 2000
    })

    a.get('/posts').then(res => {
      console.log(res.data);
    })
  </script>
```



**另一种写法**

```js
    //创建axios实例对象
    const a = axios.create({
      baseURL: 'http://localhost:3000',
      timeout: 2000
    })

    a({
      url:'/posts',
    }).then(res => {
      console.log(res);
    })
```



## 五、拦截器

> 1. 请求拦截器: 
>    Ⅰ- 在真正发送请求前执行的回调函数
>    Ⅱ- 可以对请求进行检查或配置进行特定处理
>    Ⅲ- 成功的回调函数, 传递的默认是 config(也必须是)
>    Ⅳ- 失败的回调函数, 传递的默认是 error
> 2. 响应拦截器
>    Ⅰ- 在请求得到响应后执行的回调函数
>    Ⅱ- 可以对响应数据进行特定处理
>    Ⅲ- 成功的回调函数, 传递的默认是 response
>    Ⅳ- 失败的回调函数, 传递的默认是 error



### 一个🌰

```html
  <script>
    // 设置请求拦截器  config 配置对象
    axios.interceptors.request.use(function (config) {
      console.log('请求拦截器 成功');
      return config;
    }, function (error) {
      console.log('请求拦截器 失败');
      return Promise.reject(error);
    });
 
    // 设置响应拦截器
    axios.interceptors.response.use(function (response) {
      console.log('响应拦截器 成功');
      return response.data;
      // return response;
    }, function (error) {
      console.log('响应拦截器 失败')
      return Promise.reject(error);
    });
 
    //发送请求
    axios({
      method: 'GET',
      url: 'http://localhost:3000/posts'
    }).then(response => {
      console.log('自定义回调处理成功的结果');
      console.log(response);
    });
  </script>
```



控制台输出结果：

![](E:\note\前端\笔记\ajax、promise\axios图片\拦截器结果.jpg)



### 多个拦截器输出顺序

```html
 <script>
   // Promise
   // 设置请求拦截器  config 配置对象
   axios.interceptors.request.use(function (config) {
     console.log('请求拦截器 成功 - 1号');
     //修改 config 中的参数
     config.params = {
       a: 100
     };

     return config;
   }, function (error) {
     console.log('请求拦截器 失败 - 1号');
     return Promise.reject(error);
   });

   axios.interceptors.request.use(function (config) {
     console.log('请求拦截器 成功 - 2号');
     //修改 config 中的参数
     config.timeout = 2000;
     return config;
   }, function (error) {
     console.log('请求拦截器 失败 - 2号');
     return Promise.reject(error);
   });

   // 设置响应拦截器
   axios.interceptors.response.use(function (response) {
     console.log('响应拦截器 成功 1号');
     return response.data;
     // return response;
   }, function (error) {
     console.log('响应拦截器 失败 1号')
     return Promise.reject(error);
   });

   axios.interceptors.response.use(function (response) {
     console.log('响应拦截器 成功 2号')
     return response;
   }, function (error) {
     console.log('响应拦截器 失败 2号')
     return Promise.reject(error);
   });

   //发送请求
   axios({
     method: 'GET',
     url: 'http://localhost:3000/posts'
   }).then(response => {
     console.log('自定义回调处理成功的结果');
     console.log(response);
   });
 </script>
```



控制台输出结果：

![](E:\note\前端\笔记\ajax、promise\axios图片\结果2.jpg)

> 请求拦截器是后进先执行，响应拦截器是先进先执行



## 六、取消请求

1. 基本流程 配置 cancelToken 对象 
  2. 缓存用于取消请求的 cancel 函数 
  3. 在后面特定时机调用 cancel 函数取消请求 
  4. 在错误回调中判断如果 error 是 cancel, 做相应处理
5. 实现功能 点击按钮, 取消某个正在请求中的请求,
  6. 实现功能 点击按钮, 取消某个正在请求中的请求

```html
  <div class="container">
    <button id="get" class="btn">get请求</button>
    <button id="cancel" class="btn">取消请求</button>
  </div>

  <script>
    const btn = document.querySelectorAll("button")

    //2.声明全局变量
    let cancel = null;
    
    btn[0].onclick = function() {
      //6.补充：检查上一次的请求是否已经完成
      if(cancel !== null) {
        //取消上一次的请求
        cancel();
      }

      axios({
        method: 'GET',
        url: 'http://localhost:3000/posts',
        
        //1.取消请求:添加配置对象的属性
        cancelToken: new axios.cancelToken(function(c){
          cancel = c;//3.将 c 的值赋值给cancel
        })
      }).then(res => {
        console.log(res);
        cancel = null;//4.将cancel的值初始化
      })
    }

    //5.绑定第二个事件取消请求
    btn[1].onclick = function() {
      cancel();
    }
  </script>
```

