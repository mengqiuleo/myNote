[TOC]



## 内置http模块

```js
const http =require('http');

/*
    req   获取客户端传过来的信息
    res  给浏览器响应信息
*/

http.createServer((req,res)=>{

    console.log(req.url);  //获取url

    //设置响应头
    //状态码是 200，文件类型是 html，字符集是 utf-8
    res.writeHead(200,{"Content-type":"text/html;charset='utf-8'"}); //解决乱码

    res.write("<head> <meta charset='UTF-8'></head>");  //解决乱码

    res.write('你好 nodejs');

    res.write('<h2>你好 nodejs</h2>');

    res.end();  //结束响应

}).listen(3000);
```



### 监听主机和端口号

通过listen方法来开启服务器，并且在某一个主机和端口上监听网络请求

listen函数有三个参数：

- 端口port: 可以不传, 系统会默认分配端
- 主机host: 通常可以传入localhost、ip地址127.0.0.1,或者ip地址0.0.0.0，默认是0.0.0.0
- 回调函数：服务器启动成功时的回调函数

```js
// 启动服务器,并且制定端口号和主机
server.listen(8888, '0.0.0.0', () => {
  console.log("服务器启动成功~");
});
```



### response对象

#### 返回响应结果

如果我们希望给客户端响应的结果数据，可以通过两种方式：

- Write方法：这种方式是直接写出数据，但是并没有关闭流；
- end方法：这种方式是写出最后的数据，并且写出后会关闭流；

```js
const http = require('http');

const server = http.createServer((req, res) => {

  // 响应数据的方式有两个:
  res.write("Hello World");
  res.write("Hello Response");
  res.end("message end");
});

server.listen(8000, () => {
  console.log("服务器启动🚀~")
});
```

如果我们没有调用 `end`和`close`，客户端将会一直等待结果，所以客户端在发送网络请求时，都会设置超时时间。



#### 返回状态码

设置状态码常见的有两种方式：

```js
res.statusCode = 400;
res.writeHead(200);
```



#### 响应头文件

返回头部信息，主要有两种方式：

- `res.setHeader`：一次写入一个头部信息；
- `res.writeHead`：同时写入header和status；

```js
res.setHeader("Content-Type", "application/json;charset=utf8");

res.writeHead(200, {
  "Content-Type": "application/json;charset=utf8"
})
```

Header设置 `Content-Type`有什么作用呢？

- 默认客户端接收到的是字符串，客户端会按照自己默认的方式进行处理；

比如，我们返回的是一段HTML，我们需要指定格式，让浏览器进行解析：

```js
res.setHeader("Content-Type", "text/html;charset=utf8");
res.end('<h2>Hello World</h2>')
```

如果我们希望返回一段JSON数据，应该怎么做呢？

```js
res.writeHead(200, {
  "Content-Type": "application/json;charset=utf8"
})

const data = {
  name: "zs",
  age: 18,
  height: 1.88
};

res.end(JSON.stringify(data));
```





### request对象

在向服务器发送请求时，我们会携带很多信息，比如：

- 本次请求的URL，服务器需要根据不同的URL进行不同的处理
- 本次请求的请求方式，比如GET、POST请求传入的参数和处理的方式是不同的
- 本次请求的 headers 中也会携带一些信息，比如客户端信息、接受数据的格式、支持的编码格式等
- 这些信息，Node会帮助我们封装到一个request的对象中，我们可以直接来处理这个request对象

```js
const http = require('http');

// 创建一个web服务器
const server = http.createServer((req, res) => {
  // request对象中封装了客户端给我们服务器传递过来的所有信息
  console.log(req.url);
  console.log(req.method);
  console.log(req.headers);

  res.end("Hello Server");
});

// 启动服务器,并且制定端口号和主机
server.listen(8888, '0.0.0.0', () => {
  console.log("服务器启动成功~");
});
```



### URL的处理

客户端在发送请求时，会请求不同的数据，那么会传入不同的请求地址：

- 比如 `http://localhost:8000/login`；
- 比如 `http://localhost:8000/products`;

服务器端需要根据不同的请求地址，作出不同的响应：

```js
const server = http.createServer((req, res) => {
  const url = req.url;
  console.log(url);

  if (url === '/login') {
    res.end("welcome Back~");
  } else if (url === '/products') {
    res.end("products");
  } else {
    res.end("error message");
  }
});
```

那么如果用户发送的地址中还携带一些额外的参数呢？

- `http://localhost:8000/login?name=why&password=123`;
- 这个时候，url的值是 `/login?name=why&password=123`；



我们如何对它进行解析呢？

- 使用内置模块url(URL模块的使用在下方)



### http发送网络请求

```js
http.get("http://localhost:8000", (res) => {
  res.on('data', data => {
    console.log(data.toString());
    console.log(JSON.parse(data.toString()));
  })
});
```

发送post请求：

```js
const req = http.request({
  method: 'POST',
  hostname: "localhost",
  port: 8000
}, (res) => {
  res.on('data', data => {
    console.log(data.toString());
    console.log(JSON.parse(data.toString()));
  })
})

req.on('error', err => {
  console.log(err);
})

req.end();
```



**完整demo**

```js
// 引入http核心模块
const http = require('http')

// 引入url核心模块
const url = require('url')

// 创建web服务器
const server = http.createServer()

// 处理请求
server.on('request', (req, res) => {
  // 设置响应头
  res.writeHead('200', {
    'content-type': 'text/html;charset=utf-8',
  })

  // 分析路由
  const { pathname } = url.parse(req.url, true)

  if (pathname == '/' || pathname == '/index') {
    res.end('首页')
  } else if (pathname == '/list') {
    res.end('列表页')
  } else {
    res.writeHead('404')
    res.end('Not Found')
  }
})

// 监听3000端口
server.listen(3000)

console.log('server is running on localhost:3000')
```




## 内置url模块

| url模块的使用         | 说明                                                         |
| --------------------- | ------------------------------------------------------------ |
| url.parse()           | 解析 url(第二个参数为true,可以将 query 里面的数据转换为对象) |
| url.format(urlObject) | 是上面 url.parse() 操作的逆向操作                            |
| url.resolve(from,to)  | 添加或者替换地址                                             |



**URL包含的属性**

```js
const url = require('url');

// 解析请求
const parseInfo = url.parse(req.url);
console.log(parseInfo);
```

解析结果：

```js
Url {
  protocol: null,
  slashes: null,
  auth: null,
  host: null,
  port: null,
  hostname: null,
  hash: null,
  search: '?name=why&password=123',
  query: 'name=why&password=123',
  pathname: '/login',
  path: '/login?name=why&password=123',
  href: '/login?name=why&password=123'
}
```



### 获取query参数

```js
const url=require('url');

var api='http://www.itying.com?name=zhangsan&age=20';

// console.log(url.parse(api,true));

var getValue=url.parse(api,true).query;

console.log(getValue);

console.log(`姓名：${getValue.name}--年龄:${getValue.age}`);
```



### 使用querystring内置模块

除了上面的获取参数的方式，我们也可以**使用querystring内置模块**

```js
const { pathname, query } = url.parse(req.url);

const queryObj = qs.parse(query);
console.log(queryObj.name);
console.log(queryObj.password);
```



## 内置fs模块

### 三种操作方式

Node文件系统的API非常的多

- 我们不可能，也没必要一个个去学习；
- 这个更多的应该是作为一个API查询的手册，等用到的时候查询即可；
- 学习阶段我们只需要学习最常用的即可；

但是这些API大多数都提供三种操作方式：

- 方式一：同步操作文件：代码会被阻塞，不会继续执行；
- 方式二：异步回调函数操作文件：代码不会被阻塞，需要传入回调函数，当获取到结果时，回调函数被执行；
- 方式三：异步Promise操作文件：代码不会被阻塞，通过 `fs.promises` 调用方法操作，会返回一个Promise，可以通过then、catch进行处理；

**我们这里以获取一个文件的状态为例：**

- 注意：都需要引入 `fs` 模块；

方式一：同步操作文件

```js
// 1.方式一: 同步读取文件
const state = fs.statSync('../foo.txt');
console.log(state);

console.log('后续代码执行');
```

方式二：异步回调函数操作文件

```js
// 2.方式二: 异步读取
fs.stat("../foo.txt", (err, state) => {
  if (err) {
    console.log(err);
    return;
  }
  console.log(state);
})
console.log("后续代码执行");
```

方式三：异步Promise操作文件

```js
// 3.方式三: Promise方式
fs.promises.stat("../foo.txt").then(state => {
  console.log(state);
}).catch(err => {
  console.log(err);
})
console.log("后续代码执行");
```



### 常用API

**stat()**

每个文件都带有一组详细信息，可以使用 Node.js 进行检查。

具体地说，使用 `fs` 模块提供的 `stat()` 方法。

```js
const fs = require('fs')
fs.stat('/Users/joe/test.txt', (err, stats) => {
  if (err) {
    console.error(err)
    return
  }

  stats.isFile() //true
  stats.isDirectory() //false
  stats.isSymbolicLink() //false
  stats.size //1024000 //= 1MB
})
```

- 使用 `stats.isFile()` 和 `stats.isDirectory()` 判断文件是否目录或文件。
- 使用 `stats.isSymbolicLink()` 判断文件是否符号链接。
- 使用 `stats.size` 获取文件的大小（以字节为单位）。



**readFile()**

```js
const fs = require('fs')

fs.readFile('/Users/joe/test.txt', 'utf8' , (err, data) => {
  if (err) {
    console.error(err)
    return
  }
  console.log(data)
})
```

另外，也可以使用同步的版本 `fs.readFileSync()`：

```js
const fs = require('fs')

try {
  const data = fs.readFileSync('/Users/joe/test.txt', 'utf8')
  console.log(data)
} catch (err) {
  console.error(err)
}
```



**fs.writeFile()**

```js
const fs = require('fs')

const content = '一些内容'

fs.writeFile('/Users/joe/test.txt', content, err => {
  if (err) {
    console.error(err)
    return
  }
  //文件写入成功。
})
```

另外，也可以使用同步的版本 `fs.writeFileSync()`：

```js
const fs = require('fs')

const content = '一些内容'

try {
  const data = fs.writeFileSync('/Users/joe/test.txt', content)
  //文件写入成功。
} catch (err) {
  console.error(err)
}
```

默认情况下，此 API 会替换文件的内容（如果文件已经存在）。

可以通过指定标志来修改默认的行为：

```js
fs.writeFile('/Users/joe/test.txt', content, { flag: 'a+' }, err => {})
```

可能会使用的标志有：

- `r+` 打开文件用于读写。
- `w+` 打开文件用于读写，将流定位到文件的开头。如果文件不存在则创建文件。
- `a` 打开文件用于写入，将流定位到文件的末尾。如果文件不存在则创建文件。
- `a+` 打开文件用于读写，将流定位到文件的末尾。如果文件不存在则创建文件。



**fs.appendFile()**

将内容追加到文件末尾的便捷方法是 `fs.appendFile()`（及其对应的 `fs.appendFileSync()`）：

```js
const content = '一些内容'

fs.appendFile('file.log', content, err => {
  if (err) {
    console.error(err)
    return
  }
  //完成！
})
```



**fs.mkdir()**

使用 `fs.mkdir()` 或 `fs.mkdirSync()` 可以创建新的文件夹。

```js
const fs = require('fs')

const folderName = '/Users/joe/test'

try {
  if (!fs.existsSync(folderName)) {
    fs.mkdirSync(folderName)
  }
} catch (err) {
  console.error(err)
}
```



## 内置path模块

### path常见的API

**从路径中获取信息**

- dirname：获取文件的父文件夹；
- basename：获取文件名；
- extname：获取文件扩展名；

```js
const path = require("path");

const myPath = '/Users/coderwhy/Desktop/Node/课堂/PPT/01_邂逅Node.pdf';

const dirname = path.dirname(myPath);
const basename = path.basename(myPath);
const extname = path.extname(myPath);

console.log(dirname); // /Users/coderwhy/Desktop/Node/课堂/PPT
console.log(basename); // 01_邂逅Node.pdf
console.log(extname); // .pdf
```



### 路径的拼接

- 如果我们希望将多个路径进行拼接，但是不同的操作系统可能使用的是不同的分隔符；
- 这个时候我们可以使用`path.join`函数；

```js
console.log(path.join('/user', 'why', 'abc.txt'));
```

**将文件和某个文件夹拼接**

- 如果我们希望将某个文件和文件夹拼接，可以使用 

  ```
  path.resolve
  ```

  - `resolve`函数会判断我们拼接的路径前面是否有 `/`或`../`或`./`；
  - 如果有表示是一个绝对路径，会返回对应的拼接路径；
  - 如果没有，那么会和当前执行文件所在的文件夹进行路径的拼接

```js
path.resolve('abc.txt'); // /Users/coderwhy/Desktop/Node/TestCode/04_learn_node/06_常见的内置模块/02_文件路径/abc.txt
path.resolve('/abc.txt'); // /abc.txt
path.resolve('/User/why', 'abc.txt'); // /User/why/abc.txt
path.resolve('User/why', 'abc.txt'); // /Users/coderwhy/Desktop/Node/TestCode/04_learn_node/06_常见的内置模块/02_文件路径/User/why/abc.txt
```



