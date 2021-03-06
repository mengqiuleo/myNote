# 【http学习笔记二】基础篇

[TOC]



## 一、HTTP报文是什么样子的？

### Ⅰ HTTP报文结构分析-请求报文

![](https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206042013397.jpg)

1. 起始行（start line）：描述请求或响应的基本信息；分为请求行和状态行
2. 头部字段集合（header）：使用 key-value 形式更详细地说明报文；分为请求头和响应头
3. 消息正文（entity）：实际传输的数据，它不一定是纯文本，可以是图片、视频等二进制数据。

<img src="https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206042013398.jpg" style="zoom:80%;" />



#### 请求行

请求行由三部分构成：
1. 请求方法：是一个动词，如 GET/POST，表示对资源的
操作；
2. 请求目标：通常是一个 URI，标记了请求方法要操作的资
源；
3. 版本号：表示报文使用的 HTTP 协议版本。

这三个部分通常使用空格（space）来分隔，最后要用CRLF 换行表示结束。

<img src="https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206042013399.jpg" style="zoom:80%;" />



#### 状态行

响应报文里的起始行，在这里它不叫“响应行”，而是叫“**状态行**”（status line），意思是服务器响应的状态。

比起请求行来说，状态行要简单一些，同样也是由三部分构成：
1. 版本号：表示报文使用的 HTTP 协议版本；
2. 状态码：一个三位数，用代码的形式表示处理的结果，比如 200 是成功，500 是服务器错误；
3. 原因：作为数字状态码补充，是更详细的解释文字，帮助人理解原因。

<img src="https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206042013400.jpg" style="zoom:80%;" />



#### HTTP报文头

- HTTP的报文头大体可以分为四类，分别是：

​			通用报文头、请求报文头、响应报文头和实体报文头

- 在HTTP/1.1里一共规范了47种报文头字段

头部字段是 key-value 的形式，key 和 value 之间用“:”分隔，最后用 CRLF 换行表示字段结束。比如在“Host: 127.0.0.1”这一行里 key 就是“Host”，value就是“127.0.0.1”。



不过使用头字段需要注意下面几点：

1. 字段名不区分大小写，例如“Host”也可以写成“host”，但首字母大写的可读性更好；
2. 字段名里不允许出现空格，可以使用连字符“-”，但不能使用下划线“_”。例如，“test-name”是合法的字段名，而“test name”“test_name”是不正确的字段名；
3. 字段名后面必须紧接着“:”，不能有空格，而“:”后的字段值前可以有多个空格；
4. 字段的顺序是没有意义的，可以任意排列不影响语义；
5. 字段原则上不能重复，除非这个字段本身的语义允许，例如 Set-Cookie。



##### ①通用报文头

这些字段可以用在请求报文上，也可以用在响应报文上。

<img src="https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206042013401.jpg" style="zoom:80%;" />



##### ②请求报文头

<img src="https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206042013402.jpg" style="zoom:80%;" />

**Host字段**，它属于请求字段，只能出现在请求头里，它同时也是唯一一个 HTTP/1.1 规范里要求必须出现的字段，也就是说，如果请求头里没有 Host，那这就是一个错误的报文。

Host 字段告诉服务器这个请求应该由哪个主机来处理，当一台计算机上托管了多个虚拟主机的时候，服务器端就需要用 Host 字段来选择，有点像是一个简单的“路由重定向”。



##### ③响应报文头

<img src="https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206042013403.jpg" style="zoom:80%;" />



##### ④实体报文头

<img src="https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206042013404.jpg" style="zoom:80%;" />



### Ⅱ HTTP报文结构分析-响应报文

<img src="https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206042013405.jpg" style="zoom:80%;" />





## 二、如何理解请求方法？

HTTP 协议里为什么要有“请求方法”这个东西呢？

这就要从 HTTP 协议设计时的定位说起了。还记得吗？蒂姆·伯纳斯 - 李最初设想的是要用 HTTP 协议构建一个超链接文档系统，使用 URI 来定位这些文档，也就是资源。那么，
该怎么在协议里操作这些资源呢？

很显然，需要有某种“动作的指示”，告诉操作这些资源的方式。所以，就这么出现了“请求方法”。它的实际含义就是客户端发出了一个“动作指令”，要求服务器端对 URI 定位的资源执行这个动作。



目前 HTTP/1.1 规定了八种方法，单词都必须是大写的形式，

1. GET：获取资源，可以理解为读取或者下载数据；
2. HEAD：获取资源的元信息；
3. POST：向资源提交数据，相当于写入或上传数据；
4. PUT：类似 POST；
5. DELETE：删除资源；
6. CONNECT：建立特殊的连接隧道；
7. OPTIONS：列出可对资源实行的方法；
8. TRACE：追踪请求 - 响应的传输路径。

<img src="https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206042013406.jpg" style="zoom:80%;" />



#### GET/HEAD

它的含义是请求从服务器获取资源，这个资源既可以是静态的文本、页面、图片、视频，也可以是由 PHP、Java 动态生成的页面或者其他格式的数据。

 因为GET方法所提交的数据是作为URL的一部分，所以提交的数据量不能过大。

GET 方法虽然基本动作比较简单，但搭配 URI 和其他头字段就能实现对资源更精细的操作。

例如，在 URI 后使用“#”，就可以在获取页面后直接定位到某个标签所在的位置；使用 If-Modified-Since 字段就变成了“有条件的请求”，仅当资源被修改时才会执行获取动作；使用 Range 字段就是“范围请求”，只获取资源的一部分数据。

**HEAD**方法与 GET 方法类似，也是请求从服务器获取资源，服务器的处理机制也是一样的，但服务器不会返回请求的实体数据，只会传回响应头，也就是资源的“元信息”。HEAD 方法可以看做是 GET 方法的一个“简化版”或者“轻量版”。因为它的响应头与 GET 完全相同，所以可以用在很多并不真正需要资源的场合，避免传输 body 数据的浪费。

比如，想要检查一个文件是否存在，只要发个 HEAD 请求就可以了，没有必要用 GET 把整个文件都取下来。再比如，要检查文件是否有最新版本，同样也应该用 HEAD，服务器会在响应头里把文件的修改时间传回来。



#### POST/PUT

GET 和 HEAD 方法是从服务器获取数据，而 POST 和 PUT方法则是相反操作，向 URI 指定的资源提交数据，数据就放在报文的 body 里。

PUT 的作用与 POST 类似，也可以向服务器提交数据，但与 POST 存在微妙的不同，通常 POST 表示的是“新建”“create”的含义，而 PUT 则是“修改”“update”的含义。

在实际应用中，PUT 用到的比较少。而且，因为它与 POST的语义、功能太过近似，有的服务器甚至就直接禁止使用PUT 方法，只用 POST 方法上传数据。



#### DELETE

DELETE方法指示服务器删除资源，因为这个动作危险性太大，所以通常服务器不会执行真正的删除操作，而是对资源做一个删除标记。当然，更多的时候服务器就直接不处理DELETE 求。



#### CONNECT

CONNECT是一个比较特殊的方法，要求服务器为客户端和另一台远程服务器建立一条特殊的连接隧道，这时 Web 服务器在中间充当了代理的角色。



#### OPTIONS

OPTIONS方法要求服务器列出可对资源实行的操作方法，在响应头的 Allow 字段里返回。它的功能很有限，用处也不大，有的服务器（例如 Nginx）干脆就没有实现对它的支持。



#### TRACE

TRACE方法多用于对 HTTP 链路的**测试或诊断**，可以显示出请求 - 响应的传输路径。它的本意是好的，但存在漏洞，会泄漏网站的信息，所以 Web 服务器通常也是禁止使用。



#### 扩展方法

比如用 **LOCK 方法**锁定资源暂时不允许修改，或者使用 **PATCH 方法**给资源打个小补丁，部分
更新数据。但因为这些方法是非标准的，所以需要为客户端和服务器编写额外的代码才能添加支持。





#### 安全与幂等

在 HTTP 协议里，所谓的“安全”是指请求方法不会“破坏”服务器上的资源，即不会对服务器上的资源造成实质的修改。

按照这个定义，只有 GET 和 HEAD 方法是“安全”的，因为它们是“只读”操作，只要服务器不故意曲解请求方法的处理方式，无论 GET 和 HEAD 操作多少次，服务器上的数据都是“安全的”。

而 POST/PUT/DELETE 操作会修改服务器上的资源，增加或删除数据，所以是“不安全”的。

所谓的“幂等”实际上是一个数学用语，被借用到了 HTTP协议里，意思是多次执行相同的操作，结果也都是相同的，即多次“幂”后结果“相等”。

很显然，GET 和 HEAD 既是安全的也是幂等的，DELETE可以多次删除同一个资源，效果都是“资源不存在”，所以也是幂等的。

POST 和 PUT 的幂等性质就略费解一点。

按照 RFC 里的语义，POST 是“新增或提交数据”，多次提交数据会创建多个资源，所以不是幂等的；而 PUT是“替换或更新数据”，多次更新一个资源，资源还是会第一次更新的状态，所以是幂等的。





## 三、URI && URL && URN

**URI**，也就是**统一资源标识符**（Uniform Resource Identifier）

严格地说，URI 不完全等同于网址，它包含有 URL 和 URN两个部分，在 HTTP 世界里用的网址实际上是 **URL**——**统一资源定位符**（Uniform Resource Locator）。但因为URL 实在是太普及了，所以常常把这两者简单地视为相等。



### URI 的格式

URI 本质上是一个字符串，这个字符串的作用是**唯一地标记资源的位置或者名字**。

它不仅能够标记万维网的资源，也可以标记其他的，如邮件系统、本地文件系统等任意资源。而“资源”既可以是存在磁盘上的静态文本、页面数据，也可以是由 Java、PHP 提供的动态服务。

URI 最常用的形式，由 scheme、host:port、path 和 query 四个部分组成，但有的部分可以
视情况省略。

<img src="https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206042013407.jpg" style="zoom:80%;" />



### URI 的基本组成

URI 第一个组成部分叫**scheme**，翻译成中文叫“**方案名**”或者“**协议名**”，表示**资源应该使用哪种协议**来访问。

最常见的当然就是“http”了，表示使用 HTTP 协议。另外还有“https”，表示使用经过加密、安全的 HTTPS 协议。此外还有其他不是很常见的 scheme，例如 ftp、ldap、file、news 等。

浏览器或者你的应用程序看到 URI 里的 scheme，就知道下一步该怎么走了，会调用相应的 HTTP 或者 HTTPS 下层API。显然，**如果一个 URI 没有提供 scheme，即使后面的地址再完善，也是无法处理的。**

在 scheme 之后，必须是**三个特定的字符“://”**，它把scheme 和后面的部分分离开。

在“://”之后，是被称为“**authority**”的部分，表示**资源所在的主机名**，通常的形式是“host:port”，即主机名加端口号。

主机名可以是 IP 地址或者域名的形式，必须要有，否则浏览器就会找不到服务器。但端口号有时可以省略，浏览器等客户端会依据 scheme 使用默认的端口号，例如 HTTP 的默认端口号是 80，HTTPS 的默认端口号是 443。

有了协议名和主机地址、端口号，再加上后面**标记资源所在位置的path**，浏览器就可以连接服务器访问资源了。

URI 里 path 采用了类似文件系统“目录”“路径”的表示方式，因为早期互联网上的计算机多是 UNIX 系统，所以采用了 UNIX 的“/”风格。其实也比较好理解，它与scheme 后面的“://”是一致的。

**注意，URI 的 path 部分必须以“/”开始，也就是必须包含“/”，不要把“/”误认为属于前面authority。**



举例：

```
http://nginx.org
http://www.chrono.com:8080/11-1
https://tools.ietf.org/html/rfc7230
file:///D:/http_study/www/
```

第一个 URI 算是最简单的了，协议名是“http”，主机名是“nginx.org”，端口号省略，所以是默认的 80，而路径部分也被省略了，默认就是一个“/”，表示根目录。

第二个 URI 是在实验环境里这次课程的专用 URI，主机名是“www.chrono.com”，端口号是 8080，后面的路径是“/11-1”。

第三个是 HTTP 协议标准文档 RFC7230 的 URI，主机名是“tools.ietf.org”，路径是“/html/rfc7230”。

最后一个 URI 要注意了，它的协议名不是“http”，而是“file”，表示这是本地文件，而后面居然有三个斜杠，这是怎么回事？

在scheme 的介绍中，，这三个斜杠里的前两个属于 URI 特殊分隔符“://”，然后后面
的“/D:/http_study/www/”是路径，而中间的主机名被“省略”了。这实际上是 file 类型 URI 的“特例”，它允许省略主机名，默认是本机 localhost。

**但对于 HTTP 或 HTTPS 这样的网络通信协议，主机名是绝对不能省略的。原因之前也说了，会导致浏览器无法找到服务器。**



**客户端和服务器看到的 URI 是不一样的**。

客户端看到的必须是完整的 URI，使用特定的协议去连接特定的主机，

而服务器看到的只是报文请求行里被删除了协议名和主机名的 URI。

原因：这是因为协议名和主机名已经分别出现在了请求行的版本号和请求头的 Host 字段里，没有必要再重复。

举例：

运行 Chrome，用 F12 打开开发者工具，然后在地址栏里输入“http://www.chrono.com/11-1”，得到的结果如下图。

<img src="https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206042013408.jpg" style="zoom:80%;" />



在开发者工具里依次选“Network”“Doc”，就可以找到请求的 URI。然后在 Headers 页里看 Request Headers，用“view source”就可以看到浏览器发的原始请求头了。



在 HTTP 报文里的 URI“/11-1”与浏览器里输入的“http://www.chrono.com/11-1”有很大的不同，协议名和主机名都不见了，只剩下了后面的部分。

这是因为协议名和主机名已经分别出现在了请求行的版本号和请求头的 Host 字段里，没有必要再重复。



### URI 的查询参数

**query**

使用“协议名 + 主机名 + 路径”的方式，已经可以精确定位网络上的任何资源了。但这还不够，很多时候我们还想在操作资源的时候附加一些额外的修饰参数。
举几个例子：获取商品图片，但想要一个 32×32 的缩略图版本；获取商品列表，但要按某种规则做分页和排序；跳转页面，但想要标记跳转前的原始页面。

仅用“协议名 + 主机名 + 路径”的方式是无法适应这些场景的，**所以 URI 后面还有个“query”部分**，它在 path之后，用一个“?”开始，但不包含“?”，表示对资源附加的额外要求。这是个很形象的符号，比“://”要好的多，很明显地表示了“查询”的含义。

查询参数 query 有一套自己的格式，是多个“key=value”的字符串，这些 KV 值用字符“&”连接，浏览器和客户端都可以按照这个格式把长串的查询参数解析成可理解的字典或关联数组形式。



**注：**

查询参数query也可以不使用"key=value"的形式，只是单纯的“key”,这样“value”就是空字符串。



### URI 的完整格式

URI 还有一个“真正”的完整形态，如下图所示。

<img src="https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206042013409.jpg" style="zoom:80%;" />



这个“真正”形态比基本形态多了两部分。

第一个多出的部分是协议名之后、主机名之前的身份信息“user:passwd@”，表示登录主机时的用户名和密码，但现在已经不推荐使用这种形式了（RFC7230），因为它把敏感信息以明文形式暴露出来，存在严重的安全隐患。



第二个多出的部分是查询参数后的片段标识符“#fragment”，它是 URI 所定位的资源内部的一
个“锚点”或者说是“标签”，浏览器可以在获取资源后直接跳转到它指示的位置。

但片段标识符仅能由浏览器这样的客户端使用，服务器是看不到的。也就是说，浏览器永远不会把带“#fragment”的URI 发送给服务器，服务器也永远不会用这种方式去处理资源的片段。



### URI 的编码

在 URI 里只能使用 ASCII 码，但如果要在 URI 里使用英语以外的汉语、日语等其他语言该怎么办呢？
还有，某些特殊的 URI，会在 path、query 里出现“@&?"等起界定符作用的字符，会导致 URI 解析错误，这时又该怎么办呢？

所以，URI 引入了编码机制，对于 ASCII 码以外的字符集和特殊字符做一个特殊的操作，把它们转换成与 URI 语义不冲突的形式。这在 RFC 规范里称为“escape”和“unescape”，俗称“转义”。

URI 转义的规则有点“简单粗暴”，直接把非 ASCII 码或特殊字符转换成十六进制字节值，然后前面再加上一个“%”。

例如，空格被转义成“%20”，“?”被转义成“%3F”。而中文、日文等则通常使用 UTF-8 编码后再转义，例如“银河”会被转义成“%E9%93%B6%E6%B2%B3”。



**总结：**

1. URI 是用来唯一标记服务器上资源的一个字符串，通常也称为 URL；
2. URI 通常由 scheme、host:port、path 和 query 四个部分组成，有的可以省略；
3. scheme 叫“方案名”或者“协议名”，表示资源应该使用哪种协议来访问；
4. “host:port”表示资源所在的主机名和端口号；
5. path 标记资源所在的位置；
6. query 表示对资源附加的额外要求；
7. 在 URI 里对“@&/”等特殊字符和汉字必须要做编码，否则服务器收到 HTTP 报文后会无法正确处理。





## 四、响应状态码

状态行的结构，有三部分：

<img src="https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206042013410.jpg" style="zoom:80%;" />

开头的 Version 部分是 HTTP 协议的版本号，通常是HTTP/1.1，用处不是很大。

后面的 Reason 部分是原因短语，是状态码的简短文字描述，例如“OK”“Not Found”等等，也可以自定义。但它只是为了兼容早期的文本客户端而存在，提供的信息很有限，目前的大多数客户端都会忽略它。

所以，状态行里有用的就只剩下中间的状态码（StatusCode）了。它是一个十进制数字，以代码的形式表示服务器对请求的处理结果，就像我们通常编写程序时函数返回的错误码一样。



### 状态码

目前 RFC 标准里规定的状态码是三位数，RFC 标准把状态码分成了五类，用数字的第一位表示分类，而 0~99 不用，这样状态码的实际可用范围就大大缩小了，由 000~999 变成了 100~599。

![](https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206042013411.jpg)

客户端作为请求的发起方，获取响应报文后，需要通过状态码知道请求是否被正确处理，是否要再次发送请求，如果出错了原因又是什么。这样才能进行下一步的动作，要么发送新请求，要么改正错误重发请求。

服务器端作为请求的接收方，也应该很好地运用状态码。在处理请求时，选择最恰当的状态码回复客户端，告知客户端处理的结果，指示客户端下一步应该如何行动。特别是在出错的时候，尽量不要简单地返 400、500 这样意思含糊不清的状态码。



#### 2××

2××类状态码表示服务器收到并成功处理了客户端的请求，这也是客户端最愿意看到的状态码。

“**200 OK**”是最常见的成功状态码，表示一切正常，服务器如客户端所期望的那样返回了处理结果，如果是非 HEAD请求，通常在响应头后都会有 body 数据。

“**204 No Content**”是另一个很常见的成功状态码，它的含义与“200 OK”基本相同，但响应头后没有 body 数据。所以对于 Web 服务器来说，正确地区分 200 和 204是很必要的。

“**206 Partial Content**”是 HTTP **分块下载或断点续传**的基础，在客户端发送“范围请求”、要求获取资源的部分数据时出现，它与 200 一样，也是服务器成功处理了请求，但 body 里的数据不是资源的全部，而是其中的一部分。

状态码 206 通常还会伴随着头字段“Content-Range”，表示响应报文里 body 数据的具体范围，供客户端确认，例如“Content-Range: bytes 0-99/2000”，意思是此次获取的是总计 2000 个字节的前 100 个字节。

###### 断点续传和多线程下载

HTTP是通过在Header里两个参数实现的，客户端发送请求时对应的是Range，服务器端响应时对应的是Content-Range。

**Range**

Range: bytes=0-499

Range:bytes=500-999

**Content-Range**

用于响应头中，在发出带Range的请求后，服务器会在Content-Range头部返回当前接收的范围和文件总大小。

而在响应完成后，返回的响应头内容也不同：

HTTP/1.1 200 OK（不使用断点续传方式）

HTTP/1.1 206 Partial Content （使用断点续传方式）





#### 3××

3××类状态码表示客户端请求的资源发生了变动，客户端必须用新的 URI 重新发送请求获取资源，也就是通常所说的“重定向”，包括著名的 301、302 跳转。

“**301 Moved Permanently**”俗称“永久重定向”，含义是此次请求的资源已经不存在了，需要改用改用新的 URI再次访问。

与它类似的是“**302 Found**”，曾经的描述短语是“Moved Temporarily”，俗称“临时重定向”，意思
是请求的资源还在，但需要暂时用另一个 URI 来访问。

301 和 302 都会在响应头里使用字段Location指明后续要跳转的 URI，最终的效果很相似，浏览器都会重定向到新的URI。两者的根本区别在于语义，一个是“永久”，一个是“临时”，所以在场景、用法上差距很大。

“**304 Not Modified**” 是一个比较有意思的状态码，它用于 If-Modified-Since 等条件请求，表示资源未修改，用于缓存控制。它不具有通常的跳转含义，但可以理解成“重定向已到缓存的文件”（即“缓存重定向”）。



#### 4××

4××类状态码表示客户端发送的请求报文有误，服务器无法处理，它就是真正的“错误码”含义了。

“**400 Bad Request**”是一个通用的错误码，表示请求报文有错误，但具体是数据格式错误、缺少请求头还是 URI 超长它没有明确说，只是一个笼统的错误，客户端看到 400只会是“一头雾水”“不知所措”。所以，在开发 Web 应用时应当尽量避免给客户端返回 400，而是要用其他更有明确含义的状态码。

“**403 Forbidden**”实际上不是客户端的请求出错，而是表示服务器禁止访问资源。原因可能多种多样，例如信息敏感、法律禁止等，如果服务器友好一点，可以在 body 里详细说明拒绝请求的原因，不过现实中通常都是直接给一个“闭门羹”。

“**404 Not Found**”可能是我们最常看见也是最不愿意看到的一个状态码，它的原意是资源在本服务器上未找到，所以无法提供给客户端。但现在已经被“用滥了”，只要服务器“不高兴”就可以给出个 404，而我们也无从得知后面到底是真的未找到，还是有什么别的原因，某种程度上它比403 还要令人讨厌。

4××里剩下的一些代码较明确地说明了错误的原因，都很好理解，开发中常用的有：

405 Method Not Allowed：不允许使用某些方法操作资源，例如不允许 POST 只能 GET；

406 Not Acceptable：资源无法满足客户端请求的条件，例如请求中文但只有英文；

408 Request Timeout：请求超时，服务器等待了过长的时间；

409 Conflict：多个请求发生了冲突，可以理解为多线程并发时的竞态；

413 Request Entity Too Large：请求报文里的 body 太大；

414 Request-URI Too Long：请求行里的 URI 太大；

429 Too Many Requests：客户端发送了太多的请求，通常是由于服务器的限连策略；

431 Request Header Fields Too Large：请求头某个字段或总体太大；



#### 5××

5××类状态码表示客户端请求报文正确，但服务器在处理时内部发生了错误，无法返回应有的响应数据，是服务器端的“错误码”。

“**500 Internal Server Error**”与 400 类似，也是一个通用的错误码，服务器究竟发生了什么错误我们是不知道的。不过对于服务器来说这应该算是好事，通常不应该把服务器内部的详细信息，例如出错的函数调用栈告诉外界。虽然不利于调试，但能够防止黑客的窥探或者分析。

“**501 Not Implemented**”表示客户端请求的功能还不支持，这个错误码比 500 要“温和”一些，和“即将开业，敬请期待”的意思差不多，不过具体什么时候“开业”就不好说了。

“**502 Bad Gateway**”通常是服务器作为网关或者代理时返回的错误码，表示服务器自身工作正常，访问后端服务器时发生了错误，但具体的错误原因也是不知道的。

“**503 Service Unavailable**”表示服务器当前很忙，暂时无法响应服务，我们上网时有时候遇到的“网络服务正忙，请稍后重试”的提示信息就是状态码 503。

503 是一个“临时”的状态，很可能过几秒钟后服务器就不那么忙了，可以继续提供服务，所以 503 响应报文里通常还会有一个“Retry-After”字段，指示客户端可以在多久以后再次尝试发送请求。





## 五、HTTP有哪些特点？

<img src="https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206042013412.jpg" style="zoom:80%;" />



#### 灵活可扩展

**HTTP 协议是一个“灵活可扩展”的传输协议**。



#### 可靠传输

因为 HTTP 协议是基于 TCP/IP 的，而 TCP 本身是一个“可靠”的传输协议，所以 HTTP 自然也就继承了这个特性，能够在请求方和应答方之间“可靠”地传输数据。

它的具体做法与 TCP/UDP 差不多，都是对实际传输的数据（entity）做了一层包装，加上
一个头，然后调用 Socket API，通过 TCP/IP 协议栈发送或者接收。不过我们必须正确地理解“可靠”的含义，HTTP 并不能 100% 保证数据一定能够发送到另一端，在网络繁忙、连接质量差等恶劣的环境下，也有可能收发失败。“可靠”只是向使用者提供了一个“承诺”，会在下层用多种手段“尽量”保证数据的完整送达。



#### 应用层协议

第三个特点，HTTP 协议是一个应用层的协议。
这个特点也是不言自明的，但却很重要。

在 TCP/IP 诞生后的几十年里，虽然出现了许多的应用层协议，但它们都仅关注很小的应用
领域，局限在很少的应用场景。例如 FTP 只能传输文件、SMTP 只能发送邮件、SSH 只能
远程登录等，在通用的数据传输方面“完全不能打”。

所以 HTTP 凭借着可携带任意头字段和实体数据的报文结构，以及连接控制、缓存代理等
方便易用的特性，一出现就“技压群雄”，迅速成为了应用层里的“明星”协议。只要不太
苛求性能，HTTP 几乎可以传递一切东西，满足各种需求，称得上是一个“万能”的协议。
套用一个网上流行的段子，HTTP 完全可以用开玩笑的口吻说：“不要误会，我不是针对
FTP，我是说在座的应用层各位，都是垃圾。”



#### 请求 - 应答

**HTTP 协议使用的是请求 - 应答通信模式**

这个请求 - 应答模式是 HTTP 协议最根本的通信模型，通俗来讲就是“一发一收”“有来
有去”。

请求 - 应答模式也明确了 HTTP 协议里通信双方的定位，永远是请求方先发起连接和请
求，是主动的，而应答方只有在收到请求后才能答复，是被动的，如果没有请求时不会有任
何动作。

当然，**请求方和应答方的角色也不是绝对的**，在浏览器 - 服务器的场景里，通常服务器都
是应答方，但如果将它**用作代理连接后端服务器**，那么它就可能同时扮演请求方和应答方的
角色。

HTTP 的请求 - 应答模式也恰好契合了传统的 C/S（Client/Server）系统架构，请求方作为客户端、应答方作为服务器。所以，随着互联网的发展就出现了B/S（Browser/Server）架构，用轻量级的浏览器代替笨重的客户端应用，实现零维护的“瘦”客户端，而服务器则摈弃私有通信协议转而使用 HTTP 协议。



#### 无状态

“无状态”形象地来说就是“没有记忆能力”。比如，浏览器发了一个请求，说“我是小明，请给我 A 文件。”，服务器收到报文后就会检查一下权限，看小明确实可以访问 A 文件，于是把文件发回给浏览器。接着浏览器还想要 B 文件，但服务器不会记录刚才的请求状态，不知道第二个请求和第一个请求是同一个浏览器发来的，所以浏览器必须还得重复一次自己的身份才行：“我是刚才的小明，请再给我 B 文件。”

我们可以再对比一下 UDP 协议，不过它是无连接也无状态的，顺序发包乱序收包，数据包
发出去后就不管了，收到后也不会顺序整理。而 HTTP 是有连接无状态，顺序发包顺序收包，按照收发的顺序管理报文。

但不要忘了 HTTP 是“灵活可扩展”的，虽然标准里没有规定“状态”，但完全能够在协
议的框架里给它“打个补丁”，增加这个特性。



#### 无连接

- 无连接的含义是限制每次连接只处理一个请求
- 服务器处理完客户的请求，并收到客户的应答后，即断开连接
- 采用这种方法可以节省传输时间





## 六、HTTP有哪些优点？又有哪些缺点？

#### 简单、灵活、易于扩展

HTTP 最重要也是最突出的**优点**是“**简单、灵活、易于扩展**”

“灵活和易于扩展”实际上是一体的，它们互为表里、相互促进，因为“灵活”所以才会“易于扩展”，而“易于扩展”又反过来让 HTTP 更加灵活，拥有更强的表现能力。

HTTP 协议里的请求方法、URI、状态码、原因短语、头字段等每一个核心组成要素都没有被“写死”，允许开发者任意定制、扩充或解释，给予了浏览器和服务器最大程度的信任和自由，也正好符合了互联网“自由与平等”的精神——缺什么功能自己加个字段或者错误码什么的补上就是了。



#### 应用广泛、环境成熟

HTTP 协议的另一大**优点**是“**应用广泛**”，软硬件环境都非常成熟。

不仅在应用领域，在开发领域 HTTP 协议也得到了广泛的支持。它并不限定某种编程语言或者操作系统，所以天然具有“跨语言、跨平台”的优越性。而且，因为本身的简单特性很容易实现，所以几乎所有的编程语言都有 HTTP 调用库和外围的开发测试工具。



#### 无状态

“**无状态**”，它对于 HTTP 来说**既是优点也是缺点**。

“无状态”有什么好处呢？

因为服务器没有“记忆能力”，所以就不需要额外的资源来记录状态信息，不仅实现上会简
单一些，而且还能减轻服务器的负担，能够把更多的 CPU 和内存用来对外提供服务。
而且，“无状态”也表示服务器都是相同的，没有“状态”的差异，所以可以很容易地组成
集群，让负载均衡把请求转发到任意一台服务器，不会因为状态不一致导致处理出错，使
用“堆机器”的“笨办法”轻松实现高并发高可用。

那么，“无状态”又有什么坏处呢？

既然服务器没有“记忆能力”，它就无法支持需要连续多个步骤的“事务”操作。例如电商购物，首先要登录，然后添加购物车，再下单、结算、支付，这一系列操作都需要知道用户的身份才行，但“无状态”服务器是不知道这些请求是相互关联的，每次都得问一遍身份信息，不仅麻烦，而且还增加了不必要的数据传输量。



#### 明文

HTTP 协议里还有一把优缺点一体的“**双刃剑**”，就是**明文传输**。

“明文”意思就是协议里的报文（准确地说是 header 部分）不使用二进制数据，而是用简单可阅读的文本形式。

对比 TCP、UDP 这样的二进制协议，它的优点显而易见，不需要借助任何外部工具，用浏
览器、Wireshark 或者 tcpdump 抓包后，直接用肉眼就可以很容易地查看或者修改，为
我们的开发调试工作带来极大的便利。

当然，明文的缺点也是一样显而易见，HTTP 报文的所有信息都会暴露在“光天化日之下”，在漫长的传输链路的每一个环节上都毫无隐私可言，不怀好意的人只要侵入了这个链路里的某个设备，简单地“旁路”一下流量，就可以实现对通信的窥视。

你有没有听说过“免费 WiFi 陷阱”之类的新闻呢？
黑客就是利用了 HTTP 明文传输的缺点，在公共场所架设一个 WiFi 热点开始“钓鱼”，诱骗网民上网。一旦你连上了这个 WiFi 热点，所有的流量都会被截获保存，里面如果有银行卡号、网站密码等敏感信息的话那就危险了，黑客拿到了这些数据就可以冒充你为所欲为。



#### 不安全

与“明文”缺点相关但不完全等同的**另一个缺点**是“不安全”。

安全有很多的方面，明文只是“机密”方面的一个缺点，在“身份认证”和“完整性校验”这两方面HTTP 也是欠缺的。

HTTP 没有提供有效的手段来确认通信双方的真实身份。虽然协议里有一个基本的认证机制，但因为刚才所说的明文传输缺点，这个机制几乎可以说是“纸糊的”，非常容易被攻破。如果仅使用 HTTP 协议，很可能你会连到一个页面一模一样但却是个假冒的网站，然后再被“钓”走各种私人信息。

HTTP 协议也不支持“完整性校验”，数据在传输过程中容易被窜改而无法验证真伪。

比如，你收到了一条银行用 HTTP 发来的消息：“小明向你转账一百元”，你无法知道小明是否真的就只转了一百元，也许他转了一千元或者五十元，但被黑客窜改成了一百元，真实情况到底是什么样子 HTTP 协议没有办法给你答案。

虽然银行可以用 MD5、SHA1 等算法给报文加上数字摘要，但还是因为“明文”这个致命缺点，黑客可以连同摘要一同修改，最终还是判断不出报文是否被窜改。

为了解决 HTTP 不安全的缺点，所以就出现了 HTTPS。



#### 性能

HTTP 协议基于 TCP/IP，并且使用了“请求 - 应答”的通信模式，所以性能的关键就在这
两点上。

“请求 - 应答”模式则加剧了 HTTP 的性能问题，这就是著名的“队头阻塞”（Headof-
line blocking），当顺序发送的请求序列中的一个请求因为某种原因被阻塞时，在后面排队的所有请求也一并被阻塞，会导致客户端迟迟收不到数据。















笔记均来自极客时间的课程学习：[透视HTTP协议](https://time.geekbang.org/column/intro/100029001)