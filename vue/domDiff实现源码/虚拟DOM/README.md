

```
虚拟DOM
├─ index.html //入口文件
├─ index.js 
├─ Element.js //创建element类(放每一个节点)
├─ virtualDom.js //根据元素生成虚拟节点
├─ domDiff.js //找到新旧节点之间的差异
├─ patchTypes.js //定义补丁类型
├─ doPatch.js //将补丁包打在新的dom上
├─ README.md
└─ 节点转换 //一个🌰：将真实DOM转换为虚拟dom
   ├─ dom.html
   └─ 虚拟DOM.js

```