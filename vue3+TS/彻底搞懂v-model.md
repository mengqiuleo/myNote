# 彻底搞懂v-model

[TOC]



## 双向数据绑定

vue还有一个原理叫**响应式原理**，响应式原理就是Observer,Dep,Watcher...在这里不会详细解释。

而双向数据绑定通常是指我们使用的`v-model`指令的实现，是`Vue`的一个特性，也可以说是一个`input`事件和`value`的语法糖。 `Vue`通过`v-model`指令为组件添加上`input`事件处理和`value`属性的赋值。

其实双向数据绑定的实现是基于响应式原理，具体实现是在compile中添加了对v-model指令的解析，类似于解析文本，{{}}，子节点...

```js
// 以下代码存在于compile.js文件中
// 解析v-model 指令
  compileModel: function (node, vm, exp, dir) {
      var self = this;
      var val = this.vm[exp];
      this.modelUpdater(node, val);
      new Watcher(this.vm, exp, function (value) {
          self.modelUpdater(node, value);
      });

      node.addEventListener('input', function(e) { //监听input输入事件
          var newValue = e.target.value;
          if (val === newValue) {
              return;
          }
          self.vm[exp] = newValue; //更新值
          val = newValue;
      });
  },
```

双向数据绑定的实现是基于响应式原理，我们首先对数据进行劫持，当属性值发生变化时，observer是可以知道的然后通知dep，dep再通知watcher。

而对于v-model，在我们编译模板时，会针对v-model进行解析：如果发现当前节点有v-model(eg: v-model='str')，那就会监听input事件，当str的值发生变化时，会将用户输入的值赋值到str属性上，此时相当于属性值发生变化，observer就会检测到值的变化，那就会通知到dep，然后dep通知到watcher.





## `input`事件和`value`的语法糖

`v-model`实际上是`v-on`和`v-bind`的语法糖。

目前咱们习惯性的写法是这样的:

```js
<input v-model="val" type="text">
```

但是实质上的完整写法:

```js
<input :value="val"  @input="val=$event.target.value" />
```

要理解这行代码，首先你要知道 input 元素本身有个input 事件，这是 HTML5 新增加的，类似 onchange ，每当输入框内容发生变化，就会触发 input 事件，把最新的value值传给传递给val ,完成双向数据绑定的效果 。



实现v-model：

**使用v-bind 获取value v-on绑定input触发事件**

```vue
<template>
  <input :value="value" @input="handleChange" />
</template>
<script>
  export default {
    components: { input },
    data () {
      return {
        value: "我文本框里的vaLue值"
      }
    },
    methods: {
      handleChange (val) {
        this.value = val;
      }
    }
  }
</script>
```



## v-model的副作用

`v-model` 不仅仅是语法糖，它还有副作用。

副作用如下：**如果 `v-model` 绑定的是响应式对象上某个不存在的属性，那么 `vue` 会悄悄地增加这个属性，并让它响应式。**

举个例子，看下面的代码：

```javascript
// template中：
<el-input v-model="user.tel"></el-input>
// script中：
export default {
  data() {
    return {
      user: {
        name: '公众号: 前端要摸鱼',
      }
    }
  }
}
复制代码
```

响应式数据中没有定义 `user.tel` 属性，但是 `template` 里却用 `v-model` 绑定了 `user.tel`，猜一猜当你输入时会发生什么？

 `user` 上会新增 `tel` 属性，并且 `tel` 这个属性还是**响应式**的。





## v-model 是双向绑定还是单向数据流？

v-model是双向数据绑定，也是单向数据流。

- 什么是单项数据流？
  子组件不能改变父组件传递给它的 `prop` 属性，推荐的做法是它抛出事件，通知父组件自行改变绑定的值。
- `v-model` 的做法是怎样的？
  `v-model` 做法完全符合单项数据流。甚至于，它给出了一种在命名和事件定义上的规范。





## 在组件中使用v-model

我们的自定义组件：

```vue
<tempalte>
  <div class="count" @click="addCount">click me {{value}}</div>
</template>
<script>
export default{
      props:{
       //关键的第一步：设置一个value属性
        value:{
          type:Number,
          default:0
        }
      },
      watch:{
        //监听value变化，更新组件localvalue状态
        value(v){
          this.localvalue=v;
        }  
      },
      methods:{
        //关键的第二步：事件触发localvalue变更，通过事件同步父组件状态变更
        addCount(){
           this.localvalue++;
           this.$emit('input',this.localvalue);
        }
      },
      data(){
        return{
          //组件状态，遵守单项数据流原则，不直接修改props中的属性
          localvalue:0
        }
      },
      created(){
        //初始化获取value值
        this.localvalue=this.value;
      }
    }
</script>
```

上面的组件定了我们通过在`props`中接收父组件的`value`属性，为了遵守单项数据流原则，不直接修改props中的属性，我们创建一个属于子组件的属性localvalue，并且将父组件的value属性的值传给我们自定义属性localvalue。在值更新时触发`input`事件，此时就会向父组件中emit事件`this.$emit('input',this.localvalue)`。

父组件：

```vue
<template>
  <add-one v-model="count"></add-one>
  <span>父组件{{count}}</span>
</tempalte>
<script>
export default{
  data() {
    return {
       count: 0,
    };
  },
  methods: {
  },
  created(){   
  }
}
</script>
```

针对于`input`的`v-model`双向数据绑定实际上就是通过子组件中的`$emit`方法派发`input`事件，父组件监听`input`事件中传递的值，并存储在父组件`data`中；然后父组件再通过`prop`的形式传递给子组件,在子组件中绑定`input`的`value`属性。

上面的父子组件传值，实际上也是用了：绑定value属性和触发input事件。

当然我们也可以不使用`value`和`input`事件这样的组合，

👉[vue官方文档关于v-model的说明](https://v2.cn.vuejs.org/v2/api/#model)

- 允许一个自定义组件在使用 `v-model` 时定制 prop 和 event。默认情况下，一个组件上的 `v-model` 会把 `value` 用作 prop 且把 `input` 用作 event，但是一些输入类型比如单选框和复选框按钮可能想使用 `value` prop 来达到不同的目的。使用 `model` 选项可以回避这些情况产生的冲突。

- 自定义model使用示例

  ```js
  model: {
      prop: 'myValue', // 默认是value
      event: 'myInput', // 默认是input
  },
  ```

当我们使用model的默认值的时候value作prop，input作event时，可以省略不写model。

**v-model的使用**。在父组件中使用自定义组件，例如

```html
<custom-model v-model="myValue"></custom-model>
```



改写上面的父子组件：
自定义子组件：

```vue
<tempalte>
  <div class="count" @click="addCount">click me {{value}}</div>
</template>
<script>
export default{
      //这里做了一个value和event的映射
      model:{
        value:'count',
        event:'change'
      },
      props:{
       //关键的第一步：设置一个value属性
        count:{
          type:Number,
          default:0
        }
      },
      methods:{
        //关键的第二步：事件触发localvalue变更，通过事件同步父组件状态变更
        addCount(){
           this.localvalue++;
           this.$emit('change',this.localvalue);
        }
      },
}
</script>
```

父组件：

```vue
<template>
	<add-one v-model="count"></add-one> //另一种写法，实现效果与下面的效果相同
   <add-one @change='onChange' :count='count'></add-one>
   <span>{{count}}</span>
</template>
<script>
  export default{
    data(){
      return {
        count:0,
      }
    },
    methods:{
      onChange(v){
         this.count=v;
         console.log(this.count)
      }
    }
  }
</script>
```



## 拓展：.sync修饰符

在有些情况下，我们可能需要对一个 prop 进行“双向绑定”。不幸的是，真正的双向绑定会带来维护上的问题，因为子组件可以变更父组件，且在父组件和子组件两侧都没有明显的变更来源。

> 我们需要遵循单项数据流的原则，对于从父组件中传过来的prop属性不做修改，而是使用一个自定义属性承接prop的属性，并对我们的自定义属性进行修改。

这也是为什么我们推荐以 `update:myPropName` 的模式触发事件取而代之。举个例子，在一个包含 `title` prop 的假设的组件中，我们可以用以下方法表达对其赋新值的意图：

```
this.$emit('update:title', newTitle)
```

然后父组件可以监听那个事件并根据需要更新一个本地的数据 property。例如：

```
<text-document
  v-bind:title="doc.title"
  v-on:update:title="doc.title = $event"
></text-document>
```

为了方便起见，我们为这种模式提供一个缩写，即 `.sync` 修饰符：

```
<text-document v-bind:title.sync="doc.title"></text-document>

也等价于

<text-document :title.sync="doc.title"></text-document>
```

> 注意带有 `.sync` 修饰符的 `v-bind` **不能**和表达式一起使用 (例如 `v-bind:title.sync=”doc.title + ‘!’”` 是无效的)。取而代之的是，你只能提供你想要绑定的 property 名，类似 `v-model`。

当我们用一个对象同时设置多个 prop 的时候，也可以将这个 `.sync` 修饰符和 `v-bind` 配合使用：

```
<text-document v-bind.sync="doc"></text-document>
```

这样会把 `doc` 对象中的每一个 property (如 `title`) 都作为一个独立的 prop 传进去，然后各自添加用于更新的 `v-on` 监听器。

> 将 `v-bind.sync` 用在一个字面量的对象上，例如 `v-bind.sync=”{ title: doc.title }”`，是无法正常工作的，因为在解析一个像这样的复杂表达式的时候，有很多边缘情况需要考虑。



补充：

假设上面的doc对象为：

```
doc:{
	name: zs,
	age: 18
}
```

那么：

在父组件中使用 text-documnet子组件：

```
<text-document v-bind.sync="doc"></text-document>
```

就等价于：

```
<text-document :name.sync="doc.name" :age.sync="doc.age"></text-document>
```



总结：

.sync原理：

- 给子组件传递props，子组件接收props，并且在标签的合适位置
- 子组件在恰当时机，派发名`this.$emit('update:propName',新值)`
- 父组件内，sync修饰符会自动监听`@update:propName`事件，并把接收到的最新的值

父组件中并没有定义过`update`事件，但是却可以完成`prop`属性`page`的修改，这就是`sync`语法糖的作用。





## v-model 在 Vue2 和 Vue3 中的区别

在vue3中，

```
<input v-model="searchText" />
```

上面的代码其实等价于下面这段 (编译器会对 `v-model` 进行展开)：

```
<input
  :value="searchText"
  @input="searchText = $event.target.value"
/>
```

而当**使用在一个组件上**时，`v-model` 会被展开为如下的形式：

```vue
<!-- 在父组件中引用CustomInput子组件 -->
<CustomInput
  :modelValue="searchText"
  @update:modelValue="newValue => searchText = newValue"
/>
```

要让这个例子实际工作起来，`<CustomInput>` 组件内部需要做两件事：

1. 将内部原生 `input` 元素的 `value` attribute 绑定到 `modelValue` prop
2. 输入新的值时在 `input` 元素上触发 `update:modelValue` 事件

这里是相应的代码：

```vue
<!-- 子组件CustomInput.vue -->
<script setup>
defineProps(['modelValue'])
defineEmits(['update:modelValue'])
</script>

<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
  />
</template>
```

现在 `v-model` 也可以在这个父组件上正常工作了：

```vue
<!-- 在父组件中引用子组件 -->
<CustomInput v-model="searchText" />

等价于：
<CustomInput
  :modelValue="searchText"
  @update:modelValue="newValue => searchText = newValue"
/>
```

另一种在组件内实现 `v-model` 的方式是使用一个可写的，同时具有 getter 和 setter 的计算属性。`get` 方法需返回 `modelValue` prop，而 `set` 方法需触发相应的事件：

```vue
<!-- 子组件CustomInput.vue -->
<script setup>
import { computed } from 'vue'

const props = defineProps(['modelValue'])
const emit = defineEmits(['update:modelValue'])

const value = computed({
  get() {
    return props.modelValue
  },
  set(value) {
    emit('update:modelValue', value)
  }
})
</script>

<template>
  <input v-model="value" />
</template>
```



### `v-model` 的参数

默认情况下，`v-model` 在组件上都是使用 `modelValue` 作为 prop，并以 `update:modelValue` 作为对应的事件。我们可以通过给 `v-model` 指定一个参数来更改这些名字：

```
<MyComponent v-model:title="bookTitle" />
```

在这个例子中，子组件应声明一个 `title` prop，并通过触发 `update:title` 事件更新父组件值：

在这个例子中，子组件应声明一个 `title` prop，并通过触发 `update:title` 事件更新父组件值：

```vue
<!-- MyComponent.vue -->
<script setup>
defineProps(['title'])
defineEmits(['update:title'])
</script>

<template>
  <input
    type="text"
    :value="title"
    @input="$emit('update:title', $event.target.value)"
  />
</template>
```





### 多个 `v-model` 绑定

我们可以在一个组件上创建多个 `v-model` 双向绑定，每一个 `v-model` 都会同步不同的 prop：

```vue
// 在父组件中引入子组件
<UserName
  v-model:first-name="first"
  v-model:last-name="last"
/>
```



对应的子组件：

```vue
<script setup>
defineProps({
  firstName: String,
  lastName: String
})

defineEmits(['update:firstName', 'update:lastName'])
</script>

<template>
  <input
    type="text"
    :value="firstName"
    @input="$emit('update:firstName', $event.target.value)"
  />
  <input
    type="text"
    :value="lastName"
    @input="$emit('update:lastName', $event.target.value)"
  />
</template>
```



### 废除 model 选项和 .sync 修饰符

Vue3 中移除了 `model` 选项，这样就不可以在组件内修改默认 prop 名了。现在有一种更简单的方式，就是直接在 `v-model` 后面传递要修改的 prop 名：

```html
// 要修改默认 prop 名，只需在 v-model 后面接上 :propName，例如修改为 title
<my-input v-model:title="msg"></my-input>

// 等同于
<my-input :title="msg" @update:title="msg = $event"></my-input>
```

注意组件内部也要修改 props：

```html
<template>
  <div>
    <input
      type="text"
      :value="title"
      @input="$emit('update:title', $event.target.value)"
    />
  </div>
</template>

<script>
export default {
  // 此时这里不需要 model 选项来修改了
  props: {
    title: String, // 修改为 title，注意 template 中也要修改
  },
};
</script>
复制代码
```

同时，`.sync` 修饰符也被移除了，如果你尝试使用它，会报这样的错误：

> '.sync' modifier on 'v-bind' directive is deprecated. Use 'v-model:propName' instead

错误提示中说明了，可以使用 `v-model:propName` 的方式来替代 `.sync`，因为本质上效果是一样的。





总结：

- vue3 默认属性名、事件名为：`modelValue`和`update:modelValue`；而 vue2 中则是：`value`和`input`；

- vue3 中直接通过 v-model 后面参数`v-model:foo`来指定属性名，而且修改体现在父组件中，并且`支持绑定多个 v-model`；而 vue2 中通过子组件的`model 属性中的prop值和event值`来指定属性名和事件名，修改体现在子组件中。
- vue2中的.sync`:value.sync="pageTitle"` 在vue3中全部用v-model替换`v-model:value="pageTitle"`



