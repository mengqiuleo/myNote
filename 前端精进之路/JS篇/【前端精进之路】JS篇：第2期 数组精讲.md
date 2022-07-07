[TOC]



## 写在前面

这里是小飞侠Pan🥳，立志成为一名优秀的前端程序媛！！！

本篇文章收录于我的专栏：[前端精进之路](https://blog.csdn.net/weixin_52834435/category_11886356.html?spm=1001.2014.3001.5482)

同时收录于我的[github](https://github.com/mengqiuleo)前端笔记仓库中，持续更新中，欢迎star~

👉[https://github.com/mengqiuleo/myNote](https://github.com/mengqiuleo/myNote)

<hr/>

## 1.数组的常用方法

对于数组的基本方法介绍文章👇🏻

[JavaScript数组常用方法](https://blog.csdn.net/weixin_52834435/article/details/122370869)

[方法分类：是否改变自身](https://blog.csdn.net/weixin_52834435/article/details/123931820)

[【JavaScript】再学数组相关方法](https://blog.csdn.net/weixin_52834435/article/details/123968441)





## 2.方法区分

### 循环语法比较及使用场景（for、forEach、map、for...in、for...of）

👉 [循环比较](https://blog.csdn.net/weixin_52834435/article/details/124556612)



### Map和ForEach的区别：返回值？修改原数组？

👉 [Map和ForEach的区别](https://blog.csdn.net/weixin_52834435/article/details/124763014)



## 3.判断一个变量是数组还是对象

### instanceof运算符

数组不仅是Array类型的实例，也是Object类型的实例。因此我们在判断一个变量是数组还是对象时，应该先判断数组类型，然后再去判断对象类型。如果先判断对象，那么数组值也会被判断为对象类型，这无法满足要求。

封装一个函数

```js
function getDataType(o) {
    if(o instanceof Array) {
        return 'Array'
    } else if(o instanceof Object) {
        return 'Object'
    } else {
        return 'param is not object type'
    }
}
```



### 判断构造函数

判断变量的构造函数是Array类型还是Object类型。因为一个对象的实例都是通过构造函数生成的，所以，我们可以直接判断一个变量的constructor属性。

封装一个函数

```js
function getDataType(o) {
    // 获取构造函数
    var constructor = o.__proto__.constructor || o.constructor
    if(constructor === Array){
        return 'Array'
    } else if(constructor === Object) {
        return 'Object'
    } else {
        return 'param is not object type'
    }
}
```



### toString()函数

每种引用数据类型都会直接或间接继承自Object类型，因此它们都包含toString()函数。不同数据类型的toString()函数返回值也不一样，所以通过toString()函数就可以判断一个变量是数组还是对象。

这里我们借助call()函数，直接调用Object原型上的toString()函数，把主体设置为需要传入的变量，然后通过返回值进行判断。

```js
var a = [1,2,3];
var b = {};

console.log(Object.prototype.toString.call(a));//[object Array]
console.log(Object.prototype.toString.call(b));//[object Object]
```

封装一个函数

```js
function getDataType(o) {
    var result = Object.prototype.toString.call(o);
    if(result === '[object Array]'){
        return 'Array'
    } else if(result === '[object Object]') {
        return 'Object'
    } else {
        return 'param is not object type'
    }
}
```



### Array.isArray()函数

ES6，数组增加了一个isArray()静态函数，用于判断变量是否为数组

```js
//  下面都返回true
Array.isArray([1,2])
Array.isArray(new Array())
Array.isArray(Array.prototype) //其实Array.prototype也是一个数组
```





## 4.实现数组扁平化

👉 [数组扁平化](https://blog.csdn.net/weixin_52834435/article/details/123968937)





## 5.求数组的最大值和最小值

给定一个数组[2, 4, 10, 7, 5, 8, 6]，编写一个算法，得到数组的最大值为10，最小值为2。



### 通过prototype属性扩展min()函数和max()函数

主要思想是在自定义的min()函数和max()函数中，通过循环由第一个值依次与后面的值作比较，动态更新最大值和最小值，从而找到结果。

```js
Array.prototype.min = function() {
    let min = this[0];
    let len = this.length;
    for(let i=1;i<len;i++){
        if(this[i] < min){
            min = this[i];
        }
    }
    return min;
}

Array.prototype.max = function() {
    let max = this[0];
    let len = this.length;
    for(let i=1;i<len;i++){
        if(this[i] > max) {
            max = this[i];
        }
    }
    return max;
}

let arr = [2,4,10,7,5,8,6];
console.log(arr.min());//2
console.log(arr.max());//10
```



### 借助Math对象的min()函数和max()函数

主要思想是通过apply()函数改变函数的执行体，将数组作为参数传递给apply()函数。这样数组就可以直接调用Math对象的min()函数和max()函数来获取返回值。

```js
Array.min = function(array){
    return Math.min.apply(Math, array);
}
Array.max = function(array){
    return Math.max.apply(Math, array);
}

let arr = [2,4,10,7,5,8,6];
console.log(Array.min(arr));//2
console.log(Array.max(arr));//10
```



### 借助Math对象的算法优化

在算法2中将min()函数和max()函数作为Array类型的静态函数，但并不支持链式调用，我们可以利用对象字面量进行简化。

此时在验证时因为min()函数和max()函数属于实例方法，所以可以直接通过数组调用。

```js
Array.prototype.min = function(){
    return Math.min.apply({}, this);
}
Array.prototype.max = function(){
    return Math.max.apply({}, this);
}

let arr = [2,4,10,7,5,8,6];
console.log(arr.min(arr));//2
console.log(arr.max(arr));//10
```

上面的算法代码中apply()函数传入的第一个值为{}，实际表示当前执行环境的全局对象。第二个参数this指向需要处理的数组。

由于apply()函数的特殊性，我们还可以得到其他几种实现方法。将apply()函数的第一个参数设置为null、undefined或{}都会得到相同的效果。

```js
Array.prototype.min = function(){
    return Math.min.apply(null, this);
}
Array.prototype.max = function(){
    return Math.max.apply(null, this);
}
```



### 借助Array类型的reduce()函数

#### reduce()函数

```
arr.reduce(callback,initialValue)
```

initialValue用作callback的第一个参数值，如果没有设置，则会使用数组的第一个元素值。

callback会接收4个参数（accumulator、currentValue、currentIndex、array）。

- accumulator表示上一次调用累加器的返回值，或设置的initialValue值。如果设置了initialValue，则accumulator=initialValue；否则accumulator=数组的第一个元素值。
- currentValue表示数组正在处理的值。
- currentIndex表示当前正在处理值的索引。如果设置了initialValue，则currentIndex从0开始，否则从1开始。
- array表示数组本身。



**demo**

```js
// reduce 求数组每个元素相加的和
var arr = [1,2,3,4,5];
var sum = arr.reduce((pre,cur) => {
    return pre + cur;
},0);
console.log(sum);//15

// 统计数组中每个元素出现的次数
var countOccurrences = function(arr) {
    return arr.reduce((prev,cur) => {
        prev[cur]? prev[cur]++ : prev[cur] = 1;
        return prev;
    },{});
}

console.log(countOccurrences([1,2,3,2,5,1]))//{ '1': 2, '2': 2, '3': 1, '5': 1 }
```



**实现最大值和最小值**

主要思想是reduce()函数不设置initialValue初始值，将数组的第一个元素直接作为回调函数的第一个参数，依次与后面的值进行比较。当需要找最大值时，每轮累加器返回当前比较中大的值；当需要找最小值时，每轮累加器返回当前比较中小的值。

```js
Array.prototype.max = function(){
  return this.reduce((prev,cur) => {
    return prev > cur ? prev : cur;
  })
}

Array.prototype.min = function() {
  return this.reduce((prev,cur) => {
    return prev > cur ? cur : prev;
  });
}

let arr = [2,4,10,7,5,8,6];
console.log(arr.min(arr));//2
console.log(arr.max(arr));//10
```



### 借助Array类型的sort()函数

主要思想是借助数组原生的sort()函数对数组进行排序，排序完成后首尾元素即是数组的最小、最大元素。

默认的sort()函数在排序时是按照字母顺序排序的，数字都会按照字符串处理，例如数字11会被当作"11"处理，数字8会被当作"8"处理。在排序时是按照字符串的每一位进行比较的，因为"1"比"8"要小，所以"11"在排序时要比"8"小。对于数值类型的数组来说，这显然是不合理的，所以需要我们自定义排序函数。

```js
let sortFn = function(a,b){
    return a - b;
}
let arr = [2,4,10,7,5,8,6];
let sortArr = arr.sort(sortFn);

console.log(sortArr[0]);
console.log(sortArr[sortArr.length - 1]);
```



### 借助ES6的扩展运算符

主要思想是借助于ES6中增加的扩展运算符（...），将数组直接通过Math.min()函数与Math.max()函数的调用，找出数组中的最大值和最小值。

```js
let arr = [2,4,10,7,5,8,6];
console.log(Math.min(...arr));
console.log(Math.max(...arr));
```



## 6.数组去重的7种算法

### 遍历数组

主要思想是在函数内部新建一个数组，对传入的数组进行遍历。如果遍历的值不在新数组中就添加进去，如果已经存在就不做处理。

```js
function arrUnique(array) {
  let result = [];
  for(let i=0;i<array.length;i++){
    if(result.indexOf(array[i]) === -1){
        result.push(array[i]);
    }
  }
  return result;
}
let arr = [1,4,5,7,4,8,1,10,4];
console.log(arrUnique(arr));//[ 1, 4, 5, 7, 8, 10 ]
```



### 利用对象键值对

主要思想是新建一个JS对象以及一个新的数组，对传入的数组进行遍历，判断当前遍历的值是否为JS对象的键。如果是，表示该元素已出现过，则不做处理；如果不是，表示该元素第一次出现，则给该JS对象插入该键，同时插入新的数组，最终返回新的数组。

```js
function arrUnique(array) {
  let obj = {}, result = [];
  for(let i=0;i<array.length;i++){
    if(!obj[array[i]]){
        obj[array[i]] = 'yes';
        result.push(array[i]);
    }
  }
  return result;
}
let arr = [1,4,5,7,4,8,1,10,4];
console.log(arrUnique(arr));//[ 1, 4, 5, 7, 8, 10 ]
```

上面的代码存在些许缺陷，即不能判断Number类型和String类型的数字。

因为不管是Number类型的1，还是String类型的"1"，作为对象的key都会被当作先插入类型的1处理。

所以会把Number类型和String类型相等的数字作为相等的值来处理，但实际上它们并非是重复的值。

对于数组[1, 4, 5, 7, 4, 8, 1, 10, 4, '1']的处理结果为“[1, 4, 5, 7, 8, 10]”，这显然是不合理的，正确结果应为“[1, 4, 5, 7, 8, 10, '1']”。

为了解决这个问题，我们需要将数据类型作为key的value值。这个value值为一个数组，判断key的类型是否在数组中，如果在，则代表元素重复，否则不重复，并将数据类型push到value中去。

也就是原数组中每个元素会作为一个obj 的key值，并且对应的value值是一个数组

比如，上面代码中的 1 作为 key值，并且它的value是一个数组['number','string']

```js
function arrUnique(array) {
  let obj = {}, result = [], val, type;
  for(let i=0;i<array.length;i++){
    val = array[i];
    type = typeof val;
    if(!obj[val]){
        obj[val] = [type];
        result.push(val);
    } else if(obj[val].indexOf(type) < 0){ //判断数据类型是否存在
        obj[val].push(type);
        result.push(val);
    }
  }
  return result;
}
let arr = [1,4,5,7,4,8,1,10,4];
console.log(arrUnique(arr));//[ 1, 4, 5, 7, 8, 10 ]
```



### 先排序，再去重

主要思想是借助原生的sort()函数对数组进行排序，然后对排序后的数组进行相邻元素的去重，将去重后的元素添加至新的数组中，返回这个新数组。

```js
function arrUnique(array) {
  let result = [array[0]];
  array.sort(function(a,b){
    return a - b;
  })
  for(let i=0;i<array.length;i++){
    if(array[i] !== result[result.length - 1]){
        result.push(array[i]);
    }
  }
  return result;
}
let arr = [1,4,5,7,4,8,1,10,4];
console.log(arrUnique(arr));//[ 1, 4, 5, 7, 8, 10 ]
```



### 基于reduce()函数

主要思想是利用reduce()函数，类似于算法2，需要借助一个key-value对象。

在reduce()函数的循环中判断key是否重复，如果未重复，则将当前元素push至结果数组中。

实际做法是设置initialValue为一个空数组[]，同时将initialValue作为最终的结果进行返回。在reduce()函数的每一轮循环中都会判断数据类型，如果数据类型不同，将表示为不同的值，如1和"1"，将作为不重复的值。

```js
function arrUnique(array) {
  let obj = {}, type;
  return array.reduce((prev,cur) => {
    type = typeof cur;
    if(!obj[cur]){
        obj[cur] = [type];
        prev.push(cur);
    } else if(obj[cur].indexOf(type) < 0){ //判断数据类型是否存在
        obj[cur].push(type);
        prev.push(cur)
    }
    return prev;
  },[]);

}
let arr = [1,4,5,7,4,8,1,10,4];
console.log(arrUnique(arr));//[ 1, 4, 5, 7, 8, 10 ]
```



### 借助ES6的Set数据结构

Set具有自动去重的功能。

Array类型增加了一个from()函数，用于将类数组对象转化为数组，然后再结合Set可以实现数组的去重。

```js
function arrUnique(array) {
  return Array.from(new Set(array));
}
let arr = [1,4,5,7,4,8,1,10,4];
console.log(arrUnique(arr));//[ 1, 4, 5, 7, 8, 10 ]
```



### 借助ES6的Map数据结构

Map有一个特点是key会识别不同数据类型的数据，即1与"1"在Map中会作为不同的key处理，不需要通过额外的函数来判断数据类型。

基于Map数据结构，通过filter()函数过滤，可获得去重后的结果。

```js
function arrUnique(array) {
 let map = new Map();
 return array.filter(item => {
    return !map.has(item) && map.set(item,1);
 })
}
let arr = [1,4,5,7,4,8,1,10,4];
console.log(arrUnique(arr));//[ 1, 4, 5, 7, 8, 10 ]
```



## 7.找出数组中出现次数最多的元素

存在一个数组为[3, 5, 6, 5, 9, 8, 10, 5, 7, 7, 10, 7, 7, 10, 10, 10, 10, 10]，通过一定的算法，找出次数最多的元素为10，其出现次数为7次。

### 利用键值对

主要思想是利用key-value型的键值对对数据进行存储。

- 定义一个对象，在遍历数组的时候，将数组元素作为对象的键，将出现的次数作为值。
- 获取键值对后进行遍历，获取值最大的那个元素，即为最终结果。

```js
function check(arr){
    if(!arr.length) return;
    if(arr.length === 1) return 1;
    let res = {};
    //遍历数组
    for(let i=0;i<arr.length;i++){
        if(!res[arr[i]]){
            res[arr[i]] = 1;
        } else {
            res[arr[i]] ++;
        }
    }
    //遍历res
    let keys = Object.keys(res);
    let maxNum = 0, maxElm;
    for(let i=0;i<keys.length;i++){
        maxNum = res[keys[i]];
        maxElm = keys[i];
    } 
    return '出现次数最多的元素：' + maxElm + '出现次数：' + maxNum;
}

let arr = [3,5,6,5,9,8,10,5,7,7,7,10,10,10,10];//出现次数最多的元素：10出现次数：5
console.log(check(arr));
```



### 对算法1的优化

算法2的主要思想同算法1一样，都是基于键值对对对象的遍历。不过其优于算法1的地方在于，将2次遍历减少为1次遍历，将值的判断过程放在同一次遍历中。

主要做法是在循环外层设置初始的出现次数最大值maxNum为0，然后在每次循环中处理当前元素的出现次数时，将出现次数值与maxNum比较。如果其比maxNum大，则更改maxNum值为当前元素出现次数，否则不变，最终返回maxNum作为结果。

```js
function check(arr){
    let obj = {};
    let maxNum = 0, maxElm = null;
    for(let i=0;i<arr.length;i++){
        let a = arr[i];
        obj[a] === undefined ? obj[a]=1 : (obj[a]++);
        //在当前循环中直接比较出现次数最大值
        if(obj[a] > maxNum){
            maxElm = a;
            maxNum = obj[a];
        }
    }
    return '出现次数最多的元素：' + maxElm + '出现次数：' + maxNum;
}

let arr = [3,5,6,5,9,8,10,5,7,7,7,10,10,10,10];//出现次数最多的元素：10出现次数：5
console.log(check(arr));
```



### 借助Array类型的reduce()函数

主要思想是使用Array类型的reduce()函数，优先设置初始的出现次数最大值maxNum为1，设置initialValue为一个空对象{}，每次处理中优先计算当前元素出现的次数，在每次执行完后与maxNum进行比较，动态更新maxNum与maxEle的值，最后获得返回的结果。

```js
function check(arr){
    let maxElm;
    let maxNum = 1;
    let obj = arr.reduce((prev,cur) => {
        prev[cur] ? prev[cur]++ : prev[cur]=1;
        if(prev[cur] > maxNum) {
            maxElm = cur;
            maxNum++;
        }
        return prev;
    },{});
    return '出现次数最多的元素：' + maxElm + '出现次数：' + obj[maxElm];
}

let arr = [3,5,6,5,9,8,10,5,7,7,7,10,10,10,10];//出现次数最多的元素：10出现次数：5
console.log(check(arr));
```





