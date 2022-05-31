# 【JavaScript】数据类型转换

[TOC]



## 强制类型转换

强制类型转换方式包括 Number()、parseInt()、parseFloat()、toString()、String()、Boolean()



### Number() 方法的强制转换规则

- 如果是布尔值，true 和 false 分别被转换为 1 和 0；
- 如果是数字，返回自身；
- 如果是 null，返回 0；
- 如果是 undefined，返回 NaN；
- 如果是字符串，遵循以下规则：如果字符串中只包含数字（或者是 0X / 0x 开头的十六进制数字字符串，允许包含正负号），则将其转换为十进制；如果字符串中包含有效的浮点格式，将其转换为浮点数值；如果是空字符串，将其转换为 0；如果不是以上格式的字符串，均返回 NaN；
- 如果是 Symbol，抛出错误；
- 如果是对象，并且部署了 [Symbol.toPrimitive] ，那么调用此方法，否则调用对象的 valueOf() 方法，然后依据前面的规则转换返回的值；如果转换的结果是 NaN ，则调用对象的 toString() 方法，

```js
Number(true);        // 1

Number(false);       // 0

Number('0111');      //111

Number(null);        //0

Number('');          //0

Number('1a');        //NaN

Number(-0X11);       //-17

Number('0X11')       //17

```



### parseInt()方法的强制转换规则

空字符串也会返回NaN（这一点跟Number()不一样，它返回0）

```js
console.log(parseInt('  99xioafeixiaPan'));	//99
console.log(parseInt('18.55'));	//18

let num1 = parseInt("1234blue"); // 1234
let num2 = parseInt(""); // NaN
let num3 = parseInt("0xA"); // 10，解释为十六进制整数
let num4 = parseInt(22.5); // 22
let num5 = parseInt("70"); // 70，解释为十进制值
let num6 = parseInt("0xf"); // 15，解释为十六进制整数


//parseInt()也接收第二个参数
let num = parseInt("0xAF", 16); // 175

```



### parseFloat()方法的强制转换规则

parseFloat()只解析十进制值,十六进制数值始终会返回0。

第一次出现的小数点是有效的，但第二次出现的小数点就无效了，此时字符串的剩余字符都会被忽略。

```js
let num1 = parseFloat("1234blue"); // 1234，按整数解析
let num2 = parseFloat("0xA"); // 0
let num3 = parseFloat("22.5"); // 22.5
let num4 = parseFloat("22.34.5"); // 22.34
let num5 = parseFloat("0908.5"); // 908.5
let num6 = parseFloat("3.125e7"); // 31250000

```





### Boolean() 方法的强制转换规则

**除了 undefined、 null、 false、 ' '、 0（包括 +0，-0）、 NaN 转换出来是 false，其他都是 true。**

```js
Boolean(0)          //false

Boolean(null)       //false

Boolean(undefined)  //false

Boolean(NaN)        //false

Boolean(1)          //true

Boolean(13)         //true

Boolean('12')       //true

```



### String()方法 与 toSring() 方法 的强制转换规则

**如果值有toString()方法，则调用该方法（没有参数）并返回相应的结果**

**数值、布尔值、对象和字符串都有toString()方法，但是null和undefined没有这个方法。 一般情况下toString()方法不传参数，但是，在调用熟知的toString()方法时，可以传递一个参数：输出数值的基数。**



**String()转换规则：**

- Null 和 Undefined 类型 ，null 转换为 "null"，undefined 转换为 "undefined"，
- Boolean 类型，true 转换为 "true"，false 转换为 "false"。
- Number 类型的值直接转换，不过那些极小和极大的数字会使用指数形式。
- Symbol 类型的值直接转换，但是只允许显式强制类型转换，使用隐式强制类型转换会产生错误。
- 对普通对象来说，除非自行定义 toString() 方法，否则会调用 toString()（Object.prototype.toString()）来返回内部属性 [[Class]] 的值，如"[object Object]"。如果对象有自己的 toString() 方法，字符串化时就会调用该方法并使用其返回值。



```js
var a = 11;
var aa = a.toString();
console.log(aa);//11
console.log(typeof aa);//string

var f = true;
var ff = f.toString();
console.log(ff);//true
console.log(typeof ff);//string

var num = 10;
console.log(num.toString(2));//1010


var test = undefined;
console.log(test.toString());//TypeError: Cannot read property 'toString' of undefined
```

```js
var test = undefined;
console.log(String(test));//undefined
```





## 隐式转换规则

凡是通过逻辑运算符 (&&、 ||、 !)、运算符 (+、-、*、/)、关系操作符 (>、 <、 <= 、>=)、相等运算符 (==) 或者 if/while 条件的操作，如果遇到两个数据类型不一样的情况，都会出现隐式类型转换。



### == 的隐式类型转换规则

- 如果类型相同，无须进行类型转换；

- 如果其中一个操作值是 null 或者 undefined，那么另一个操作符必须为 null 或者 undefined，才会返回 true，否则都返回 false；

- 如果其中一个是 Symbol 类型，那么返回 false；

- 两个操作值如果为 string 和 number 类型，那么就会将字符串转换为 number；

- 如果一个操作值是 boolean，那么转换成 number；

- 如果一个操作值为 object 且另一方为 string、number 或者 symbol，就会把 object 转为原始类型再进行判断（调用 object 的 valueOf/toString 方法进行转换）。

- 如果两个操作数都是对象，则比较它们是不是同一个对象。如果两个操作数都指向同一个对象，则相等操作符返回`true`

- 存在 NaN 则返回 false

  ```js
  let result1 = (true == 1); // true
  
  let result1 = ("55" == 55); // true
  
  let obj = {valueOf:function(){return 1}}
  let result1 = (obj == 1); // true
  
  let result1 = (null == undefined ); // true
  
  let result1 = (NaN == NaN ); // false
  
  let obj1 = {name:"xxx"}
  let obj2 = {name:"xxx"}
  let result1 = (obj1 == obj2 ); // false
  
  ```





### + 的隐式类型转换规则

- 如果其中有一个是字符串，另外一个是 undefined、null 或布尔型，则调用 toString() 方法进行字符串拼接；如果是纯对象、数组、正则等，则默认调用对象的转换方法会存在优先级，然后再进行拼接。
- 如果其中有一个是数字，另外一个是 undefined、null、布尔型或数字，则会将其转换成数字进行加法运算，对象的情况还是参考上一条规则。
- 如果其中一个是字符串、一个是数字，则按照字符串规则进行拼接。

```js
1 + 2        // 3  常规情况

'1' + '2'    // '12' 常规情况




'1' + undefined   // "1undefined" 规则1，undefined转换字符串

'1' + null        // "1null" 规则1，null转换字符串

'1' + true        // "1true" 规则1，true转换字符串

'1' + 1n          // '11' 比较特殊字符串和BigInt相加，BigInt转换为字符串

1 + undefined     // NaN  规则2，undefined转换数字相加NaN

1 + null          // 1    规则2，null转换为0

1 + true          // 2    规则2，true转换为1，二者相加为2

1 + 1n            // 错误  不能把BigInt和Number类型直接混合相加

'1' + 3           // '13' 规则3，字符串拼接

```



### Object 的转换规则

```js
var test = {};
console.log(test.toString());//[object Object]
console.log(test.valueOf());//{}
```



对象转换的规则，会先调用内置的 [ToPrimitive] 函数，其规则逻辑如下：

- 如果部署了 Symbol.toPrimitive 方法，优先调用再返回；
- 调用 valueOf()，如果转换为基础类型，则返回；
- 调用 toString()，如果转换为基础类型，则返回；
- 如果都没有返回基础类型，会报错。



**对象在作为操作数时，解释器总是优先调用valueOf()， 而其他情况，解释器总是认为我们想要的是字符串，所以会优先调用toString(), 因此对象在前面返回结果就是Number;其他情况对象默认用toString** 



```js
var obj = {
  value: 1,
  valueOf() {
    return 2;
  },
  toString() {
    return '3'
  },
  [Symbol.toPrimitive]() {
    return 4
  }
}

console.log(obj + 1); // 输出5

// 因为有Symbol.toPrimitive，就优先执行这个；如果把Symbol.toPrimitive这段代码删掉，
//则执行valueOf打印结果为3；如果valueOf也去掉，则调用toString返回'31'(字符串拼接)


// 再看两个特殊的case：
console.log(10 + {})
// "10[object Object]"
//注意：{}会默认调用valueOf是{}，不是基础类型继续转换，调用toString，返回结果"[object Object]"，
//于是和10进行'+'运算，按照字符串拼接规则来，参考'+'的规则


console.log([1,2,undefined,4,5] + 10);
// "1,2,,4,510"
//注意[1,2,undefined,4,5]会默认先调用valueOf结果还是这个数组，不是基础数据类型继续转换，也还是调用toString，返回"1,2,,4,5"，
//然后再和10进行运算，还是按照字符串拼接规则，参考'+'的第3条规则


{}+10
//10
//这里的对象被看成操作符，所以会调 valueOf 方法，结果为 {}
```

