[TOC]



### 一.弹性盒子

#### 1.**声明定义**

容器盒子里面包含着容器元素，使用 `display:flex` 或 `display:inline-flex` 声明为弹性盒子。

#### 2.flex-direction

用于控制盒子元素排列的方向。

| 值             | 描述                           |
| :------------- | :----------------------------- |
| row            | 从左到右水平排列元素（默认值） |
| row-reverse    | 从右向左排列元素               |
| column         | 从上到下垂直排列元素           |
| column-reverse | 从下到上垂直排列元素           |

#### 3.flex-wrap

flex-wrap 属性规定flex容器是单行或者多行，同时横轴的方向决定了新行堆叠的方向。

| 选项         | 说明                                             |
| :----------- | :----------------------------------------------- |
| nowrap       | 元素不拆行或不拆列（默认值）                     |
| wrap         | 容器元素在必要的时候拆行或拆列。                 |
| wrap-reverse | 容器元素在必要的时候拆行或拆列，但是以相反的顺序 |

**行元素换行**

<img src="E:\note\前端\笔记\css\图片\flex-行元素换行.png" style="zoom:67%;" />

```css
    flex-direction: row;
    flex-wrap: wrap;
```

**水平排列反向换行**

<img src="E:\note\前端\笔记\css\图片\flex-水平排列反向换行.png" style="zoom:67%;" />

```css
flex-direction: row;
flex-wrap: wrap-reverse;
```

**垂直元素换行**

<img src="E:\note\前端\笔记\css\图片\flex-垂直元素换行.png" style="zoom:67%;" />

```css
flex-direction: column;
flex-wrap: wrap;
```

**垂直元素反向换行**

<img src="E:\note\前端\笔记\css\图片\flex-垂直元素反向换行.png" style="zoom:67%;" />

```css
flex-direction: column;
flex-wrap: wrap-reverse;
```

#### 3.flex-flow

`flex-flow` 是 `flex-direction` 与 `flex-wrap` 的组合简写模式。

举例：
下面是从右向左排列，换行向上拆分行。

<img src="E:\note\前端\笔记\css\图片\flex-flow.png" style="zoom:67%;" />

```css
flex-flow: row-reverse wrap-reverse;
```

#### 4.justify-content

用于控制元素在主轴上的排列方式，注意是**主轴的排列方式**。

| 选项          | 说明                                                         |
| :------------ | :----------------------------------------------------------- |
| flex-start    | 元素紧靠主轴起点                                             |
| flex-end      | 元素紧靠主轴终点                                             |
| center        | 元素从弹性容器中心开始                                       |
| space-between | 第一个元素靠起点，最后一个元素靠终点，余下元素平均分配空间   |
| space-around  | 每个元素两侧的间隔相等。所以，元素之间的间隔比元素与容器的边距的间隔大一倍 |
| space-evenly  | 元素间距离平均分配                                           |

**①水平排列元素，并使用 `justify-content: flex-end` 对齐到主轴终点**

<img src="E:\note\前端\笔记\css\图片\justify-content-flex-end.png" style="zoom:67%;" />

```css
display: flex;
flex-flow: row wrap;
justify-content: flex-end;
```

**②使用 `space-evenly` 平均分配容器元素**

<img src="E:\note\前端\笔记\css\图片\justify-content-space-evenly.png" style="zoom:67%;" />

```css
  display: flex;
  flex-flow: row wrap;
  justify-content: space-evenly;
```

**③垂直排列时对齐到主轴终点**

<img src="E:\note\前端\笔记\css\图片\justify-content- flex-end（垂直方向）.png" style="zoom:67%;" />

```css
  display: flex;
  flex-flow: column wrap;
  justify-content: flex-end;
```

#### 5.align-items

- align-item是控制元素在行上的排列(适用于单行元素)
- align-content是控制行在交差轴上的排列(适用于多行元素)

**align-items**

用于控制容器元素在交叉轴上的排列方式。

| 选项       | 说明                           |
| :--------- | :----------------------------- |
| stretch    | 元素被拉伸以适应容器（默认值） |
| center     | 元素位于容器的中心             |
| flex-start | 元素位于容器的交叉轴开头       |
| flex-end   | 元素位于容器的交叉轴结尾       |

**拉伸适应交叉轴**

如果给子盒子设置了 `width | height | min-height | min-width | max-width | max-height` ，将影响`stretch` 的结果，因为 `stretch` 优先级低于宽高设置。

<img src="E:\note\前端\笔记\css\图片\strech.png" style="zoom:67%;" />

```css
  article {/*父盒子*/
    height: 200px;
    border: solid 5px silver;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: stretch;
  }
  article div {/*子盒子*/
    width: 80px;
    border: solid 5px blueviolet;
    text-align: center;
    font-size: 28px;
  }
```

**对齐到交叉轴的顶部**

<img src="E:\note\前端\笔记\css\图片\对齐到交叉轴的顶部.png" style="zoom:67%;" />

```css
flex-direction: row;
align-items: flex-start;
```

**对齐到交叉轴底部**

<img src="E:\note\前端\笔记\css\图片\对齐到交叉轴底部.png" style="zoom:67%;" />

```css
flex-direction: row;
align-items: flex-end;
```

**对齐到交叉轴中心**

<img src="E:\note\前端\笔记\css\图片\对齐到交叉轴中心.png" style="zoom:67%;" />

```css
flex-direction: row;
align-items: center;
```

纵向排列时交叉轴排列

<img src="E:\note\前端\笔记\css\图片\纵向排列时交叉轴排列.png" style="zoom:67%;" />

```css
    display: flex;
    flex-direction: column;
    align-items: center;
```

#### 5.align-content

只适用于多行显示的弹性容器，用于控制行（而不是元素）在交叉轴上的排列方式。

| 选项          | 说明                                                         |
| :------------ | :----------------------------------------------------------- |
| stretch       | 将空间平均分配给元素                                         |
| flex-start    | 元素紧靠主轴起点                                             |
| flex-end      | 元素紧靠主轴终点                                             |
| center        | 元素从弹性容器中心开始                                       |
| space-between | 第一个元素靠起点，最后一个元素靠终点，余下元素平均分配空间   |
| space-around  | 每个元素两侧的间隔相等。所以，项目之间的间隔比项目与边框的间隔大一倍 |
| space-evenly  | 元素间距离平均分配                                           |

**水平排列在交叉轴中居中排列**

<img src="E:\note\前端\笔记\css\图片\水平排列在交叉轴中居中排列.png" style="zoom:67%;" />

```css
    display: flex;
    flex-direction: row;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: center;
```

**垂直排列时交叉轴的排列**

<img src="E:\note\前端\笔记\css\图片\垂直排列时交叉轴的排列.png" style="zoom:67%;" />

```css
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
    align-items: flex-start;
    align-content: center;
```



### 二.弹性元素

放在容器盒子中的元素即为容器元素。

- 不能使用float与clear规则
- 弹性元素均为块元素
- 绝对定位的弹性元素不参与弹性布局

#### 1.align-self

用于控制单个元素在交叉轴上的排列方式，`align-items` 用于控制容器中所有元素的排列，而 `align-self` 用于控制一个弹性元素的交叉轴排列。

| 选项       | 说明                   |
| :--------- | :--------------------- |
| stretch    | 将空间平均分配给元素   |
| flex-start | 元素紧靠主轴起点       |
| flex-end   | 元素紧靠主轴终点       |
| center     | 元素从弹性容器中心开始 |

```css
<style>
  * {
    padding: 0;
    margin: 0;
    padding: 10px;
    margin: 5px;
  }
  article {
    height: 400px;
    border: solid 5px silver;
    box-sizing: border-box;
    display: flex;
    flex-direction: row;
    align-items: center;
  }
  article div {
    height: 50px;
    min-width: 50px;
    border: solid 5px blueviolet;
    text-align: center;
    font-size: 28px;
  }
  article div:nth-of-type(1) {
    align-self: flex-start;
  }
  article div:nth-of-type(3) {
    align-self: flex-end;
  }
</style>
...

<article>
    <div>1</div>
    <div>2</div>
    <div>3</div>
</article>
```

<img src="E:\note\前端\笔记\css\图片\align-self.png" style="zoom:67%;" />

#### 2.flex-grow

用于将弹性盒子的可用空间，分配给弹性元素。可以使用整数或小数声明。

举例：

为三个DIV 弹性元素设置了1、3、6 ，即宽度分成10等份，第三个元素所占宽度为`(宽度/(1+3+6)) X 6`。

#### 3.flex-shrink

与 `flex-grow` 相反 `flex-shrink` 是在弹性盒子装不下元素时定义的缩小值。

下例在600宽的弹性盒子中放了 1000 宽的弹性元素。并为最后两个元素设置了缩放，最后一个元素的缩放比例为 500 -( ( (1000-600) / (100X1+400x3+500X6) ) x 3 ) X 500 = 220.9，计算公式说明如下：

```text
缩小比例 = 不足的空间 / (元素 1 宽度 x 缩小比例) + (元素 2 宽度 x 缩小比例) ...
最终尺寸 = 元素三宽度 - (缩小比例 x  元素 3 的宽度) X 元素宽度
```

<img src="E:\note\前端\笔记\css\图片\flex-shrink.png" style="zoom:67%;" />

```css
    article div:nth-child(1) {
        flex-shrink: 0;
    }
    article div:nth-child(2) {
        flex-shrink: 1;
    }
    article div:nth-child(3) {
        flex-shrink: 3;
    }
```

#### 4.flex-basis

flex-basis 属性定义了在分配多余空间之前，项目占据的主轴空间（main size）。浏览器根据这个属性，计算主轴是否有多余空间。

可以是长度单位，也可以是百分比。`flex-basis`的优先级高于`width、height`属性。

**优先级**

flex-basis 优先级大于 width、height。

<img src="E:\note\前端\笔记\css\图片\flex-basis.png" style="zoom:67%;" />

```css
<style>
  * {
    padding: 0;
    margin: 0;
  }
  article {
    width: 600px;
    position: relative;
    height: 150px;
    margin-left: 100px;
    margin-top: 100px;
    outline: solid 5px silver;
    display: flex;
    padding: 20px;
  }
  article div {
    outline: solid 5px blueviolet;
    text-align: center;
    font-size: 28px;
    line-height: 5em;
  }
  article div:nth-of-type(1) {
    flex-basis: 100px;
    width: 200px;
  }
  article div:nth-of-type(2) {
    flex-basis: 200px;
  }
  article div:nth-of-type(3) {
    flex-basis: 200px;
  }
</style>
...

<article>
  <div>1</div>
  <div>2</div>
  <div>3</div>
</article>
```

#### 5.flex

flex是flex-grow、flex-shrink 、flex-basis缩写组合。

> 建议使用 flex 面不要单独使用 flex-grow / flew-shrink / flex-basis 。

#### 6.order

用于控制弹性元素的位置，默认为 `order:0` 数值越小越在前面，可以负数或整数。