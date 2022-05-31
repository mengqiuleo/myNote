# Ajax、Fetch、Axios三者的区别

[TOC]

## Ajax

ajax基本知识点 👉[Ajax学习笔记](https://blog.csdn.net/weixin_52834435/article/details/123926645)

> 本身是针对MVC的编程,不符合现在前端MVVM的浪潮
>
> Ajax 是一种思想，XMLHttpRequest 只是实现 Ajax 的一种方式。其中 XMLHttpRequest 模块就是实现 Ajax 的一种很好的方式。



**特点：**

- 局部刷新页面，无需重载整个页面。



一个🌰

```js
const SERVER_URL = "/server";
let xhr = new XMLHttpRequest();
// 创建 Http 请求
xhr.open("GET", SERVER_URL, true);
// 设置状态监听函数
xhr.onreadystatechange = function() {
  if (xhr.readyState !== 4) return;
  // 当请求成功时
  if (xhr.status === 200 || xhr.status === 304) {
    console.log(xhr.responseText);
  } else {
    console.error(xhr.statusText);
  }
};
// 发送 Http 请求
xhr.send();
```



**使用Promise封装AJAX请求**

```js
const getJSON = function (url) {
  return new Promise((resolve, reject) => {
    const xhr = new XMLHttpRequest();
    xhr.open("GET", url, false);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function () {
      if (xhr.readyState !== 4) return;
      if (xhr.status === 200 || xhr.status === 304) {
        resolve(xhr.responseText);
      } else {
        reject(new Error(xhr.responseText));
      }
    };
    xhr.send();
  });
};
```



## Fetch

**Fetch 是一个 API，它是真实存在的，它是基于 promise 的。**

> fetch是原生js,没有使用XMLHttpRequest对象

```html
<body>
  <script>
    function ajaxFetch(url) {
      fetch(url).then(res => res.json()).then(data => {
        console.info(data)
      })
    }
    ajaxFetch('https://smallpig.site/api/category/getCategory')
  </script>
</body>
```

> * fetch只对网络请求报错,对400、500都当成成功的请求,需要封装去处理
> * fetch默认不会带cookie,需要添加配置项
> * fetch不支持 abort(中止) 、不支持超时控制,使用`setTimeout`及`Promise.reject`实现的超时控制并不能阻止请求过程继续在后台运行,造成了量的浪费
> * fetch不能原生检测请求的进度,而XHR可以



## Axios

axios基本使用👉 [【axios】学习笔记](https://blog.csdn.net/weixin_52834435/article/details/124626127?spm=1001.2014.3001.5501)

> - axios和vue没关系，axios也不是随着Vue的兴起才广泛使用的，axios本身就是独立的请求库，跟用什么框架没关系；而且最初Vue官方推荐的请求库是vue-resouce，后来才推荐的axios；
> - axios利用xhr进行了二次封装的请求库，xhr只是axios中的其中一个请求适配器，axios在nodejs端还有个http的请求适配器；axios = xhr + http；
> - axios应该是一个顶层的封装库，底层可以选择xhr或者fetch进行请求



**特点：**

- 从浏览器中创建 XMLHttpRequests
- 从 node.js 创建 http 请求
- 支持 Promise API
- 拦截请求和响应
- 转换请求数据和响应数据
- 取消请求
- 自动转换 JSON 数据
- 客户端支持防御 XSRF



## 三者对比：

> - 远古时期，XMLHttpRequest对象的出现，JavaScript调用它就可以让浏览器异步地发http请求，然后这项异步技术就被称为Ajax。
> - 之后jQuery封装了它，让异步结果更清晰的表现在一个对象的回调函数属性上。编写方式更简单，但出现了新的问题~回调地狱。
> - Promise为了解决异步编程的回调地狱问题诞生了。
> - 随后有人把xhr对象用Promise封装了起来~它就是axios库(浏览器端)，axios在node.js环境是http模块的封装
> - 后来又出现了一个可以异步地发http请求的api，就是fetch()。它并非是封装xhr对象的库。而是全新的JavaScript的接口。而且fetch api天生就是自带Promise的
> - 现在的Ajax就有了两种方式: xhr对象和fetch()。`XHR和Fetch是不同的标准`。



- ajax是js异步技术的术语，早起相关的api是xhr，它是一个术语。
- fetch是es6新增的用于网络请求标准api，它是一个api。
- axios是用于网络请求的第三方库，它是一个库。



> ajax是异步请求的统称。axios和fetch都是利用promise封装实现的ajax。只不过fetch是浏览器亲生的，axios是别人家的孩子。



## 为什么比起 fetch 更倾向于选择 Axios

### 1.浏览器兼容方面

* Axios支持IE11及以上
* Fetch默认不支持IE,加补丁后支持IE10及以上 



### 2.请求取消

比如用户离开屏幕或者组件时会需要取消请求

* Axios 支持
* fetch不支持请求取消



### 3.JSON结果转换

* Axios自动转换
* Fetch需要多一步 :`then(res=>res.json())`

```js
// axios
axios.get('http://localhost:3000')
 .then(response => {
   console.log(response.data);
 }, error => {
   console.log(error);
 });

// fetch()
fetch('http://localhost:3000')
 .then(response => response.json())    // 额外多了一步
 .then(data => {
   console.log(data) 
 })
 .catch(error => console.error(error));
```



### 4.拦截器

* Axios支持request和respone的拦截: 请求拦截可以用于日志和权限等; 响应拦截可以用于格式化等
* Fetch不支持,但可以通过复写Fetch函数勉强实现



### 5.CSRF保护

* Axios内置支持
* Fetch不支持



### 

