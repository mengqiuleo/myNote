# Tree-Shaking 实现原理

## 理论基础

在 CommonJs、AMD、CMD 等旧版本的 JavaScript 模块化方案中，导入导出行为是高度动态，难以预测的，例如：

```js
if(process.env.NODE_ENV === 'development'){
  require('./bar');
  exports.foo = 'foo';
}
```

而 ESM 方案则从规范层面规避这一行为，它要求所有的导入导出语句只能出现在模块顶层，且导入导出的模块名必须为字符串常量，这意味着下述代码在 ESM 方案下是非法的：

```js
if(process.env.NODE_ENV === 'development'){
  import bar from 'bar';
  export const foo = 'foo';
}
```

所以，ESM 下模块之间的依赖关系是高度确定的，与运行状态无关，编译工具只需要对 ESM 模块做静态分析，就可以从代码字面量中推断出哪些模块值未曾被其它模块使用，这是实现 Tree Shaking 技术的必要条件。



## 实现原理

Webpack 中，Tree-shaking 的实现一是先**标记**出模块导出值中哪些没有被用过，二是使用 Terser 删掉这些没被用到的导出语句。标记过程大致可划分为三个步骤：

- Make 阶段，收集模块导出变量并记录到模块依赖关系图 ModuleGraph 变量中
- Seal 阶段，遍历 ModuleGraph 标记模块导出变量有没有被使用
- 生成产物时，若变量没有被其它模块使用则删除对应的导出语句



> 标记功能需要配置 `optimization.usedExports = true` 开启

就是说，标记的效果就是删除没有被其它模块使用的导出语句，注意只是删除导出语句，而不是删除整个没有被使用过的代码块。

作为对比，如果没有启动标记功能(`optimization.usedExports = false` 时)，则变量无论有没有被用到都会保留导出语句.

注意，这个时候 `foo` 变量对应的代码 `const foo='foo'` 都还保留完整，这是因为标记功能只会影响到模块的导出语句，真正执行“**Shaking**”操作的是 Terser 插件。例如在上例中 `foo` 变量经过标记后，已经变成一段 Dead Code —— 不可能被执行到的代码，这个时候只需要用 Terser 提供的 DCE 功能就可以删除这一段定义语句，以此实现完整的 Tree Shaking 效果。



