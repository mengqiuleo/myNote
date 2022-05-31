# BOM



[TOC]



## 一、认识BOM

JavaScript有一个非常重要的运行环境就是浏览器，而且浏览器本身又作为一个应用程序需要对其本身进行操作，所以通常浏览器会有对应的对象模型（BOM，Browser Object Model）。
我们可以将BOM看成是连接JavaScript脚本与浏览器窗口的桥梁。



**BOM主要包括以下的对象模型：**

- **window：包括全局属性、方法，控制浏览器窗口相关的属性、方法；**

- **location：浏览器连接到的对象的位置（URL）；**

- **history：操作浏览器的历史；**

- **navigator：客户端标识和信息的对象实例** 

- **screen：客户端显示器信息**

  

1.Navigator  

 代表的当前浏览器的信息，通过该对象可以来识别不同的浏览器  

2.Location  

 代表当前浏览器的地址栏信息，通过Location可以获取地址栏信息，或者操作浏览器跳转页面  

3.History  

 代表浏览器的历史记录，可以通过该对象来操作浏览器的历史记录  

由于隐私原因，该对象不能获取到具体的历史记录，只能操作浏览器向前或向后翻页  

而且该操作只在当次访问时有效  

4.Screen  

 代表用户的屏幕的信息，通过该对象可以获取到用户的显示器的相关的信息  



window对象在浏览器中有两个身份：

- 身份一：全局对象。
  - 我们知道ECMAScript其实是有一个全局对象的，这个全局对象在Node中是global；
  - 在浏览器中就是window对象；
- 身份二：浏览器窗口对象。
    作为浏览器窗口时，提供了对浏览器操作的相关的API；



#### Window全局对象

在浏览器中，window对象就是之前经常提到的全局对象，也就是我们之前提到过GO对象：

- 比如在全局通过var声明的变量，会被添加到GO中，也就是会被添加到window上；
- 比如window默认给我们提供了全局的函数和类：setTimeout、Math、Date、Object等；



#### Window窗口对象

事实上window对象上肩负的重担是非常大的：

- 第一：包含大量的属性，localStorage、console、location、history、screenX、scrollX等等（大概60+个属性）；
- 第二：包含大量的方法，alert、close、scrollTo、open等等（大概40+个方法）；
- 第三：包含大量的事件，focus、blur、load、hashchange等等（大概30+个事件）；
- 第四：包含从EventTarget继承过来的方法，addEventListener、removeEventListener、dispatchEvent方法；



## 二、Navigator

>  代表的当前浏览器的信息，通过该对象可以来识别不同的浏览器  
>
>  由于历史原因，Navigator对象中的大部分属性都已经不能帮助我们识别浏览器了  
>
>  一般我们只会使用userAgent来判断浏览器的信息，  
>
> ​	userAgent是一个字符串，这个字符串中包含有用来描述浏览器信息的内容，  
>
> ​	不同的浏览器会有不同的userAgent  
>
> 
>
> - 火狐的userAgent 
>   Mozilla5.0 (Windows NT 6.1; WOW64; rv:50.0) Gecko20100101 Firefox50.0  
>
> - Chrome的userAgent 
>   Mozilla5.0 (Windows NT 6.1; Win64; x64) AppleWebKit537.36 (KHTML, like Gecko) Chrome52.0.2743.82 Safari537.36  
>
> - IE8 
>   Mozilla4.0 (compatible; MSIE 8.0; Windows NT 6.1; WOW64; Trident7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)  
>
> - IE9 
>   Mozilla5.0 (compatible; MSIE 9.0; Windows NT 6.1; WOW64; Trident7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)  
>
> - IE10 
>   Mozilla5.0 (compatible; MSIE 10.0; Windows NT 6.1; WOW64; Trident7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E)  
>
> - IE11 
>   Mozilla5.0 (Windows NT 6.1; WOW64; Trident7.0; SLCC2; .NET CLR 2.0.50727; .NET CLR 3.5.30729; .NET CLR 3.0.30729; Media Center PC 6.0; .NET4.0C; .NET4.0E; rv:11.0) like Gecko 
>    在IE11中已经将微软和IE相关的标识都已经去除了，所以我们基本已经不能通过UserAgent来识别一个浏览器是否是IE了  





## 三、History 

 对象可以用来操作浏览器向前或向后翻页	 

- length  属性，可以获取到当成访问的链接数量 

- state 属性，当期保留的状态值

  

- back() ，可以用来回退到上一个页面，作用和浏览器的回退按钮一样	 

- forward()  ，可以跳转下一个页面，作用和浏览器的前进按钮一样	 

- go()  ，可以用来跳转到指定的页面   它需要一个整数作为参数 
  	1:表示向前跳转一个页面 相当于forward() 
  	2:表示向前跳转两个页面 
  	-1:表示向后跳转一个页面 
  	-2:表示向后跳转两个页面  

- pushState() : 打开一个指定的地址

- replaceState() : 打开一个新的地址，并且使用 replace



<img src="E:\note\前端\笔记\js\dom&&bom\BOM——history.jpg" style="zoom:67%;" />

## 四、Location  

 该对象中封装了浏览器的地址栏的信息	 
如果直接打印location，则可以获取到地址栏的信息（当前页面的完整路径） 

```js
alert(location);  
```



Location对象用于表示window上当前链接到的URL信息。

常见的属性有哪些呢？

- href: 当前window对应的超链接URL, 整个URL；
- protocol: 当前的协议；
- host: 主机地址；
- hostname: 主机地址(不带端口)；
- port: 端口；
- pathname: 路径；
- search: 查询字符串；
- hash: 哈希值；
- username：URL中的username（很多浏览器已经禁用）；
- password：URL中的password（很多浏览器已经禁用）；



如果直接将location属性修改为一个完整的路径，或相对路径 
则我们页面会自动跳转到该路径，并且会生成相应的历史记录 

```
location = "http:www.baidu.com";  
location = "01.BOM.html";  

```



- assign() 
   用来跳转到其他的页面，作用和直接修改location一样	  

    赋值一个新的URL，并且跳转到该URL中；

- replace()  

​		 可以使用一个新的页面替换当前页面，调用完毕也会跳转页面 
​			**不会生成历史记录**，不能使用回退按钮回退



- reload() 
   用于重新加载当前页面，作用和刷新按钮一样  

   如果在方法中传递一个true，作为参数，则会强制清空缓存刷新页面 

  ```
  location.reload(true);	
  ```

  

```js
const locationBtn = document.querySelector("#location")

locationBtn.onclick = function() {
  location.assign("http://www.baidu.com")
  location.replace("http://www.baidu.com")
  location.reload()
}
```



## 五、window  

#### window常见的属性

<img src="E:\note\前端\笔记\js\dom&&bom\属性.jpg" style="zoom:67%;" />



#### window常见的方法

<img src="E:\note\前端\笔记\js\dom&&bom\方法.jpg" style="zoom:67%;" />



#### window常见的事件

<img src="E:\note\前端\笔记\js\dom&&bom\事件.jpg" style="zoom:67%;" />