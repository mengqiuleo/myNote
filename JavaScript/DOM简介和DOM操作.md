## DOM简介和DOM操作

[TOC]





### 一、基本概念

##### **JavaScript的组成**

JavaScript基础分为三个部分：

- ECMAScript：JavaScript的语法标准。包括变量、表达式、运算符、函数、if语句、for语句等。
- **DOM**：文档对象模型（Document object Model），操作**网页上的元素**的API。比如让盒子移动、变色、轮播图等。
- **BOM**：浏览器对象模型（Browser Object Model），操作**浏览器部分功能**的API。比如让浏览器自动滚动。



##### 节点

**节点**（Node）：构成 HTML 网页的最基本单元。网页中的每一个部分都可以称为是一个节点，比如：html标签、属性、文本、注释、整个文档等都是一个节点。

虽然都是节点，但是实际上他们的具体类型是不同的。常见节点分为四类：

- 文档节点（文档）：整个 HTML 文档。整个 HTML 文档就是一个文档节点。
- 元素节点（标签）：HTML标签。
- 属性节点（属性）：元素的属性。
- 文本节点（文本）：HTML标签中的文本内容（包括标签之间的空格、换行）。

节点的类型不同，属性和方法也都不尽相同。所有的节点都是Object。



##### 什么是DOM

**DOM**：Document Object Model，文档对象模型。DOM 为文档提供了结构化表示，并定义了如何通过脚本来访问文档结构。目的其实就是为了能让js操作html元素而制定的一个规范。

DOM就是由节点组成的。

**解析过程**： HTML加载完毕，渲染引擎会在内存中把HTML文档，生成一个DOM树，getElementById是获取内中DOM上的元素节点。然后操作的时候修改的是该元素的**属性**。

**DOM树**：（一切都是节点）

![](E:\note\前端\笔记\js\dom&&bom\dom树.png)

上图可知，**在HTML当中，一切都是节点**（非常重要）。

整个html文档就是一个文档节点。所有的节点都是Object。



##### DOM可以做什么

- 找对象（元素节点）
- 设置元素的属性值
- 设置元素的样式
- 动态创建和删除元素
- 事件的触发响应：事件源、事件、事件的驱动程序



### 二、常用节点

JS 提供了访问常用节点的 api

| 方法                     | 说明                        |
| ------------------------ | --------------------------- |
| document                 | document是DOM操作的起始节点 |
| document.documentElement | 文档节点即html标签节点      |
| document.body            | body标签节点                |
| document.head            | head标签节点                |
| document.links           | 超链接集合                  |
| document.anchors         | 所有锚点集合                |
| document.forms           | form表单集合                |
| document.images          | 图片集合                    |

#### DOCUMENT

使用title获取和设置文档标题

```js
//获取文档标题
console.log(document.title)

//设置文档标签
document.title = '后盾人-houdunren.com'
```



获取当前URL

```js
console.log(document.URL)
```



获取域名

```js
document.domain
```

获取来源地址

```js
console.log(document.referrer)
```

系统针对特定标签提供了快速选择的方式



#### ID

下面是直接使用 ID 获取元素（这是非标准操作，对浏览器有挑剔）

```js
<div id="app">后盾人</div>
<script>
  // 直接通过 ID 获取元素（非标准操作）
  console.dir(app)
</script>
```



#### links

下面展示的是获取所有a标签

```js
<div name="app">
  <a href="">houdunren.com</a>
  <a href="">houdunwang.com</a>
</div>
<script>
  const nodes = document.links
  console.dir(nodes)
</script>
```



#### anchors

下例是获取锚点集合后能过 锚点 name 属性获取元素

```js
<div>
  <a href="" name="n1">houdunren.com</a>
  <a href="" name="n2">houdunwang.com</a>
</div>
<script>
  // 通过锚点获取元素
  console.dir(document.anchors.n2)
</script>
```



#### images

下面是获取所有图片节点

```js
<img src="" alt="" />
<img src="" alt="" />
<img src="" alt="" />
<script>
  // 获取所有图片节点
  console.dir(document.images)
</script>
```

### 三、元素节点的获取

总结：

想要操作元素节点，必须首先要找到该节点。有三种方式可以获取DOM节点：

```js
var div1 = document.getElementById("box1"); //方式一：通过 id 获取 一个 元素节点（为什么是一个呢？因为 id 是唯一的）

var arr1 = document.getElementsByTagName("div"); //方式二：通过 标签名 获取 元素节点数组，所以有s

var arr2 = document.getElementsByClassName("hehe"); //方式三：通过 类名 获取 元素节点数组，所以有s
```

既然方式二、方式三获取的是标签数组，那么习惯性是**先遍历之后再使用**。



详细解释：

###### getElementById

使用ID选择是非常方便的选择具有ID值的节点元素，但注意ID应该是唯一的。

> 只能通过document对象上使用

```js
<div id="houdunren">houdunren.com</div>
<script>
  const node = document.getElementById('houdunren')
  console.dir(node)
</script>
```

getElementById只能通过document访问，不能通过元素读取拥有ID的子元素，下面的操作将产生错误

```js
<div id="app">
  houdunren.com
  <div id="houdunwang">houdunwang.com</div>
</div>
<script>
  const app = document.getElementById('app')
  const node = app.getElementById('houdunwang') //app.getElementById is not a function
  console.log(node)
</script>
```



###### getElementsByName

使用getElementByName获取设置了name属性的元素，虽然在DIV等元素上同样有效，但一般用来对表单元素进行操作时使用。

- 返回NodeList节点列表对象
- NodeList顺序为元素在文档中的顺序
- 需要在 document 对象上使用

```js
<div name="houdunren">houdunren.com</div>
<input type="text" name="username" />

<script>
  const div = document.getElementsByName('houdunren')
  console.dir(div)
  const input = document.getElementsByName('username')
  console.dir(input)
</script>
```



###### getElementsByTagName

使用getElementsByTagName用于按标签名获取元素

- 返回HTMLCollection节点列表对象
- 是不区分大小的获取

```js
<div name="houdunren">houdunren.com</div>
<div id="app"></div>
<script>
  const divs = document.getElementsByTagName('div')
  console.dir(divs)
</script>
```

**通配符**

可以使用通配符 ***** 获取所有元素

```js
<div name="houdunren">houdunren.com</div>
<div id="app"></div>

<script>
  const nodes = document.getElementsByTagName('*')
  console.dir(nodes)
</script>
```

某个元素也可以使用通配置符 ***** 获取后代元素，下面获取 id为houdunren的所有后代元素

```js
<div id="houdunren">
  <span>houdunren.com</span>
  <span>houdunwang.com</span>
</div>

<script>
  const nodes = document.getElementsByTagName('*').namedItem('houdunren').getElementsByTagName('*')
  console.dir(nodes)
</script>
```



###### getElementsByClassName

getElementsByClassName用于按class样式属性值获取元素集合

- 设置多个值时顺序无关，指包含这些class属性的元素

```js
<div class="houdunren houdunwang xiangjun">houdunren.com</div>
<div class="houdunwang">houdunwang.com</div>

<script>
  const nodes = document.getElementsByClassName('houdunwang')
  console.log(nodes.length) //2

  //查找同时具有 houdunwang 与 houdunren 两个class属性的元素
  const tags = document.body.getElementsByClassName('houdunwang houdunren ')
  console.log(tags.length) //1
</script>
```



###### querySelectorAll

使用querySelectorAll根据CSS选择器获取Nodelist节点列表

- 获取的NodeList节点列表是静态的，添加或删除元素后不变

获取所有div元素

```js
<div class="xiangjun">向军大叔</div>
<div id="app">
  <div class="houdunren houdunwang">houdunren.com</div>
  <div class="houdunwang">houdunwang.com</div>
</div>

<script>
  const app = document.getElementById('app')
  const nodes = app.querySelectorAll('div')
  console.log(nodes.length) //2
</script>
```



获取id为app元素的，class 为houdunren的后代元素

```js
<div class="xiangjun">向军大叔</div>
<div id="app">
  <div class="houdunren houdunwang">houdunren.com</div>
  <div class="houdunwang">houdunwang.com</div>
</div>
<script>
  const nodes = document.querySelectorAll('#app .houdunren')
  console.log(nodes.length) //2
</script>
```



根据元素属性值获取元素集合

```js
<div id="app">
  <div class="houdunren houdunwang" data="hd">houdunren.com</div>
  <div class="houdunwang">houdunwang.com</div>
</div>
<script>
  const nodes = document.querySelectorAll(`#app .houdunren[data='hd']`)
  console.log(nodes.length) //1
</script>
```



再来看一些通过样式选择器查找元素

```js
<div id="app">
  <div class="houdunren">houdunren.com</div>
  <div class="houdunwang">houdunwang.com</div>
  <span>后盾人</span>
</div>

<script>
  //查找紧临兄弟元素
  console.log(document.querySelectorAll('.houdunren+div.houdunwang'))

  //查找最后一个 div 子元素
  console.log(document.querySelector('#app div:last-of-type'))

  //查找第二个 div 元素
  console.log(document.querySelector('#app div:nth-of-type(2)').innerHTML)
</script>
```



###### querySelector

querySelector使用CSS选择器获取一个元素，下面是根据属性获取单个元素

```js
<div id="app">
  <div class="houdunren houdunwang" data="hd">houdunren.com</div>
  <div class="houdunwang">houdunwang.com</div>
</div>
<script>
  const node = app.querySelector(`#app .houdunren[data='hd']`)
  console.log(node)
</script>
```



###### matches

用于检测元素是否是指定的样式选择器匹配，下面过滤掉所有name属性的LI元素

```js
<div id="app">
  <li>houdunren</li>
  <li>向军大叔</li>
  <li name="houdunwang">houdunwang.com</li>
</div>
<script>
  const nodes = [...document.querySelectorAll('li')].filter(node => {
    return !node.matches(`[name]`)
  })
  console.log(nodes)
</script>
```



###### closest

查找最近的符合选择器的祖先元素（包括自身），下例查找父级拥有 `.comment`类的元素

```js
<div class="comment">
  <ul class="comment">
    <li>houdunren.com</li>
  </ul>
</div>

<script>
  const li = document.getElementsByTagName('li')[0]
  const node = li.closest(`.comment`)
  //结果为 ul.comment
  console.log(node)
</script>
```



##### 区分getElementsBy... 和 quertSelectorAll

`Nodelist`与`HTMLCollection`都是包含多个节点标签的集合，大部分功能也是相同的。

- getElementsBy...等方法返回的是HTMLCollection
- querySelectorAll 返回的是 NodeList
- NodeList节点列表是动态的，即内容添加后会动态更新



###### 动态与静态

通过 getElementsByTagname 等getElementsBy... 函数获取的Nodelist与HTMLCollection集合是动态的，即有元素添加或移动操作将实时反映最新状态。

- 使用getElement...返回的都是动态的集合
- 使用querySelectorAll返回的是静态集合

###### 动态特性

下例中通过按钮动态添加元素后，获取的元素集合是动态的，而不是上次获取的固定快照。



<img src="E:\note\前端\笔记\js\dom&&bom\动态特性1.png" style="zoom:75%;" />

<img src="E:\note\前端\笔记\js\dom&&bom\动态特性2.png" style="zoom:67%;" />



```js
<h1>houdunren.com</h1>
<h1>houdunwang.com</h1>
<button id="add">添加元素</button>

<script>
  let elements = document.getElementsByTagName('h1')
  console.log(elements)
  let button = document.querySelector('#add')
  button.addEventListener('click', () => {
    document.querySelector('body').insertAdjacentHTML('beforeend', '<h1>向军大叔</h1>')
    console.log(elements)//长度会随着元素的增加而改变
  })
</script> 
```

![](E:\note\前端\笔记\js\dom&&bom\动态特性1.2.png)





document.querySelectorAll获取的集合是静态的

```js
<h1>houdunren.com</h1>
<h1>houdunwang.com</h1>
<button id="add">添加元素</button>

<script>
  let elements = document.querySelectorAll('h1')
  console.log(elements)
  let button = document.querySelector('#add')
  button.addEventListener('click', () => {
    document.querySelector('body').insertAdjacentHTML('beforeend', '<h1>向军大叔</h1>')
    console.log(elements)//长度永远为2
  })
</script>
```

<img src="E:\note\前端\笔记\js\dom&&bom\节点静态更改.png" style="zoom:67%;" />



###### 使用静态

如果需要保存静态集合，则需要对集合进行复制

```js
<div id="houdunren">houdunren.com</div>
<div name="houdunwang">houdunwang.com</div>
<script>
  const nodes = document.getElementsByTagName('div')
  const clone = Array.prototype.slice.call(nodes)
  console.log(nodes.length);//2
  document.body.appendChild(document.createElement('div'))
  console.log(nodes.length);//3
  console.log(clone.length);//2
</script>
```





### 四、节点属性及节点集合的遍历

#### （一）节点属性



######  nodeType

nodeType指以数值返回节点类型

| nodeType | 说明         |
| -------- | ------------ |
| 1        | 元素节点     |
| 2        | 属性节点     |
| 3        | 文本节点     |
| 8        | 注释节点     |
| 9        | document对象 |

下面是节点nodeType的示例

```js
<div id="app">
  <div class="houdunren" data="hd">houdunren.com</div>
  <div class="houdunwang">houdunwang.com</div>
  <div class="xiangjun"><!-- 向军大叔 --></div>
</div>
<script>
  const node = document.querySelector(`#app`)
  console.log(node.nodeType) //1
  console.log(node.firstChild.nodeType) //3
  console.log(node.attributes.id.nodeType) //2

  const xj = document.querySelector('.xiangjun')
  console.log(xj.childNodes[0].nodeType) //8
</script>
```



###### Prototype

当然也可以使用对象的原型进行检测

- section 、main、aslide 标签的原型对象为HTMLElement
- 其他非系统标签的原型对象为HTMLUnknownElement

```js
let h1 = document.querySelector('h1')
let p = document.querySelector('p')
console.log(h1 instanceof HTMLHeadingElement) //true
console.log(p instanceof HTMLHeadingElement) //false
console.log(p instanceof Element) //true
```



###### nodeName

nodeName指定节点的名称

- 获取值为大写形式

| nodeType | nodeName      |
| -------- | ------------- |
| 1        | 元素名称如DIV |
| 2        | 属性名称      |
| 3        | #text         |
| 8        | #comment      |

下面来操作 nodeName

```js
<div id="app">
  <div class="houdunren" data="hd">houdunren.com</div>
  <div class="houdunwang">houdunwang.com</div>
  <div class="xiangjun"><!-- 向军大叔 --></div>
  <span> 后盾人</span>
</div>
<script>
  const div = document.querySelector(`#app`)
  const span = document.querySelector('span')

  // 标签节点为大写的标签名DIV
  console.log(div.nodeName)
  console.log(span.nodeName)

  // 文本节点为 #text
  console.log(div.firstChild.nodeName)

  //属性节点为属性名
  console.log(div.attributes.id.nodeName)

  // 注释节点为#comment
  const xj = document.querySelector('.xiangjun')
  console.log(xj.childNodes[0].nodeName)
</script>
```

![](E:\note\前端\笔记\js\dom&&bom\节点属性.png)



######  tagName

nodeName可以获取不限于元素的节点名，tagName仅能用于获取标签节点的名称

- tagName存在于Element类的原型中
- 文本、注释节点值为 undefined
- 获取的值为大写的标签名

```js
<div id="app">
  <div class="houdunren" data="hd">houdunren.com</div>
  <div class="houdunwang">houdunwang.com</div>
  <div class="xiangjun"><!-- 向军大叔 --></div>
  <span> 后盾人</span>
</div>
<script>
  const div = document.querySelector(`#app`)
  const span = document.querySelector('span')

  // 标签节点为大写的标签名 如DIV、SPAN
  console.log(div.tagName)
  console.log(span.tagName)

  // 文本节点为undefined
  console.log(div.firstChild.tagName)

  //属性节点为undefined
  console.log(div.attributes.id.tagName)

  // 注释节点为 undefined
  const xj = document.querySelector('.xiangjun')
  console.log(xj.childNodes[0].tagName)
</script>
```

![](E:\note\前端\笔记\js\dom&&bom\节点属性2.png)



###### nodeValue

使用nodeValue或data函数获取节点值，也可以使用节点的data属性获取节点内容

| nodeType | nodeValue |
| -------- | --------- |
| 1        | null      |
| 2        | 属性值    |
| 3        | 文本内容  |
| 8        | 注释内容  |

下面来看nodeValue的示例

```js
<div id="app">
  <div class="houdunren">houdunren.com</div>
  <div class="houdunwang">houdunwang.com</div>
  <div class="xiangjun"><!-- 向军大叔 --></div>
</div>
<script>
  const node = document.querySelector(`#app`)
  //标签的 nodeValue 值为 null
  console.log(node.nodeValue)

  //属性的 nodeVale 值为属性值
  console.log(node.attributes.id.nodeValue)

  //文本的 nodeValue 值为文本内容
  const houdunwang = document.querySelector('.houdunwang')
  console.log(houdunwang.firstChild.nodeValue)

  //注释的 nodeValue 值为注释内容
  const xj = document.querySelector('.xiangjun')
  console.log(xj.childNodes[0].nodeValue)
</script>
```

![](E:\note\前端\笔记\js\dom&&bom\节点属性3.png)





#### （二）节点集合

##### NodeList

```js
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta http-equiv="X-UA-Compatible" content="ie=edge">
    <title>Document</title>
</head>
<body>
    <div class="test-div">
        div1
        <div class="test-div">
            div2
            <div class="test-div">
                div3
            </div>
        </div>
    </div>
</body>
</html>
```

在浏览器中打开这个html文件，打开控制台输入:

```js
document.querySelectorAll('div')
```

<img src="E:\note\前端\笔记\js\dom&&bom\nodelist.png" style="zoom:80%;" />

返回的NodeList中包含这三个div。展开NodeList的`__proto__`属性后发现，NodeList继承于一个NodeList对象，而这个NodeList对象又继承于Object对象。

NodeList除了`length`属性外还有其他5个方法（method），分别是`entries, forEach, item, keys, values`，



###### entries()：
调用entries方法会返回一个iterator（迭代器），关于iterator/iterable可以参见MDN，简单点说就是返回了一个可以遍历的对象，而这个对象实现了iterable protocal，所以需要用for...of遍历，

```js
var divs = document.querySelectorAll('div');
for(var item of divs.entries()){
    console.log(item);
}
```

返回类型为数组

![](E:\note\前端\笔记\js\dom&&bom\nodelist1.png)



###### forEach():
forEach的用法和Array的forEach用法一样，都是用于遍历集合元素：

```js
var divs = document.querySelectorAll('div');
divs.forEach(function (el, index, list) {
    console.log(el);
});
```



###### item():
item()用于从NodeList中获取单个节点元素：

```js
var divs = document.querySelectorAll('div');
console.log(divs.item(0));
```



###### keys():

返回一个iterator用于遍历NodeList的key：

```js
var divs = document.querySelectorAll('div');
for (var key of list.keys()) {
    console.log(key);
}
```

![](E:\note\前端\笔记\js\dom&&bom\nodelistkey.png)





###### values():
和keys()类似，返回一个iterator用于遍历NodeList的value，即html元素：

```js
var divs = document.querySelectorAll('div');
for (var value of divs.values()) {
    console.log(value);
}
```

![](E:\note\前端\笔记\js\dom&&bom\nodelistvalue.png)



##### HTMLCollection

先获取到一个HTMLCollection，在控制台中输入并执行：

```js
document.getElementsByTagName('div')
```

![](E:\note\前端\笔记\js\dom&&bom\htmlcollection.png)

HTMLCollection继承于一个HTMLCollection对象，而HTMLCollection又直接继承于Object对象，所以它和NodeList是平级的。

HTMLCollection有`length`属性和`item`方法，但没有NodeList的`entries, forEach, keys, values`这四个方法，但是又多了一个`namedItem`（根据id和name筛选元素）方法

HTMLCollection 不是一个数组！

HTMLCollection 看起来可能是一个数组，但其实不是。



DOM节点不光包含HTML元素，还包含text node（字符节点）和comment（注释），

HTMLCollection只包含HTML元素，

NodeList会包含所有类型的DOM节点。

> getElementsByTagName() 方法返回 HTMLCollection 对象。
>
> 大部分浏览器的 querySelectorAll() 返回 NodeList 对象。



###### namedItem

HTMLCollection具有namedItem方法可以按name或id属性来获取元素

```js
<div name="app">
  <div id="houdunren">houdunren.com</div>
  <div name="houdunwang">houdunwang.com</div>
</div>

<script>
  const nodes = document.getElementsByTagName('div')
  console.dir(nodes.namedItem('houdunwang'))
   console.dir(nodes.namedItem('houdunren'))
</script>
```





##### 二者对比

```js
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta http-equiv="X-UA-Compatible" content="ie=edge">
  <title>Document</title>
</head>
<body>
  <div class="test">
    <p class="p1">Hello</p>
    <p class="p2">World</p>
    <script>
      let test = document.getElementsByClassName('test')[0];

      console.log(test.childNodes);
      console.log(test.children);
    </script>
  </div>
</body>
</html>

```

![](E:\note\前端\笔记\js\dom&&bom\二者对比.png)

`test.childNodes`是`NodeList`类型的，而`test.children`则是`HTMLCollection`类型的。

`test.childNodes`内包含了7个节点，而`test.children`则只包含了3个元素。



**`NodeList`中可以包含所有的节点类型，而`HTMLCollection`只能包含ElementNode类型的节点。**



#### （三）节点遍历



##### for Of

Nodelist与HTMLCollection是类数组的可迭代对象所以可以使用for...of进行遍历

```js
<div id="houdunren">houdunren.com</div>
<div name="houdunwang">houdunwang.com</div>
<script>
  const nodes = document.getElementsByTagName('div')
  for (const item of nodes) {
    console.log(item)
  }
</script>
```



##### forEach

Nodelist节点列表也可以使用forEach来进行遍历，但HTMLCollection则不可以

```js
<div id="houdunren">houdunren.com</div>
<div name="houdunwang">houdunwang.com</div>
<script>
  const nodes = document.querySelectorAll('div')
  nodes.forEach((node, key) => {
    console.log(node)
  })
</script>
```



##### call/apply

节点集合对象原型中不存在map方法，但可以借用Array的原型map方法实现遍历

```js
<div id="houdunren">houdunren.com</div>
<div name="houdunwang">houdunwang.com</div>

<script>
  const nodes = document.querySelectorAll('div')
  Array.prototype.map.call(nodes, (node, index) => {
    console.log(node, index)
  })
</script>
```



##### Array.from

Array.from用于将类数组转为组件，并提供第二个迭代函数。所以可以借用Array.from实现遍历

```js
<div id="houdunren">houdunren.com</div>
<div name="houdunwang">houdunwang.com</div>

<script>
  const nodes = document.getElementsByTagName('div')
  Array.from(nodes, (node, index) => {
    console.log(node, index)
  })
</script>
```



### 五、节点关系

节点是父子级嵌套与前后兄弟关系，使用DOM提供的API可以获取这种关系的元素。

- 文本和注释也是节点，所以也在匹配结果中

#### 基础知识

节点是根据HTML内容产生的，所以也存在父子、兄弟、祖先、后代等节点关系，下例中的代码就会产生这种多重关系

- h1与ul是兄弟关系
- span与li是父子关系
- ul与span是后代关系
- span与ul是祖先关系

```js
<h1>后盾人</h1>
<ul>
  <li>
    <span>houdunren</span>
    <strong>houdunwang</strong>
  </li>
</ul>
```

下面是通过节点关系获取相应元素的方法

| 节点属性        | 说明           |
| --------------- | -------------- |
| childNodes      | 获取所有子节点 |
| parentNode      | 获取父节点     |
| firstChild      | 第一个子节点   |
| lastChild       | 最后一个子节点 |
| nextSibling     | 下一个兄弟节点 |
| previousSibling | 上一个兄弟节点 |

子节点集合与首、尾节点获取

- 文本也是node所以也会在匹配当中

```js
<div id="app">
  <div class="houdunren" data="hd">houdunren.com</div>
  <div class="houdunwang">houdunwang.com</div>
  <div class="xiangjun">向军大叔</div>
</div>
<script>
  const node = document.querySelector(`#app`)
  console.log(node.childNodes) //所有子节点
  console.log(node.firstChild) //第一个子节点是文本节点
  console.log(node.lastChild) //最后一个子节点也是文本节点
</script>
```



下面通过示例操作节点关联

- 文本也是node所以也会在匹配当中

```js
<div id="app">
  <div class="houdunren" data="hd">houdunren.com</div>
  <div class="houdunwang">houdunwang.com</div>
  <div class="xiangjun">向军大叔</div>
</div>
<script>
  const node = app.querySelector(`.houdunwang`)
  console.log(node.parentNode) //div#app
  console.log(node.childNodes) //文本节点
  console.log(node.nextSibling) //下一个兄弟节点是文本节点
  console.log(node.previousSibling) //上一个节点也是文本节点
</script>
```

document是顶级节点html标签的父节点是document

```js
<script>
  console.log(document.documentElement.parentNode === document)
</script>
```



#### 处理标签关系

使用childNodes等获取的节点包括文本与注释，但这不是我们常用的，为此系统也提供了只操作元素的关系方法。



**基础知识**

下面是处理标签关系的常用 API

| 节点属性               | 说明                                             |
| ---------------------- | ------------------------------------------------ |
| parentElement          | 获取父元素                                       |
| children               | 获取所有子元素                                   |
| childElementCount      | 子标签元素的数量                                 |
| firstElementChild      | 第一个子标签                                     |
| lastElementChild       | 最后一个子标签                                   |
| previousElementSibling | 上一个兄弟标签                                   |
| nextElementSibling     | 下一个兄弟标签                                   |
| contains               | 返回布尔值，判断传入的节点是否为该节点的后代节点 |

以下实例展示怎样通过元素关系获取元素

```js
<div id="app">
  <div class="houdunren" data="hd">houdunren.com</div>
  <div class="houdunwang">houdunwang.com</div>
  <div class="xiangjun"><!-- 向军大叔 --></div>
</div>

<script>
  const app = document.querySelector(`#app`)
  console.log(app.children) //所有子元素
  console.log(app.firstElementChild) //第一个子元素 div.houdunren
  console.log(app.lastElementChild) //最后一个子元素 div.xiangjun

  const houdunwang = document.querySelector('.houdunwang')
  console.log(houdunwang.parentElement) //父元素 div#app

  console.log(houdunwang.previousElementSibling) //上一个兄弟元素 div.houdunren
  console.log(houdunwang.nextElementSibling) //下一个兄弟元素 div.xiangjun
</script>
```

html标签的父节点是document，但父标签节点不存在

```js
<script>
  console.log(document.documentElement.parentNode === document) //true
  console.log(document.documentElement.parentElement) //null
</script>
```



### 六、操作节点属性

#### 标准属性

元素的标准属性可以直接进行操作，下面是直接设置元素的className

```js
<div id="app">
  <div class="houdunren" data="hd">houdunren.com</div>
  <div class="houdunwang">houdunwang.com</div>
</div>
<script>
  const app = document.querySelector(`#app`)
  app.className = 'houdunren houdunwang'
</script>
```



下面设置图像元素的标准属性

```js
<img src="" alt="" />
<script>
  let img = document.images[0]
  img.src = 'https://www.houdurnen.com/avatar.jpg'
  img.alt = '后盾人'
</script>
```



使用hidden隐藏元素

```js
<div id="app">houdunren.com</div>
<script>
  const app = document.querySelector('#app')
  app.addEventListener('click', function () {
    this.hidden = true
  })
</script>
```



**多类型**

大部分属性值是都是字符串，但并不是全部，下例中需要转换为数值后进行数据运算

```js
<input type="number" name="age" value="88" />

<script>
  let input = document.getElementsByName('age').item(0)
  input.value = parseInt(input.value) + 100
</script>
```

下面表单checked属性值为Boolean类型

```js
<label for="hot"> <input id="hot" type="checkbox" name="hot" />热门 </label>
<script>
  const node = document.querySelector(`[name='hot']`)
  node.addEventListener('change', function () {
    console.log(this.checked)
  })
</script>
```

属性值并都与HTML定义的值一样，下面返回的href属性值是完整链接

```js
<a href="#houdunren" id="home">后盾人</a>
<script>
  const node = document.querySelector(`#home`)
  console.log(node.href)
</script>
```



#### 定制属性

对于标准的属性可以使用DOM属性的方式进行操作，但对于标签的非标准的定制属性则不可以。但JS提供了方法来控制标准或非标准的属性

可以理解为元素的属性分两个地方保存，DOM属性中记录标准属性，特征中记录标准和定制属性

- 使用特征操作时属性名称不区分大小写
- 特征值都为字符串类型

| 方法            | 说明     |
| --------------- | -------- |
| getAttribute    | 获取属性 |
| setAttribute    | 设置属性 |
| removeAttribute | 删除属性 |
| hasAttribute    | 属性检测 |

特征是可迭代对象，下面使用for...of来进行遍历操作

```js
<div id="app" content="后盾人" color="red">houdunwang.com</div>
<script>
  const app = document.querySelector('#app')
  for (const { name, value } of app.attributes) {
    console.log(name, value)
  }
</script>
```

![](E:\note\前端\笔记\js\dom&&bom\自定义属性.png)

属性值都为字符串，所以数值类型需要进行转换

```js
<input type="number" name="age" value="88" />
<script>
  let input = document.getElementsByName('age').item(0)
  let value = input.getAttribute('value') * 1 + 100
  input.setAttribute('value', value)
</script>
```

使用removeAttribute删除元素的class属性，并通过hasAttribute进行检测删除结果

```js
<div class="houdunwang">houdunwang.com</div>
<script>
  let houdunwang = document.querySelector('.houdunwang')
  houdunwang.removeAttribute('class')
  console.log(houdunwang.hasAttribute('class')) //false
</script>
```

特征值与HTML定义是一致的，这和属性值是不同的

```js
<a href="#houdunren" id="home">后盾人</a>
<script>
  const node = document.querySelector(`#home`)
  
  // http://127.0.0.1:5500/test.html#houdunren
  console.log(node.href)
  
  // #houdunren
  console.log(node.getAttribute('href'))
</script>
```



**attributes**

元素提供了attributes 属性可以只读的获取元素的属性

```js
<div class="houdunwang" data-content="后盾人">houdunwang.com</div>
<script>
  let houdunwang = document.querySelector('.houdunwang')
  console.dir(houdunwang.attributes['class'].nodeValue) //houdunwang
  console.dir(houdunwang.attributes['data-content'].nodeValue) //后盾人
</script>
```



###### 自定义特征

虽然可以随意定义特征并使用getAttribute等方法管理，但很容易造成与标签的现在或未来属性重名。建议使用以data-为前缀的自定义特征处理，针对这种定义方式JS也提供了接口方便操作。

- 元素中以data-为前缀的属性会添加到属性集中
- 使用元素的dataset可获取属性集中的属性
- 改变dataset的值也会影响到元素上

下面演示使用属性集设置DIV标签内容

```js
<div class="houdunwang" data-content="后盾人" data-color="red">houdunwang.com</div>

<script>
  let houdunwang = document.querySelector('.houdunwang')
  let content = houdunwang.dataset.content
  console.log(content) //后盾人
  houdunwang.innerHTML = `<span style="color:${houdunwang.dataset.color}">${content}</span>`
</script>
```

多个单词的特征使用驼峰命名方式读取

```js
<div class="houdunwang" data-title-color="red">houdunwang.com</div>
<script>
  let houdunwang = document.querySelector('.houdunwang')
  houdunwang.innerHTML = `
    <span style="color:${houdunwang.dataset.titleColor}">${houdunwang.innerHTML}</span>
  `
</script>
```

改变dataset值也会影响到页面元素上

```js
<div class="houdunwang" data-title-color="red">houdunwang.com</div>
<script>
  let houdunwang = document.querySelector('.houdunwang')
  houdunwang.addEventListener('click', function () {
    this.dataset.titleColor = ['red', 'green', 'blue'][Math.floor(Math.random() * 3)]
    this.style.color = this.dataset.titleColor
  })
</script>
```





### 七、节点操作

#### 创建节点

创建节点的就是构建出DOM对象，然后根据需要添加到其他节点中



##### append

append 也是用于添加元素，同时他也可以直接添加文本等内容。

```text
<script>
    document.body.append((document.createElement('div').innerText = '向军'))
    document.body.append('houdunren.com')
</script>
```



##### createTextNode

创建文本对象并添加到元素中

```text
<div id="app"></div>
<script>
  let app = document.querySelector('#app')
  let text = document.createTextNode('houdunren')
  app.append(text)
</script>
```



##### createElement

使用createElement方法可以标签节点对象，创建span标签新节点并添加到div#app

```js
<div id="app"></div>
<script>
  let app = document.querySelector('#app')
  let span = document.createElement('span')
  span.innerHTML = 'houdunren'
  app.append(span)
</script>
```



##### cloneNode&importNode

使用cloneNode和document.importNode用于复制节点对象操作

- cloneNode是节点方法
- cloneNode 参数为true时递归复制子节点即深拷贝
- importNode是documet对象方法

复制div#app节点并添加到body元素中

```js
<div id="app">houdunren</div>
<script>
  let app = document.querySelector('#app')
  let newApp = app.cloneNode(true)
  document.body.appendChild(newApp)
</script>
```

document.importNode方法是部分IE浏览器不支持的，也是复制节点对象的方法

- 第一个参数为节点对象
- 第二个参数为true时递归复制

```js
<div id="app">houdunren</div>
<script>
  let app = document.querySelector('#app')
  let newApp = document.importNode(app, true)
  document.body.appendChild(newApp)
</script>
```



#### 古老方法

下面列表过去使用的操作节点的方法，现在不建议使用了。但在阅读老代码时可来此查看语法

| 方法         | 说明                           |
| ------------ | ------------------------------ |
| appendChild  | 添加节点                       |
| insertBefore | 用于插入元素到另一个元素的前面 |
| removeChild  | 删除节点                       |
| replaceChild | 进行节点的替换操作             |



##### 插入节点

插入节点有两种方式，它们的含义是不同的。

方式1：

```javascript
	父节点.appendChild(新的子节点);
```

解释：父节点的最后插入一个新的子节点。

方式2：

```javascript
	父节点.insertBefore(新的子节点,作为参考的子节点)
```

解释：

- 在参考节点前插入一个新的节点。
- 如果参考节点为null，那么他将在父节点里面的最后插入一个子节点。



##### 删除节点

格式如下：

```javascript
	父节点.removeChild(子节点);
```

解释：**用父节点删除子节点**。必须要指定是删除哪个子节点。

如果我想删除自己这个节点，可以这么做：

```javascript
	node1.parentNode.removeChild(node1);
```



#### insertAdjacentHTML

将html文本插入到元素指定位置，浏览器会对文本进行标签解析，包括以下位置

| 选项        | 说明         |
| ----------- | ------------ |
| beforebegin | 元素本身前面 |
| afterend    | 元素本身后面 |
| afterbegin  | 元素内部前面 |
| beforeend   | 元素内部后面 |

在div#app前添加HTML文本

```js
<div id="app">
  <div class="houdunren" data="hd">houdunren.com</div>
  <div class="houdunwang">houdunwang.com</div>
</div>
<script>
  let app = document.querySelector('#app')
  let span = document.createElement('span')
  app.insertAdjacentHTML('beforebegin', '<h1>后盾人</h1>')
</script>
```



#### insertAdjacentElement

insertAdjacentElement() 方法将指定元素插入到元素的指定位置，包括以下位置

- 第一个参数是位置
- 第二个参数为新元素节点

| 选项        | 说明         |
| ----------- | ------------ |
| beforebegin | 元素本身前面 |
| afterend    | 元素本身后面 |
| afterbegin  | 元素内部前面 |
| beforeend   | 元素内部后面 |

在div#app 前插入span标签

```js
<div id="app">
  <div class="houdunren" data="hd">houdunren.com</div>
  <div class="houdunwang">houdunwang.com</div>
</div>
<script>
  let app = document.querySelector('#app')
  let span = document.createElement('span')
  span.innerHTML = '后盾人'
  app.insertAdjacentElement('beforebegin', span)
</script>
```



#### 推荐方法

| 方法        | 说明                       |
| ----------- | -------------------------- |
| append      | 节点尾部添加新节点或字符串 |
| prepend     | 节点开始添加新节点或字符串 |
| before      | 节点前面添加新节点或字符串 |
| after       | 节点后面添加新节点或字符串 |
| replaceWith | 将节点替换为新节点或字符串 |

在标签内容后面添加新内容

```js
<div id="app">
  houdunren.com
</div>
<script>
  let app = document.querySelector('#app')
  app.append('-houdunwang.com')
</script>
```

同时添加多个内容，包括字符串与元素标签

```js
<div id="app">
  houdunren.com
</div>
<script>
  let app = document.querySelector('#app')
  let h1 = document.createElement('h1')
  h1.append('后盾人')
  app.append('@', h1)
</script>
```

将标签替换为新内容

```js
<div id="app">
  houdunren.com
</div>
<script>
  let app = document.querySelector('#app')
  let h1 = document.createElement('h1')
  h1.append('houdunwang.com')
  app.replaceWith(h1)
</script>
```

添加新元素h1到目标元素div#app里面

```js
<div id="app"></div>
<script>
  let app = document.querySelector('#app')
  let h1 = document.createElement('h1')
  h1.innerHTML = 'houdunren'
  app.append(h1)
</script>
```

将h2移动到h1之前

```js
<h1>houdunren.com@h1</h1>
<h2>houdunwang@h2</h2>
<script>
  let h1 = document.querySelector('h1')
  let h2 = document.querySelector('h2')
  h1.before(h2)
</script>
```

使用remove方法可以删除节点

```js
<div id="app">
  houdunren.com
</div>
<script>
  let app = document.querySelector('#app')
  app.remove()
</script>
```



### 八、节点内容

####  innerHTML

​	innerHTML用于向标签中添加html内容，同时触发浏览器的解析器重绘DOM。

#### outerHTML

outerHTML与innerHTML的区别是包含父标签

- outerHTML不会删除原来的旧元素
- 只是用新内容替换替换旧内容，旧内容（元素）依然存在



#### textContent与innerText

textContent与innerText是访问或添加文本内容到元素中

- textContentb部分IE浏览器版本不支持
- innerText部分FireFox浏览器版本不支持
- 获取时忽略所有标签,只获取文本内容
- 设置时将内容中的标签当文本对待不进行标签解析

获取时忽略内容中的所有标签

```js
<div id="app">
  <h1>houdunren.com</h1>
</div>
<script>
  let app = document.querySelector('#app')
  console.log(app.textContent)
</script>

//houdunren.com
```

设置时将标签当文本对待，即转为HTML实体内容

**不进行标签解析**

```js
<div id="app">
  <div class="houdunren" data="hd">houdunren.com</div>
  <div class="houdunwang">houdunwang.com</div>
</div>
<script>
  let app = document.querySelector('#app')
  app.textContent="<h1>后盾人</h1>"
</script>

```



#### outerText

与innerText差别是会影响所操作的标签

```js
<h1>houdunren.com</h1>
<script>
  let h1 = document.querySelector('h1')
  h1.outerText = '后盾人'
</script>

```



#### insertAdjacentText

将文本插入到元素指定位置，不会对文本中的标签进行解析，包括以下位置

| 选项        | 说明         |
| ----------- | ------------ |
| beforebegin | 元素本身前面 |
| afterend    | 元素本身后面 |
| afterbegin  | 元素内部前面 |
| beforeend   | 元素内部后面 |

添加文本内容到div#app前面

```js
<div id="app">
  <div class="houdunren" data="hd">houdunren.com</div>
  <div class="houdunwang">houdunwang.com</div>
</div>
<script>
  let app = document.querySelector('#app')
  let span = document.createElement('span')
  app.insertAdjacentText('beforebegin', '<h1>后盾人</h1>')
</script>

```

