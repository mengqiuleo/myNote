## cookie

```js
const Koa = require('koa');
const Router = require('koa-router');

const app = new Koa();

const testRouter = new Router();

// 登录接口
testRouter.get('/test', (ctx, next) => {
  // maxAge对应毫秒，存储cookie是 key-value形式
  ctx.cookies.set("name", "lilei", {
    maxAge: 500 * 1000
  })

  ctx.body = "test";
});


testRouter.get('/demo', (ctx, next) => {
  // 读取cookie
  const value = ctx.cookies.get('name');
  ctx.body = "你的cookie是" + value;
});

app.use(testRouter.routes());
app.use(testRouter.allowedMethods());

app.listen(8080, () => {
  console.log("服务器启动成功~");
})
```

- cookie设置的其实是明文，所以会有安全问题
- 当已经存了cookie，再次访问网站时，会将cookie发送到服务器端，服务器端会拿出cookie进行验证，所以我们可以将cookie拿出来验证



## session

```js
const Koa = require('koa');
const Router = require('koa-router');
const Session = require('koa-session');

const app = new Koa();

const testRouter = new Router();

// 创建Session的配置
const session = Session({
  key: 'sessionid',
  maxAge: 10 * 1000,
  signed: true, // 是否使用加密签名
}, app);
app.keys = ["aaaa"];// 这里是要使用的加密签名，这个签名是放在服务器端的
app.use(session);

// 登录接口
testRouter.get('/test', (ctx, next) => {
  // name/password -> id/name
  const id = 110;
  const name = "coderwhy";

  // 添加一个session，执行下面的语句时客户端已经存储了一个session
  // session本质上就是一个cookie，所以存储在cookie中，并且name为sessionid，是因为我们上面设置的name是sessionid
  //对应value值是：将信息使用base64编码生成
  ctx.session.user = {id, name};

  ctx.body = "test";
});

testRouter.get('/demo', (ctx, next) => {
  // 使用session时，客户端将session发送到服务器端，并且在服务器端会解码，我们可以在服务器端打印出存储的信息
  console.log(ctx.session.user);
  ctx.body = 'demo';
});

app.use(testRouter.routes());
app.use(testRouter.allowedMethods());

app.listen(8080, () => {
  console.log("服务器启动成功~");
})
```

- session 本质上也是一个cookie，只不过是存储在浏览器上的session一般存在于cookie中，并且是一个sessionId，sessionId通过要保存的信息加上签名来加密生成，所以在客户端查看的session是一个字符串

- 当我们把cookie传递到服务器端时，里面的sessionId也会被传过去，然后服务器端拿出sessionId，利用加密算法进行解密，拿到信息进行验证

  