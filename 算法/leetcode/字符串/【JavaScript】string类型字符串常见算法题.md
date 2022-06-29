[TOC]



### 字符串逆序输出

字符串的逆序输出就是将一个字符串以相反的顺序进行输出。

真实场景如下所示:

给定一个字符串'abcdefg'，执行一定的算法后，输出的结果为'gfedcba'

**实现一：**

主要思想是借助数组的reverse()函数。

首先将字符串转换为字符数组，然后通过调用数组原生的reverse()函数进行逆序，得到逆序数组后再通过调用join()函数得到逆序字符串。

```js
function reverseString(str) {
  return str.split('').reverse().join('');
}

var str = 'abcdefg';
console.log(reverseString(str))
```



**实现二**

主要思想是利用字符串本身的charAt()函数。

从尾部开始遍历字符串，然后利用charAt()函数获取字符并逐个拼接，得到最终的结果。charAt()函数接收一个索引数字，返回该索引位置对应的字符。

```js
function reverseString(str) {
  var result = '';
  for(let i=str.length-1;i>=0;i--) {
    result += str.charAt(i);
  }
  return result;
}

var str = 'abcdefg';
console.log(reverseString(str))
```



**实现三**

主要思想是通过递归实现逆序输出，与算法2的处理类似。

递归从字符串最后一个位置索引开始，通过charAt()函数获取一个字符，并拼接到结果字符串中，递归结束的条件是位置索引小于0。

```js
function reverseString(str,pos,strOut) {
  if(pos<0){
    return strOut;
  }
  strOut += str.charAt(pos--);
  return reverseString(str,pos,strOut);
}

var str = 'abcdefg';
var result = '';
console.log(reverseString(str,str.length-1,result))
```



**实现四**

主要思想是通过call()函数来改变slice()函数的执行主体。

调用call()函数后，可以让字符串具有数组的特性，在调用未传入参数的slice()函数后，得到的是一个与自身相等的数组，从而可以直接调用reverse()函数，最后再通过调用join()函数，得到逆序字符串。

```js
function reverseString(str) {
  // 改变slice()函数的执行主体，得到一个数组
  var arr = Array.prototype.slice.call(str);
  // 调用reverse()函数逆序数组
  return arr.reverse().join('');
}

var str = 'abcdefg';
console.log(reverseString(str))
```



### 统计字符串中出现次数最多的字符及出现的次数

假如存在一个字符串'helloJavascripthellohtmlhellocss'，其中出现次数最多的字符是l，出现的次数是7次。

**实现一**

借助于key-value形式的对象来存储字符与字符出现的次数，但是在运算上有所差别。

- 首先通过key-value形式的对象来存储数据，key表示不重复出现的字符，value表示该字符出现的次数。
- 然后将字符串处理成数组，通过forEach()函数遍历每个字符。在处理之前需要先判断当前处理的字符是否已经在key-value对象中，如果已经存在则表示已经处理过相同的字符，则无须处理；如果不存在，则会处理该字符item
- 通过split()函数传入待处理字符，可以得到一个数组，该数组长度减1即为该字符出现的次数。
- 获取字符出现的次数后，立即与表示出现最大次数和最大次数对应的字符变量maxCount和maxCountChar相比，如果比maxCount大，则将值写入key-value对象中，并动态更新maxCount和maxCountChar的值，直到最后一个字符处理完成。
- 最后得到的结果即maxCount和maxCountChar两个值。

```js
function fun(str){
  let json = {};
  let maxCount = 0, maxCountChar = '';
  str.split('').forEach(item => {
    //判断json对象中是否有对应的key
    if(!json.hasOwnProperty(item)){
      //当前字符出现的次数(使用split分割得到数组，该数组长度减1即为该字符出现的次数)
      let number = str.split(item).length - 1;
      //直接与出现次数最大值比较，并进行更新
      if(number > maxCount) {
        //写入json对象
        json[item] = number;
        //更新maxCount与maxCountChar的值
        maxCount = number;
        maxCountChar = item;
      }
    }
  })
  return '出现最多的值是：' + maxCountChar + ',出现次数：' + maxCount;
}

var str = 'helloJavaScripthellohtmlhellocss';
console.log(fun(str)); //出现最多的值是：l,出现次数：7
```



**实现二**

主要思想是借助replace()函数，主要实现方式如下。

- 通过while循环处理，跳出while循环的条件是字符串长度为0。
- 在while循环中，记录原始字符串的长度originCount，用于后面做长度计算处理。
- 获取字符串第一个字符char，通过replace()函数将char替换为空字符串''，得到一个新的字符串，它的长度remainCount相比于originCount会小，其中的**差值originCount - remainCount即为该字符出现的次数**。
- 确定字符出现的次数后，直接与maxCount进行比较，如果比maxCount大，则直接更新maxCount的值，并同步更新maxCountChar的值；如果比maxCount小，则不做任何处理。
- 处理至跳出while循环，得到最终结果。

```js
function fun(str){
  //定义两个变量，分别表示出现最大次数和对应的字符
  let maxCount = 0, maxCountChar = '';
  while(str) {
    //记录原始字符串的长度
    let  originCount = str.length;
    //当前处理的字符
    let char = str[0];
    let reg = new RegExp(char,'g');
    //使用replace()函数替换处理的字符作为空字符串
    str = str.replace(reg,'');
    let remainCount = str.length;//现在字符串的长度
    //当前字符出现的次数
    let charCount = originCount - remainCount;
    //与最大次数作比较
    if(charCount > maxCount){
      //更新maxCount 和 maxCountChar的值
      maxCount = charCount;
      maxCountChar = char;
    }
  }
  return '出现最多的值是：' + maxCountChar + ',出现次数：' + maxCount;
}

var str = 'helloJavaScripthellohtmlhellocss';
console.log(fun(str)); //出现最多的值是：l,出现次数：7
```



**实现三**

这里是对题目有所改编，是查询数组

**js查询数组中重复最多次数的值，注意：值不一定只有一个，可能有多个**

该题的思路：
好像用map存储每个数字的个数行不通，我最开始的思路是用一个新数组存储，temp[index]++，但是行不通。最后看了答案，用一个对象存储，这个对象的属性是每个数字，属性值是这个数字的个数。

```js
function foo(array) {
  let arr = [];//存放最多次数的值
  let temp = {};//保存每个数的个数
  let res = 0;//记录出现最多次数的个数
  array.forEach(item => {
    if(temp[item] === undefined) { //如果这个数之前没出现过
      temp[item] = 1;//将它的次数赋为1
    } else {
      temp[item]++;//次数++
    }
  });
  for(let i in temp) {//遍历下标
    if(temp[i] > res){//如果这个数的次数比之前出现过的最多次数还多
      arr.length = 0;//清空数组
      arr.push(Number(i));//将这个数加入最终答案，因为属性名是字符串，将它转换为数字
      res = temp[i];//更新最大次数
    }else if(temp[i] === res){//出现次数相同的数字
      arr.push(Number(i));//将答案加入数组
      res = temp[i];//更新最大次数
    }
  }
  return arr;
}

console.log(foo([1,1,2,5,5,4,6,9]));//[ 1, 5 ]
```



### 去除字符串中重复的字符

假如存在一个字符串'helloJavaScripthellohtmlhellocss'，其中存在大量的重复字符，例如h、e、l等，去除重复的字符，只保留一个，得到的结果应该是'heloJavscriptm'。

**实现一**

主要思想是通过key-value形式的对象来存储字符串以及字符串出现的次数，然后逐个判断出现次数最大值，同时获取对应的字符。 

- 首先通过key-value形式的对象来存储数据，key表示不重复出现的字符，value表示该字符出现的次数。
- 然后遍历字符串的每个字符，判断是否出现在key中。如果在，直接将对应的value值加1；如果不在，则直接新增一组key-value，value值为1。
- 得到key-value对象后，遍历该对象，逐个比较value值的大小，找出其中最大的值并记录key-value，即获得最终想要的结果。

```js
function fun(str) {
  //结果数组
  var result = [];

  // key-value形式的对象
  var json = {};

  for(let i=0;i<str.length;i++){
    //当前处理的字符
    let char = str[i];
    //判断是否在对象中
    if(!json[char]) {
      //value值设置为false
      json[char] = true;
      //添加值结果数组中
      result.push(char)
    }
  }
  return result.join('');
}

var str = 'helloJavaScripthellohtmlhellocss';
console.log(fun(str)) //heloJavScriptms
```



**实现二**

主要思想是借助数组的filter()函数，然后在filter()函数中使用indexOf()函数判断。

- 通过call()函数改变filter()函数的执行体，让字符串可以直接执行filter()函数。
- 在自定义的filter()函数回调中，通过indexOf()函数判断其第一次出现的索引位置，如果与filter()函数中的index一样，则表示第一次出现，符合条件则return出去。这就表示只有第一次出现的字符会被成功过滤出来，而其他重复出现的字符会被忽略掉。
- filter()函数返回的结果便是已经去重的字符数组，将其转换为字符串输出即为最终需要的结果。

```js
function fun(str){
  //使用call()函数改变filter函数的执行主体
  let result = Array.prototype.filter.call(str,(char,index,arr) => {
    //通过indexOf()函数与index的比较，判断是否是第一次出现的字符
    return arr.indexOf(char) === index;
  })
  return result.join('');
}

var str = 'helloJavaScripthellohtmlhellocss';
console.log(fun(str)); //heloJavScriptms
```



**实现三**

主要思想是借助ES6中的Set数据结构，Set具有自动去重的特性，可以直接将数组元素去重。

- 将字符串处理成数组，然后作为参数传递给Set的构造函数，通过new运算符生成一个Set的实例。
- 将Set通过扩展运算符（...）转换成数组形式，最终转换成字符串获得需要的结果。

```js
function fun(str){
  //字符串转换的数组作为参数，生成Set的实例
  let set = new Set(str.split(''));
  //将set重新处理为数组，然后转换成字符串
  return [...set].join('');
}

var str = 'helloJavaScripthellohtmlhellocss';
console.log(fun(str)); //heloJavScriptms
```



### 判断一个字符串是否为回文字符串

回文字符串是指一个字符串正序和倒序是相同的，例如字符串'abcdcba'是一个回文字符串，而字符串'abcedba'则不是一个回文字符串。需要注意的是，这里不区分字符大小写，即a与A在判断时是相等的。

给定两个字符串'abcdcba'和'abcedba'，经过一定的算法处理，分别会返回“true”和“false”。

**实现一**

主要思想是将字符串按从前往后顺序的字符与按从后往前顺序的字符逐个进行比较，如果遇到不一样的值则直接返回“false”，否则返回“true”。

```js
function check(str){
  //空字符串直接返回“true”
  if(!str.length){
    return true;
  }
  //统一转换成小写，同时转换成数组
  str = str.toLowerCase().split('');
  let start = 0, end = str.length - 1;
  //通过while循环判断正序和倒序的字母
  while(start < end) {
    //如果相等则更改比较的索引
    if(str[start] === str[end]){
      start++;
      end--;
    }else {
      return false;
    }
  }
  return true;
}

let str1 = 'abcdcba';
let str2 = 'abcdbba';
console.log(check(str1)); // true
console.log(check(str2)); // false
```



**实现二**

与算法1的主要思想相同，将正序和倒序的字符逐个进行比较，与算法1不同的是，算法2采用递归的形式实现。

递归结束的条件有两种情况，一个是当字符串全部处理完成，此时返回“true”；另一个是当遇到首字符与尾字符不同，此时返回“false”。而其他情况会依次进行递归处理。

```js
function check(str){
  //字符串处理完成，返回“true”
  if(!str.length){
    return true;
  }
  //统一转换成小写
  str = str.toLowerCase();
  let end = str.length - 1;
  //当首字符和尾字符不同，直接返回“false”
  if(str[0] !== str[end]){
    return false;
  }
  //删掉字符串首尾字符，进行递归处理
  return check(str.slice(1,end));
}

let str1 = 'abcdcba';
let str2 = 'abcdbba';
console.log(check(str1)); // true
console.log(check(str2)); // false
```



**实现三**

主要思想是将字符串进行逆序处理，然后与原来的字符串进行比较，如果相等则表示是回文字符串，否则不是回文字符串。

```js
function check(str){
  //统一转换成小写
  str = str.toLowerCase();
  //将字符串转换为数组
  let arr = str.split('');
  //将数组逆序并转换成字符串
  let reverseStr = arr.reverse().join('');
  return str === reverseStr;
}

let str1 = 'abcdcba';
let str2 = 'abcdbba';
console.log(check(str1)); // true
console.log(check(str2)); // false
```

