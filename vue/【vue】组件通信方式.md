## 【vue】组件间六种通信方式

[TOC]



### 1.props 和 $emit

**使用props，父组件向子组件传递数据**

父组件vue模板father.vue

```vue
<template>
    <child :msg="message"></child>
</template>

<script>

import child from './child.vue';

export default {
    components: {
        child
    },
    data () {
        return {
            message: 'father message';
        }
    }
}
</script>
```

子组件vue模板child.vue

```vue
<template>
    <div>{{msg}}</div>
</template>

<script>
export default {
    props: {
        msg: {
            type: String,
            required: true
        }
    }
}
</script>
```



**子组件通过$emit触发事件，回调给父组件。**

父组件vue模板father.vue

```vue
<template>
    <child @msgFunc="func"></child>
</template>

<script>

import child from './child.vue';

export default {
    components: {
        child
    },
    methods: {
        func (msg) {
            console.log(msg);
        }
    }
}
</script>
```

子组件vue模板child.vue

```vue
<template>
    <button @click="handleClick">点我</button>
</template>

<script>
export default {
    props: {
        msg: {
            type: String,
            required: true
        }
    },
    methods () {
        handleClick () {
            //........
            this.$emit('msgFunc');
        }
    }
}
</script>
```

当子组件发生点击事件时，通过$emit触发事件，

父组件接收到自定义事件，然后执行回调的事件func,`@msgFunc="func"`。



### 2.$emit 和 $on

**这种方法通过一个空的Vue实例作为中央事件总线（事件中心），用它来触发事件和监听事件,巧妙而轻量地实现了任何组件间的通信，包括父子、兄弟、跨级**。当我们的项目比较大时，可以选择更好的状态管理解决方案vuex。

$on方法用来监听一个事件。

$emit用来触发一个事件。



- 首先创建一个vue的空白实例

```vue
import Vue from 'vue'
export default new Vue()
```

- 子组件A

把组件A通过$emit传到那个Vue空白实例里面

```vue
<template>
    <div>
        <span>A组件->{{msg}}</span>
        <input type="button" value="把a组件数据传给b" @click ="send">
    </div>
</template>
<script>
import vmson from "util/emptyVue"
export default {
    data(){
        return {
            msg:{
                a:'666',
                b:'999'
            }
        }
    },
    methods:{
        send:function(){
            vmson.$emit("aevent",this.msg)
        }
    }
}
</script>
```

- 子组件B

组件B通过$on去监听vmson实例中的自定义方法aevent

```vue
<template>
 <div>
    <span>{{msg}}</span>
 </div>
</template>
<script>
      import vmson from "util/emptyVue"
      export default {
         data(){
                return {
                    msg:""
                }
            },
         mounted(){
                vmson.$on("aevent",(val)=>{//监听aevent事件
                    console.log(val);//打印出来结果
                    this.msg = val;
                })
          }
    }
</script>
```

- 父组件

这个父组件就是把A、B两个组件放在父组件中注册渲染

```vue
<template>
     <div>
      <childa></childa>
      <childb></childb>    
     </div>
</template>
<script>
   import childa from './childa.vue';
   import childb from './childb.vue';
   export default {
    components:{
        childa,
        childb
    },
    data(){
        return {
            msg:""
        }
    },
    methods:{
       
    }
   }
</script>
```



### 3.Vuex

![](E:\note\前端\笔记\vue\vue组间通讯\vuex.png)

Vuex实现了一个单向数据流，在全局拥有一个State存放数据，当组件要更改State中的数据时，必须通过Mutation进行，Mutation同时提供了订阅者模式供外部插件调用获取State数据的更新。而当所有异步操作(常见于调用后端接口异步获取更新数据)或批量的同步操作需要走Action，但Action也是无法直接修改State的，还是需要通过Mutation来修改State的数据。最后，根据State的变化，渲染到视图上。


简要介绍各模块在流程中的功能：

- Vue Components：Vue组件。HTML页面上，负责接收用户操作等交互行为，执行dispatch方法触发对应action进行回应。
- dispatch：操作行为触发方法，是唯一能执行action的方法。
- actions：**操作行为处理模块,由组件中的`$store.dispatch('action 名称', data1)`来触发。然后由commit()来触发mutation的调用 , 间接更新 state**。可以定义异步函数，并在回调中提交mutation,就相当于异步更新了state中的字段
- commit：状态改变提交操作方法。对mutation进行提交，是唯一能执行mutation的方法。
- mutations：**状态改变操作方法，由actions中的`commit('mutation 名称')`来触发**。是Vuex修改state的唯一推荐方法。该方法只能进行同步操作，且方法名只能全局唯一。
- state：state中存放页面共享的状态字段
- getters：相当于当前模块state的计算属性


**Vuex实例应用**

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



### 4.$attrs 和 $listeners

A(父) --> B --> C(子)

如果A是B组件的父组件，B是C组件的父组件。如果想要组件A给组件C传递数据，这种隔代的数据。

> `$attrs / $listeners`，实现组件之间的跨代通信。
>
> `$attrs`与`$listeners` 是两个对象，
>
> - `$attrs` 里存放的是父组件中绑定的非 Props 属性，
> - `$listeners`里存放的是父组件中绑定的非原生事件。

举例：

这里使用三个组件，父组件，子组件，孙子组件

1.父组件

```vue
<template>
  <div>
    <h1>父亲</h1>
    <p>姓名：{{name}}</p>
    <p>年龄：{{age}}</p>
      <!-- 这里将父组件身上的属性和方法传递给了子组件 -->
    <Child :name="name" :age="age" @changeName="changeName"></Child>
  </div>
</template>

<script>
import Child from "./Child.vue";

export default {
  name:"Parent", 
  components:{
    Child
  },
  data() {
    return {
      name:"pjy",
      age:20
    };
  },
  methods: {
    changeName(){
      this.name = "Pan"
    }
  },
}
</script>
```

2.子组件

```vue
<template>
  <div>
    <h1>孩子</h1>
      <!-- $listeners 和 $attrs 用来获取父组件身上的属性和方法 -->
    <button @click="$listeners.changeName">按钮</button>
    <GrandChild v-bind="$attrs"></GrandChild>
      <!-- 这里将父组件身上的 $attrs 向下传递给了孙子组件 -->
  </div>
</template>

<script>
import GrandChild from "./GrandChild.vue"
export default {
  name: 'MySelect',
  components:{
    GrandChild
  }
}
</script>
```

3.孙子组件

```vue
<template>
  <div>
    <h1>孙子</h1>
    <p>姓名：{{$attrs.name}}</p>
    <p>年龄：{{$attrs.age}}</p>
  </div>
</template>

<script>
export default {
  name:"GrandChild",

}
</script>
```



### 5.$parent / $children 与 ref

- `ref`：如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例
- `$parent` / `$children`：访问父 / 子实例



#### （1）$parent / $children

父组件：

```vue
<template>
  <div>
    <h1>父亲</h1>
    <p>{{message}}</p>
    <button @changeName="changeChildNumber">按钮</button>
    <Child />
  </div>
</template>

<script>
import Child from "./Child.vue";

export default {
  name:"Parent", 
  components:{
    Child
  },
  data() {
    return {
      message: "hello world"
    };
  },
  methods: {
    changeChildNumber(){
        <!-- 父组件通过 $children 来访问子组件的值 -->
      this.$children[0].number = 50
    }
  },
}
</script>
```

子组件：

```vue
<template>
  <div>
    <h1>孩子</h1>
    <p>{{number}}</p>
    <p>获取父组件的值：{{parentMessage}}</p>
  </div>
</template>

<script>
export default {
  name: 'Child',
  data() {
    return {
      number: 10
    }
  },
  computed:{
    parentMessage(){
        <!-- 子组件通过 $parent 来访问父组件的值 -->
      return this.$parent.message
    }
  }
}
</script>
```



#### （2）ref

`ref`：如果在普通的 DOM 元素上使用，引用指向的就是 DOM 元素；如果用在子组件上，引用就指向组件实例

```vue
// component-a 子组件
export default {
  data () {
    return {
      title: 'Vue.js'
    }
  },
  methods: {
    sayHello () {
      window.alert('Hello');
    }
  }
}
```

```vue
// 父组件
<template>
  <component-a ref="comA"></component-a>
</template>
<script>
  export default {
    mounted () {
      const comA = this.$refs.comA;
      console.log(comA.title);  // Vue.js
      comA.sayHello();  // 弹窗
    }
  }
</script>
```



### 6.provide/inject

祖先组件中通过provider来提供变量，然后在孙组件中通过inject来注入变量

它的使用场景，主要是子组件获取上级组件的状态

举例：

父组件

```vue
// 父组件
export default {
  provide: {
    name: 'pjy'
  }
}
```

```vue
// 子组件
export default {
  inject: ['name'],
  mounted () {
    console.log(this.name);  // pjy
  }
}
```

可以看到，

在 父组件 里，我们设置了一个 **provide: name**，值为 pjy，它的作用就是将 **name** 这个变量提供给它的所有子组件。

而在 子组件 中，通过 `inject` 注入了从 父组件 中提供的 **name** 变量，那么在 子组件 中，就可以直接通过 **this.name** 访问这个变量了，它的值也是 pjy。这就是 provide / inject API 最核心的用法。



### 总结：

常见使用场景可以分为三类：

- 父子通信：

  - 父向子传递数据是通过 props，子向父是通过 events（`$emit`）；

  - 通过父链 / 子链也可以通信（`$parent` / `$children`）；

  - ref 也可以访问组件实例；

  - provide / inject API；

  - $attrs/$listeners 用于父组件传给子组件或孙组件

- 兄弟通信：

Bus；Vuex

- 跨级通信：

Bus；Vuex；provide / inject API、`$attrs/$listeners`


