# 从零开始配置webpack(进阶篇)

[TOC]



## 前言

[从零开始配置webpack系列(基础篇)](https://blog.csdn.net/weixin_52834435/article/details/125326240?spm=1001.2014.3001.5502)

从零开始配置webpack系列(进阶篇)

从零开始配置webpack系列(优化篇)

从零开始配置webpack系列(项目篇)

从零开始配置webpack系列(原理篇)

从零开始配置webpack系列(面试篇)





## 进阶一：代码分离

**代码分离特性**能够把代码分离到不同的 bundle 中，然后可以按需加载或并行加载这些文件。代码分离可以用于获取更小的 bundle，以及控制资源加载优先级，如果使用合理，会极大影响加载时间。

常用的代码分离方法有三种： 

- 入口起点：使用 entry 配置手动地分离代码。 
- 防止重复：使用 Entry dependencies 或者 SplitChunksPlugin 去重和分离 chunk。
- 动态导入：通过模块的内联函数调用来分离代码。



### 入口起点

在 src 目录下创建 another-module.js 文件：

```js
//another-module.js
//这个模块依赖了 lodash ，需要安装一下： npm install lodash --save-dev

import _ from 'lodash'
console.log(_.join(['Another', 'module', 'loaded!'], ' '))
```

修改配置文件：

```js
module.exports = {
    entry: {
   		index: './src/index.js',
    	another: './src/another-module.js',
	},
    output: {
    	filename: '[name].bundle.js'
    },
}
```

查看打包后的文件：

```
<script defer src="index.bundle.js"></script>
<script defer src="another.bundle.js"></script>
```

两个入口的 bundle 文件都被链接到了 app.html 中。



这种方式的确存在一些隐患：

- 如果入口 chunk 之间**包含一些重复的模块，那些重复模块都会被引入到各个 bundle 中。** 
- 这种方法不够灵活，并且不能动态地将核心应用程序逻辑中的代码拆分出来。



### 防止重复

#### 入口依赖 

配置 dependOn option 选项，这样可以在多个 chunk 之间共享模块

```js
module.exports = {
    entry: {
        index: {
            import: './src/index.js',
            dependOn: 'shared',
        },
        another: {
            import: './src/another-module.js',
            dependOn: 'shared',
        },
    	shared: 'lodash',
    }
}
```

index.bundle.js 与 another.bundle.js 共享的模块 lodash.js 被打包到一个单独的文件 shared.bundle.js 中。



#### SplitChunksPlugin

SplitChunksPlugin 插件可以将公共的依赖模块提取到已有的入口 chunk 中，或者提取到一个新生成的 chunk。使用这个插件，将之前的示例中重 复的 lodash 模块去除：

```js
module.exports = {
    entry: {
        	index: './src/index.js',
        	another: './src/another-module.js'
     },
    optimization: {
         splitChunks: {
             chunks: 'all',
          },
    },
}
```

使用 optimization.splitChunks 配置选项之后，现在应该可以看出， index.bundle.js 和 another.bundle.js 中已经移除了重复的依赖模块。需要注意的是，插件将 lodash 分离到单独的 chunk，并且将其从 main bundle 中移除，减轻了大小。



### 动态导入

第一种，也是推荐选择的方式是，使用符合 ECMAScript 提案的 import() 语法 来实现动态导入。

第二种，则是 webpack 的遗留功能，使用 webpack 特定的 require.ensure。



### 懒加载

懒加载或者按需加载，是一种很好的优化网页或应用的方式。这种方式实际上是先把 你的代码在一些逻辑断点处分离开，然后在一些代码块中完成某些操作后，立即引用 或即将引用另外一些新的代码块。这样加快了应用的初始加载速度，减轻了它的总体 体积，因为某些代码块可能永远不会被加载



创建一个 math.js 文件，在主页面中通过点击按钮调用其中的函数：

```js
export const add = () => {
	return x + y
}
export const minus = () => {
	return x - y
}
```

编辑 index.js 文件：

```js
const button = document.createElement('button')
button.textContent = '点击执行加法运算'
button.addEventListener('click', () => {
    import(/* webpackChunkName: 'math' */ './math.js').then(({ add}) => {
   		console.log(add(4, 5))
    })
})
document.body.appendChild(button)
```

这里有句注释，我们把它称为 webpack 魔法注释： webpackChunkName: 'math' , 告诉webpack打包生成的文件名为 math 。

第一次加载完页面， math.bundle.js 不会加载，当点击按钮后，才加载 math.bundle.js 文件。



### 预获取/预加载模块

在声明 import 时，使用下面这些内置指令，可以让 webpack 输出 "resource hint(资源提示)"，来告知浏览器：

- prefetch(预获取)：将来某些导航下可能需要的资源 
- preload(预加载)：当前导航下可能需要资源

下面这个 prefetch 的简单示例中，编辑 index.js 文件：

```js
const button = document.createElement('button')
button.textContent = '点击执行加法运算'
button.addEventListener('click', () => {
    import(/* webpackChunkName: 'math', 				     webpackPrefetch:true*/'./math.js').then(({ add }) => { 
    	console.log(add(4, 5))
    })
})
document.body.appendChild(button)
```

 添加第二句魔法注释： webpackPrefetch: true 

告诉 webpack 执行预获取。这会生成`<link rel="prefetch" href="math.js">`并追加到页面头部，指示着浏览器在闲置时间预取 math.js 文件。

启动服务，在浏览器上查看：

我们发现，在还没有点击按钮时， math.bundle.js 就已经下载下来了。



与 prefetch 指令相比，preload 指令有许多不同之处： 

- preload chunk 会在父 chunk 加载时，以并行方式开始加载。prefetch chunk 会在父 chunk 加载结束后开始加载。 
- preload chunk 具有中等优先级，并立即下载。prefetch chunk 在浏览器闲置时下载
- preload chunk 会在父 chunk 中立即请求，用于当下时刻。prefetch chunk 会 用于未来的某个时刻。 浏览器支持程度不同

创建一个 print.js 文件

```js
export const print = () => {
	console.log('preload chunk.')
}
```

修改 index.js 文件：

```js
const button2 = document.createElement('button')
button2.textContent = '点击执行字符串打印'
button2.addEventListener('click', () => {
	import(/* webpackChunkName: 'print', webpackPreload: true */
    './print.js').then(({ print }) => {
    	print(4, 5)
    })
})
document.body.appendChild(button2)
```

启动服务，在浏览器上查看：

仔细观察，发现 print.bundle.js 未被下载，因为我们配置的是 webpackPreload , 是在父 chunk 加载时，以并行方式开始加载。点击按钮才加载的 模块不会事先加载的。



## 进阶二：缓存

以上，我们使用 webpack 来打包我们的模块化后的应用程序，webpack 会生成一个可部署的 /dist 目录，然后把打包后的内容放置在此目录中。只要 /dist 目录中 的内容部署到 server 上，client（通常是浏览器）就能够访问此 server 的网站及其 资源。而最后一步获取资源是比较耗费时间的，这就是为什么浏览器使用一种名为 缓存 的技术。可以通过命中缓存，以降低网络流量，使网站加载速度更快，然而，如果我们在部署新版本时不更改资源的文件名，浏览器可能会认为它没有被更新，就 会使用它的缓存版本。由于缓存的存在，当你需要获取新的代码时，就会显得很棘 手。

通过必要的配置，以确保 webpack 编译生成的文件能够被客户端缓存，而在文件内容变化后，能够请求到新的文件。



### 输出文件的文件名

我们可以通过替换 output.filename 中的 substitutions 设置，来定义输出文件的 名称。webpack 提供了一种使用称为 substitution(可替换模板字符串) 的方式，通 过带括号字符串来模板化文件名。其中， [contenthash] substitution 将根据资源 内容创建出唯一 hash。当资源内容发生变化时， [contenthash] 也会发生变化。

修改配置文件：

```js
module.exports = {
    output: {
    	filename: '[name].[contenthash].js',
    },
};
```

bundle 的名称是它内容（通过 hash）的映射。如果我们不做修改，然后 再次运行构建，文件名会保持不变。



### 缓存第三方库

将第三方库(library)（例如 lodash ）提取到单独的 vendor chunk 文件中，是比较 推荐的做法，这是因为，它们很少像本地的源代码那样频繁修改。因此通过实现以上 步骤，利用 client 的长效缓存机制，命中缓存来消除请求，并减少向 server 获取资 源，同时还能保证 client 代码和 server 代码版本一致。 我们在 optimization.splitChunks 添加如下 cacheGroups 参数并构建：

```js
splitChunks: {
    cacheGroups: {
        vendor: {
            test: /[\\/]node_modules[\\/]/,
            name: 'vendors',
            chunks: 'all',
        },
    },
},
```



### 将 js 文件放到一个文件夹中

目前，全部 js 文件都在 dist 文件夹根目录下，我们尝试把它们放到一个文件夹中，修改配置文件

```js
ouotput: {
	filename: 'scripts/[name].[contenthash].js',
}
```



## 进阶三：拆分开发环境和生产环境配置

现在，我们只能手工的来调整 mode 选项，实现生产环境和开发环境的切换，且很多 配置在生产环境和开发环境中存在不一致的情况，比如开发环境没有必要设置缓存， 生产环境还需要设置公共路径等等。 

本节介绍拆分开发环境和生产环境，让打包更灵活。



### 公共路径

publicPath 配置选项在各种场景中都非常有用。你可以通过它来指定应用程序中所 有资源的基础路径。

#### 基于环境设置 

在开发环境中，我们通常有一个 assets/ 文件夹，它与索引页面位于同一级别。但是，如果我们将所有静态资源托管至 CDN，然后想在生产环境中使用呢？ 想要解决这个问题，可以直接使用一个 environment variable(环境变量)。假设 我们有一个变量 ASSET_PATH ：

```js
import webpack from 'webpack';

// 尝试使用环境变量，否则使用根路径
const ASSET_PATH = process.env.ASSET_PATH || '/';

export default {
    output: {
    	publicPath: ASSET_PATH,
    },
    plugins: [
        // 这可以帮助我们在代码中安全地使用环境变量
        new webpack.DefinePlugin({
        	'process.env.ASSET_PATH': JSON.stringify(ASSET_PATH),
        }),
    ],
};
```



#### Automatic publicPath

有可能你事先不知道 publicPath 是什么，webpack 会自动根据 import.meta.url 、 document.currentScript 、 script.src 或者 self.location 变量设置 publicPath。你需要做的是将 output.publicPath 设为 'auto' ：

```js
module.exports = {
    output: {
    	publicPath: 'auto',
    },
};
```



### 环境变量

想要消除 webpack.config.js 在 开发环境 和 生产环境 之间的差异，你可能需要环境变量

webpack 命令行 环境配置的 --env 参数，可以允许你传入任意数量的环境变量。

而在 webpack.config.js 中可以访问到这些环境变量。

例如， --env production 或 --env goal=local 。

```
npx webpack --env goal=local --env production --progress
```

对于我们的 webpack 配置，有一个必须要修改之处。通常， module.exports 指向 配置对象。要使用 env 变量，你必须将 module.exports 转换成一个函数：

```js
//...
module.exports = (env) => {
    return {
    //...
    // 根据命令行参数 env 来设置不同环境的 mode
    mode: env.production ? 'production' : 'development',
    //...
    }
}
```



### 拆分配置文件

目前，生产环境和开发环境使用的是一个配置文件，我们需要将这两个文件单独放到不同的配置文件中。如 webpack.config.dev.js （开发环境配置）和 webpack.config.prod.js （生产环境配置）。

在项目根目录下创建一个配置文件夹 config 来存放他们。 

webpack.config.dev.js 配置如下：

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
        // 用来匹配 .css 结尾的文件
        test: /\.css$/,
        // use 数组里面 Loader 执行顺序是从右到左
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.styl$/,
        use: ["style-loader", "css-loader", "stylus-loader"],
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
  // 其他省略
  devServer: {
    host: "localhost", // 启动服务器域名
    port: "3000", // 启动服务器端口号
    open: true, // 是否自动打开浏览器
  },
  mode: "development",
};
```



webpack.config.prod.js 配置如下：

```js
const path = require("path");
const ESLintWebpackPlugin = require("eslint-webpack-plugin");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  entry: "./src/main.js",
  output: {
    path: path.resolve(__dirname, "../dist"), // 生产模式需要输出
    filename: "static/js/main.js", // 将 js 文件输出到 static/js 目录中
    clean: true,
  },
  module: {
    rules: [
      {
        // 用来匹配 .css 结尾的文件
        test: /\.css$/,
        // use 数组里面 Loader 执行顺序是从右到左
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.less$/,
        use: ["style-loader", "css-loader", "less-loader"],
      },
      {
        test: /\.s[ac]ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
      {
        test: /\.styl$/,
        use: ["style-loader", "css-loader", "stylus-loader"],
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
  // devServer: {
  //   host: "localhost", // 启动服务器域名
  //   port: "3000", // 启动服务器端口号
  //   open: true, // 是否自动打开浏览器
  // },
  mode: "production",
};
```



拆分成两个配置文件后，分别运行这两个文件： 

开发环境：

```
[felix] 10-multiple-env $ npx webpack serve -c
./config/webpack.config.dev.js
```

生产环境：

```
[felix] 10-multiple-env $ npx webpack -c
./config/webpack.config.prod.js
```



### npm 脚本

每次打包或启动服务时，都需要在命令行里输入一长串的命令。我们将父目录的 package.json 、 node_modules 与 package-lock.json 拷贝到与dist目录同级，

配置 npm 脚本来简化命令行的输入，这时可以省略 npx ：

```js
{
    "scripts": {
        "start": "webpack serve -c ./config/webpack.config.dev.js",
        "build": "webpack -c ./config/webpack.config.prod.js"
    }
}
```

开发环境运行脚本

```
[felix] 10-multiple-env $ npm run start
[felix] 10-multiple-env $ npm run build
```



### 提取公共配置

这两个配置文件里存在大量的重复代码，可以手动的将这些重复的代码单独提取到一个文件里，

创建 webpack.config.common.js ，配置公共的内容

```js
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extractplugin')

const toml = require('toml')
const yaml = require('yaml')
const json5 = require('json5')

module.exports = {
    entry: {
        index: './src/index.js',
        another: './src/another-module.js'
    },
    output: {
        // 注意这个dist的路径设置成上一级
        path: path.resolve(__dirname, '../dist'),
        clean: true,
        assetModuleFilename: 'images/[contenthash][ext]',
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: './index.html',
            filename: 'app.html',
            inject: 'body'
        }),
        new MiniCssExtractPlugin({
        	filename: 'styles/[contenthash].css'
        })
    ],
    module: {
        rules: [
        {
            test: /\.png$/,
            type: 'asset/resource',
            generator: {
            	filename: 'images/[contenthash][ext]'
    		}
		},
        {
            test: /\.svg$/,
            type: 'asset/inline'
        },
        {
            test: /\.txt$/,
            type: 'asset/source'
        },
        {
            test: /\.jpg$/,
            type: 'asset',
            parser: {
                dataUrlCondition: {
                	maxSize: 4 * 1024
                }
            }
        },
        {
            test: /\.(css|less)$/,
            use: [MiniCssExtractPlugin.loader, 'css-loader', 'lessloader']
        },
        {
            test: /\.(woff|woff2|eot|ttf|otf)$/,
            type: 'asset/resource'
        },
        {
            test: /\.(csv|tsv)$/,
            use: 'csv-loader'
        },
        {
            test: /\.xml$/,
            use: 'xml-loader'
        },
        {
            test: /\.toml$/,
            type: 'json',
            parser: {
                parse: toml.parse
            }
        },
        {
            test: /\.yaml$/,
            type: 'json',
            parser: {
                parse: yaml.parse
            }
         },
        {
            test: /\.json5$/,
            type: 'json',
            parser: {
                parse: json5.parse
            }
        },
        {
            test: /\.js$/,
            exclude: /node_modules/,
            use: {
                loader: 'babel-loader',
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: [
                        [
                        '@babel/plugin-transform-runtime'
                        ]
                    ]
                }
            }
         }
        ]
    },
    optimization: {
        splitChunks: {
            cacheGroups: {
                vendor: {
                    test: /[\\/]node_modules[\\/]/,
                    name: 'vendors',
                    chunks: 'all'
                }
            }
        }
    },
    
//关闭 webpack 的性能提示
performance: {
	hints:false
}
}
```

改写 webpack.config.dev.js :

```js
module.exports = {
// 开发环境不需要配置缓存
output: {
filename: 'scripts/[name].js',
},
// 开发模式
mode: 'development', 

// 配置 source-map
devtool: 'inline-source-map',

// 本地服务配置
devServer: {
static: './dist'
}
}
```

修改 webpack.config.prod.js :

```js
const CssMinimizerPlugin = require('css-minimizer-webpackplugin')
module.exports = {
    // 生产环境需要缓存
    output: {
        filename: 'scripts/[name].[contenthash].js',
        publicPath: 'http://localhost:8080/'
    },
    // 生产环境模式
    mode: 'production',
    // 生产环境 css 压缩
    optimization: {
        minimizer: [
        	new CssMinimizerPlugin()
        ]
    }
}
```



### 合并配置文件

如何保证配置合并没有问题呢？使用webpack-merge工具

```
npm install webpack-merge -D
```

创建 webpack.config.js ，合并代码

```js
const { merge } = require('webpack-merge')

const commonConfig = require('./webpack.config.common.js')

const productionConfig = require('./webpack.config.prod.js')

const developmentConfig = require('./webpack.config.dev')

module.exports = (env) => {
    switch(true) {
    case env.development:
    	return merge(commonConfig, developmentConfig)
    case env.production:
    	return merge(commonConfig, productionConfig)
    default:
    	throw new Error('No matching configuration was found!');
    }
}
```

