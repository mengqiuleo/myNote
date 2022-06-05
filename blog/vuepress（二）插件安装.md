# vuepress（二）插件安装推荐

[TOC]



## 前言

这里是一个关于vuepress搭建的系列教程，里面也包括了我自己对博客的一些优化

我的博客👉：[一枚前端程序媛的blog](http://106.14.187.205/)

因为域名备案还没下来，所以只能IP地址裸奔了😂

上面的没有使用SSL加密，所以访问有可能报错

所以目前还使用的是Github Pages👉: [一枚前端程序媛的blog](https://mengqiuleo.github.io/)



我在最开始时用的是 **Hexo+butterfly **搭建博客，但是后来发现，hexo的界面虽然很好看，但是自认为vuepress的文章分类更清楚，更适合于当做自己的笔记库（而本人就是想搭建一个自己的知识库）。





## 二、插件

插件配置在 config.js 文件中

```js
"plugins"： [
	// 插件的配置
]
```

每个插件都是一个数组进行配置



### 1.back-to-top

文章看到下面的时候，点击一个图标会回到顶部

下载：`yarn add -D @vuepress/plugin-back-to-top`

```
"plugins"： [
	['@vuepress/back-to-top'],
]
```



### 2.last-updated

文章的末尾会自动显示文章的更新日期

这里的最后更新时间以通过git提交的时间为准，在本地修改文章，时间并不会改变

```
"plugins"： [
	['@vuepress/last-updated'],
]
```



### 3.看板娘

下载命令：

`npm install @vuepress-reco/vuepress-plugin-kan-ban-niang -D` 

如果使用的是yarn，`yarn add @vuepress-reco/vuepress-plugin-kan-ban-niang -D`



- 官方文档👉： [kanbanniang](https://vuepress-theme-reco.recoluan.com/views/plugins/kanbanniang.html)

![](https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206051922482.jpg)

我的看板娘配置

```
    ['@vuepress-reco/vuepress-plugin-kan-ban-niang',{
      theme: ["blackCat"],
      clean: false,
      info: 'https://github.com/mengqiuleo',
      messages: {
        welcome: '',
        home: '心里的花，我想要带你回家',
        theme: '好吧，希望你能喜欢我的其他小伙伴。',
        close: '再见哦'
      }
    }],
```





### 4.樱花插件

![](https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206051930411.jpg)

 只要把这个放进 config的plugins中就可以了

```
// 只要把这个放进 config的plugins中就可以了 
["sakura", {
    num: 20,  // 默认数量
    show: true, //  是否显示
    zIndex: -1,   // 层级
    img: {
      replace: false,  // false 默认图 true 换图 需要填写httpUrl地址
      httpUrl: '...'     // 绝对路径
    }     
}]
```



### 5.代码复制

![](https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206051930941.jpg)

下载：

`yarn add vuepress-plugin-nuggets-style-copy -D`

```js
 [
    "vuepress-plugin-nuggets-style-copy",
    {
      copyText: "复制代码",
      tip: {
        content: "复制成功",
      },
    },
  ],
```



### 6.添加著作权信息

下载：`npm install vuepress-plugin-copyright -D`

```js
[
    'copyright',
    {
      authorName: '小飞侠Pan', // 选中的文字将无法被复制
      minLength: 30, // 如果长度超过  30 个字符
    },
  ]
```



### 7.动态标题展示

下载：`npm i vuepress-plugin-dynamic-title -D`

```js
    ['dynamic-title',{
        // showIcon: 'https://www.typescriptlang.org/favicon-32x32.png?v=8944a05a8b601855de116c8a56d3b3ae',
        showText: '(/≧▽≦/)欢迎回来~',
        // hideIcon: 'https://www.typescriptlang.org/favicon-32x32.png?v=8944a05a8b601855de116c8a56d3b3ae',
        hideText: '(●—●)bye bye~',
        recoverTime: 1000,
    }]
```





### 8.我的所有插件配置

```js
  "plugins": [
    ['@vuepress/back-to-top'],
    ['@vuepress/last-updated'],
    ['@vuepress-reco/vuepress-plugin-kan-ban-niang',{
      theme: ["blackCat"],
      clean: false,
      info: 'https://github.com/mengqiuleo',
      messages: {
        welcome: '',
        home: '心里的花，我想要带你回家',
        theme: '好吧，希望你能喜欢我的其他小伙伴。',
        close: '再见哦'
      }
    }],
    ["sakura", {
      num: 30,  // 默认数量
      show: true, //  是否显示
      zIndex: -1,   // 层级
      img: {
        replace: false,  // false 默认图 true 换图 需要填写httpUrl地址
        httpUrl: '...'     // 绝对路径
      }     
    }],
    ["vuepress-plugin-nuggets-style-copy", {
      copyText: "复制代码",
      tip: {
          content: "复制成功"
      }
   }],
    ['copyright',{
        authorName: '小飞侠Pan', // 选中的文字将无法被复制
        minLength: 30, // 如果长度超过  30 个字符
    }],
    ['dynamic-title',{
        // showIcon: 'https://www.typescriptlang.org/favicon-32x32.png?v=8944a05a8b601855de116c8a56d3b3ae',
        showText: '(/≧▽≦/)欢迎回来~',
        // hideIcon: 'https://www.typescriptlang.org/favicon-32x32.png?v=8944a05a8b601855de116c8a56d3b3ae',
        hideText: '(●—●)bye bye~',
        recoverTime: 1000,
    }]
  ]
```

