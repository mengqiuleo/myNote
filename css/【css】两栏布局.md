# 【css】两栏布局

一般两栏布局指的是**左边一栏宽度固定，右边一栏宽度自适应**。

[TOC]



### 1.浮动 + margin

先将左元素设置定宽为100px，并左浮动。

然后给右元素设置`margin-left`，值等于左元素的宽度。

```html
<style>
      .container {
        background-color: bisque;
      }
      .left {
        width: 100px;
        background-color: aquamarine;
        float: left;
      }
      .right {
        background-color: brown;
        margin-left: 100px;
      }
    </style>

  <body>
    <div class="container">
      <div class="left">左侧固定</div>
      <div class="right">右侧自适应</div>
    </div>
  </body>
```

![](E:\note\前端\笔记\css\两栏布局\1.jpg)



### 2.浮动 + BFC

触发BFC后，右元素就会环绕着浮动的元素，不会被浮动的元素所覆盖。

```html
<style>
      .container {
        background-color: bisque;
      }
      .left {
        width: 100px;
        background-color: aquamarine;
        float: left;
      }
      .right {
        background-color: brown;
        overflow: hidden;
      }
    </style>

  <body>
    <div class="container">
      <div class="left">左侧固定</div>
      <div class="right">右侧自适应</div>
    </div>
  </body>
```

![](E:\note\前端\笔记\css\两栏布局\1.jpg)



### 3.定位 + margin-left

先给父元素和左子元素设置定位，然后给左子元素设置`left: 0 `并设置宽度，然后给右子元素设置` margin-left`，值等于左子元素的宽度。

```html
<style>
      .container {
        position: relative;
        background-color: bisque;
      }
      .left {
        width: 100px;
        background-color: aquamarine;
        position: absolute;
        left: 0;
      }
      .right {
        background-color: brown;
        margin-left: 100px;
      }
    </style>

  <body>
    <div class="container">
      <div class="left">左侧固定</div>
      <div class="right">右侧自适应</div>
    </div>
  </body>
```

![](E:\note\前端\笔记\css\两栏布局\1.jpg)



### 4.定位 

与上面的第三种方式类似，只不过是给右子元素设置 定位 和 left，而不是用`margin-left`

```html
<style>
      .container {
        position: relative;
        background-color: bisque;
      }
      .left {
        width: 100px;
        background-color: aquamarine;
        position: absolute;
        left: 0;
      }
      .right {
        background-color: brown;
        position: absolute;
        left: 100px;
      }
    </style>

  <body>
    <div class="container">
      <div class="left">左侧固定</div>
      <div class="right">右侧自适应</div>
    </div>
  </body>
```



### 5. flex

给父容器设置flex布局，然后给右子元素设置 `flex: 1`。

```html 
<style>
      .container {
        display: flex;
        background-color: bisque;
      }
      .left {
        width: 100px;
        background-color: aquamarine;
      }
      .right {
        background-color: brown;
        flex: 1;
      }
    </style>

  <body>
    <div class="container">
      <div class="left">左侧固定</div>
      <div class="right">右侧自适应</div>
    </div>
  </body>
```





