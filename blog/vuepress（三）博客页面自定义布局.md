# vuepress（三）博客页面自定义布局

[TOC]



## 前言

这里是一个关于vuepress搭建的系列教程，里面也包括了我自己对博客的一些优化

我的博客👉：[一枚前端程序媛的blog](http://106.14.187.205/)

因为域名备案还没下来，所以只能IP地址裸奔了😂

上面的没有使用SSL加密，所以访问有可能报错

所以目前还使用的是Github Pages👉: [一枚前端程序媛的blog](https://mengqiuleo.github.io/)



我在最开始时用的是 **Hexo+butterfly **搭建博客，但是后来发现，hexo的界面虽然很好看，但是自认为vuepress的文章分类更清楚，更适合于当做自己的笔记库（而本人就是想搭建一个自己的知识库）。





## 一、博客自定义页面布局

### 效果展示：

**我的博客的自定义布局**👉：[在线简历](https://mengqiuleo.github.io/resume/)



在默认主题下，每一个`.md`文件都会被渲染在`<div class="page"></div>`这样的一个标签中，同时生成页面的侧边栏、编辑链接(如果有)、最新更新时间(如果有)以及上一篇/下一篇(如果有)。
 但是如果我们不想生成这样的页面，而是想使用自定义布局，也就是使用`Vue`组件来进行自定义页面开发，VuePress提供给了我们这样的能力，它在**保留导航栏**的基础上，其它一切我们都可以自定义的，它的配置可能是这样的

```
// 在需要自定义的.md文件中使用YAML语法
---
layout: customerComponent
---
```

上面这样的一个组件名，它对应的路径为`.vuepress/components/customerComponent.vue`，由于 VuePress会自动帮我们把`.vuepress/components`目录下的所有组件全部注册，这样我们可以在任何一个`.md`文件中进行使用





### 1.在compontents文件夹下注册组件

根据我们的博客目录结构，我们要将自定义的布局组件放在 components文件夹下，

![](https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206051950484.jpg)

并且我的组件对应的css样式与components文件夹同级



**然后我们就可以在组件中编写对应的代码了**



#### 一个demo🌰

```
<template>
  <div class="customer-component">
    <div class="left">123</div>
    <div class="center">123</div>
    <div class="right">123</div>
  </div>
</template>
<style lang="stylus">
  .customer-component
    height: calc(100vh - 60px);
    display: flex;
    background-color: #333;
    color: #fff;
    & > div
      flex: 0 0 200px;
      width: 200px;
      text-align: center
    .left
      background-color: #58a;
    .center
      flex: 1;
      background-color: #fb3;
    .right
      background-color: #58a;
</style>
```



最终显示效果：

![](https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206051950089.jpg)





### 2.在对应的文章中引用该组件

![](https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206051952270.jpg)