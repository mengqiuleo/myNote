# Map和ForEach的区别：返回值？修改原数组？

[TOC]



## 返回值？

**第一个区别就是forEach没有返回值，而Map返回一个新数组**



## 修改原数组？

第二个区别在于：**是否会修改原数组**。

这个问题得分情况讨论，需要看数组的每一项是基本数据类型，还是对象。



### ForEach的🌰

#### 基本数据类型

```js
let arr = [1,2,3];

arr.forEach((item) => {
  item = item*2;
})
console.log("arr",JSON.stringify(arr));//[1,2,3]
```

如果数组是基本数据类型，直接让遍历的遍历的值重新计算，不会修改原数组。



```js
let arr1 = [1,2,3];
arr1.forEach((item,index,arr1) => {
  arr1[index] = item*2;
})
console.log("arr1",JSON.stringify(arr1));//[2,4,6]
```

如果数组是基本数据类型，通过index下标修改元素的值，会修改原数组。



#### 对象

```js
let objArr = [
  { name: '张三', age: 20 },
  { name: '李四', age: 30 },
];

objArr.forEach((item) => {
  item = {
      name: '王五',
      age: '29',
  };
});
console.log(JSON.stringify(objArr));
// 打印结果：[{"name":"张三","age":20},{"name":"李四","age":30}]
```

数组的元素是引用数据类型时，直接通过形参修改对象，不会改变原数组。



```js
let objArr1 = [
  { name: '张三', age: 20},
  { name: '李四', age: 30 },
];

objArr1.forEach((item) => {
  item.name = '王五';
});
console.log(JSON.stringify(objArr1)); 
// 打印结果：[{"name":"王五","age":20},{"name":"王五","age":30}]

//---------------------------------------------------------------------------------------

let objArr2 = [
    { name: '张三', age: 28 },
    { name: '李四', age: 34 },
];

objArr2.forEach((item, index, arr) => {
    arr[index].name = '王五';
});
console.log(JSON.stringify(objArr2)); 
// 打印结果：[{"name":"王五","age":28},{"name":"王五","age":34}]
```

数组的元素是引用数据类型时，修改对象的某个属性，或者通过对象的index来修改，会改变原数组。





### Map的🌰

```js
//map的语法
arr.map(function (item, index, arr) {
    return newItem;
});
```



```js
var arr1 = [1, 3, 6, 2, 5, 6];

var arr2 = arr1.map(function (item, index,arr1) {
    //arr1[index] = item + 10;
    return item + 10; //让arr1中的每个元素加10
});
console.log(arr1);//[ 1, 3, 6, 2, 5, 6 ]


//--------------------------------------------------------------------------------------

const arr = [
  {
    name: "zs",
    age: 22,
  },
  {
    name: "Pan",
    age: 23,
  },
];

var arr3 = arr.map((item) => {
  item.name = "ls"; // 修改 item 里的某个属性
  return item;
});
console.log("arr",JSON.stringify(arr));
//arr [{"name":"ls","age":22},{"name":"ls","age":23}]

console.log("arr3",JSON.stringify(arr3));
//arr3 [{"name":"ls","age":22},{"name":"ls","age":23}]
```



```js
var arr1 = [1, 3, 6, 2, 5, 6];

var arr2 = arr1.map(function (item, index,arr1) {
    arr1[index] = item + 10;
    return item + 10; //让arr1中的每个元素加10
});
console.log(arr1);//[ 11, 13, 16, 12, 15, 16 ]
console.log(arr2);//[ 11, 13, 16, 12, 15, 16 ]


//---------------------------------------------------------------------------------------

const arr = [
  {
    name: "zs",
    age: 22,
  },
  {
    name: "Pan",
    age: 23,
  },
];

var arr3 = arr.map((item) => {
  item = {
    name:"ww",
    age:18
  };
  return item;
});
console.log("arr",JSON.stringify(arr));
//arr [{"name":"zs","age":22},{"name":"Pan","age":23}]

console.log("arr3",JSON.stringify(arr3));
//arr3 [{"name":"ww","age":18},{"name":"ww","age":18}]
```

和ForEach差不多，都是不仅要判断数组是基本数据类型还是对象，另外还要判断是否是通过元素下标来对值进行更改。