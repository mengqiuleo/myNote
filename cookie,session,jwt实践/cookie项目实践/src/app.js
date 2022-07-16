const querystring = require('querystring')
const handleUserRouter = require('./routes/user')

const serverHandler = (req,res) => {
  res.setHeader('Content-Type', 'application/json') //设置返回数据的格式
  const url = req.url // api/user/login?username=zs&password=123

  req.path = url.split('?')[0] // /user/login
  req.query =  querystring.parse(url.split('?')[1]) // { username: 'zs', password: '123' }

  console.log("cookie: ",req.headers.cookie)

  req.cookie = {}
  const cookieStr = req.headers.cookie || ''
  cookieStr.split(';').forEach(item => {
    if(!item){
      return
    }
    const arr = item.split('=')
    const key = arr[0].trim()//trim用来去除空格
    const val = arr[1].trim()
    req.cookie[key] = val 
  });

  const userResult = handleUserRouter(req,res)

  res.end(userResult)
}

module.exports = serverHandler