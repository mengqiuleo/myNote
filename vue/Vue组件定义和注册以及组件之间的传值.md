# Vue组件定义和注册以及组件之间的传值

[TOC]



## (一)认识组件化

### 组件化的思想：

- 如果我们将一个页面中所有的处理逻辑全部放在一起，处理起来就会变得非常复杂，而且不利于后续的管理以及扩展。
- 但如果，我们讲一个页面拆分成一个个小的功能块，每个功能块完成属于自己这部分独立的功能，那么之后整个页面的管理和维护就变得非常容易了。



### 模块化和组件化的区别

- 模块化：是从代码逻辑的角度进行划分的；方便代码分层开发，保证每个功能模块的职能单一
- 组件化：是从UI界面的角度进行划分的；前端的组件化，方便UI组件的重用



### 组件化思想的应用：

- 有了组件化的思想，我们在之后的开发中就要充分的利用它。
- 尽可能的将页面拆分成一个个小的、可复用的组件。 这样让我们的代码更加方便组织和管理，并且扩展性也更强。

![](E:\note\前端\笔记\vue\vue组件图片\图片1.jpg)



## (二)注册组件

组件的使用分成三个步骤：

- 创建组件构造器

- 注册组件

- 使用组件。

  ![](E:\note\前端\笔记\vue\vue组件图片\注册组件1.jpg)



![](E:\note\前端\笔记\vue\vue组件图片\注册组件2.jpg)



### **注册组件步骤解析**

1.Vue.extend()：

- 调用Vue.extend()创建的是一个组件构造器。 

- 通常在创建组件构造器时，传入template代表我们自定义组件的模板。

- 该模板就是在使用到组件的地方，要显示的HTML代码。

事实上，这种写法在Vue2.x的文档中几乎已经看不到了，它会直接使用下面我们会讲到的语法糖，但是在很多资料还是会提到这种方式，而且这种方式是学习后面方式的基础。

2.Vue.component()：

- 调用Vue.component()是将刚才的组件构造器注册为一个组件，并且给它起一个组件的标签名称。

- 所以需要传递两个参数：1、注册组件的标签名 2、组件构造器

3.组件必须**挂载在某个Vue实例下**，否则它不会生效。（

​	我们来看下面我使用了三次`<my-cpn></my-cpn>`，而第三次其实并没有生效：

![](E:\note\前端\笔记\vue\vue组件图片\保存在vue实例下.jpg)



### 实际开发中组件常见写法（荐）

**模板的分离写法**：将组件内容定义到template标签中去。

##### 全局组件

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="vue2.5.16.js"></script>
</head>

<body>
    <!-- 定义模板 -->
    <template id="myAccount">
        <div>
            <h2>登录页面</h2>
            <h3>注册页面</h3>
        </div>
    </template>

    <div id="app">
        <!-- 使用组件 -->
        <account> </account>
    </div>

    <script>

        //定义、注册组件
        Vue.component('account', {
            template: '#myAccount'    // template 是 Vue 中的关键字，不能改。
        });

        new Vue({
            el: '#app'
        });
    </script>
</body>

</html>
```



我们在上一段中定义的是**全局组件**，这样做的时候，多个Vue实例都可以使用这个组件。

我们还可以在一个Vue实例的内部定义**私有组件**，这样做的时候，只有当前这个Vue实例才可以使用这个组件。

##### 局部组件

```html
<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
    <script src="vue2.5.16.js"></script>
</head>

<body>

    <!-- 定义模板 -->
    <template id="loginTmp">
        <h3>这是私有的login组件</h3>
    </template>

    <div id="app">
        <!-- 调用Vue实例内部的私有组件 -->
        <my-login></my-login>
    </div>

    <script>
        new Vue({
            el: '#app',
            data: {},
            components: { // 定义、注册Vue实例内部的私有组件
                myLogin: {
                    template: '#loginTmp'
                }
            }
        });
    </script>
</body>

</html>
```





#### 注意点：驼峰式命名

上方代码中，如果在注册私有组件时，组件的名称是**驼峰命名**，比如：

```html
 <script>
        new Vue({
            el: '#app',
            data: {},
            components: { // 定义、注册Vue实例内部的私有组件
                myLogin: {
                    template: '#loginTmp'
                }
            }
        });
 </script>
```

那么，在标签中使用组件时，需要把大写的驼峰改为小写的字母，同时两个单词之间使用`-`进行连接：

```html
        <my-login></my-login>
```



### **全局组件和局部组件**

- 当我们通过**调用**Vue.component**()**注册组件时，组件的注册是全局的。这意味着该组件可以在任意**Vue**示例下使用。

- 如果我们注册的组件是挂载在某个实例中, 那么就是一个局部组件

![](E:\note\前端\笔记\vue\vue组件图片\局部与全局.jpg)

![](E:\note\前端\笔记\vue\vue组件图片\局部与全局2.jpg)

上面的例子中，没有被渲染的原因是：这个组件只在app1中注册了，没有在app2中注册。



### **父组件和子组件**

<img src="E:\note\前端\笔记\vue\vue组件图片\父子组件.jpg" style="zoom:80%;" />



## (三)**组件数据的存放**

**组件对象也有一个data属性(也可以有methods等属性）**

只是这个**data属性必须是一个函数**

而且**这个函数返回一个对象，对象内部保存着数据**

![](E:\note\前端\笔记\vue\vue组件图片\组内数据.jpg)



>  **为什么是一个函数呢?**
>
> 首先，如果不是一个函数，Vue直接就会报错。
>
> 其次，原因是在于Vue让每个组件对象都返回一个新的对象，因为如果是同一个对象的，组件在多次使用后会相互影响。
>
> 每当我们创建一个新的组件实例时，就会调用data函数，data函数里会return一个**新开辟**的对象数据。这样做，就可以保证每个组件实例有**独立的数据存储**。
>
> 

<img src="E:\note\前端\笔记\vue\vue组件图片\data().jpg" style="zoom:80%;" />





## (四)组件通信

在开发中，往往一些数据确实需要从上层传递到下层：

- 比如在一个页面中，我们从服务器请求到了很多的数据。

- 其中一部分数据，并非是我们整个页面的大组件来展示的，而是需要下面的子组件进行展示。

- 这个时候，并不会让子组件再次发送一个网络请求，而是直接让**大组件(父组件)**将数据传递给**小组件(子组件)**。

  

![](E:\note\前端\笔记\vue\vue组件图片\组间通信.png)



### **props**基本用法（父传子）

在组件中，使用选项props来声明需要从父级接收到的数据。

props的值有两种方式：

- 方式一：字符串数组，数组中的字符串就是传递时的名称。

- 方式二：对象，对象可以设置传递时的类型，也可以设置默认值等。



一个最简单的props传递

<img src="E:\note\前端\笔记\vue\vue组件图片\props.jpg" style="zoom:80%;" />

另一个例子：

```html
<!DOCTYPE html>
<html lang="en">
 
<head>
  <meta charset="UTF-8">
  <title>Title</title>
</head>
 
<body>
 
  <div id="app">
    <!--<cpn v-bind:cmovies="movies"></cpn>-->
    
    <!-- 没有v-bind直接这样写是给prop传递一个静态的值，也就是说movies不是一个变量而是一个字符串 -->
    <!--<cpn cmovies="movies" cmessage="message"></cpn>-->
 
    <!-- 步骤2 通过:cmessage="message" 将data中的数据传给子组件props -->
    <cpn :cmessage="message" :cmovies="movies"></cpn>
  </div>
 
 
  <!-- 子组件 -->
  <template id="cpn">
    <div>
      <!-- 步骤3 将props中的值显示在子组件中 -->
      <ul>
        <li v-for="item in cmovies">{{item}}</li>
      </ul>
      <h2>{{cmessage}}</h2>
    </div>
  </template>
 
  <script src="../js/vue.js"></script>
  <script>
    // 父传子: props
 
    // -------子组件------
    const cpn = {
      template: '#cpn',
 
      // 子组件通过prop接收  我们能够在组件实例中访问这个值，就像访问 data 中的值一样
 
      /* ***步骤1*** 在 子组件 定义props */
      // ****方式1：字符串数组，数组中的字符串就是传递时的名称（之后要引用的变量名）
       props: ['cmovies', 'cmessage'], // 不要把元素当成字符串，把它当成数组
 
 
      
 
      data() {
        return {}
      }
    }
 
 
    // -----父组件-----
    const app = new Vue({
      el: '#app',
      data: {
        message: '你好啊',
        movies: ['海王', '海贼王', '海尔兄弟']
      },
      components: {
        cpn
      }
    })
  </script>
 
<!-- 
  步骤：
  1.在子组件里写props
  2.在子组件的标签加上v-bind  <cpn v-bind:props里定义的名称="父组件data数据名称"></cpn>
  3.将props中的值显示在子组件中
 -->
 
 
</body>
 
</html>
```

props传值为对象

```html
// ***方式2：对象，对象可以设置传递时的类型，也可以设置默认值等->当需要对props进行类型等验证时
      props: {
        // 1.类型限制
        // 基础的类型检查 (`null` 和 `undefined` 会通过任何类型验证)
        // cmovies: Array,
        // cmessage: String,
 
        // 多个可能的类型
        // propB: [String, Number],
 
        // 2.提供一些默认值, 以及必传值
        cmessage: {
          type: String,
          default: 'aaaaaaaa',
          required: true // 必填的字符串
        },
        // 类型是对象或者数组时, 默认值必须是一个工厂函数
        cmovies: {
          type: Array,
          default () {
            return {
              message: 'hello'
            }
          }
        },
        // 自定义验证函数
        propF: {
          validator: function (value) {
            // 这个值必须匹配下列字符串中的一个
            return ['success', 'warning', 'danger'].indexOf(value) !== -1
          }
        }
 
      },
```

<img src="E:\note\前端\笔记\vue\vue组件图片\props对象.png" style="zoom:80%;" />



### **子级向父级传递**($emit)

自定义事件的流程：

- 在子组件中，通过$emit()来触发事件。

- 在父组件中，通过v-on来监听子组件事件。

<img src="E:\note\前端\笔记\vue\vue组件图片\子传父.png" style="zoom:80%;" />

```html
 
  <!--父组件模板-->
  <div id="app">
    <!-- 3.在父组件子标签中，通过v-on来监听子组件事件 并添加一个响应该事件的处理方法 -->
    <cpn @item-click="cpnClick"></cpn>
  </div>
 
  <!--子组件模板-->
  <template id="cpn">
    <div>
      <!-- 1.在子组件中创建一个按钮，给按钮绑定一个点击事件 -->
      <button v-for="item in categories" @click="btnClick(item)">
        {{item.name}}
      </button>
    </div>
  </template>
 
  <script src="../js/vue.js"></script>
  <script>
    // 子传父 自定义事件
 
    // 子组件 
    const cpn = {
      template: '#cpn',
      data() {
        return {
          categories: [{
              id: 'aaa',
              name: '热门推荐'
            },
            {
              id: 'bbb',
              name: '手机数码'
            },
            {
              id: 'ccc',
              name: '家用家电'
            },
            {
              id: 'ddd',
              name: '电脑办公'
            },
          ]
        }
      },
      methods: {
        btnClick(item) {
          // 发射事件: 自定义事件
          // 2.在子组件中，通过$emit()来触发事件
          this.$emit('item-click', item)
          // 注意！！！！这里的$emit事件名不要写成驼峰！！！脚手架里可以，会先编译成一个组件对象render函数
        }
      }
    }
 
    // 父组件 
    const app = new Vue({
      el: '#app',
      data: {
        message: '你好啊'
      },
      components: {
        cpn
      },
      methods: {
        cpnClick(item) { // 这里的参数是接收子组件传过来的数据的
          console.log('cpnClick', item);
          
        }
      }
    })
  </script>
```



### 组件通信的其他方法

#### 1.`$emit`/`$on`（eventBus）

**这种方法通过一个空的Vue实例作为中央事件总线（事件中心），用它来触发事件和监听事件,巧妙而轻量地实现了任何组件间的通信，包括父子、兄弟、跨级**。

具体实现方式：

```vue
    var Event=new Vue();
    Event.$emit(事件名,数据);
    Event.$on(事件名,data => {});
```

举个例子

假设兄弟组件有三个，分别是A、B、C组件，C组件如何获取A或者B组件的数据

```vue
<div id="itany">
	<my-a></my-a>
	<my-b></my-b>
	<my-c></my-c>
</div>
<template id="a">
  <div>
    <h3>A组件：{{name}}</h3>
    <button @click="send">将数据发送给C组件</button>
  </div>
</template>
<template id="b">
  <div>
    <h3>B组件：{{age}}</h3>
    <button @click="send">将数组发送给C组件</button>
  </div>
</template>
<template id="c">
  <div>
    <h3>C组件：{{name}}，{{age}}</h3>
  </div>
</template>


<script>
var Event = new Vue();//定义一个空的Vue实例
var A = {
	template: '#a',
	data() {
	  return {
	    name: 'tom'
	  }
	},
	methods: {
	  send() {
	    Event.$emit('data-a', this.name);
	  }
	}
}
var B = {
	template: '#b',
	data() {
	  return {
	    age: 20
	  }
	},
	methods: {
	  send() {
	    Event.$emit('data-b', this.age);
	  }
	}
}
var C = {
	template: '#c',
	data() {
	  return {
	    name: '',
	    age: ""
	  }
	},
	mounted() {//在模板编译完成后执行
	 Event.$on('data-a',name => {
	     this.name = name;//箭头函数内部不会产生新的this，这边如果不用=>,this指代Event
	 })
	 Event.$on('data-b',age => {
	     this.age = age;
	 })
	}
}
var vm = new Vue({
	el: '#itany',
	components: {
	  'my-a': A,
	  'my-b': B,
	  'my-c': C
	}
});	
</script>

```

`$on` 监听了自定义事件 data-a和data-b，因为有时不确定何时会触发事件，一般会在 mounted 或 created 钩子中来监听。



#### 2.`$parent` / `$children`与 `ref`

父子组件的访问方式： $children（父访问子）

- 有时候我们需要父组件直接访问子组件，子组件直接访问父组件，或者是子组件访问根组件。
  - **父**组件**访问子**组件：使用**$children或$refs**
  - **子**组件访问**父**组件：使用**$parent**



①先看下**$children**的访问

- **this.$children是一个数组类型**，它包含所有子组件对象。
- 我们这里通过一个遍历，取出所有子组件的message状态。

<img src="E:\note\前端\笔记\vue\vue组件图片\children.png" style="zoom:80%;" />



②**父子组件的访问方式：** **$refs**

$children的缺陷：

- 通过$children访问子组件时，是一个数组类型，访问其中的子组件必须通过索引值。

- 但是当子组件过多，我们需要拿到其中一个时，往往不能确定它的索引值，甚至还可能会发生变化。

- 有时候，我们想明确获取其中一个特定的组件，这个时候就可以使用$refs

$refs的使用：

- $refs和ref指令通常是一起使用的。

- 首先，我们通过ref给某一个子组件绑定一个特定的ID。

- 其次，通过this.$refs.ID就可以访问到该组件了。

![](E:\note\前端\笔记\vue\vue组件图片\refs.png)

![](E:\note\前端\笔记\vue\vue组件图片\refs2.png)

**这种方法的弊端是，无法在跨级或兄弟间通信**。



③如果我们想在子组件中直接访问父组件，可以通过`$parent`

注意事项：

- 尽管在Vue开发中，我们允许通过$parent来访问父组件，但是在真实开发中尽量不要这样做。

- 子组件应该尽量避免直接访问父组件的数据，因为这样耦合度太高了。

- 如果我们将子组件放在另外一个组件之内，很可能该父组件没有对应的属性，往往会引起问题。

- 另外，更不好做的是通过$parent直接修改父组件的状态，那么父组件中的状态将变得飘忽不定，很不利于我的调试和维护。

<img src="E:\note\前端\笔记\vue\vue组件图片\parent.png" style="zoom:80%;" />



④使用`$root(根组件)`

```vue
 
<div id="app">
  <cpn></cpn>
</div>
 
<template id="cpn">
  <div>
    <h2>我是cpn组件</h2>
    <ccpn></ccpn>
  </div>
</template>
 
<template id="ccpn">
  <div>
    <h2>我是子组件</h2>
    <button @click="btnClick">按钮</button>
  </div>
</template>
 
<script src="../js/vue.js"></script>
<script>
  const app = new Vue({
    el: '#app',
    data: {
      message: '你好啊'
    },
    components: {
      cpn: {
        template: '#cpn',
        data() {
          return {
            name: '我是cpn组件的name'
          }
        },
        components: {
          ccpn: {
            template: '#ccpn',
            methods: {
              btnClick() {
                // 1.访问父组件$parent
                // console.log(this.$parent);
                // console.log(this.$parent.name);
 
                // 2.访问根组件$root
                console.log(this.$root);
                console.log(this.$root.message);
              }
            }
          }
        }
      }
    }
  })
</script>
```



#### 3.provide/inject(提供/注入)



**用处**：父组件可以向其所有子组件传入数据，而不管子组件层次结构有多深

父组件有一个 provide 选项来提供数据。子组件有一个 inject 选项来开始使用这个数据

eg：

​	index（根） ，  a(父)  ，   b(子)

​	props方式传值：index ->  a    ->   b

​	provide/inject 方式传值：index -> a ,  index ->  b

**举例**

接下来就用一个例子来验证上面的描述: 假设有三个组件: A.vue、B.vue、C.vue 其中 C是B的子组件，B是A的子组件。

```vue
// A.vue

<template>
  <div>
	<comB></comB>
  </div>
</template>

<script>
  import comB from '../components/test/comB.vue'
  export default {
    name: "A",
    provide: {
      for: "demo"
    },
    components:{
      comB
    }
  }
</script>

```

```vue
// B.vue

<template>
  <div>
    {{demo}}
    <comC></comC>
  </div>
</template>

<script>
  import comC from '../components/test/comC.vue'
  export default {
    name: "B",
    inject: ['for'],
    data() {
      return {
        demo: this.for
      }
    },
    components: {
      comC
    }
  }
</script>

```

```vue
// C.vue
<template>
  <div>
    {{demo}}
  </div>
</template>

<script>
  export default {
    name: "C",
    inject: ['for'],
    data() {
      return {
        demo: this.for
      }
    }
  }
</script>

```



#### 4.`$attrs`/`$listeners`

简单来说：`$attrs`与`$listeners` 是两个对象，`$attrs` 里存放的是父组件中绑定的非 Props 属性，`$listeners`里存放的是父组件中绑定的非原生事件。





### 总结

常见使用场景可以分为三类:

- 父子组件通信: `props`; `$parent` / `$children`; `provide` / `inject` ; `ref` ;  `$attrs` / `$listeners`
- 兄弟组件通信: `eventBus` ; 	vuex
- 跨级通信:  `eventBus`；Vuex；`provide` / `inject` 、`$attrs` / `$listeners`


