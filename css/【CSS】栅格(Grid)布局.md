# 【CSS】栅格(Grid)布局

[TOC]



## 声明栅格

```
display: grid;
display: inline-grid;
```



## 划分行列

- 使用 grid-template-columns 划分列数

- 使用 grid-template-rows 划分行数

`grid-tempalte` 是 `grid-template-rows`、`grid-template-columns`、`grid-template-areas` 的三个属性的简写。



### 一个🌰

```css
/** 两行三列 */
div {
  grid-template-rows: 100px 100px;
  grid-template-columns: 100px 100px 100px;
}

/** 使用百分比 */
div {
  display: grid;
  grid-template-rows: 50% 50%;
  grid-template-columns: 25% 25% 25% 25%;
}

/** 使用repeat统一设置值,第一个参数为重复数量，第二个参数是重复值 */
div {
  grid-template-rows: repeat(2, 50%);
  grid-template-columns: repeat(2, 50%);
}

div {
  display: grid;
  grid-template-rows: repeat(2, 50%);
  grid-template-columns: repeat(2, 100px 50px);
}

/** 自动填充：根据容器尺寸，自动设置元素尺寸 */
div {
  width: 300px;
  height: 200px;
  display: grid;
  grid-template-rows: repeat(auto-fill, 100px);
  grid-template-columns: repeat(auto-fill, 100px);
  /* 两行三列 （300/100,200/100） */
}

/** 使用fr设置比例 */
div {
  width: 300px;
  height: 200px;
  display: grid;
  grid-template-rows: 1fr 2fr;
  grid-template-columns: 100px 1fr 2fr;
}

/** 组合使用 */
div {
  width: 300px;
  height: 100px;
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: repeat(2, 1fr 2fr);
}

/** 使用auto自动填充 */
div {
  display: grid;
  grid-template-rows: repeat(2, 1fr);
  grid-template-columns: 20vw auto 30vw; 
}
```



### 简写形式的🌰

```css
/** 简写形式 */
grid-template: 10vh 20vh 10vh/ 30vw 1fr;
grid-template: repeat(3, 100px) / repeat(3, 100px);
```



## 行列间距

- row-gap 行间距
- coliumn-gap 列间距
- gap 组合定义

```css
row-gap: 30px;
column-gap: 20px;
gap: 20px 10px;
gap: 20px;/*行列间距都为20px*/
```



## 栅格命名

```css
grid-template-rows: [r1-start] 100px [r1-end r2-start] 100px [r2-end r3-start] 100px [r3-end];

grid-template-columns: [c1-start] 100px [c1-end c2-start] 100px [c2-start c3-start] 100px [c3-end];

/* 控制某个元素的位置 */
    div:first-child {
        grid-row-start: r2-start;
        grid-column-start: c1-end;
        grid-row-end: r2-end;
        grid-column-end: c3-start;
    }
```



```css
grid-template-rows: repeat(3, [r-start] 100px [r-end]);
grid-template-columns: repeat(3, [c-start] 100px [c-end]);

/* 对于重复设置的栅格系统会自动命名，使用时使用 c 1、c 2 的方式定位栅格 */
    div:first-child {
        grid-row-start: r-start 2;
        grid-column-start: c-start 2;
        grid-row-end: r-start 2;
        grid-column-end: c-end 2;
    }
```



## 元素定位

| 样式属性          | 说明         |
| ----------------- | ------------ |
| grid-row-start    | 行开始栅格线 |
| grid-row-end      | 行结束栅格线 |
| grid-column-start | 列开始栅格线 |
| grid-column-end   | 列结束栅格线 |



`grid-area`

是同时对 `grid-row` 与 `grid-column` 属性的组合声明。

```css
grid-row-start/grid-column-start/grid-row-end/grid-column-end

grid-area: 2/2/4/4;/* 2行2列开始，4行4列结束*/
```



### 一个🌰

```css
grid-template-rows: repeat(4, 1fr);
grid-template-columns: repeat(4, 1fr);

div {
   grid-row-start: 2;
   grid-row-end: 4;
   grid-column-start: 2;
   grid-column-end: 4;
}
```



```css
 grid-template-rows: [r1-start] 100px [r1-end r2-start] 100px [r2-end r3-start] 100px [r3-end];
 grid-template-columns: [c1-start] 100px [c1-end c2-start] 100px [c2-start c3-start] 100px [c3-end];

    div:first-child {
        grid-row-start: r1-end;
        grid-column-start: c2-start;
        grid-row-end: r3-start;
        grid-column-end: c3-start;
    }
```



**简写形式**

```
grid-row: 2/4;
grid-column: 2/4;
```



### 根据偏移量(span)定位

```css
div {
  grid-row-start: 2;
  grid-column-start: 2;
  grid-row-end: span 3;
  grid-column-end: span 2;
  /* 2行2列开始，行偏移3，列偏移2 */
}
```





## 栅格对齐

| 选项            | 说明                                             | 对象     |
| --------------- | ------------------------------------------------ | -------- |
| justify-content | 所有栅格在容器中的水平对齐方式，容器有额外空间时 | 栅格容器 |
| align-content   | 所有栅格在容器中的垂直对齐方式，容器有额外空间时 | 栅格容器 |
| align-items     | 栅格内所有元素的垂直排列方式                     | 栅格容器 |
| justify-items   | 栅格内所有元素的横向排列方式                     | 栅格容器 |





### justify-content 和 align-content (栅格在容器内的排列)

属性的值如下

| 值            | 说明                                                         |
| ------------- | ------------------------------------------------------------ |
| start         | 容器左边                                                     |
| end           | 容器右边                                                     |
| center        | 容器中间                                                     |
| stretch       | 撑满容器                                                     |
| space-between | 第一个栅格靠左边，最后一个栅格靠右边，余下元素平均分配空间   |
| space-around  | 每个元素两侧的间隔相等。所以，栅格之间的间隔比栅格与容器边距的间隔大一倍 |
| space-evenly  | 栅格间距离完全平均分配                                       |



### justify-items 和 align-items (所有元素在栅格内的排列)

justify-items 和 align-items 的属性值如下

| 值      | 说明               |
| ------- | ------------------ |
| start   | 元素对齐栅格的左边 |
| end     | 元素对齐栅格的右边 |
| center  | 元素对齐栅格的中间 |
| stretch | 水平撑满栅格       |



## 元素单独对齐

justify-self与align-self控制单个栅格内元素的对齐方式，属性值与justify-items和align-items是一致的。

| 值      | 说明               |
| ------- | ------------------ |
| start   | 元素对齐栅格的左边 |
| end     | 元素对齐栅格的右边 |
| center  | 元素对齐栅格的中间 |
| stretch | 水平撑满栅格       |

```css
div:first-child {
  justify-self: end;
  align-self: center;
}

div:nth-child(4) {
  justify-self: start;
  align-self: center;
}
```

