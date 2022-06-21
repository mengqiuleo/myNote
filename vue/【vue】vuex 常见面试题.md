# 【vue】vuex常见面试题

[TOC]



## 一、vuex简介

![](./vue组间通讯/vuex.png)

### 对vuex的理解

Vuex实现了一个单向数据流，在全局拥有一个State存放数据，当组件要更改State中的数据时，必须通过Mutation进行，Mutation同时提供了订阅者模式供外部插件调用获取State数据的更新。而当所有异步操作(常见于调用后端接口异步获取更新数据)或批量的同步操作需要走Action，但Action也是无法直接修改State的，还是需要通过Mutation来修改State的数据。最后，根据State的变化，渲染到视图上。



### 各模块在流程中的功能：

- Vue Components：Vue组件。HTML页面上，负责接收用户操作等交互行为，执行dispatch方法触发对应action进行回应。
- dispatch：操作行为触发方法，是唯一能执行action的方法。
- actions：**操作行为处理模块,由组件中的`$store.dispatch('action 名称', data1)`来触发。然后由commit()来触发mutation的调用 , 间接更新 state**。可以定义异步函数，并在回调中提交mutation,就相当于异步更新了state中的字段
- commit：状态改变提交操作方法。对mutation进行提交，是唯一能执行mutation的方法。
- mutations：**状态改变操作方法，由actions中的`commit('mutation 名称')`来触发**。是Vuex修改state的唯一推荐方法。该方法只能进行同步操作，且方法名只能全局唯一。
- state：state中存放页面共享的状态字段
- getters：相当于当前模块state的计算属性



### Vuex实例应用

- 父组件

```vue
<template>
  <div id="app">
    <ChildA/>
    <ChildB/>
  </div>
</template>

<script>
  import ChildA from 'components/ChildA'
  import ChildB from 'components/ChildB'

  export default {
    name: 'App',
    components: {ChildA, ChildB}
  }
</script>
```

- 子组件ChildA

```vue
 <template>
  <div id="childA">
    <h1>我是A组件</h1>
    <button @click="transform">点我让B组件接收到数据</button>
    <p>{BMessage}}</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        AMessage: 'Hello，B组件，我是A组件'
      }
    },
    computed: {
      BMessage() {
        return this.$store.state.BMsg
      }
    },
    methods: {
      transform() {
        this.$store.commit('receiveAMsg', {
          AMsg: this.AMessage
        })
      }
    }
  }
</script>
```

- 子组件ChildB

```vue
<template>
  <div id="childB">
    <h1>我是B组件</h1>
    <button @click="transform">点我看A组件接收的数据</button>
    <p>{{AMessage}}</p>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        BMessage: 'Hello，A组件，我是B组件'
      }
    },
    computed: {
      AMessage() {
        return this.$store.state.AMsg
      }
    },
    methods: {
      transform() {
        this.$store.commit('receiveBMsg', {
          BMsg: this.BMessage
        })
      }
    }
  }
</script>
```

- vuex模块store.js

```vue
import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

const state = {
  // 初始化A和B组件的数据，等待获取
  AMsg: '',
  BMsg: ''
}

const mutations = {
  receiveAMsg(state, payload) {
    state.AMsg = payload.AMsg
  },
  receiveBMsg(state, payload) {
    state.BMsg = payload.BMsg
  }
}

export default new Vuex.Store({
  state,
  mutations
})
```



## 二、常见面试题

### 1.Vuex 为什么要分模块并且加命名空间

**模块**:由于使用单一状态树，应用的所有状态会集中到一个比较大的对象。当应用变得非常复杂时，store 对象就有可能变得相当臃肿。为了解决以上问题，Vuex 允许我们将 store 分割成模块（module）。每个模块拥有自己的 state、mutation、action、getter、甚至是嵌套子模块。



### 2.Vuex和单纯的全局对象有什么区别？

- Vuex 的状态存储是响应式的。当 Vue 组件从 store 中读取状态的时候，若 store 中的状态发生变化，那么相应的组件也会相应地得到高效更新。
- 不能直接改变 store 中的状态。改变 store 中的状态的唯一途径就是显式地提交 (commit) mutation。这样使得我们可以方便地跟踪每一个状态的变化，从而让我们能够实现一些工具帮助我们更好地了解我们的应用。



### 3.为什么 Vuex 的 mutation 中不能做异步操作？

- 每个mutation执行完成后都会对应到一个新的状态变更，这样devtools就可以打个快照存下来，然后就可以实现 time-travel 了。如果mutation支持异步操作，就没有办法知道状态是何时更新的，无法很好的进行状态的追踪，给调试带来困难。

- action 可以进行一系列的异步操作，并且通过提交 mutation 来记录 action 产生的副作用（即状态变更）



### 4.Vuex中 action 和 mutation 的区别

mutation中的操作是一系列的同步函数，用于修改state中的变量的的状态。它会接受 state 作为第一个参数，第二个参数是参数。

```vue
const store = new Vuex.Store({
  state: {
    count: 1
  },
  mutations: {
    increment (state) {
      state.count++      // 变更状态
    }
  }
})
```

当触发一个类型为 increment 的 mutation 时，需要调用此函数：

```javascript
increment: function() {
	this.$store.commit('increment')
}
```



而Action类似于mutation，不同点在于：

- Action 可以包含任意异步操作。
- Action 提交的是 mutation，而不是直接变更状态。

```vue
const store = new Vuex.Store({
  state: {
    count: 0
  },
  mutations: {
    increment (state) {
      state.count++
    }
  },
  actions: {
    increment (context) {
      context.commit('increment')
    }
  }
})
```

Action 函数接受一个与 store 实例具有相同方法和属性的 context 对象，因此你可以调用 context.commit 提交一个 mutation，或者通过 context.state 和 context.getters 来获取 state 和 getters。

在Vue组件中, 如果我们调用action中的方法, 那么就需要使用dispatch

```vue
methods: {
	increment() {
		this.$store.dispatch('increment',{cCount: 5})
	}
}
```



### 5.Vuex有哪几种属性？

有五种，分别是 State、 Getter、Mutations 、Actions、 Modules

- state => 基本数据(数据源存放地)
- getters => 从基本数据派生出来的数据
- mutations => 提交更改数据的方法，同步
- actions => 像一个装饰器，包裹mutations，使之可以异步。
- modules => 模块化Vuex


