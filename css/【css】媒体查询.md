# 【css】媒体查询

[TOC]





> #### 媒体查询：
>
> Media Queries能在不同的条件下使用不同的样式，使页面在不同在终端设备下达到不同的渲染效果。



## 一、认识viewport

> 通俗的讲，移动设备上的viewport就是设备的屏幕上能用来显示我们的网页的那一块区域。
>
> 在默认情况下，一般来讲，移动设备上的viewport都是要大于浏览器可视区域的，这是因为考虑到移动设备的分辨率相对于桌面电脑来说都比较小，所以为了能在移动设备上正常显示那些传统的为桌面浏览器设计的网站，移动设备上的浏览器都会把自己默认的viewport设为980px或1024px。
>
> 但带来的后果就是浏览器会出现横向滚动条，因为浏览器可视区域的宽度是比这个默认的viewport的宽度要小的。



手机是在电脑后出现的，早期网页设置没有考虑到手机的存在。把一个电脑端访问的网页拿到手机上浏览，我们需要告诉手机该怎么做。

我们不能让手机浏览器使用PC端的分辨率来展示网页，这会让高分辨率的手机上造成文字过小。

使用viewport可以将手机物理分辨率合理转为浏览器分辨率。

viewport是虚拟窗口，虚拟窗口大于手机的屏幕尺寸。手机端浏览器将网页放在这个大的虚拟窗口中，我们就可以通过拖动屏幕看到网页的其他部分。

但有时需要控制viewport虚拟窗口的尺寸或初始的大小，比如希望viewport完全和屏幕尺寸一样宽。



## 二、关于三个viewport的理论

移动设备上有三个viewport。

### layout viewport（布局视口）

布局视口默认为980px，

布局视口定义了pc网页在移动端的默认布局行为。

默认为布局视口时，根植于pc端的网页在移动端展示很模糊。

这个`layout viewport`的宽度可以通过 `document.documentElement.clientWidth` 来获取。

![](E:\note\前端\笔记\css\媒体查询\布局视口.png)







### visual viewport（视觉视口）

视觉视口表示浏览器内看到的网站的显示区域，用户可以通过缩放来查看网页的显示内容，从而改变视觉视口。视觉视口的定义，就像拿着一个放大镜分别从不同距离观察同一个物体，视觉视口仅仅类似于放大镜中显示的内容，因此视觉视口不会影响布局视口的宽度和高度。

`visual viewport`的宽度可以通过`window.innerWidth` 来获取

![](E:\note\前端\笔记\css\媒体查询\视觉视口.png)



### ideal viewport（理想视口）

 因为现在越来越多的网站都会为移动设备进行单独的设计，所以必须还要有一个能完美适配移动设备的viewport。所谓的完美适配指的是，首先不需要用户缩放和横向滚动条就能正常的查看网站的所有内容；第二，显示的文字的大小是合适，比如一段14px大小的文字，不会因为在一个高密度像素的屏幕里显示得太小而无法看清，理想的情况是这段14px的文字无论是在何种密度屏幕，何种分辨率下，显示出来的大小都是差不多的。当然，不只是文字，其他元素像图片什么的也是这个道理。

ideal viewport并没有一个固定的尺寸，不同的设备拥有有不同的ideal viewport。



## 三、利用meta标签对viewport进行控制

移动设备默认的viewport是layout viewport，也就是那个比屏幕要宽的viewport，但在进行移动设备网站的开发时，我们需要的是ideal viewport。

使用meta标签：

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
```

meta viewport 有6个属性:

| width         | 设置 layout viewport 的宽度，为一个正整数，或字符串"device-width" |
| ------------- | ------------------------------------------------------------ |
| initial-scale | 设置页面的初始缩放值，为一个数字，可以带小数                 |
| minimum-scale | 允许用户的最小缩放值，为一个数字，可以带小数                 |
| maximum-scale | 允许用户的最大缩放值，为一个数字，可以带小数                 |
| height        | 设置 layout viewport 的高度，这个属性对我们并不重要，很少使用 |
| user-scalable | 是否允许用户进行缩放，值为"no"或"yes", no 代表不允许，yes代表允许 |



### width  

在移动端布局时，在meta标签中我们会将width设置称为`device-width`，`device-width`一般是表示分辨率的宽，通过`width=device-width`的设置我们就将布局视口设置成了理想的视口。



### JS延迟

设置 user-scalable=no 时可以js解决300延迟的问题，你也可以理解为当设置 user-scalable=yes 时，系统要识别两只手指，所以要有个宽容时间。

user-scalable=no 代表 不允许用户进行缩放



## 四、媒体设备

常用媒体类型

| 选项   | 说明                               |
| ------ | ---------------------------------- |
| all    | 所有媒体类型                       |
| screen | 用于电脑屏幕，平板电脑，智能手机等 |
| print  | 打印设备                           |
| speech | 应用于屏幕阅读器等发声设备         |

- 可以使用 link 与 style 中定义媒体查询
- 也可以使用 `@import url(screen.css) screen` 形式媒体使用的样式
- 可以用逗号分隔同时支持多个媒体设备
- 未指定媒体设备时等同于all



### style

```css
    <style media="screen">
        h1 {
            font-size: 3em;
            color: blue;
        }
    </style>
    <style media="print">
        h1 {
            font-size: 8em;
            color: red;
        }

        h2,
        hr {
            display: none;
        }
    </style>
```

可以指定某种style样式只针对于某些媒体设备



### link

在 `link` 标签中通过 `media` 属性可以设置样式使用的媒体设备。

- `common.css` 没有指定媒体所以全局应用
- `screen.css` 应用在屏幕设备
- `print.css` 应用在打印设备

```css
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>document</title>
    <link rel="stylesheet" href="common.css">
    <link rel="stylesheet" href="screen.css" media="screen">
    <link rel="stylesheet" href="print.css" media="print">
</head>

<body>
    <h1>123</h1>
    <hr>
    <h2>456</h2>
</body>
```

**common.css**

```css
h1 {
    outline: solid 5px #e74c3c;
}
```

**screen.css**

```css
h1 {
    font-size: 3em;
    color: blue;
}
```

**print.css**

```css
h1 {
    font-size: 8em;
    color: red;
}

h2,hr {
    display: none;
}
```



### @import

可以将所有的媒体适配规则放在一个css文件中，然后在入口文件中引入这个css

入口文件：

```css
<link rel="stylesheet" href="style.css">
```

style.css:

```css
@import url(screen.css) screen;
@import url(print.css) print;
```



### @media

```css
    <style>
        @media screen {
            h1 {
                font-size: 3em;
                color: blue;
            }
        }

        @media print {
            h1 {
                font-size: 8em;
                color: red;
            }

            h2,
            hr {
                display: none;
            }
        }
    </style>
```



### 多设备支持

可以用逗号分隔同时支持多个媒体设备。

```css
@import url(screen.css) screen,print;

<link rel="stylesheet" href="screen.css" media="screen,print">
 
@media screen,print {...}
```



## 五、查询条件

### 设备方向

使用 `orientation` 属性可以定义设备的方向

| 值        | 说明                   |
| --------- | ---------------------- |
| portrait  | 竖屏设备即高度大于宽度 |
| landscape | 横屏设备即宽度大于高度 |



### 逻辑与

```css
        @media screen and (orientation: landscape) and (max-width: 600px) {
            body {
                background: #8e44ad;
            }

            h1 {
                font-size: 3em;
                color: white;
            }
        }
```

要求：

- 横屏显示
- 宽度不能超过600px



### 逻辑或

多个`或` 条件查询**使用逗号连接**，不像其他程序中使用 `or` 语法。

```css
        @media screen and (orientation: landscape),
        screen and (max-width: 600px) {
            body {
                background: #8e44ad;
            }

            h1 {
                font-size: 3em;
                color: white;
            }
        }
```

要求：

如果设备是横屏显示或宽度不超600px时



### 不应用

`not` 表示不应用样式，即所有条件**都满足**时**不应用**样式。

**必须将not写在查询的最前面**

```css
        @media not screen and (orientation: landscape) and (max-width:600px) {
            body {
                background: #8e44ad;
            }

            h1 {
                font-size: 3em;
                color: white;
            }
        }
```

要求：满足上述条件时，不应用下面的样式



### only

用来排除不支持媒体查询的浏览器。

- 对支持媒体查询的设备，正常调用样式，此时就当only不存在
- 对不支持媒体查询的设备不使用样式
- only 和 not 一样只能出现在媒体查询的开始

```css
@media only screen and (orientation: landscape) and (max-width: 600px) {
	...
}

```



## 六、面试题：对媒体查询的理解？

媒体查询由⼀个可选的媒体类型和零个或多个使⽤媒体功能的限制了样式表范围的表达式组成，例如宽度、⾼度和颜⾊。媒体查询，添加⾃ CSS3，允许内容的呈现针对⼀个特定范围的输出设备⽽进⾏裁剪，⽽不必改变内容本身，适合 web ⽹⻚应对不同型号的设备⽽做出对应的响应适配。

媒体查询包含⼀个可选的媒体类型和满⾜ CSS3 规范的条件下，包含零个或多个表达式，这些表达式描述了媒体特征，最终会被解析为 true 或 false。如果媒体查询中指定的媒体类型匹配展示⽂档所使⽤的设备类型，并且所有的表达式的值都是 true，那么该媒体查询的结果为 true。那么媒体查询内的样式将会⽣效。

简单来说，使用 @media 查询，可以针对不同的媒体类型定义不同的样式。@media 可以针对不同的屏幕尺寸设置不同的样式，特别是需要设置设计响应式的页面，@media 是非常有用的。当重置浏览器大小的过程中，页面也会根据浏览器的宽度和高度重新渲染页面。



## 七、面试题：响应式设计的概念及基本响应式

网站设计`（Responsive Web design`）是一个网站能够兼容多个终端，而不是为每一个终端做一个特定的版本。

关于原理： 基本原理是通过媒体查询`（@media）`查询检测不同的设备屏幕尺寸做处理。

关于兼容： 页面头部必须有 meta 声明的`viewport`。

```css
<meta name="viewport" content="width=device-width,initial-scale=1.0 ,maximum-scale=1.0,user-scalable=no"/>
```

