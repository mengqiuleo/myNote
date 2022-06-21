# 从零开始配置webpack(原理篇)

[TOC]



## Loader 原理

> loader：帮助 webpack 将不同类型的文件转换为 webpack 可识别的模块
>
> 
>
> loader 就是一个函数
>
> 当webpack解析资源时，会调用相应的loader去处理
>
> loader接收到文件内容作为参数（比如一个loader处理js文件，那么这个js文件内容就是参数），返回内容出去



### loader执行顺序

1. 分类

- pre： 前置 loader
- normal： 普通 loader
- inline： 内联 loader
- post： 后置 loader



2. 执行顺序

- 4 类 loader 的执行优级为：`pre > normal > inline > post` 。
- 相同优先级的 loader 执行顺序为：`从右到左，从下到上`。

举例🌰

```js
// 此时loader执行顺序：loader3 - loader2 - loader1
module: {
  rules: [
    {
      test: /\.js$/,
      loader: "loader1",
    },
    {
      test: /\.js$/,
      loader: "loader2",
    },
    {
      test: /\.js$/,
      loader: "loader3",
    },
  ],
},
    
   
// 此时loader执行顺序：loader1 - loader2 - loader3
module: {
  rules: [
    {
      enforce: "pre",
      test: /\.js$/,
      loader: "loader1",
    },
    {
      // 没有enforce就是normal
      test: /\.js$/,
      loader: "loader2",
    },
    {
      enforce: "post",
      test: /\.js$/,
      loader: "loader3",
    },
  ],
},
```

3. 使用 loader 的方式

- 配置方式：在 `webpack.config.js` 文件中指定 loader。（pre、normal、post loader）
- 内联方式：在每个 `import` 语句中显式指定 loader。（inline loader）



4. inline loader

用法：`import Styles from 'style-loader!css-loader?modules!./styles.css';`

含义：

- 使用 `css-loader` 和 `style-loader` 处理 `styles.css` 文件
- 通过 `!` 将资源中的 loader 分开

`inline loader` 可以通过添加不同前缀，跳过其他类型 loader。

- `!` 跳过 normal loader。

```
import Styles from '!style-loader!css-loader?modules!./styles.css';
```

- `-!` 跳过 pre 和 normal loader。

```
import Styles from '-!style-loader!css-loader?modules!./styles.css';
```

- `!!` 跳过 pre、 normal 和 post loader。

```
import Styles from '!!style-loader!css-loader?modules!./styles.css';
```



### loader分类

#### 1. 同步 loader

```js
module.exports = function (content, map, meta) {
  return content;
};
```

`this.callback` 方法则更灵活，因为它允许传递多个参数，而不仅仅是 `content`。

```javascript
module.exports = function (content, map, meta) {
  // 第一个参数：err 代表是否有错误
  // 第二个参数：content 处理后的内容
  // 传递map，让source-map不中断
  // 传递meta，让下一个loader接收到其他参数
  this.callback(null, content, map, meta);
  return; // 当调用 callback() 函数时，总是返回 undefined
};
```



#### 2. 异步loader

```javascript
module.exports = function (content, map, meta) {
  const callback = this.async();
  // 进行异步操作
  setTimeout(() => {
    callback(null, content, map, meta);
  }, 1000);
};
```

> 由于同步计算过于耗时，在 Node.js 这样的单线程环境下进行此操作并不是好的方案，我们建议尽可能地使你的 loader 异步化。但如果计算量很小，同步 loader 也是可以的



#### 3. Raw Loader

默认情况下，资源文件会被转化为 UTF-8 字符串，然后传给 loader。通过设置 raw 为 true，loader 可以接收原始的 Buffer。

一般用来处理图片资源

```javascript
module.exports = function (content) {
  // raw loader 接收到的content是一个Buffer数据
  return content;
};
module.exports.raw = true; // 开启 Raw Loader


//写法2
function testLoader(content) {
    return content;
}
testLoader.raw = true;
module.exports = testLoader;
```



#### 4. Pitching Loader

要求在暴露的对象中添加一个 pitch 方法

```javascript
module.exports = function (content) {
  return content;
};
module.exports.pitch = function (remainingRequest, precedingRequest, data) {
  console.log("do somethings");
};
```

webpack 会先从左到右执行 loader 链中的每个 loader 上的 pitch 方法（如果有），然后再从右到左执行 loader 链中的每个 loader 上的普通 loader 方法。

![](E:\note\前端\笔记\webpack\原理篇\1.jpg)

此时的执行顺序为：

pitch1 --> pitch2 --> pitch3 --> loader3 --> loader2 --> loader1



在这个过程中如果任何 pitch 有返回值，则 loader 链被阻断。webpack 会跳过后面所有的的 pitch 和 loader，直接进入上一个 loader 。

![](E:\note\前端\笔记\webpack\原理篇\2.jpg)



### 手写loader

#### 手写 clean-log-loader

作用：用来清理 js 代码中的`console.log`

```javascript
// loaders/clean-log-loader.js
module.exports = function cleanLogLoader(content) {
  // 将console.log替换为空
  return content.replace(/console\.log\(.*\);?/g, "");
};
```

使用：

```js
module.exports = {
	module: {
        rules: [
          {
            test: /\.js$/,
            loader: "./loaders/clean-log-loader.js",
          }
    	],
  	},
}
```



#### 手写 banner-loader

作用：给 js 代码添加文本注释，例如标明文章作者，并且，我们允许自己传入要添加的名字

```js
//loaders/banner-loader/index.js
const schema = require("./schema.json");

module.exports = function(content) {
  //schema对options的验证规则
  //schema符合JSON Schema 的规则
  const options = this.getOptions(schema);//使用loader的API，拿到传入的options

  const prefix = `
    /**
    * Author: ${options.author} 
    */
  `;

  return prefix + content;
}


//schema.json: 配置规则
{
  "type": "object",
  "properties": {
    "author": {
      "type": "string"
    }
  },
  "additionalProperties": false
}
```

配置：

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "./loaders/banner-loader",
        options: {
          author: "Pan"
        }
      }
    ],
  },	
}
```

打包后查看文件：

```js
eval("\n    /**\n    * Author: Pan \n    */\n  console.log(\"hello main\");\r\n\r\nconsole.log(\"hello 111\");\n\n
```



## Plugin 原理

### Plugin工作原理

> 通过插件我们可以扩展 webpack，加入自定义的构建行为，使 webpack 可以执行更广泛的任务，拥有更强的构建能力
>
> 
>
> webpack 就像一条生产线，要经过一系列处理流程后才能将源文件转换成输出结果。 这条生产线上的每个处理流程的职责都是单一的，多个流程之间有存在依赖关系，只有完成当前处理后才能交给下一个流程去处理。 插件就像是一个插入到生产线中的一个功能，在特定的时机对生产线上的资源做处理。webpack 通过 Tapable 来组织这条复杂的生产线。 webpack 在运行过程中会广播事件，插件只需要监听它所关心的事件，就能加入到这条生产线中，去改变生产线的运作。 webpack 的事件流机制保证了插件的有序性，使得整个系统扩展性很好。 
>
> ​																			——「深入浅出 Webpack」

站在代码逻辑的角度就是：webpack 在编译代码过程中，会触发一系列 `Tapable` 钩子事件，插件所做的，就是找到相应的钩子，往上面挂上自己的任务，也就是注册事件，这样，当 webpack 构建的时候，插件注册的事件就会随着钩子的触发而执行了



### Webpack 内部的钩子

#### 什么是钩子

钩子的本质就是：事件。为了方便我们直接介入和控制编译过程，webpack 把编译过程中触发的各类关键事件封装成事件接口暴露了出来。这些接口被很形象地称做：`hooks`（钩子）。开发插件，离不开这些钩子



#### Tapable

`Tapable` 为 webpack 提供了统一的插件接口（钩子）类型定义，它是 webpack 的核心功能库。webpack 中目前有十种 `hooks`，在 `Tapable` 源码中可以看到，他们是：

```javascript
exports.SyncHook = require("./SyncHook");
exports.SyncBailHook = require("./SyncBailHook");
exports.SyncWaterfallHook = require("./SyncWaterfallHook");
exports.SyncLoopHook = require("./SyncLoopHook");
exports.AsyncParallelHook = require("./AsyncParallelHook");
exports.AsyncParallelBailHook = require("./AsyncParallelBailHook");
exports.AsyncSeriesHook = require("./AsyncSeriesHook");
exports.AsyncSeriesBailHook = require("./AsyncSeriesBailHook");
exports.AsyncSeriesLoopHook = require("./AsyncSeriesLoopHook");
exports.AsyncSeriesWaterfallHook = require("./AsyncSeriesWaterfallHook");
exports.HookMap = require("./HookMap");
exports.MultiHook = require("./MultiHook");
```

`Tapable` 还统一暴露了三个方法给插件，用于注入不同类型的自定义构建行为：

- `tap`：可以注册同步钩子和异步钩子。
- `tapAsync`：回调方式注册异步钩子。
- `tapPromise`：Promise 方式注册异步钩子。



### Plugin 构建对象

#### Compiler

compiler 对象中保存着完整的 Webpack 环境配置，每次启动 webpack 构建时它都是一个独一无二，仅仅会创建一次的对象。

这个对象会在首次启动 Webpack 时创建，我们可以通过 compiler 对象上访问到 Webapck 的主环境配置，比如 loader 、 plugin 等等配置信息。

它有以下主要属性：

- `compiler.options` 可以访问本次启动 webpack 时候所有的配置文件，包括但不限于 loaders 、 entry 、 output 、 plugin 等等完整配置信息。
- `compiler.inputFileSystem` 和 `compiler.outputFileSystem` 可以进行文件操作，相当于 Nodejs 中 fs。
- `compiler.hooks` 可以注册 tapable 的不同种类 Hook，从而可以在 compiler 生命周期中植入不同的逻辑。



#### Compilation

compilation 对象代表一次资源的构建，compilation 实例能够访问所有的模块和它们的依赖。

一个 compilation 对象会对构建依赖图中所有模块，进行编译。 在编译阶段，模块会被加载(load)、封存(seal)、优化(optimize)、 分块(chunk)、哈希(hash)和重新创建(restore)。

它有以下主要属性：

- `compilation.modules` 可以访问所有模块，打包的每一个文件都是一个模块。
- `compilation.chunks` chunk 即是多个 modules 组成而来的一个代码块。入口文件引入的资源组成一个 chunk，通过代码分割的模块又是另外的 chunk。
- `compilation.assets` 可以访问本次打包生成所有文件的结果。
- `compilation.hooks` 可以注册 tapable 的不同种类 Hook，用于在 compilation 编译模块阶段进行逻辑添加以及修改。



### 生命周期简图

![](E:\note\前端\笔记\webpack\原理篇\plugin.jpg)



### 开发一个插件

#### 一个自定义的插件

所有的插件都是一个构造函数，所以我们用class声明一个构造函数

```js
// plugins/test-plugin.js

/**
 * 1. webpack加载 webpack.config.js 中所有配置，此时就会 new TestPlugin(), 执行插件的constructor
 * 2. webpack 创建compiler对象
 * 3.遍历所有 plugins 中插件，调用插件的apply方法
 * 4. 执行剩下编译流程（触发各个hooks事件）
 */

class TestPlugin {
  constructor() {
    console.log("TestPlugin constructor");
  }

  apply(compiler) {
    console.log("TestPlugin apply");
  }
}

module.exports = TestPlugin;
```

配置使用

```js
const TestPlugin = require("./plugins/test-plugin");//先引入

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname,"./dist"),
    filename: "js/[name].js",
    clean:true,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        loader: "./loaders/banner-loader",
        options: {
          author: "Pan"
        }
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname,"public/index.html"),
    }),
    new TestPlugin(), //使用我们自己的插件
  ],
  mode: "development",
};
```



#### 注册 hook

```js
class TestPlugin {
  constructor() {
    console.log("TestPlugin constructor");
  }

  apply(compiler) {
    console.log("TestPlugin apply");

    // 由文档可知，environment是同步钩子，所以需要使用 tap注册
    compiler.hooks.environment.tap("TestPlugin", () => {
      console.log("TestPlugin environment");
    });

    //emit同步
    compiler.hooks.emit.tap("TestPlugin",(compilation) => {
      console.log("TestPlugin emit 111");
    });

    //emit异步串行,特点就是异步任务顺序执行
    compiler.hooks.emit.tapAsync("TestPlugin",(compilation,callback) => {
      setTimeout(() => {
        console.log("TestPlugin emit 222");
        callback();
      },2000);
    });

    //emit异步串行
    compiler.hooks.emit.tapPromise("TestPlugin",(compilation,callback) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          console.log("TestPlugin emit 333");
          resolve();
        },1000);
      })
    });

    //make异步并行,特点就是异步任务同时执行,一上来全部触发
    // 可以使用 tap、tapAsync、tapPromise 注册。
    // 如果使用tap注册的话，进行异步操作是不会等待异步操作执行完成的。
    compiler.hooks.make.tapAsync("TestPlugin",(compilation,callback) => {
      setTimeout(() => {
        console.log("compiler.make() 222");
        // 必须调用
        callback();
      }, 3000);
    });

    compiler.hooks.make.tapAsync("TestPlugin",(compilation,callback) => {
      setTimeout(() => {
        console.log("compiler.make() 333");
        // 必须调用
        callback();
      }, 2000);
    });

    compiler.hooks.make.tapAsync("TestPlugin",(compilation,callback) => {
      setTimeout(() => {
        console.log("compiler.make() 111");
        // 必须调用
        callback();
      }, 1000);
    })
  }
}

module.exports = TestPlugin;
```



#### 启动调试

通过console输出 compiler 和 compilation

通过调试查看 `compiler` 和 `compilation` 对象数据情况。

```js
class TestPlugin {
  constructor() {
    console.log("TestPlugin constructor");
  }

  apply(compiler) {
    console.log("compiler",compiler); //!!! 打印compiler
    console.log("TestPlugin apply");

    // 由文档可知，environment是同步钩子，所以需要使用 tap注册
    compiler.hooks.environment.tap("TestPlugin", () => {
      console.log("TestPlugin environment");
    });

    compiler.hooks.emit.tap("TestPlugin",(compilation) => {
      console.log("compilation",compilation); //!!! 打印compilation
      console.log("TestPlugin emit 111");
    });
  }
}
```

使用nodejs的debug来调试



### 手写Plugin

#### 手写BannerWebpackPlugin

1. 作用：给打包输出文件添加注释。
2. 开发思路:

- 需要打包输出前添加注释：需要使用 `compiler.hooks.emit` 钩子, 它是打包输出前触发。
- 如何获取打包输出的资源？`compilation.assets` 可以获取所有即将输出的资源文件。

banner-webpack-plugin.js

```js
class BannerWebpackPlugin {
  constructor(options = {}) {
    this.options = options;
  }

  apply(compiler) {
    //在资源输出之前触发钩子函数
    compiler.hooks.emit.tapAsync("BannerWebpackPlugin",(compilation,callback) => {
      const extensions = ["css","js"];//我们需要拿到后缀为js或css的资源

      // 1.获取即将输出的资源文件：compilation.assets
      // 2.过滤只保留js和css资源
      const assets = Object.keys(compilation.assets).filter((assetPath) => {
        // 将文件名切割 ['xxx','js'] ['xxx','css']
        const splitted = assetPath.split(".");
        // 获取最后一个文件扩展名
        const extension = splitted[splitted.length - 1];
        //判断是否包含，并返回判断结果
        return extensions.includes(extension); 
      });
      //console.log(assets);
      
      // 3.遍历剩下资源添加上注释
      const prefix = `
/**
 * Author: ${this.options.author}
*/
      `

      assets.forEach(asset => {
        //获取原来内容
        const source = compilation.assets[asset].source();

        //拼接注释
        const content = prefix + source;

        //修改资源
        compilation.assets[asset] = {
          //最终资源输出时，调用source方法，source方法的返回值就是资源的具体内容
          source() {
            return content;
          },
          // 资源大小
          size() {
            return content.length;
          }
        }
      })

      callback();//异步函数继续向下执行
    })
  }
}

module.exports = BannerWebpackPlugin;
```

使用配置：

```js
const path = require('path');
const HtmlWebpackPlugin = require("html-webpack-plugin");
const BannerWebpackPlugin = require("./plugins/banner-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname,"./dist"),
    filename: "js/[name].js",
    clean:true,
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname,"public/index.html"),
    }),
    new BannerWebpackPlugin({ // 使用自定义plugin
      author: "Pan"
    }),
  ],
  mode: "production",
};
```



打包后的结果：

```js

/**
 * Author: Pan
*/
      console.log("hello main"),console.log("hello 111");
```

