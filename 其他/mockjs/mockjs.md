[TOC]

## 写在前面

这里是小飞侠Pan🥳，立志成为一名优秀的前端程序媛！！！

本篇文章收录于我的[github](https://github.com/mengqiuleo)前端笔记仓库中，持续更新中，欢迎star~

👉[https://github.com/mengqiuleo/myNote](https://github.com/mengqiuleo/myNote)

<hr>

## Mock.js 初体验

**安装：**

```
npm install mockjs
```

**导入：**

```
var Mock = require('mockjs')
```

**导入：**

```
var data = Mock.mock({....})
```



## Mock.js语法规范

Mock.js语法规范: https://github.com/nuysoft/Mock/wiki/Syntax-Specification

这里只是说明了一些最常用的语法规范

另外，我们可以直接参考官方给出的示例：http://mockjs.com/examples.html

### 1.数据模板定义规范

数据模板中的每个属性由 3 部分构成：属性名(name)、生成规则(rule)、属性值(value)：

```
'name|rule': value
```



**属性值是字符串 String**

1. 'name|min-max': string
通过重复 string 生成一个字符串，重复次数大于等于 min，小于等于 max。
2. 'name|count': string
通过重复 string 生成一个字符串，重复次数等于 count。



**属性值是数字 Number**

1. 'name|min-max': string
通过重复 string 生成一个字符串，重复次数大于等于 min，小于等于 max。
2. 'name|count': string
通过重复 string 生成一个字符串，重复次数等于 count。
1. 'name|min-max': number
生成一个大于等于 min、小于等于 max 的整数，属性值 number 只是用来确定类型。



**demo**

我们在根目录下新建一个mock的文件夹，并且在该文件夹下新建一个 test.js 文件，用来存放我们要生成的mock数据

注意，首先需要导入mock

```js
// ！！！导入mockjs
const Mock = require('mockjs')

// 调用Mock的方法，生成模拟的数据

// 生成一个用户名，*出现1-10次,是随机的
var data1 = Mock.mock({ 'username|1-10': '*' })
//{ username: '****' }
//{ username: '*********' }

// 生成一个用户名，*出现5次
var data2 = Mock.mock({ 'username|5': '*' })
//{ username: '*****' }

// 生成一个年龄，年龄18-40岁中间
var data3 = Mock.mock({ 'age|18-40': 0 })
//{ age: 25 }
// { age: 28 }

// 随机生成一个id
var data4 = Mock.mock('@id')
//450000198502099849
//640000201404227659

// 随机生成一个中文名称
var data5 = Mock.mock('@cname()')
//唐刚
//姜霞
//范磊

console.log(data)
```





### 2.数据占位符定义规范

占位符 只是在属性值字符串中占个位置，并不出现在最终的属性值中

```
@占位符
@占位符(参数 [, 参数])
```

@id() : 得到随机的id

@cname(): 随机生成中文名字

@date('yyyy-MM-dd'): 随机生成日期

@paragraph(): 描述

@email(): 邮箱地址



**demo**

```js
// ！！！导入mockjs
const Mock = require('mockjs')

// 随机生成一个id
var data4 = Mock.mock('@id')
//450000198502099849
//640000201404227659

// 随机生成一个中文名称
var data5 = Mock.mock('@cname()')
//唐刚
//姜霞
//范磊

console.log(data)
```



### 3.一个实际开发中会用到的案例：生成个人信息

```
Mock.mock({
id: "@id()",//得到随机的id,对象
username: "@cname()",//随机生成中文名字
date: "@date()",//随机生成日期
description: "@paragraph()",//描述
email: "@email()", //email
'age|18-38': 0
})
```



我们新建一个 userInfo.js 

```js
// ！！！导入mockjs
const Mock = require('mockjs')

// 随机生成一个对象
var data = Mock.mock({
  id: '@id()',
  username: '@cname()',
  date: '@date(yyyy-MM-dd)',
  description: '@paragraph()',
  email: '@email()',
  'age|18-40': 0
})

/**
{
  id: '140000198202057935',
  username: '蔡秀英',
  date: '1989-05-22',
  description: 'Dyskicwleb weqosmtu pkqjpcl jtdlcmu rmrurqzw dqsqu lhfbkbg zlcwcczyl pig nivxsa fknxxfv wqqdr acyl. Mpdqrkal fkysogt chie bqmwqbx cbncedxa lzwtv kpecxzs kscg jkutrm rjzbsp loixqslowr twdxdagm lici. Icsmti cmfmby amr enswma bwre nqmywt ikr nsguv siwsbd bsejuotzf xgorcicfjq kwksvnr gfc ttgutrb xmhiwtyo. Kvrhy vhejf iix cgpjhk adehu twa mucee muign bxiaxmxamt ucpuvvg tclw crr uyafxorjs qdyu uunk vjic evmbimfsxz. Wnrxxnkxwn vvwl ahatqd kqoju qdgixcl lmywjtbc ghvexo wjdecdpelz remhft ykjxftxshc jvtjvv grcgxl jnjzfbnq igzpxmy fqpmn.',
  email: 'q.njvudb@hqijwlrsev.om',
  age: 20
}
 */

console.log(data)
```



## Mock.js在Vue中的使用

步骤：
1. 定义接口路由，在接口中并返回mock模拟的数据
2. 在vue.config.js中配置devServer，在before属性中引入接口路由函数
3. 使用axios调用该接口，获取数据



### 1.定义接口路由，在接口中并返回mock模拟的数据

这里就相当于你在写服务器端的代码

我们在mock文件夹下新建一个index.js文件，在这个文件中定义接口

```js
const Mock = require('mockjs')

// 随机生成一个对象
var data = Mock.mock({
  id: '@id()',
  username: '@cname()',
  date: '@date(yyyy-MM-dd)',
  description: '@paragraph()',
  email: '@email()',
  'age|18-40': 0 
})
// console.log(data)

module.exports = function (app) {

  if (process.env.MOCK == 'true') {//判断是否使用mock
    // node中的express框架
    // 参数1： 接口地址；参数2：服务器处理函数
    app.use('/api/userinfo', (req, res) => {
      // 将模拟的数据转成json格式返回给浏览器
      res.json(data)
    })
  }
}
```

在上面的代码中，我们定义的接口为：`/api/userinfo`



### 2.在vue.config.js中配置devServer，在before属性中引入接口路由函数

```js
module.exports = {
  devServer: {
    // devServer在发送请求时，会先走到before指定的函数中进行处理，如果before中没有对应的接口路由，才会请求外网等
    before: require('./mock/index.js')
  }
}
```



### 3.使用axios调用该接口，获取数据

这里我们直接在APP.vue中使用axios

```vue
<template>
  <div>Hello</div>
</template>

<script>
import axios from 'axios'
export default {
  created() {
    axios.get('/api/userinfo').then(result=>{
      console.log(result);
      console.log(result.data);//其实 result.data 才是我们定义的数据，它会自动在外面包一层，我们可以打印出来进行对比 
    })
  }
}
</script>
```



## 如何控制Mock接口的开关？

我们只是希望在开发环境下使用mock数据。

1. 新建.env.development，定义环境变量

   ```
   # 控制是否需要使用mock模拟的数据
   MOCK = true
   ```

2. 定义接口路由前，判断当前MOCK环境变量是否为true

  ```js
  module.exports = function (app) {
      if (process.env.MOCK == 'true') {
          app.use('/api/userinfo', (req, res) => {
              res.json(obj)
          })
      }
  }
  ```

  