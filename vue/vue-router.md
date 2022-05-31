# **vue**-router

[TOC]



### (一)基本使用

使用vue-router的步骤:

- 第一步: 创建路由组件

- 第二步: 配置路由映射: 组件和路径映射关系

- 第三步: 使用路由: 通过`<router-link>和<router-view>`



#### **简单案例**

##### **创建router实例**

![](E:\note\前端\笔记\vue\vue-router\使用1.png)



##### **挂载到Vue实例中**

![](E:\note\前端\笔记\vue\vue-router\使用2.png)



##### **步骤一：创建路由组件**

![](E:\note\前端\笔记\vue\vue-router\使用3.png)



##### **步骤二：**配置组件和路径的映射关系

![](E:\note\前端\笔记\vue\vue-router\使用4.png)



##### **步骤三：**使用路由.

![](E:\note\前端\笔记\vue\vue-router\使用5.png)

- `<router-link>`: 该标签是一个vue-router中已经内置的组件, 它会被渲染成一个`<a>`标签.

- `<router-view>`: 该标签会根据当前的路径, 动态渲染出不同的组件.

- 网页的其他内容, 比如顶部的标题/导航, 或者底部的一些版权信息等会和`<router-view>`处于同一个等级.

- 在路由切换时, 切换的是`<router-view>`挂载的组件, 其他内容不会发生改变.



##### **最终效果如下**

![](E:\note\前端\笔记\vue\vue-router\使用6.png)



### (二)细节处理

#### 1.路由重定向(redirect)

我们这里还有一个不太好的实现:

- 默认情况下, 进入网站的首页, 我们希望`<router-view>`渲染首页的内容.

- 但是我们的实现中, 默认没有显示首页组件, 必须让用户点击才可以.

如何可以让**路径**默认跳到到**首页**, 并且`<router-view>`渲染首页组件呢?

- 非常简单, 我们只需要配置多配置一个映射就可以了.

![](E:\note\前端\笔记\vue\vue-router\默认路径.png)

配置解析:

- 我们在routes中又配置了一个映射. 

- path配置的是根路径: /

- redirect是重定向, 也就是我们将根路径重定向到/home的路径下, 这样就可以得到我们想要的结果了.



#### 2.history模式

我们前面说过改变路径的方式有两种:

- URL的hash

- HTML5的history

- 默认情况下, 路径的改变使用的URL的hash.

如果希望使用HTML5的history模式, 非常简单, 进行如下配置即可:

![](E:\note\前端\笔记\vue\vue-router\history.png)



#### 3.router-link补充

在前面的`<router-link>`中, 我们只是使用了一个属性: to, 用于指定跳转的路径.

`<router-link>`还有一些**其他属性**:

- tag: tag可以指定`<router-link>`之后渲染成什么组件, 比如上面的代码会被渲染成一个`<li>`元素, 而不是`<a>`

- replace: replace不会留下history记录, 所以指定replace的情况下, 后退键返回不能返回到上一个页面中
- active-class: 当`<router-link>`对应的路由匹配成功时, 会自动给当前元素设置一个router-link-active的class, 设置active-class可以修改默认的名称.

​			在进行高亮显示的导航菜单或者底部tabbar时, 会使用到该类.

 			但是通常不会修改类的属性, 会直接使用默认的router-link-active即可. 

![](E:\note\前端\笔记\vue\vue-router\link补充.png)



#### 4.**路由代码跳转**

有时候, 页面的跳转可能需要执行对应的JavaScript代码, 这个时候, 就可以使用第二种跳转方式了

![](E:\note\前端\笔记\vue\vue-router\路由跳转.png)



#### 5.**动态路由**

在某些情况下，一个页面的path路径可能是不确定的，比如我们进入用户界面时，希望是如下的路径：

- /user/aaaa或/user/bbbb

- 除了有前面的/user之外，后面还跟上了用户的ID

- 这种path和Component的匹配关系，我们称之为动态路由(也是路由传递数据的一种方式)。

![](E:\note\前端\笔记\vue\vue-router\动态路由.png)

代码：

User组件：

```html
<template>
  <div>
    <h2>我是用户界面</h2>
    <p>我是用户的相关信息, 嘿嘿嘿</p>
    <h2>计算属性userId:{{userId}}</h2>
    <h2>$route.params.id:{{$route.params.id}}</h2>
    <button @click="btnClick">按钮</button>
  </div>
</template>
 
<script>
  export default {
    name: "User",
    computed: {
      userId() {
        return this.$route.params.id
      }
    },
    created() {
      console.log('User created');
    },
    destroyed() {
      console.log('User destroyed');
    },
    methods: {
      btnClick() {
        // 所有的组件都继承自Vue类的原型
        console.log(this.$router); // 是我们index.js创建的那个大的路由对象router
        console.log(this.$route); // 当前哪个路由处于活跃状态，获取到的就是哪个路由
 
        console.log(this.name);
      }
    }
  }
</script>
 
<style scoped>
 
</style>
```



router文件夹下index.js

```html
...
const routes = [
    ...
    {
        path:'/user/:id',
        component:User
    }
]
const router = new VueRouter({
    routes,
    mode:'history',
    linkActiveClass:'active'
})
export default router
```



App.vue 

```html
<template>
  <div id="app">
   
    <h2>我是APP组件</h2>
    <router-link to="/home">首页</router-link>
    <router-link to="/about">关于</router-link>
 
    <!-- 动态路由 -->
    <!--<router-link :to="/user/yyy">用户</router-link>-->
    <!-- 动态拼接 使用v-bind -->
     <router-link :to="'/user/'+userId">用户</router-link>
  </div>
</template>
 
<script>
export default {
  name: "App",
  components: {},
  data() {
    return {
      userId: "zhangsan"
    };
  },
};
</script>
```



### (三)**路由的懒加载**

官方给出了解释:

- 当打包构建应用时，Javascript 包会变得非常大，影响页面加载。

- 如果我们能把不同路由对应的组件分割成不同的代码块，然后当路由被访问的时候才加载对应组件，这样就更加高效了

官方在说什么呢?

- 首先, 我们知道路由中通常会定义很多不同的页面.

- 这个页面最后被打包在哪里呢? 一般情况下, 是放在一个js文件中.

- 但是, 页面这么多放在一个js文件中, 必然会造成这个页面非常的大.

- 如果我们一次性从服务器请求下来这个页面, 可能需要花费一定的时间, 甚至用户的电脑上还出现了短暂空白的情况.

- 如何避免这种情况呢? 使用路由懒加载就可以了.

路由懒加载做了什么?

- 路由懒加载的主要作用就是将路由对应的组件打包成一个个的js代码块.

- 只有在这个路由被访问到的时候, 才加载对应的组件



##### **懒加载的方式**

![](E:\note\前端\笔记\vue\vue-router\懒加载.png)



### (四)**嵌套路由**

<img src="E:\note\前端\笔记\vue\vue-router\嵌套路由.png" style="zoom:67%;" />

实现嵌套路由有两个步骤:

- 创建对应的子组件, 并且在路由映射中配置对应的子路由.

- 在组件内部使用`<router-view>`标签



步骤一：定义两个组件

![](E:\note\前端\笔记\vue\vue-router\嵌套路由1.png)



步骤二：

<img src="E:\note\前端\笔记\vue\vue-router\嵌套路由2.png"  />



步骤三：

![](E:\note\前端\笔记\vue\vue-router\嵌套路由3.png)



步骤四：

![](E:\note\前端\笔记\vue\vue-router\嵌套路由4.png)



### (五)**传递参数**

#### 参数分类

传递参数主要有两种类型: params和query

**params**的类型:

- 配置路由格式: /router/:id

- 传递的方式: 在path后面跟上对应的值

- 传递后形成的路径: /router/123, /router/abc

**query**的类型:

- 配置路由格式: /router, 也就是普通配置

- 传递的方式: 对象中使用query的key作为传递方式

- 传递后形成的路径: /router?id=123, /router?id=abc



#### **传递参数方式一**: `<router-link>`

![](E:\note\前端\笔记\vue\vue-router\传参1.png)



#### **传递参数方式二**: JavaScript代码

![](E:\note\前端\笔记\vue\vue-router\传参2.png)



#### **获取参数**

获取参数通过$route对象获取的.

- 在使用了 vue-router 的应用中，路由对象会被注入每个组件中，赋值为 this.$route ，并且当路由切换时，路由对象会被更新。

![](E:\note\前端\笔记\vue\vue-router\获取参数.png)



#### **$route**和**$router**

$route和$router是有区别的

- $router为VueRouter实例，想要导航到不同URL，则使用$router.push方法

- $route为当前router跳转对象里面可以获取name、path、query、params等 

![](E:\note\前端\笔记\vue\vue-router\vs.png)



### (六)**导航守卫**

#### 什么是导航守卫?

- vue-router提供的导航守卫主要用来监听监听路由的进入和离开的.

- vue-router提供了beforeEach和afterEach的钩子函数, 它们会在路由即将改变前和改变后触发.



#### 使用

我们可以利用beforeEach来完成标题的修改.

- 首先, 我们可以在钩子当中定义一些标题, 可以利用meta来定义

- 其次, 利用导航守卫,修改我们的标题.

![](E:\note\前端\笔记\vue\vue-router\导航守卫1.jpg)

![](E:\note\前端\笔记\vue\vue-router\导航守卫2.jpg)

导航钩子的三个参数解析:

- to: 即将要进入的目标的路由对象.

- from: 当前导航即将要离开的路由对象.

- next: 调用该方法后, 才能进入下一个钩子



### (七)**keep-alive**

keep-alive 是 Vue 内置的一个组件，可以使被包含的组件保留状态，或避免重新渲染。

- 它们有两个非常重要的属性:

​		 include - 字符串或正则表达，只有匹配的组件会被缓存

 		exclude - 字符串或正则表达式，任何匹配的组件都不会被缓存

router-view 也是一个组件，如果直接被包在 keep-alive 里面，所有路径匹配到的视图组件都会被缓存：

![](E:\note\前端\笔记\vue\vue-router\Keep-alive.png)

```html
<template>
  <div id="app">
    <!-- 导航守卫 keep-alive -->
    <router-link to="/home">首页</router-link>
    <router-link to="/about">关于</router-link>
 
    <!-- 在vue中我们可以使用keepalive来进行组件缓存 -->
    <keep-alive exclude="Profile,User">
      <router-view />
    </keep-alive>
  </div>
</template>
```

