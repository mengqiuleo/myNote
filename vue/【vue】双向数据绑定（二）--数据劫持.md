## 【vue】双向数据绑定（二）-- 实现vue的数据劫持与发布订阅

> 通过 Object.defineProperty() 来实现一个简单的数据劫持

[TOC]



### 1.创建一个 index.html 和 vue.js，并对属性进行监测（数据劫持） --> Observe函数

在 index.html 页面上创建一个 **vue实例**

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <div id="app">
    <h3>姓名是：{{ name }}</h3>
    <h3>年龄是：{{ age }}</h3>
    <h3>info.a的值是: {{ info.a }}</h3>

    <!-- 通过表单来验证数据劫持 -->
    <div>name的值: <input type="text" v-model="name" /></div>
    <div>info.a的值: <input type="text" v-model="info.a" /></div>
  </div>

  <script src="./vue.js"></script>
  <script>
    const vm = new Vue({
      el: '#app',
      data: { 
        name: 'zs',
        age: 20,
        info: {
          a: 'a1',
          c: 'c1'
        }
      }
    })

    console.log(vm)
  </script>
</body>

</html>
```



vue.js

第一步先在 vue实例上 绑定 $data 属性，该属性的值就是 vue实例上的数据。

接下来对所有数据进行监测。

具体实现监测的方法：

- 创建一个监测（数据劫持）的函数
- 在函数里，通过 Object.keys(obj) 获取到当前 obj 上的每个属性
- 对于每一个属性设置 set 和 get
- 并且对于子节点还是 object 的情况进行**递归**

```js
class Vue {
  constructor(options) {
    // 1.这里的options就指向vue实例中的 el 和 data
    this.$data = options.data

    // 2.调用数据劫持的方法
    Observe(this.$data)
      
  }
}

// 2.1 定义一个数据劫持的方法
function Observe(obj) {
  // 这是递归的终止条件
  if (!obj || typeof obj !== 'object') return

  // 通过 Object.keys(obj) 获取到当前 obj 上的每个属性
  Object.keys(obj).forEach((key) => {
    // 当前被循环的 key 所对应的属性值
    let value = obj[key]
    // 把 value 这个子节点，进行递归
    Observe(value)
    // 需要为当前的 key 所对应的属性，添加 getter 和 setter
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        console.log(`有人获取了 ${key} 的值：`)
        return value
      },
      set(newVal) {
        value = newVal
        Observe(value)
      },
    })
  })
}
```



打开控制台，发现此时 vm身上所有的属性都已经添加上了 setter 和getter

![](E:\note\前端\笔记\vue\双向数据绑定\监测.jpg)



并且，可以使用 `vm.$data` 的方法获取对应的属性值

![](E:\note\前端\笔记\vue\双向数据绑定\获取.jpg)





### 2.进行属性代理，使得可以通过 vm.age 直接获取，而不是使用 vm.$data.age 

```js
// 属性代理
    Object.keys(this.$data).forEach((key) => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return this.$data[key]
        },
        set(newValue) {
          this.$data[key] = newValue
        },
      })
    })
```



vue.js 完整代码

```js
class Vue {
  constructor(options) {
    // 1.这里的options就指向vue实例中的 el 和 data
    this.$data = options.data

    // 2.调用数据劫持的方法
    Observe(this.$data)

    // 3.属性代理
    Object.keys(this.$data).forEach((key) => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return this.$data[key]
        },
        set(newValue) {
          this.$data[key] = newValue
        },
      })
    })
  }
}

// 2.1 定义一个数据劫持的方法
function Observe(obj) {
  // 这是递归的终止条件
  if (!obj || typeof obj !== 'object') return

  // 通过 Object.keys(obj) 获取到当前 obj 上的每个属性
  Object.keys(obj).forEach((key) => {
    // 当前被循环的 key 所对应的属性值
    let value = obj[key]
    // 把 value 这个子节点，进行递归
    Observe(value)
    // 需要为当前的 key 所对应的属性，添加 getter 和 setter
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        console.log(`有人获取了 ${key} 的值：`)
        return value
      },
      set(newVal) {
        value = newVal
        Observe(value)
      },
    })
  })
}

```



打开控制台，进行测试

![](E:\note\前端\笔记\vue\双向数据绑定\获取2.jpg)



### 3.读取vm的属性值，并将值填充到 {{xxx}} 中进行渲染 --> Compile函数

定义 Compile函数，（ps: 所有相关函数的定义都放在 class Vue 外面，调用都在 constructor 中进行）

```js
// 对 HTML 结构进行模板编译的方法
function Compile(el, vm) {
  // 获取 el 对应的 DOM 元素
  vm.$el = document.querySelector(el)

  // 创建文档碎片，提高 DOM 操作的性能
  const fragment = document.createDocumentFragment()

  while ((childNode = vm.$el.firstChild)) {
    fragment.appendChild(childNode)
  }

  // 进行模板编译
  replace(fragment)

  vm.$el.appendChild(fragment)

  // 负责对 DOM 模板进行编译的方法
  function replace(node) {
    // 定义匹配插值表达式的正则
    const regMustache = /\{\{\s*(\S+)\s*\}\}/

    // 证明当前的 node 节点是一个文本子节点，需要进行正则的替换
    if (node.nodeType === 3) {
      // 注意：文本子节点，也是一个 DOM 对象，如果要获取文本子节点的字符串内容，需要调用 textContent 属性获取
      const text = node.textContent
      // 进行字符串的正则匹配与提取
      const execResult = regMustache.exec(text)
      console.log(execResult)
      if (execResult) {
        const value = execResult[1].split('.').reduce((newObj, k) => newObj[k], vm)
        node.textContent = text.replace(regMustache, value)
        // 在这个时候，创建 Watcher 类的实例
        new Watcher(vm, execResult[1], (newValue) => {
          node.textContent = text.replace(regMustache, newValue)
        })
      }
      // 终止递归的条件
      return
    }

    // 判断当前的 node 节点是否为 input 输入框
    if (node.nodeType === 1 && node.tagName.toUpperCase() === 'INPUT') {
      // 得到当前元素的所有属性节点
      const attrs = Array.from(node.attributes)
      const findResult = attrs.find((x) => x.name === 'v-model')
      if (findResult) {
        // 获取到当前 v-model 属性的值   v-model="name"    v-model="info.a"
        const expStr = findResult.value
        const value = expStr.split('.').reduce((newObj, k) => newObj[k], vm)
        node.value = value

        // 创建 Watcher 的实例
        new Watcher(vm, expStr, (newValue) => {
          node.value = newValue
        })

        // 监听文本框的 input 输入事件，拿到文本框最新的值，把最新的值，更新到 vm 上即可
        node.addEventListener('input', (e) => {
          const keyArr = expStr.split('.')
          const obj = keyArr.slice(0, keyArr.length - 1).reduce((newObj, k) => newObj[k], vm)
          const leafKey = keyArr[keyArr.length - 1]
          obj[leafKey] = e.target.value
        })
      }
    }

    // 证明不是文本节点，可能是一个DOM元素，需要进行递归处理
    node.childNodes.forEach((child) => replace(child))
  }
}
```



在定义好，要在 class Vue 的 `constructor` 中调用模板编译的函数

```js
    // 调用模板编译的函数
    Compile(options.el, this)
```



### 4.创建依赖收集的 Dep类，去收集 watcher 订阅者的类

```js
// 依赖收集的类/收集 watcher 订阅者的类
class Dep {
  constructor() {
    // 今后，所有的 watcher 都要存到这个数组中
    this.subs = []
  }

  // 向 subs 数组中，添加 watcher 的方法
  addSub(watcher) {
    this.subs.push(watcher)
  }

  // 负责通知每个 watcher 的方法
  notify() {
    this.subs.forEach((watcher) => watcher.update())
  }
}
```



### 5.创建订阅者的 Watcher类

```js
// 订阅者的类
class Watcher {
  // cb 回调函数中，记录着当前 Watcher 如何更新自己的文本内容
  //    但是，只知道如何更新自己还不行，还必须拿到最新的数据，
  //    因此，还需要在 new Watcher 期间，把 vm 也传递进来（因为 vm 中保存着最新的数据）
  // 除此之外，还需要知道，在 vm 身上众多的数据中，哪个数据，才是当前自己所需要的数据，
  //    因此，必须在 new Watcher 期间，指定 watcher 对应的数据的名字
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb

    // ↓↓↓↓↓↓ 下面三行代码，负责把创建的 Watcher 实例存到 Dep 实例的 subs 数组中 ↓↓↓↓↓↓
    Dep.target = this
    key.split('.').reduce((newObj, k) => newObj[k], vm)
    Dep.target = null
  }

  // watcher 的实例，需要有 update 函数，从而让发布者能够通知我们进行更新！
  update() {
    const value = this.key.split('.').reduce((newObj, k) => newObj[k], this.vm)
    this.cb(value)
  }
}
```



### 总结：

#### 完整代码 -- index.html

```html
<!DOCTYPE html>
<html lang="en">

<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Document</title>
</head>

<body>
  <div id="app">
    <h3>姓名是：{{ name }}</h3>
    <h3>年龄是：{{ age }}</h3>
    <h3>info.a的值是: {{ info.a }}</h3>

    <!-- 通过表单来验证数据劫持 -->
    <div>name的值: <input type="text" v-model="name" /></div>
    <div>info.a的值: <input type="text" v-model="info.a" /></div>
  </div>

  <script src="./vue.js"></script>
  <script>
    const vm = new Vue({
      el: '#app',
      data: { 
        name: 'zs',
        age: 20,
        info: {
          a: 'a1',
          c: 'c1'
        }
      }
    })

    console.log(vm)
  </script>
</body>

</html>
```



#### 完整代码 -- vue.js

```js
class Vue {
  constructor(options) {
    this.$data = options.data

    // 调用数据劫持的方法
    Observe(this.$data)

    // 属性代理
    Object.keys(this.$data).forEach((key) => {
      Object.defineProperty(this, key, {
        enumerable: true,
        configurable: true,
        get() {
          return this.$data[key]
        },
        set(newValue) {
          this.$data[key] = newValue
        },
      })
    })

    // 调用模板编译的函数
    Compile(options.el, this)
  }
}


// 1.定义一个数据劫持的方法
function Observe(obj) {
  // 这是递归的终止条件
  if (!obj || typeof obj !== 'object') return
  const dep = new Dep()

  // 通过 Object.keys(obj) 获取到当前 obj 上的每个属性
  Object.keys(obj).forEach((key) => {
    // 当前被循环的 key 所对应的属性值
    let value = obj[key]
    // 把 value 这个子节点，进行递归
    Observe(value)
    // 需要为当前的 key 所对应的属性，添加 getter 和 setter
    Object.defineProperty(obj, key, {
      enumerable: true,
      configurable: true,
      get() {
        // 只要执行了下面这一行，那么刚才 new 的 Watcher 实例，
        // 就被放到了 dep.subs 这个数组中了
        Dep.target && dep.addSub(Dep.target)
        return value
      },
      set(newVal) {
        value = newVal
        Observe(value)
        // 通知每一个订阅者更新自己的文本
        dep.notify()
      },
    })
  })
}


// 2.对 HTML 结构进行模板编译的方法
function Compile(el, vm) {
  // 获取 el 对应的 DOM 元素
  vm.$el = document.querySelector(el)

  // 创建文档碎片，提高 DOM 操作的性能
  const fragment = document.createDocumentFragment()

  while ((childNode = vm.$el.firstChild)) {
    fragment.appendChild(childNode)
  }

  // 进行模板编译
  replace(fragment)

  vm.$el.appendChild(fragment)

  // 负责对 DOM 模板进行编译的方法
  function replace(node) {
    // 定义匹配插值表达式的正则
    const regMustache = /\{\{\s*(\S+)\s*\}\}/

    // 证明当前的 node 节点是一个文本子节点，需要进行正则的替换
    if (node.nodeType === 3) {
      // 注意：文本子节点，也是一个 DOM 对象，如果要获取文本子节点的字符串内容，需要调用 textContent 属性获取
      const text = node.textContent
      // 进行字符串的正则匹配与提取
      const execResult = regMustache.exec(text)
      console.log(execResult)
      if (execResult) {
        const value = execResult[1].split('.').reduce((newObj, k) => newObj[k], vm)
        node.textContent = text.replace(regMustache, value)
        // 在这个时候，创建 Watcher 类的实例
        new Watcher(vm, execResult[1], (newValue) => {
          node.textContent = text.replace(regMustache, newValue)
        })
      }
      // 终止递归的条件
      return
    }

    // 判断当前的 node 节点是否为 input 输入框
    if (node.nodeType === 1 && node.tagName.toUpperCase() === 'INPUT') {
      // 得到当前元素的所有属性节点
      const attrs = Array.from(node.attributes)
      const findResult = attrs.find((x) => x.name === 'v-model')
      if (findResult) {
        // 获取到当前 v-model 属性的值   v-model="name"    v-model="info.a"
        const expStr = findResult.value
        const value = expStr.split('.').reduce((newObj, k) => newObj[k], vm)
        node.value = value

        // 创建 Watcher 的实例
        new Watcher(vm, expStr, (newValue) => {
          node.value = newValue
        })

        // 监听文本框的 input 输入事件，拿到文本框最新的值，把最新的值，更新到 vm 上即可
        node.addEventListener('input', (e) => {
          const keyArr = expStr.split('.')
          const obj = keyArr.slice(0, keyArr.length - 1).reduce((newObj, k) => newObj[k], vm)
          const leafKey = keyArr[keyArr.length - 1]
          obj[leafKey] = e.target.value
        })
      }
    }

    // 证明不是文本节点，可能是一个DOM元素，需要进行递归处理
    node.childNodes.forEach((child) => replace(child))
  }
}


// 3.依赖收集的类/收集 watcher 订阅者的类
class Dep {
  constructor() {
    // 今后，所有的 watcher 都要存到这个数组中
    this.subs = []
  }

  // 向 subs 数组中，添加 watcher 的方法
  addSub(watcher) {
    this.subs.push(watcher)
  }

  // 负责通知每个 watcher 的方法
  notify() {
    this.subs.forEach((watcher) => watcher.update())
  }
}


// 4.订阅者的类
class Watcher {
  // cb 回调函数中，记录着当前 Watcher 如何更新自己的文本内容
  //    但是，只知道如何更新自己还不行，还必须拿到最新的数据，
  //    因此，还需要在 new Watcher 期间，把 vm 也传递进来（因为 vm 中保存着最新的数据）
  // 除此之外，还需要知道，在 vm 身上众多的数据中，哪个数据，才是当前自己所需要的数据，
  //    因此，必须在 new Watcher 期间，指定 watcher 对应的数据的名字
  constructor(vm, key, cb) {
    this.vm = vm
    this.key = key
    this.cb = cb

    // ↓↓↓↓↓↓ 下面三行代码，负责把创建的 Watcher 实例存到 Dep 实例的 subs 数组中 ↓↓↓↓↓↓
    Dep.target = this
    key.split('.').reduce((newObj, k) => newObj[k], vm)
    Dep.target = null
  }

  // watcher 的实例，需要有 update 函数，从而让发布者能够通知我们进行更新！
  update() {
    const value = this.key.split('.').reduce((newObj, k) => newObj[k], this.vm)
    this.cb(value)
  }
}

```

