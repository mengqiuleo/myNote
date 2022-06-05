# vuepress(五)部署到github.io

[TOC]



## 前言

这里是一个关于vuepress搭建的系列教程，里面也包括了我自己对博客的一些优化

我的博客👉：[一枚前端程序媛的blog](http://106.14.187.205/)

因为域名备案还没下来，所以只能IP地址裸奔了😂

上面的没有使用SSL加密，所以访问有可能报错

所以目前还使用的是Github Pages👉: [一枚前端程序媛的blog](https://mengqiuleo.github.io/)





## 一、部署到github.io

发布到github和发布到gitee不同。

发布到github上，我们需要两个仓库，一个存放我们所有的源文件，另一个存放打包好的dist目录。

并且要为存放dist文件的那个仓库开启 Github Pages



### 1.创建一个存放所有文件的仓库

> 注意，这个仓库名不能是自己的username，因为username 在另一个仓库要用



另外，我们要在`.gitignore`文件中加入 dist文件，**我们不要把dist文件上传到仓库中**

如果此时已经把dist文件上传到仓库中了，那么也是可以挽救的。

方法如下👇🏻

> **.gitignore 只对未跟踪的文件起作用！**
> 已跟踪的文件是指那些被纳入了版本控制的文件，在上一次提交中有它们的记录。那么未跟踪文件就是指那些从没提交过的文件。
>
> 因为上次已经把/dist 整个提交上去了，所以这时候.gitignore已经不行了

1. 取消文件跟踪

- git rm 或者 git rm --cached

- git rm ： 同时从工作区和索引中删除文件。即本地的文件也被删除了。

- git rm --cached：从索引中删除文件,但是本地文件还存在， 只是不希望这个文件被版本控制。

​    这里我使用第二个，具体用法就是 git rm --cached -r dist

​    -r 的意思是递归处理，如果不加 -r的话，会报错

​    如果取消某个文件的跟踪，可以不用 -r 直接 git rm --cached dist/index.less

2. 把 gitignore 提交上去

   - git add .
   - git commit -m ‘修改gitignore’
   - git push

   以后本地dist目录下文件再变的话，也不会被跟踪到了，
   



### 2.创建一个只有dist文件的仓库，并为它开启Github Pages

创建对外展示仓库，该仓库与内容开发的仓库不一样，我们要按照`用户名.github.io`的格式创建

![](https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206052045875.jpg)



然后我们对项目进行打包，将里面的dist文件复制到另外一个文件中（这个文件夹要放在项目文件夹的外面），然后给存放dist文件的文件夹设置git,推送到 `用户名.github.io`的仓库中

![](https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206052045315.jpg)



最后为`username.github.io`仓库开启pages

![](https://cdn.jsdelivr.net/gh/mengqiuleo/images/202206052045479.jpg)





## 二、实现文件更改后，自动上传打包后的文件

这里使用一个脚本

![](E:\note\blog\（五）github部署\目录.jpg)

在开发根目录下创建`deploy.sh`，用于发布`dist`网页到`github.io`，脚本内容如下

```sh
#!/usr/bin/env sh
 
# 确保脚本抛出遇到的错误
set -e
 
# 生成静态文件， npm run docs:build
yarn docs:build
rm -rf ../vueDist/dist/*

# 将build生成的dist目录拷贝至上一层目录中
cp -rf docs/.vuepress/dist ../vueDist/

# 进入生成的文件夹
cd ../vueDist/dist

# git初始化，每次初始化不影响推送
git init
git add -A
git commit -m 'deploy'
git branch -M main

# 如果你想要部署到 https://USERNAME.github.io
git push -f git@github.com:mengqiuleo/mengqiuleo.github.io.git main
```



> 对于上面的脚本的注意点：
>
> 1. 一个是`rm -rf ../vueDist/dist/*`，这句话的意思是删除我们所有项目文件仓库中的dist文件
> 2. `cp -rf docs/.vuepress/dist ../vueDist/`，是将生成的新的dist文件覆盖掉原来的dist仓库中的文件，这里第一个参数是我们所有项目文件仓库中的那个dist,第二个参数是只存放dist文件的仓库路径，两个参数之间用空格隔开
> 3. 对于上述文件的路径，**每个人仓库的存放位置不同，所以需要自己配置**。
> 4. 路径配置方法：因为脚本与docs文件同级，所以我们要向上`../`退出到上一级，或者直接`docs/`进入下一级



修改`package.json`文件

```js
"scripts": {
  "deploy": "bash deploy.sh"
}
```



以后当我们更新文件后，

首先执行：

- git add .
- git commit -m "XXX"
- git push

此时已经推送到了我们存放所有文件的那个仓库中，然后执行`npm run deploy`或`yarn deploy`

现在 打包好的dist文件会自动更新在`username.github.io`的仓库中
