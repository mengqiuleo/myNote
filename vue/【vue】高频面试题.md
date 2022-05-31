# 【vue】高频面试题

[TOC]



### 一、为什么 data 是一个函数

组件中的 data 写成一个函数，数据以函数返回值形式定义，这样每复用一次组件，就会返回一份新的 data，类似于给每个组件实例创建一个私有的数据空间，让各个组件实例维护各自的数据。而单纯的写成对象形式，就使得所有组件实例共用了一份 data，这样可能造成多处调用之间的**数据污染**



### 二、v-if 和 v-show 有何区别？

- v-if 在编译过程中会被转化成三元表达式,条件不满足时不渲染此节点。

- v-show 会被编译成指令，条件不满足时控制样式将对应节点隐藏 （display:none）
- v-if是惰性的，如果初始条件为假，则什么也不做；只有在条件第一次变为真时才开始局部编译; 
- v-show是在任何条件下，无论首次条件是否为真，都被编译，然后被缓存，而且DOM元素保留；

> v-if是动态的向DOM树内添加或者删除DOM元素；
>
> v-show是通过设置DOM元素的display样式属性控制显隐；

**使用场景**

v-if 适用于在运行时很少改变条件，不需要频繁切换条件的场景

v-show 适用于需要非常频繁切换条件的场景



### 三、v-for 为什么要加 key

如果不使用 key，Vue 会使用一种最大限度减少动态元素并且尽可能的尝试就地修改/复用相同类型元素的算法。key 是为 Vue 中 vnode 的唯一标记，通过这个 key，我们的 diff 操作可以更准确、更快速

**更准确**：因为带 key 就不是就地复用了，在 sameNode 函数 a.key === b.key 对比中可以避免就地复用的情况。所以会更加准确。

**更快速**：利用 key 的唯一性生成 map 对象来获取对应节点，比遍历方式更快



### 四、vue 常见内置指令

- v-text：更新元素的textContent
- v-html：更新元素的innerHTML--注意防止xss攻击
- v-show：根据表达式的值，切换元素的`display`属性，来控制元素的显隐
- v-if/v-else/v-else-if：可以配合template来使用，进行条件渲染
- v-for：列表循环渲染 数组，对象，字符串
- v-on：缩写是@，绑定事件
- v-bind：缩写是:，用于动态绑定各种变量
- v-model：双向绑定表单项的值
- v-slot：插槽
- v-once：元素和组件值渲染一次，首次渲染后，不再随数据的变化重新渲染
- v-pre：跳过这个元素和它的子元素的编译过程



### 五、vue常见修饰符

- `.lazy` 改变输入框的值时value不会改变。当光标离开输入框时，v-model绑定的值value才会改变
- `.stop` 阻止冒泡
- `.self` 只有点击事件绑定的本身才会触发事件
- `.once` 事件只执行一次
- `.prevent` 阻止默认事件（例如a标签的跳转）



### 六、computed 和 watch 的区别和运用的场景

- computed 是计算属性，依赖其他属性计算值，并且 computed 的值有缓存，只有当计算值变化才会返回内容，它可以设置 getter 和 setter

- watch 监听到值的变化就会执行回调，在回调中可以进行一些逻辑操作。watch 可以进行**异步操作**，

  - **当我们需要深度监听对象中的属性时，可以打开 deep：true 选项，这样便会对对象中的每一项进行监听**
  - 监听的函数接收两个参数，第一个参数是最新的值，第二个是变化之前的值
  - 监听数据必须是data中声明的或者父组件传递过来的props中的数据，当发生变化时，会触发其他操作，函数有两个的参数：
    - immediate：组件加载立即触发回调函数
    - deep：深度监听，发现数据内部的变化，在复杂数据类型中使用，例如数组中的对象发生变化。需要注意的是，deep无法监听到数组和对象内部的变化。
      

- **运用场景**：

  - 当我们需要进行数值计算，并且依赖于其它数据时，应该使用 computed，因为可以利用 computed 的缓存特性，避免每次获取值时，都要重新计算；
  - 当我们需要在数据变化时执行异步或开销较大的操作时，应该使用 watch，使用watch选项允许我们执行异步操作 ( 访问一个 API )，限制我们执行该操作的频率，并在我们得到最终结果前，设置中间状态。这些都是计算属性无法做到的。

  

### 七、Computed 和 Methods 的区别

对于最终的结果，两种方式是相同的

**不同点：**

- computed: 计算属性是基于它们的依赖进行缓存的，只有在它的相关依赖发生改变时才会重新求值；
- method 调用总会执行该函数。



### 八、slot 的使用

slot的用法可以分为三类，分别是**默认插槽、具名插槽和作用域插槽**

- 默认插槽：当slot没有指定name属性值的时候一个默认显示插槽，一个组件内只有有一个匿名插槽。
- 具名插槽：带有具体名字的插槽，也就是带有name属性的slot，一个组件可以出现多个具名插槽。
- 作用域插槽：默认插槽、具名插槽的一个变体，可以是匿名插槽，也可以是具名插槽，该插槽的不同点是在子组件渲染作用域插槽时，可以**将子组件内部的数据传递给父组件，让父组件根据子组件的传递过来的数据决定如何渲染该插槽**。

> 作用域插槽
>
> - **父组件替换插槽的标签，但是内容由子组件来提供**。
> - 样式父组件说了算，但内容可以显示子组件插槽绑定的data
> - **通过`slot-scope`获取子组件的信息，在内容中使用，并且支持解构赋值**

举例：

- 子组件：

内容可以显示子组件插槽绑定的data

```vue
<template>
	<div class="category">
		<h3>{{title}}分类</h3>
		<slot :games="games" msg="hello">我是默认的一些内容</slot>
	</div>
</template>

<script>
	export default {
		name:'Category',
		props:['title'],
		data() {
			return {
				games:['红色警戒','穿越火线','劲舞团','超级玛丽'],
			}
		},
	}
</script>

<style scoped>
	.category{
		background-color: skyblue;
		width: 200px;
		height: 300px;
	}
	h3{
		text-align: center;
		background-color: orange;
	}
	video{
		width: 100%;
	}
	img{
		width: 100%;
	}
</style>
```



- 父组件

```vue
<template>
	<div class="container">

		<Category title="游戏">
			<template scope="atguigu"> 此时atguigu里放的就是所有的数据
				<ul>
					<li v-for="(g,index) in atguigu.games" :key="index">{{g}}                       </li>
				</ul>
			</template>
		</Category>

		<Category title="游戏">
			<template scope="{games}"> 这里支持解构赋值
				<ol>
					<li style="color:red" v-for="(g,index) in games" :key="index">{{g}}</li>
				</ol>
			</template>
		</Category>

		<Category title="游戏">
			<template slot-scope="{games}">
				<h4 v-for="(g,index) in games" :key="index">{{g}}</h4>
			</template>
		</Category>

	</div>
</template>

<script>
	import Category from './components/Category'
	export default {
		name:'App',
		components:{Category},
	}
</script>

<style scoped>
	.container,.foot{
		display: flex;
		justify-content: space-around;
	}
	h4{
		text-align: center;
	}
</style>
```



效果：
![](E:\note\前端\笔记\vue\vue常见面试题\作用域插槽.jpg)

可以看到，内容是由子组件决定，样式由父组件决定。



### 九、nextTick的使用和原理

举例：

```vue
<div ref="testDiv">{{name}}</div>

name: 'pjy'

this.name = 'pan'
console.log(this.$refs.testDiv.innerHTML) // pjy

```

> Vue采用的是`异步更新`的策略，通俗点说就是，`同一事件循环内`多次修改，会`统一`进行一次`视图更新`

所以拿到的还是上一次的旧视图数据。

使用nextTick:

```
this.name = 'pan'
this.$nextTick(() => {
    console.log(this.$refs.testDiv.innerHTML) // pan
})
```

> nextTick：在修改数据之后立即使用这个方法，获取更新后的 DOM。
>
> - 在vue生命周期中，如果在created()钩子进行DOM操作，也一定要放在`nextTick()`的回调函数中。
>
> 因为在created()钩子函数中，页面的DOM还未渲染，这时候也没办法操作DOM，所以，此时如果想要操作DOM，必须将操作的代码放在`nextTick()`的回调函数中。

nextTick 的核心是利用了如 Promise 、MutationObserver、setImmediate、setTimeout的原生 JavaScript 方法来模拟对应的微/宏任务的实现，本质是为了利用 JavaScript 的这些异步回调任务队列来实现 Vue 框架中自己的异步回调队列。



### 十、scoped的作用

当一个style标签拥有scoped属性时，它的CSS样式就只能作用于当前的组件。通过设置该属性，使得组件之间的样式不互相污染。如果一个项目中的所有style标签全部加上了scoped，相当于实现了样式的模块化。

####  审查元素时发现data-v-xxxxx，这是啥？

![](E:\note\前端\笔记\vue\vue常见面试题\scoped.jpg)

> 这是在标记vue文件中css时使用scoped标记产生的，因为要保证各文件中的css不相互影响，给每个component都做了唯一的标记，所以每引入一个component就会出现一个新的'data-v-xxx'标记



### 十一、对 Vue 的理解

Vue 是一个构建数据驱动的渐进性框架，它的目标是通过 API 实现响应数据绑定和视图更新。

渐进式：通俗点讲就是，你想用啥你就用啥，咱也不强求你。你想用component就用，不用也行，你想用vuex就用，不用也可以。

优点：渐进式，组件化，轻量级，虚拟dom，响应式，单页面路由，数据与视图分开

缺点：单页面不利于seo，不支持IE8以下，首屏加载时间长



### 十二、v-model 是如何实现的

> v-model 只是一个语法糖，
>
> 本质是：v-model = v-bind(:value属性) + v-on(@input属性)
>
> input事件是DOM原生的事件，类似于 click，change事件

#### （1）作用在表单元素上

动态绑定了 input 的 value 指向了 messgae 变量，并且在触发 input 事件的时候去动态把 message设置为目标值：

```vue
<template>
  <div id="app">
    <p>{{text}}</p>
    <!-- <input type="text" v-model="text"> -->

    <!-- 自己实现v-model -->
    <input 
      type="text"
      :value="text"
      @input="handleInput">
  </div>
</template>

<script>
export default {
  name: 'App',
  data(){
    return{
      text:"v-model原理"
    }
  },
  methods: {
    handleInput(e){
      this.text = e.target.value
    } 
  },
}
</script>

<style></style>

```

这里对于handleInput函数有简写形式

第二种写法（简写）

```vue
	<input 
      type="text"
      :value="text"
      @input="(e) => (text = e.target.value)">
```



#### （2）作用在组件上

**本质是一个父子组件通信的语法糖，通过 prop 和 $.emit 实现。**

默认情况下，一个组件上的v-model 会把 value 用作 prop且把 input 用作 event。

**具体实现：**

js 监听input 输入框输入数据改变，用 @input，数据改变以后就会立刻触发这个事件。通过input事件把数据 $emit 出去，再父组件接受。父组件设置v-model的值为input `$emit`过来的值。

```vue
// 父组件
<aa-input v-model="aa"></aa-input>
// 等价于
<aa-input v-bind:value="aa" v-on:input="aa=$event.target.value"></aa-input>
//$event 指代当前触发的事件对象;
//$event.target 指代当前触发的事件对象的dom;
//$event.target.value 就是当前dom的value值;



// 子组件：
<input v-bind:value="aa" v-on:input="onmessage"></aa-input>

props:{value:aa,}
methods:{
    onmessage(e){
        $emit('input',e.target.value)
    }
}

```



### 十三、为什么 v-for 和 v-if 不建议用在一起

> `v-for`优先级是高于`v-if`的

因为解析时先解析 v-for 再解析 v-if。如果遇到需要同时使用时可以考虑写成计算属性的方式。

- 当 v-for 和 v-if 处于同一个节点时，v-for 的优先级比 v-if 更高，这意味着 v-if 将分别重复运行于每个 v-for 循环中。如果要遍历的数组很大，而真正要展示的数据很少时，这将造成很大的性能浪费
- 这种场景建议使用 computed，先对数据进行过滤

举例：

```vue
<div v-for="item in [1, 2, 3, 4, 5, 6, 7]" v-if="item !== 3">
    {{item}}
</div>
```

会先把7个元素都遍历出来，然后再一个个判断是否为3，并把3给**隐藏掉**，这样的坏处就是，渲染了无用的3节点，增加无用的dom操作，建议使用computed来解决这个问题：

```vue
<div v-for="item in list">
    {{item}}
</div>

computed() {
    list() {
        return [1, 2, 3, 4, 5, 6, 7].filter(item => item !== 3)
    }
  }
```

