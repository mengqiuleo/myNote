# vuex

[TOC]



![](E:\note\前端\笔记\vue\vuex\vuex.png)

## (一)简单案例

1.首先，我们需要在某个地方存放我们的Vuex代码：

- 这里，我们先创建一个文件夹store，并且在其中创建一个index.js文件

- 在index.js文件中写入如下代码：

  ![](E:\note\前端\笔记\vue\vuex\案例1.png)

  

  2.其次，我们让所有的Vue组件都可以使用这个store对象

  - 来到main.js文件，导入store对象，并且放在new Vue中

  - 这样，在其他Vue组件中，我们就可以通过this.$store的方式，获取到这个store对象了

![](E:\note\前端\笔记\vue\vuex\案例2.png)

3.使用

在其他组件中使用store对象中保存的状态即可

- 通过this.$store.state.属性的方式来访问状态

- 通过this.$store.commit('mutation中方法')来修改状态

![](E:\note\前端\笔记\vue\vuex\案例3.png)



## (二)五个核心概念

Vuex有几个比较核心的概念: State，Getters，Mutation，Action，Module



### Ⅰ**Getters**基本使用

1. 有时候，我们需要从store中获取一些state变异后的状态，比如下面的Store中：

​	获取学生年龄大于20的个数。

![](E:\note\前端\笔记\vue\vuex\getters.png)



- 可以用computed计算属性，但是这样的话，代码不好复用，其他组件使用不方便 

​		![](E:\note\前端\笔记\vue\vuex\getters1.png)

- 我们可以在Store中定义getters

  ![](E:\note\前端\笔记\vue\vuex\getters2.png)



2.Getters作为参数和传递参数

​	如果我们已经有了一个获取所有年龄大于20岁学生列表的getters, **并且我们想获取该列表的长度，**那么代码可以这样来写

![](E:\note\前端\笔记\vue\vuex\getters3.png)

getters里面的方法 也会有state参数。

getters 也可以接受其他 getters 作为第二个参数。



3. getters默认是不能传递参数的, 如果希望传递参数, 那么只能让getters本身返回另一个函数

   比如上面的案例中,我们希望根据ID获取用户的信息

![](E:\note\前端\笔记\vue\vuex\getters4.png)



```html
 <h2>----------App内容: getters相关信息----------</h2>
 
    <h2>{{ $store.getters.powerCounter }}</h2>
    <h2>{{ $store.getters.more20stu }}</h2>
    <h2>{{ $store.getters.more20stuLength }}</h2>
    <h2>{{ $store.getters.moreAgeStu(12) }}</h2>
```



### Ⅱ **Mutation**状态更新

Vuex的store状态的更新唯一方式：**提交Mutation**

#### 1.状态更新

- mutation的定义方式

```html
mutations: {
	increment(state) {
		state.count++;
	},
	
	//有参数
	increamentCount(state,payload) {
		state.count += payload.count
	}
}

```

- 通过mutation更新 

![](E:\note\前端\笔记\vue\vuex\mutation.png)



#### 2.**传递参数**

在通过mutation更新数据的时候, 有可能我们希望携带一些**额外的参数**

​	参数被称为是mutation的载荷(Payload)

![](E:\note\前端\笔记\vue\vuex\参数1.png)

![](E:\note\前端\笔记\vue\vuex\参数2.png)

但是如果参数不是一个呢?

- 比如我们有很多参数需要传递.

- 这个时候, 我们通常会以对象的形式传递, 也就是payload是一个对象.

- 这个时候可以再从对象中取出相关的信息.

![](E:\note\前端\笔记\vue\vuex\参数3.png)

![](E:\note\前端\笔记\vue\vuex\参数4.png)

整体代码

```html
// template... 
  <!-- mutation传递参数 -->
    <button @click="addCount(5)">+5</button>
    <button @click="addCount(10)">+10</button>
    <button @click="addStudent">添加学生</button>
// ...
 
// methods
     addCount(count) {
      // payload: 负载
      // 1.普通的提交封装 这样写的 mutations里的 incrementCount(state, count) 的count就是count
       this.$store.commit('incrementCount', count) // 单个参数
    },
```



#### 3.提交风格

上面的通过**commit**进行提交是一种普通的方式

Vue还提供了另外一种风格, 它是一个**包含type属性的对象**,(下面是vue代码)

![](E:\note\前端\笔记\vue\vuex\提交风格.png)

Mutation中的处理方式是将整个commit的对象作为payload使用, 所以代码没有改变, 依然如下:（下面是mutation代码）

![](E:\note\前端\笔记\vue\vuex\提交风格1.png)



### Ⅲ action

- 我们强调, 不要再Mutation中进行异步操作.
  - 但是某些情况, 我们确实希望在Vuex中进行一些异步操作, 比如网络请求, 必然是异步的.这个时候怎么处理呢?
  - Action类似于Mutation, 但是是用来代替Mutation进行异步操作的.

<img src="E:\note\前端\笔记\vue\vuex\action.png" style="zoom:67%;" />

context是什么?

- context是和store对象具有相同方法和属性的对象.

- 也就是说, 我们可以通过context去进行commit相关的操作, 也可以获取context.state等.



在Vue组件中, 如果我们调用action中的方法, 那么就需要使用dispatch

<img src="E:\note\前端\笔记\vue\vuex\action1.png" style="zoom:67%;" />



### Ⅳ module

Module是模块的意思, 为什么在Vuex中我们要使用模块呢?

- Vue使用单一状态树,那么也意味着很多状态都会交给Vuex来管理.
- 当应用变得非常复杂时,store对象就有可能变得相当臃肿.
- 为了解决这个问题, Vuex允许我们将store分割成模块(Module), 而每个模块拥有自己的state、mutations、actions、getters等

<img src="E:\note\前端\笔记\vue\vuex\module.png" style="zoom:75%;" />

上面的代码中, 我们已经有了整体的组织结构, 下面我们来看看具体的局部模块中的代码如何书写.

- 我们在moduleA中添加state、mutations、getters

- mutation和getters接收的第一个参数是局部状态对象

![](E:\note\前端\笔记\vue\vuex\module1.png)

![](E:\note\前端\笔记\vue\vuex\module2.png)

注意:

- 虽然, 我们的doubleCount和increment都是定义在对象内部的.

- 但是在调用的时候, 依然是通过this.$store来直接调用的.



**module中actions的写法**

接收一个context参数对象

- 局部状态通过 context.state 暴露出来，根节点状态则为 context.rootState

![](E:\note\前端\笔记\vue\vuex\module3.png)

- 如果getters中也需要使用全局的状态, 可以接受更多的参数

![](E:\note\前端\笔记\vue\vuex\module4.png)