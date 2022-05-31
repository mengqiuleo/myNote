## 【css】三栏布局

三栏布局主要是前后两列定宽，中间自适应

![](E:\note\前端\笔记\css\三栏布局\1.jpg)

[TOC]





### 1.浮动 + margin

左边元素左浮动，右边元素有浮动，并给两遍元素都设置宽度。

然后给中间元素设置 `margin-left`和 `margin-right`，值都等于左右元素的宽度。

```html
<style>
      .container {
        background-color: bisque;
      }
      .left {
        background-color: aquamarine;
        float: left;
        width: 100px;
      }
      .right {
        background-color: brown;
        float: right;
        width: 100px;
      }
      .main {
        background-color: blanchedalmond;
        margin-left: 100px;
        margin-right: 100px;
      }
    </style>

  <body>
    <div class="container">
      <div class="left">左侧固定</div>
      <div class="right">右侧固定</div>
      <div class="main">中间自适应</div>
    </div>
  </body>
```

![](E:\note\前端\笔记\css\三栏布局\2.jpg)



### 2.浮动 + BFC

左边元素左浮动，右边元素有浮动，并给两遍元素都设置宽度。

然后给中间元素设置BFC，通过`overflow`实现

```html
<style>
      .container {
        background-color: bisque;
      }
      .left {
        background-color: aquamarine;
        float: left;
        width: 100px;
      }
      .right {
        background-color: brown;
        float: right;
        width: 100px;
      }
      .main {
        background-color: blanchedalmond;
        overflow: hidden;
      }
    </style>

  <body>
    <div class="container">
      <div class="left">左侧固定</div>
      <div class="right">右侧固定</div>
      <div class="main">中间自适应</div>
    </div>
  </body>
```



### 3. flex 

给父元素设置flex布局，然后给指定元素设置`flex: 1`

```html
<style>
      .container {
        background-color: bisque;
        display: flex;
      }
      .left {
        background-color: aquamarine;
        width: 100px;
      }
      .right {
        background-color: brown;
        width: 100px;
      }
      .main {
        background-color: blanchedalmond;
        flex: 1;
      }
    </style>

  <body>
    <div class="container">
      <div class="left">左侧固定</div>
      <div class="right">右侧固定</div>
      <div class="main">中间自适应</div>
    </div>
  </body>
```



### 4.定位

给父元素和左右子元素设置定位，并给左右子元素设置宽度和left/right，然后给中间元素设置`margin-left`和`margin-right`

```html
<style>
      .container {
        background-color: bisque;
        position: relative;
      }
      .left {
        background-color: aquamarine;
        position: absolute;
        width: 100px;
        left: 0;
      }
      .right {
        background-color: brown;
        position: absolute;
        width: 100px;
        right: 0;
      }
      .main {
        background-color: blanchedalmond;
        margin-left: 100px;
        margin-right: 100px;
      }
    </style>

  <body>
    <div class="container">
      <div class="left">左侧固定</div>
      <div class="right">右侧固定</div>
      <div class="main">中间自适应</div>
    </div>
  </body>
```



b站相关视频：[前端菌告诉你们前端最简单易懂的CSS三栏布局](https://www.bilibili.com/video/BV1iF41147Vq?from=search&seid=12524588234504428871&spm_id_from=333.337.0.0)