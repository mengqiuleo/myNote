# 【vue】vue-Router常见面试题

[TOC]



## 一、vue-Router基本使用

1.点击这里👉[vue-router使用](https://blog.csdn.net/weixin_52834435/article/details/122917256)

2.导航守卫的使用：[导航守卫](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html)

## 二、常见面试题

### 1.vue-router 路由钩子函数是什么 执行顺序是什么

钩子函数种类有:全局守卫、路由守卫、组件守卫

- 全局前置/钩子：beforeEach、beforeResolve、afterEach
- 路由独享的守卫：beforeEnter
- 组件内的守卫：beforeRouteEnter、beforeRouteUpdate、beforeRouteLeave



**完整的导航解析流程:**

1. 导航被触发。
2. 在失活的组件里调用 beforeRouteLeave 守卫。
3. 调用全局的 beforeEach 守卫。
4. 在重用的组件里调用 beforeRouteUpdate 守卫 (2.2+)。
5. 在路由配置里调用 beforeEnter。
6. 解析异步路由组件。
7. 在被激活的组件里调用 beforeRouteEnter。
8. 调用全局的 beforeResolve 守卫 (2.5+)。
9. 导航被确认。
10. 调用全局的 afterEach 钩子。
11. 触发 DOM 更新。
12. 调用 beforeRouteEnter 守卫中传给 next 的回调函数，创建好的组件实例会作为回调函数的参数传入。



### 2. vue-router 动态路由是什么 有什么问题

例如，我们有一个 User 组件，对于所有 ID 各不相同的用户，都要使用这个组件来渲染。那么，我们可以在 vue-router 的路由路径中使用“动态路径参数”(dynamic segment) 来达到这个效果：

```vue
const User = {
  template: "<div>User</div>",
};

const router = new VueRouter({
  routes: [
    // 动态路径参数 以冒号开头
    { 
    	path: "/user/:id", 
    	component: User 
    },
  ],
});

```

#### (1) params 方式

- 配置路由格式：`/router/:id`
- 传递的方式：在path后面跟上对应的值
- 传递后形成的路径：`/router/123`

1）路由定义

```javascript
//在APP.vue中
<router-link :to="'/user/'+userId" replace>用户</router-link>    

//在index.js
{
   path: '/user/:userid',
   component: User,
},
复制代码
```

2）路由跳转

```javascript
// 方法1：
<router-link :to="{ name: 'users', params: { uname: wade }}"> 按钮 </router-link>

// 方法2：
this.$router.push({name:'users',params:{uname:wade}})

// 方法3：
this.$router.push('/user/' + wade)
复制代码
```

3）参数获取 通过 `this.$route.params.userid` 获取传递的值




#### (2) query 方式

- 配置路由格式：`/router`，也就是普通配置
- 传递的方式：对象中使用query的key作为传递方式
- 传递后形成的路径：`/route?id=123`

1）路由定义

```javascript
//方式1：直接在router-link 标签上以对象的形式
<router-link :to="{path:'/profile',query:{name:'why',age:28,height:188}}">档案</router-link>

// 方式2：写成按钮以点击事件形式
<button @click='profileClick'>我的</button>    

profileClick(){
  this.$router.push({
    path: "/profile",
    query: {
        name: "kobi",
        age: "28",
        height: 198
    }
  });
}
复制代码
```

2）跳转方法

```javascript
// 方法1：
<router-link :to="{ name: 'users', query: { uname: james }}">按钮</router-link>

// 方法2：
this.$router.push({ name: 'users', query:{ uname:james }})

// 方法3：
<router-link :to="{ path: '/user', query: { uname:james }}">按钮</router-link>

// 方法4：
this.$router.push({ path: '/user', query:{ uname:james }})

// 方法5：
this.$router.push('/user?uname=' + jsmes)
复制代码
```

3）获取参数

```javascript
通过this.$route.query 获取传递的值
```




#### (3) params 和 query 的区别

- 对于 query：

name 和 path 都可以用，

```
<router-link :to="{ name: 'W', query: { id:'1234'，age:'12' }}"/>
<router-link :to="{ path: '/W', query: { id:'1234',age:'12' }}"/>
```



- 对于 params:

只能用 name,

```
<router-link :to="{ name: 'W', params: { id:'1234',age:'12' }}"/>
```



**总结**

用法：query要用path来引入，params要用name来引入，接收参数都是类似的，分别是 `this.$route.query.name` 和 `this.$route.params.name` 。

**url地址显示**：query更加类似于ajax中get传参，params则类似于post，说的再简单一点，前者在浏览器地址栏中显示参数，后者则不显示

**注意**：query刷新不会丢失query里面的数据 params刷新会丢失 params里面的数据。



### 3.$route 和 $router 的区别

- `$router`为VueRouter实例，想要导航到不同URL，则使用$router.push方法
- `$route`为当前router跳转对象，里面可以获取name、path、query、params等



### 4.Vue-Router 的懒加载如何实现

路由懒加载的含义：

把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件

```
const List = () => import('@/components/list.vue')

const router = new VueRouter({
  routes: [
    { path: '/list', component: List }
  ]
})
```



### 5.vue-router 中常用的路由模式

#### hash 模式

1. location.hash 的值实际就是 URL 中#后面的东西 它的特点在于：hash 虽然出现 URL 中，但不会被包含在 HTTP 请求中，对后端完全没有影响，因此改变 hash 不会重新加载页面。

2. 可以为 hash 的改变添加监听事件

```javascript
window.addEventListener("hashchange", funcRef, false);
```

每一次改变 hash（window.location.hash），都会在浏览器的访问历史中增加一个记录利用 hash 的以上特点，就可以来实现前端路由“更新视图但不重新请求页面”的功能了

> 特点：兼容性好但是不美观



#### history 模式

利用了 HTML5 History Interface 中新增的 pushState() 和 replaceState() 方法。

这两个方法应用于浏览器的历史记录站，在当前已有的 back、forward、go 的基础之上，它们提供了对历史记录进行修改的功能。这两个方法有个共同的特点：当调用他们修改浏览器历史记录栈后，虽然当前 URL 改变了，但浏览器不会刷新页面，这就为单页应用前端路由“更新视图但不重新请求页面”提供了基础。

> 特点：虽然美观，但是刷新会出现 404 需要后端进行配置(一般是将页面配置重定向到首页路由)



**总结**

 hash模式是开发中默认的模式，如果想要切换到history模式，就要进行以下配置（后端也要进行配置）：

```vue
const router = new VueRouter({
  mode: 'history',
  routes: [...]
})
```



### 6.编程式路由导航 与 声明式路由导航

#### 编程式路由导航 --> 即写 js 的方式

相关 API：

**1) this.$router.push(path):**

相当于点击路由链接(可以返回到当前路由界面) --> 队列的方式（先进先出）

**2)this.$router.replace(path):**

用新路由替换当前路由(不可以返回到当前路由界面) --> 栈的方式（先进后出）

**3)this.$router.back():**

请求(返回)上一个记录路由

**4)this.$router.go(-1):**

请求(返回)上一个记录路由

**5) this.$router.go(1):**

请求下一个记录路由



#### 声明式路由导航 --> 即 `<router-link>`

```
<router-link to='xxx' tag='li'>  To PageB  </router-link>
```

注意：`<router-link>`  会默认解析成 a 标签，可以通过 tag 属性指定它解析成什么标签



### 7.单页面应用的优缺点（SPA）

单页面应用程序将所有的活动局限于一个Web页面中，在该Web页面初始化时加载相应的HTML、JavaScript 和 CSS。一旦页面加载完成，单页面应用不会因为用户的操作而进行页面的重新加载或跳转。取而代之的是利用 JavaScript 动态的变换HTML的内容，从而实现UI与用户的交互。由于避免了页面的重新加载，单页面应用可以提供较为流畅的用户体验。



#### 单页面应用的优点

- 良好的交互体验

单页应用的内容的改变不需要重新加载整个页面，获取数据也是通过Ajax异步获取，没有页面之间的切换，就不会出现“白屏现象”,也不会出现假死并有“闪烁”现象，页面显示流畅

- 良好的前后端工作分离模式

后端不再负责模板渲染、输出页面工作，后端API通用化，即同一套后端程序代码，不用修改就可以用于Web界面、手机、平板等多种客户端

- 减轻服务器压力

单页应用相对服务器压力小，服务器只用出数据就可以，不用管展示逻辑和页面合成，吞吐能力会提高几倍



#### 缺点

- 首屏加载慢

  解决方案： 

  - 1.vue-router懒加载

    Vue-router懒加载就是按需加载组件，只有当路由被访问时才会加载对应的组件，而不是在加载首页的时候就加载，项目越大，对首屏加载的速度提升得越明显

  - 2.使用CDN加速

    在做项目时，我们会用到很多库，采用cdn加载可以加快加载速度。

  - 3.异步加载组件

  - 4.服务端渲染

    服务端渲染还能对seo优化起到作用，有利于搜索引擎抓取更多有用的信息（如果页面纯前端渲染，搜索引擎抓取到的就只是空页面）

- 不利于SEO

seo 本质是一个服务器向另一个服务器发起请求，解析请求内容。但一般来说搜索引擎是不会去执行请求到的js的。也就是说，搜索引擎的基础爬虫的原理就是抓取url，然后获取html源代码并解析。 如果一个单页应用，html在服务器端还没有渲染部分数据数据，在浏览器才渲染出数据，即搜索引擎请求到的html是模型页面而不是最终数据的渲染页面。 这样就很不利于内容被搜索引擎搜索到

解决方案：

- 1.服务端渲染

  服务器合成完整的 html 文件再输出到浏览器

- 2.页面预渲染

- 3.路由采用h5 history模式