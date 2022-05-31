# 【vue】生命周期（包含父子组件）

[TOC]



## 一、vue生命周期方法

![](E:\note\前端\笔记\vue\vue生命周期\生命周期.png)

生命周期就是 vue 从开始创建到销毁的过程，分为四大步（创建，挂载， 更新，销毁），每一步又分为两小步，比如：beforCreate和created,beforeMount和mounted,beforeUpdate和updated,beforeDestroy和destroyed。

- new Vue 的时候会初始化事件和生命周期
- beforeCreate 和 created 之间会挂载 Data，绑定事件；接下来会根据 el 挂载页面元素，如果没有设置 el 则生命周期结束，直到手动挂载；el 挂载结束后，根据 templete/outerHTML(el)渲染页面
- 在 beforeMount 前虚拟 DOM 已经创建完成；之后在 mounted 前，将 vm.$el 替换掉页面元素 el;mounted 将虚拟 dom 挂载到真实页面（此时页面已经全部渲染完成）
- 之后发生数据变化时 触发 beforeUpdate 和 updated 进行一些操作
- 最后主动调用 销毁函数 或者 组件自动销毁时 beforeDestroy，手动撤销监听事件，计时器等；destroyed 时仅存在 Dom 节点，其他所有东西已自动销毁



![](E:\note\前端\笔记\vue\vue生命周期\生命周期2.jpg)



## 二、keep-alive 中的生命周期

- beforeCreate、created、beforeMount、mounted、beforeUpdate、updated、beforeDestroy、destroyed。

- keep-alive 有自己独立的钩子函数 activated 和 deactivated。

| activited （keep-alive 专属）   | 组件被激活时调用 |
| ------------------------------- | ---------------- |
| deactivated （keep-alive 专属） | 组件被销毁时调用 |

> keep-alive是 Vue 提供的一个内置组件，用来对组件进行缓存——在组件切换过程中将状态保留在内存中，防止重复渲染DOM。

如果为一个组件包裹了 keep-alive，那么它会多出两个生命周期：deactivated、activated。同时，beforeDestroy 和 destroyed 就不会再被触发了，因为组件不会被真正销毁。

当组件被换掉时，会被缓存到内存中、触发 deactivated 生命周期；当组件被切回来时，再去缓存里找这个组件、触发 activated钩子函数。



## 三、Vue 子组件和父组件执行顺序

- 组件的调用顺序都是先父后子,渲染完成的顺序是先子后父。
- 组件的销毁操作是先父后子，销毁完成的顺序是先子后父。



**加载渲染过程：**

1. 父组件 beforeCreate
2. 父组件 created
3. 父组件 beforeMount
4. 子组件 beforeCreate
5. 子组件 created
6. 子组件 beforeMount
7. 子组件 mounted
8. 父组件 mounted

**更新过程：**

1. 父组件 beforeUpdate
2. 子组件 beforeUpdate
3. 子组件 updated
4. 父组件 updated

**销毁过程：**

1. 父组件 beforeDestroy
2. 子组件 beforeDestroy
3. 子组件 destroyed
4. 父组件 destoryed




## 四、created和mounted的区别

- created:在模板渲染成html前调用，即通常初始化某些属性值，然后再渲染成视图。在这一步，实例已完成以下的配置：数据观测(data observer)，属性和方法的运算，watch/event 事件回调。这里没有$el,如果非要想与 Dom 进行交互，可以通过 vm.$nextTick 来访问 Dom
- mounted:在模板渲染成html后调用，通常是初始化页面完成后，再对html的dom节点进行一些需要的操作。在当前阶段，真实的 Dom 挂载完毕，数据完成双向绑定，可以访问到 Dom 节点



## 五、异步请求在哪一步发起？

我们可以在钩子函数 created、beforeMount、mounted 中进行调用，因为在这三个钩子函数中，data 已经创建，可以将服务端端返回的数据进行赋值。 

推荐在 created 钩子函数中调用异步请求，因为在 created 钩子函数中调用异步请求有以下优点：

- 能更快获取到服务端数据，减少页面加载时间，用户体验更好；
- SSR不支持 beforeMount 、mounted 钩子函数，放在 created 中有助于一致性。



## 六、在什么阶段才能访问操作DOM？

在钩子函数 mounted 被调用前，Vue 已经将编译好的模板挂载到页面上，所以在 mounted 中可以访问操作 DOM。