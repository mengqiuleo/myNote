# 【CSS】圣杯、双飞翼布局

[TOC]



## 圣杯布局

<img src="E:\note\前端\笔记\css\圣杯双飞翼\圣杯.jpg" style="zoom:50%;" />

> 左右固定，中间自适应，并且中间内容优先加载



### 基本布局样式

- 因为要优先加载，所以中间区域放在布局的最前面。
- 为了让中间三个区域在一行显示，为它们包裹起来，并设置浮动。
- 设置浮动后，发现底部也跑到了上面，和中间三个元素在一行，所以要**清除浮动**。

```html
  <style>
    .center{
      background-color: brown;
    }
    .left {
      background-color: skyblue;
    }
    .right {
      background-color: aquamarine;
    }
    .center,.left,.right {
      float: left;
      font-size: 30px;
    }
    .clearfix::after {
      content: "";
      display: block;
      clear: both;
    }
  </style>

<body>
  <header>头部</header>
  <div class="clearfix">
    <!-- 因为要优先加载，所以中间区域放在布局的最前面 -->
    <div class="center">主区域</div>
    <div class="left">左区域</div>
    <div class="right">右区域</div>
  </div>
  <footer>底部</footer>
</body>
```

页面初始化：

![](E:\note\前端\笔记\css\圣杯双飞翼\初始化.jpg)





### 接下来要把主区域移动到中间

- 先为中间三个区域的父元素添加内边距padding，值为左区域的宽度 `padding: 0 100px;`
- 为中间区域（主区域）添加宽度 `width：100%；`
- 为左区域设置左外边距 `margin-left：-100%；`
- 此时主区域就成功的显示在中间了

![](E:\note\前端\笔记\css\圣杯双飞翼\图.jpg)



```html
  <style>
    .center{
      background-color: brown;
      width: 100%;
    }
    .left {
      background-color: skyblue;
      width: 100px;
      margin-left: -100%;
    }
    .right {
      background-color: aquamarine;
      width: 100px;
    }
    .center,.left,.right {
      float: left;
      font-size: 30px;
    }
    .clearfix::after {
      content: "";
      display: block;
      clear: both;
    }
    .wrapper {
      padding: 0 100px;
    }
  </style>


<body>
  <header>头部</header>
  <div class="clearfix wrapper">
    <!-- 因为要优先加载，所以中间区域放在布局的最前面 -->
    <div class="center">主区域</div>
    <div class="left">左区域</div>
    <div class="right">右区域</div>
  </div>
  <footer>底部</footer>
</body>
```

![](E:\note\前端\笔记\css\圣杯双飞翼\1.jpg)

此时左区域已正常的放在了左边，但右区域还未正常显示



### 把右区域放在主区域的右边

- 给右区域设置左外边距，值为自己（右区域）的宽度 `margin-left: -100px;`

![](E:\note\前端\笔记\css\圣杯双飞翼\图2.jpg)



此时右区域已经成功的放在了右边

![](E:\note\前端\笔记\css\圣杯双飞翼\2.jpg)



但此时出现了一个问题：左右区域会挡住主区域的内容



### 移动左右区域，防止两边挡住中间

- 给左右区域设置定位 `posotion: relative;`
- 并设置左右距离为自己的宽度
- 此时就实现了圣杯布局

![](E:\note\前端\笔记\css\圣杯双飞翼\图3.jpg)



```css
    .left {
      position: relative;
      left: -100px;
    }
    .right {
      position: relative;
      right: -100px;
    }
```

![](E:\note\前端\笔记\css\圣杯双飞翼\3.jpg)



### 完整代码

```html
  <style>
    .center{
      background-color: brown;
      width: 100%;
    }
    .left {
      background-color: skyblue;
      width: 100px;
      margin-left: -100%;
      position: relative;
      left: -100px;
    }
    .right {
      background-color: aquamarine;
      width: 100px;
      margin-left: -100px;
      position: relative;
      right: -100px;
    }
    .center,.left,.right {
      float: left;
      font-size: 30px;
    }
    .clearfix::after {
      content: "";
      display: block;
      clear: both;
    }
    .wrapper {
      padding: 0 100px;
    }
  </style>


<body>
  <header>头部</header>
  <div class="clearfix wrapper">
    <!-- 因为要优先加载，所以中间区域放在布局的最前面 -->
    <div class="center">主区域</div>
    <div class="left">左区域</div>
    <div class="right">右区域</div>
  </div>
  <footer>底部</footer>
</body>
```





## 双飞翼布局

> 双飞翼布局和圣杯布局要实现的效果相同，只不过是实现的方式不同



### 基本布局样式

- 左右区域各自设置宽度为100px

- 给中间三个元素设置浮动，使中间三个元素显示在同一行，并清除浮动对底部的影响
- 给中间区域设置宽度 `width: 100%`
- 给左区域设置左外边距 `margin-left: -100%`
- 给右区域设置左外边距 `margin-left: -100px`

![](E:\note\前端\笔记\css\圣杯双飞翼\飞1.jpg)



```html
  <style>
    .center,.left,.right {
      float: left;
      font-size: 30px;
    }
    .footer {
      clear: both;
    }
    .center{
      background-color: brown;
      width: 100%;
    }
    .left {
      background-color: skyblue;
      width: 100px;
      margin-left: -100%;
    }
    .right {
      background-color: aquamarine;
      width: 100px;
      margin-left: -100px;
    }
  </style>


<body>
  <header>头部</header>
    <!-- 因为要优先加载，所以中间区域放在布局的最前面 -->
    <div class="center">主区域</div>
    <div class="left">左区域</div>
    <div class="right">右区域</div>
  <footer class="footer">底部</footer>
</body>
```



![](E:\note\前端\笔记\css\圣杯双飞翼\飞2.jpg)

此时已经实现了基本的布局，但是左右区域会将主区域挡住



### 使左右区域移开，不要挡住主区域

我们可以给主区域设置外边距，使主区域向中间缩进

这里要注意，不能直接给主区域添加外边距margin，这样会使整个中间区域一起跑掉

举例：

```css
    .center{
      background-color: brown;
      width: 100%;
      margin: 0 100px;
    }
```

![](E:\note\前端\笔记\css\圣杯双飞翼\飞3.jpg)



#### 需要为主区域包裹一个wrapper父元素

- 将主区域的宽度和浮动都添加在那个wrapper父元素上
- 主区域负责设置外边距margin

![](E:\note\前端\笔记\css\圣杯双飞翼\飞4.jpg)

```css
    .wrapper {
      width: 100%;
      float: left;
    }
    .center {
      margin-left: 100px;
        /* 值为左右区域的宽度 */
      margin-right: 100px;
    }
```

```html 
<body>
  <header>头部</header>
    <!-- 因为要优先加载，所以中间区域放在布局的最前面 -->
    <div class="wrapper">
      <div class="center">主区域</div>
    </div>
    <div class="left">左区域</div>
    <div class="right">右区域</div>
  <footer class="footer">底部</footer>
</body>
```

此时就实现了双飞翼布局

![](E:\note\前端\笔记\css\圣杯双飞翼\飞5.jpg)



### 完整代码

```html
  <style>
    .left,.right {
      float: left;
      font-size: 30px;
    }
    .footer {
      clear: both;
    }
    .center{
      background-color: brown;
      font-size: 30px;
    }
    .left {
      background-color: skyblue;
      width: 100px;
      margin-left: -100%;
    }
    .right {
      background-color: aquamarine;
      width: 100px;
      margin-left: -100px;
    }
      
  /* 以下是对主区域的设置 */
    .wrapper {
      width: 100%;
      float: left;
    }
    .center {
      margin-left: 100px;
      /* 值为左右区域的宽度 */
      margin-right: 100px;
    }
  </style>
  
  
<body>
  <header>头部</header>
    <!-- 因为要优先加载，所以中间区域放在布局的最前面 -->
    <div class="wrapper">
      <div class="center">主区域</div>
    </div>
    <div class="left">左区域</div>
    <div class="right">右区域</div>
  <footer class="footer">底部</footer>
</body>
```





## 二者对比

![](E:\note\前端\笔记\css\圣杯双飞翼\对比1.jpg)

![](E:\note\前端\笔记\css\圣杯双飞翼\对比2.jpg)