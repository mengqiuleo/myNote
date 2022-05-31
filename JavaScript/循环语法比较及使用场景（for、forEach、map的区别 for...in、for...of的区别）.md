## 循环语法比较及使用场景（for、forEach、map、for...in、for...of）

[TOC]



### for...in和for...of的区别

- for…of 遍历获取的是对象的键值，for…in 获取的是对象的键名；
- for… in 会遍历对象的整个原型链，性能非常差不推荐使用，而 for … of 只遍历当前对象不会遍历原型链；
- 对于数组的遍历，for…in 会返回数组中所有可枚举的属性(包括原型链上可枚举的属性)，for…of 只返回数组的下标对应的属性值；

**总结：** for...in 循环主要是为了遍历对象而生，不适用于遍历数组；for...of 循环可以用来遍历数组、类数组对象，字符串、Set、Map 以及 Generator 对象。



### forEach和map方法有什么区别

这两个方法都是用来遍历数组的，两者区别如下：

- forEach()方法会针对每一个元素执行提供的函数，对数据的操作会改变原数组，该方法没有返回值；
- map()方法不会改变原数组的值，返回一个新数组，新数组中的值为原数组调用函数处理之后的值；



### forEach 的中断

在js中有`break` `return` `continue` 对函数进行中断或跳出循环的操作，我们在 `for`循环中会用到一些中断行为，对于优化数组遍历查找是很好的，但由于`forEach`属于迭代器，只能按序依次遍历完成，所以不支持上述的中断行为。

在 forEach 里面使用`return`并不会跳出，只会被当做`continue`.

可以利用 `try catch` 实现循环中断

```js
　　function getItemById(arr, id) {
        var item = null;
        try {
            arr.forEach(function (curItem, i) {
                if (curItem.id == id) {
                    item = curItem;
                    throw Error();
                }
            })
        } catch (e) {
        }
        return item;
    }
```

