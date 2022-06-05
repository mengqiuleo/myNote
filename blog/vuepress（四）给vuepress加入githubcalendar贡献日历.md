# vuepress(四)给vuepress加入githubcalendar贡献日历

[TOC]



## 前言

这里是一个关于vuepress搭建的系列教程，里面也包括了我自己对博客的一些优化

我的博客👉：[一枚前端程序媛的blog](http://106.14.187.205/)

因为域名备案还没下来，所以只能IP地址裸奔了😂

上面的没有使用SSL加密，所以访问有可能报错

所以目前还使用的是Github Pages👉: [一枚前端程序媛的blog](https://mengqiuleo.github.io/)





## 一、给vuepress加入githubcalendar贡献日历

### 效果展示：

我放在了首页，效果展示：[贡献日历](https://mengqiuleo.github.io/)



### 1.最终呈现

![](https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206051959763.jpg)



这个博客美化，起初是应为自己在搭建 hexo+butterfly 时，可以使用插件来显示贡献日历，但vuepress好像官方并没有找到类似的插件。

所以后来我在github上找到了类似的插件👉：[贡献日历](https://github.com/2016rshah/githubchart-api)



### 2.使用插件

这个插件最终是以一个图片的形式进行展示，所以我们可以将这张图片放在任何位置，并且这个插件直接使用即可，不需要下载。



直接将下面的代码放到自己的博客中：

```
<img src="https://ghchart.rshah.org/2016rshah" alt="2016rshah's Github chart" />
```

我们其实也可以更改贡献的颜色，官网上有解释。



我放在了首页，效果展示：[贡献日历](https://mengqiuleo.github.io/)

```js
---
home: true
heroImage: 'https://xxxxx.jpg'
actionText: 快速上手 →
actionLink: /js/
features:
- title: XXXXXX
  details: XXXXX
- title: XXXXX
  details: XXXXX
- title: XXXXX
  details: XXXXX
footer: MIT Licensed | Copyright © xxxxxxx
---

<img src="https://ghchart.rshah.org/mengqiuleo" 
  alt="2016rshah's Github chart" 
  style="width:100%"/>
```

