[TOC]



## 使用对称加密

需要安装的中间件

- koa
- koa-router
- jsonwebtoken

```js
const Koa = require('koa');
const Router = require('koa-router');
const jwt = require('jsonwebtoken')
const app = new Koa();

const testRouter = new Router();

const SECRET_KEY = 'abccba123' //要使用的加密方式

// 1.登录接口
testRouter.post('/test', (ctx, next) => {
  const user = {id:10,name:'why'}
  const token = jwt.sign(user, SECRET_KEY, {
    expiresIn: 100 //设置过期时间
  })

  ctx.body = token
  //eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAsIm5hbWUiOiJ3aHkiLCJpYXQiOjE2NTgwMjM4ODgsImV4cCI6MTY1ODAyMzk4OH0.EsRwRbZKDG2PlXm6PBjE8WTzJBTzxOGC9JpEXslwN6U
});

// 2.验证接口
testRouter.get('/demo', (ctx, next) => {
  const authorization = ctx.headers.authorization
  const token = authorization.replace('Bearer ','') //拿到token

  try {
    const result = jwt.verify(token,SECRET_KEY) //对token进行验证：使用刚开始的加密算法
    ctx.body = result
  } catch(err){ //如果过期的话报错
    ctx.body = 'token是无效的'
  }
 
});

app.use(testRouter.routes());
app.use(testRouter.allowedMethods());

app.listen(8080, () => {
  console.log("服务器启动成功~");
})

```



## 非对称加密

我们需要自己生成一对私钥和公钥：**使用私钥加密，公钥解密**

注意：在执行命令之前，我们需要自己安装 **OpenSSL**

- 首先创建一个存放私钥和公钥的文件夹，并且进入文件夹：`cd keys`
- 输出命令：`openssl`
- 执行命令生成私钥：`genrsa -out private.key 1024`
- 生成公钥：`rsa -in private.key -public -out public.key`

```js
const Koa = require('koa');
const Router = require('koa-router');
const jwt = require('jsonwebtoken')
const app = new Koa();

const testRouter = new Router();

// 读取到自己存储的公钥和私钥：每个人的存放路径不同
const PRIVATE_KEY = fs.readFileSync('./keys/private.key') 
const PUBLIC_KEY = fs.readFileSync('./keys/public.key')

// 登录接口
testRouter.post('/test', (ctx, next) => {
  const user = {id:10,name:'why'}
  const token = jwt.sign(user, PRIVATE_KEY, { //使用私钥加密
    expiresIn: 100, //设置过期时间：单位为秒
    algorithm: 'RS256' //设置使用的加密算法
  })

  ctx.body = token // 返回给客户端token，并保存
});

// 验证接口
testRouter.get('/demo', (ctx, next) => {
  const authorization = ctx.headers.authorization
  const token = authorization.replace('Bearer ','') //拿到token

  try {
    const result = jwt.verify(token,PUBLIC_KEY,{ //对token进行验证：使用公钥
      algorithms: ['RS256'] //说明使用我们指定的加密算法
    }) 
    ctx.body = result
  } catch(err){ //如果过期的话报错
    ctx.body = 'token是无效的'
  }
 
});

app.use(testRouter.routes());
app.use(testRouter.allowedMethods());

app.listen(8080, () => {
  console.log("服务器启动成功~");
})

```

