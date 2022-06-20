# 从零开始配置webpack(优化篇)

[TOC]



## 前言

[从零开始配置webpack系列(基础篇)](https://blog.csdn.net/weixin_52834435/article/details/125326240?spm=1001.2014.3001.5502)

[从零开始配置webpack系列(进阶篇)](https://blog.csdn.net/weixin_52834435/article/details/125365020?spm=1001.2014.3001.5502)

从零开始配置webpack系列(优化篇)

从零开始配置webpack系列(项目篇)

从零开始配置webpack系列(原理篇)

从零开始配置webpack系列(面试篇)



## 提升开发体验

### source-map

无论是什么开发，要求开发环境最不可少的一点功能就是 ——debug功能。

之前我们通过webpack, 将我们的源码打包成了 bundle.js。 试想：实际上客户端(浏览器)读取的是打包后的 bundle.js ,那么当浏览器执行代码报错的时候，报错的信息自然也是bundle的内容。我们如何将报错信息(bundle错误 的语句及其所在行列)映射到源码上？**souce-map**

webpack已经内置了sourcemap的功能，我们只需要通过简单的配置，将可以开启它。

```js
module.exports = {
    // 开启 source map
    // 开发中推荐使用 'source-map'
    // 生产环境一般不开启 sourcemap
    devtool: 'source-map',
}
```

当我们执行打包命令之后，我们发现bundle的最后一行总是会多出一个注释，指向 打包出的bundle.map.js(sourcemap文件)。 sourcemap文件用来描述 源码文件和 bundle文件的代码位置映射关系。基于它，我们将bundle文件的错误信息映射到源 码文件上。

除开'source-map'外，还可以基于我们的需求设置其他值，webpack——devtool一 共提供了7种SourceMap模式：

| 模式                    | 解释                                                         |
| ----------------------- | ------------------------------------------------------------ |
| eval                    | 每个module会封装到 eval 里包裹起来执行，并且会在末尾追 加注释 //@ sourceURL. |
| source-map              | 生成一个SourceMap文件.                                       |
| hidden-source-map       | 和 source-map 一样，但不会在 bundle 末尾追加注释.            |
| inline-source-map       | 生成一个 DataUrl 形式的 SourceMap 文件                       |
| eval-source-map         | 每个module会通过eval()来执行，并且生成一个DataUrl形式的 SourceMap. |
| cheap-source-map        | 生成一个没有列信息（column-mappings）的SourceMaps文 件，不包含loader的 sourcemap（譬如 babel 的 sourcemap） |
| cheap-module-source-map | 生成一个没有列信息（column-mappings）的SourceMaps文 件，同时 loader 的 sourcemap 也被简化为只包含对应行的 |

要注意的是，生产环境我们一般不会开启sourcemap功能，

主要有两点原因: 

1. 通过bundle和sourcemap文件，可以反编译出源码————也就是说，线上产 物有soucemap文件的话，就意味着有暴漏源码的风险。 
2. 可以观察到，sourcemap文件的体积相对比较巨大,这跟我们生产环境的追 求不同(生产环境追求更小更轻量的bundle)



## 提升打包构建速度

### HotModuleReplacement(模块热替换与热加载)

#### 模块热替换

模块热替换(HMR - hot module replacement)功能会在应用程序运行过程中， 替换、添加或删除模块，而无需重新加载整个页面

启用 webpack 的 热模块替换 特性，需要配置devServer.hot参数

```js
module.exports = {
    //...
    devServer: {
    	hot: true,
    },
};
```

此时我们实现了基本的模块热替换功能。



#### 模块热加载

热加载(文件更新时，自动刷新我们的服务和页面) 新版的webpack-dev-server 默认已经开启了热加载的功能。 它对应的参数是devServer.liveReload，默认为 true。 注意，如果想要关掉它，要将liveReload设置为false的同时，也要关掉 hot

```js
module.exports = {
    //...
    devServer: {
    	liveReload: false, //默认为true，即开启热更新功能。
    },
};
```



### OneOf

打包时每个文件都会经过所有 loader 处理，虽然因为 `test` 正则原因实际没有处理上，但是都要过一遍。比较慢。

**OneOf 就是只能匹配上一个 loader, 剩下的就不匹配了。**

使用：

```js
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: undefined, // 开发模式没有输出，不需要指定输出目录
    filename: "static/js/main.js", // 将 js 文件输出到 static/js 目录中
    // clean: true, // 开发模式没有输出，不需要清空输出结果
  },
  module: {
    rules: [
      {
        oneOf: [
          {
            // 用来匹配 .css 结尾的文件
            test: /\.css$/,
            // use 数组里面 Loader 执行顺序是从右到左
            use: ["style-loader", "css-loader"],
          },
          {
            test: /\.(png|jpe?g|gif|webp)$/,
            type: "asset",
            parser: {
              dataUrlCondition: {
                maxSize: 10 * 1024, // 小于10kb的图片会被base64处理
              },
            },
            generator: {
              // 将图片文件输出到 static/imgs 目录中
              // 将图片文件命名 [hash:8][ext][query]
              // [hash:8]: hash值取8位
              // [ext]: 使用之前的文件扩展名
              // [query]: 添加之前的query参数
              filename: "static/imgs/[hash:8][ext][query]",
            },
          },
          {
            test: /\.(ttf|woff2?)$/,
            type: "asset/resource",
            generator: {
              filename: "static/media/[hash:8][ext][query]",
            },
          },
          {
            test: /\.js$/,
            exclude: /node_modules/, // 排除node_modules代码不编译
            loader: "babel-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new ESLintWebpackPlugin({
      // 指定检查文件的根目录
      context: path.resolve(__dirname, "../src"),
    }),
    new HtmlWebpackPlugin({
      // 以 public/index.html 为模板创建文件
      // 新的html文件有两个特点：1. 内容和源文件一致 2. 自动引入打包生成的js等资源
      template: path.resolve(__dirname, "../public/index.html"),
    }),
  ],
  // 开发服务器
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "3000", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
    hot: true, // 开启HMR功能
  },
  mode: "development",
  devtool: "cheap-module-source-map",
};
```



### Include/Exclude

开发时我们需要使用第三方的库或插件，所有文件都下载到 node_modules 中了。而这些文件是不需要编译可以直接使用的。

所以我们在对 js 文件处理时，要排除 node_modules 下面的文件。

- include

包含，只处理 xxx 文件

- exclude

排除，除了 xxx 文件以外其他文件都处理

```js
module.exports = {
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.js$/,
            // exclude: /node_modules/, // 排除node_modules代码不编译
            include: path.resolve(__dirname, "../src"), // 也可以用包含
            loader: "babel-loader",
          },
        ],
      },
    ],
  },
  plugins: [
    new ESLintWebpackPlugin({
      // 指定检查文件的根目录
      context: path.resolve(__dirname, "../src"),
      exclude: "node_modules", // 默认值
    }),
  ],
};
```



### Cache

每次打包时 js 文件都要经过 Eslint 检查 和 Babel 编译，速度比较慢。

我们可以缓存之前的 Eslint 检查 和 Babel 编译结果，这样第二次打包时速度就会更快了

**Cache 对 Eslint 检查 和 Babel 编译结果进行缓存。**

```js
module.exports = {
  module: {
    rules: [
      {
        oneOf: [
          {
            test: /\.js$/,
            // exclude: /node_modules/, // 排除node_modules代码不编译
            include: path.resolve(__dirname, "../src"), // 也可以用包含
            loader: "babel-loader",
            options: {
              cacheDirectory: true, // 开启babel编译缓存
              cacheCompression: false, // 缓存文件不要压缩
            },
          },
        ],
      },
    ],
  }, 
};
```



## 减少代码体积

### Tree Shaking

开发时我们定义了一些工具函数库，或者引用第三方工具函数库或组件库。

如果没有特殊处理的话我们打包时会引入整个库，但是实际上可能我们可能只用上极小部分的功能。

这样将整个库都打包进来，体积就太大了

`Tree Shaking` 是一个术语，通常用于描述移除 JavaScript 中的没有使用上的代码。

**注意：它依赖 `ES Module`**

Webpack 已经默认开启了这个功能，无需其他配置



#### sideEffects

Webpack 不能百分百安全地进行 tree-shaking。有些模块导入，只要被引入，就会对应用程序产生重要的影响。一个很好的例子就是全局样式表，或者设置全局配 置的JavaScript 文件。 

Webpack 认为这样的文件有“副作用”。具有副作用的文件不应该做 tree-shaking， 因为这将破坏整个应用程序

如何告诉 Webpack 你的代码无副作用，可以通过 package.json 有一个特殊的属性 sideEffects，就是为此而存在的。

它有三个可能的值： 

- **true** 如果不指定其他值的话。这意味着所有的文件都有副作用，也就是没有一个文件 可以 tree-shaking。 
- **false** 告诉 Webpack 没有文件有副作用，所有文件都可以 tree-shaking。 
- **数组[…]** 是文件路径数组。它告诉 webpack，除了数组中包含的文件外，你的任何文件都没有副作用。因此，除了指定的文件之外，其他文件都可以安全地进行 treeshaking。



## 优化代码运行性能

### Network Cache

将来开发时我们对静态资源会使用缓存来优化，这样浏览器第二次请求资源就能读取缓存了，速度很快。

但是这样的话就会有一个问题, 因为前后输出的文件名是一样的，都叫 main.js，一旦将来发布新版本，因为文件名没有变化导致浏览器会直接读取缓存，不会加载新资源，项目也就没法更新了。

所以我们从文件名入手，确保更新前后文件名不一样，这样就可以做缓存了



- fullhash（webpack4 是 hash）

每次修改任何一个文件，所有文件名的 hash 至都将改变。所以一旦修改了任何一个文件，整个项目的文件缓存都将失效。

- chunkhash

根据不同的入口文件(Entry)进行依赖文件解析、构建对应的 chunk，生成对应的哈希值。我们 js 和 css 是同一个引入，会共享一个 hash 值。

- contenthash

根据文件内容生成 hash 值，只有文件内容变化了，hash 值才会变化。所有文件 hash 值是独享且不同的

```js
    // [contenthash:8]使用contenthash，取8位长度
    filename: "static/js/[name].[contenthash:8].js", // 入口文件打包输出资源命名方式
    chunkFilename: "static/js/[name].[contenthash:8].chunk.js", // 动态导入输出资源命名方式
```



### Core-js

过去我们使用 babel 对 js 代码进行了兼容性处理，其中使用@babel/preset-env 智能预设来处理兼容性问题。

它能将 ES6 的一些语法进行编译转换，比如箭头函数、点点点运算符等。但是如果是 async 函数、promise 对象、数组的一些方法（includes）等，它没办法处理。

所以此时我们 js 代码仍然存在兼容性问题，一旦遇到低版本浏览器会直接报错。所以我们想要将 js 兼容性问题彻底解决

`core-js` 是专门用来做 ES6 以及以上 API 的 `polyfill`。

`polyfill`翻译过来叫做垫片/补丁。就是用社区上提供的一段代码，让我们在不兼容某些新特性的浏览器上，使用该新特性

首先修改js文件，使用promise：

```js
import "core-js/es/promise"; //手动按需引入， import "core-js";是全部引入，体积较大
import count from "./js/count";
import sum from "./js/sum";

const result1 = count(2, 1);
console.log(result1);
const result2 = sum(1, 2, 3, 4);
console.log(result2);
// 添加promise代码
const promise = Promise.resolve();
promise.then(() => {
  console.log("hello promise");
});
```



```
npm i core-js
```

配置：

```js
module.exports = {
  // 智能预设：能够编译ES6语法
  presets: [
    [
      "@babel/preset-env",
      // 按需加载core-js的polyfill
      { useBuiltIns: "usage", corejs: { version: "3", proposals: true } },
    ],
  ],
};
```

此时就会自动根据我们代码中使用的语法，来按需加载相应的 `polyfill` 了



### PWA

开发 Web App 项目，项目一旦处于网络离线情况，就没法访问了。我们希望给项目提供离线体验。

渐进式网络应用程序(progressive web application - PWA)：是一种可以提供类似于 native app(原生应用程序) 体验的 Web App 的技术。

其中最重要的是，在 **离线(offline)** 时应用程序能够继续运行功能。

内部通过 Service Workers 技术实现的

```
npm i workbox-webpack-plugin -D
```

修改配置文件：

```js
const WorkboxPlugin = require("workbox-webpack-plugin");
module.exports = {
	plugins: [
		    new WorkboxPlugin.GenerateSW({
                  // 这些选项帮助快速启用 ServiceWorkers
                  // 不允许遗留任何“旧的” ServiceWorkers
                  clientsClaim: true,
                  skipWaiting: true,
            }),
	]
}
```

修改main.js

```js
import count from "./js/count";
import sum from "./js/sum";

const result1 = count(2, 1);
console.log(result1);
const result2 = sum(1, 2, 3, 4);
console.log(result2);
// 添加promise代码
const promise = Promise.resolve();
promise.then(() => {
  console.log("hello promise");
});

const arr = [1, 2, 3, 4, 5];
console.log(arr.includes(5));

// 配置 PWA
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker
      .register("/service-worker.js")
      .then((registration) => {
        console.log("SW registered: ", registration);
      })
      .catch((registrationError) => {
        console.log("SW registration failed: ", registrationError);
      });
  });
}
```

