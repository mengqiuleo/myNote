# vuepress博客搭建（一）导航栏与侧边栏

[TOC]

## 前言

这里是一个关于vuepress搭建的系列教程，里面也包括了我自己对博客的一些优化

我的博客👉：[一枚前端程序媛的blog](http://106.14.187.205/)

因为域名备案还没下来，所以只能IP地址裸奔了😂

上面的没有使用SSL加密，所以访问有可能报错

所以目前还使用的是Github Pages👉: [一枚前端程序媛的blog](https://mengqiuleo.github.io/)



我在最开始时用的是 **Hexo+butterfly **搭建博客，但是后来发现，hexo的界面虽然很好看，但是自认为vuepress的文章分类更清楚，更适合于当做自己的笔记库（而本人就是想搭建一个自己的知识库）。

对于vuepress的基础的设置，我首先推荐去b站看视频，然后看官方文档就行。

但是对于导航栏和侧边栏，这两个配置感觉有点乱，我感觉用**例子🌰**来展示导航栏和侧边栏的配置更容易上手。

所以下面我就用自己的博客来演示导航栏和侧边栏的配置。

注：我的博客是使用了默认主题，没有配置别的主题。



## 一、项目目录

```
.
├── docs
│   ├── .vuepress 
│   │   ├── components(在该目录下，我们可以自定义博客某个页面的模板，在下一篇文章中会有演示)
│   │   ├── public(存放一些公共样式，比如网站图标和头像，当然，也可以直接将图片放入图床)
|   |   ├── dist(这里存放打包好的文件，最后我们将打包好的文件上传到服务器就行)
│   │   ├── styles(这里放一些自定义样式，在这里我们可以修改主题色)
│   │   │   ├── index.styl
│   │   │   └── palette.styl
│   │   ├── config.js (这里是博客的一些配置，导航栏、侧边栏、下载的插件都在这里配置)
|   ├── about(一个存放自己博客的文件夹，我们可以将不同的文章设置不同的文件夹进行分类)
|   |   ├── README.md(每个文件夹都要有一个README.md文件，否则导航栏配置不生效)
|   |   ├── 文章一.md
|   |   ├── 文章二.md
|   ├── javaScript(同上)
|   |   ├── README.md
│   └── README.md(这个md文档是首页的配置)
│ 
└── package.json 项目初始化时，根目录下自动生成的配置文件,定义了项目的基本配置信息及需要依赖的各个模块、指定运行脚本命令的npm命令行缩写等。

```



上面目录中**首页**的配置：👉 [首页](https://v2.vuepress.vuejs.org/zh/reference/default-theme/frontmatter.html#%E9%A6%96%E9%A1%B5)

配置🌰：

```
---
home: true
heroImage: 'https://XXX.jpg'
actionText: 快速上手 
actionLink: /js/
features:
  - title: 简洁至上
    details: 以 Markdown 为中心的项目结构，以最少的配置帮助你专注于写作。
  - title: Vue 驱动
    details: 享受 Vue 的开发体验，可以在 Markdown 中使用 Vue 组件，又可以使用 Vue 来开发自定义主题。
  - title: 高性能
    details: VuePress 会为每个页面预渲染生成静态的 HTML，同时，每个页面被加载的时候，将作为 SPA 运行。
footer: MIT Licensed | Copyright © XXXX
---
```



> 总结：
>
> - 我们的配置都在 .vuepress文件夹下进行，只有首页的README.md与 .vuepress文件夹同级
> - .vuepress文件夹下 config.js 是主要的配置
>
> - 我们自己的文章目录与 .vuepress文件夹同级
> - 每个文章的文件夹下都要有一份 README.md文件，否则导航栏配置不生效



## 二、导航栏配置

**导航栏的配置在 docs/.vuepress/cpnfig.js 中配置**

```js
themeConfig： {
  nav: [
  	{
  	   text: 'Hmoe',
  	   link: '/'
  	},
  	{
  	   text: 'CSS',
  	   link: '/css/'
  	},
    {//这个导航栏对应多个子导航栏
        text: 'CS与浏览器', // 这里的text就是导航栏上的名字
        items: [
          {text: '计算机网络', link: '/cs/network/'},
          {text: '浏览器相关', link: '/cs/browser/'}, // 对应的路径如下图所示
          {text: '数据库', link: '/cs/database/'},
          {text: '操作系统', link: 'cs/os/'}
        ]
     }
  ]
}
```

![](https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206051827094.jpg)





## 三、侧边栏

我的侧边栏目录

```js
    sidebar: { //侧边栏
      '/js/': [
        {
          title: '闭包',
          children: [
            // ['','文章推荐'],
            ['test','test']
          ]
        },
        {
          title: '作用域',
          children: [
            ['test1','测试test1'],
            ['test2','test2']
          ]
        },
        "only"
      ],
      '/good/':[
        ['','优秀文章推荐']
      ],
      '/about/':[
        "2021年总结",
        "大二上半学期寒假总结",
        "关于蓝桥杯、天梯赛的乱七八糟的心得"
      ],
      '/cs/network/':[
        "【http学习笔记一】破冰篇",
        "【http学习笔记二】基础篇",
        "【http学习笔记三】进阶篇",
        "【http学习笔记四】安全篇",
        "【http学习笔记五】飞翔篇",
        "【http学习笔记六】探索篇"
      ]
    }
```



**官方文档说了，一级标题不会生成侧边栏，正文默认从二级标题开始，二级和三级会生成侧边栏**

侧边栏可以以对象的形式，也可以以数组的形式，但现在基本上都是用数组的形式进行配置。

每个导航栏对应一个数组。默认点开是首先加载每个文章文件夹下的README.md



### 样式一：一个导航栏下对应多篇文章

```js
'/cs/network/':[
	    " ",  // 该目录下的README.md文章
        "【http学习笔记一】破冰篇",
        "【http学习笔记二】基础篇",
        "【http学习笔记三】进阶篇",
        "【http学习笔记四】安全篇",
        "【http学习笔记五】飞翔篇",
        "【http学习笔记六】探索篇"
]
```

对应文章

![](https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206051857684.jpg)



对应左侧导航栏

![](https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206051843109.jpg)

> 此时，你在配置中写的名字要与文章的名字相同



### 样式二：一个导航栏多篇文章，且要对文章起别名

```js
      '/good/':[
        ['','优秀文章推荐'],
        ['熟悉ES6','ES6新特性']
      ],
```

- 这个是将good文件夹下的README.md文章起别名为优秀文章推荐。

- 熟悉ES6.md 起别名为ES6新特性



### 样式三：一个导航栏下多篇文章进行分组

效果如图所示

![](https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206051857644.jpg)

这里分组为 闭包，作用域，还有一个单篇文章

```js
'/js/': [
        {
          title: '闭包',
          children: [
            // ['','文章推荐'],
            ['test','test']
          ]
        },
        {
          title: '作用域',
          children: [
            ['test1','测试test1'],
            ['test2','test2']
          ]
        },
        "only" //这是单篇文章
]
```

> 注意：侧边栏显示的名字并不是你在配置中添加的名字，而是你文章中的二三级标题
>
> 并且在分组中我们也可以对文章起别名

举例🌰:

上面我的 only.md 在侧边栏显示并不是 only，而是单篇文章，这是因为：我的 only.md 的 二级标题为单篇文章

```
## 单篇文章
### 12321315464

#### 这里是我的单篇文章的内容
```





## 四、MarkDown 语法注意点

md文档基本上没有什么变化，唯一要注意的一点是：**引用框的显示**

![](https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206051857206.jpg)

对应的格式：

```
::: tip
推荐文章

warning

danger

details
:::
```

上下用三个冒号，第一行的冒号后面加上引用框的类型，可选的类型如下

- tip
- warning
- danger
- details

