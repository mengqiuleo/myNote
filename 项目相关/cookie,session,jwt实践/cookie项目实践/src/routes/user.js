// 判断用户名密码是否正确的函数
const loginTest = function(username,password){
  if(username === 'zs' && password === '123'){//注意：因为参数的传递是字符串形式，所以即使密码是数字，也要用字符串的形式判断
    return true
  }
  return false
}

//设置cookie过期时间的函数
const setCookieExpireTime = function() {
  const date = new Date()
  date.setTime(date.getTime() + 10*1000)
  return date.toGMTString()
}

const handleUserRouter = function(req,res) {
  const method = req.method
  if(method === 'GET' && req.path === '/api/user/login'){
    const { username, password } = req.query
    const loginResult = loginTest(username,password)
    if(loginResult){
      res.setHeader('Set-Cookie', `username=${username}; path=/; expires=${setCookieExpireTime()}`)
      return {
        errorCode: 0,
        data: 'cookie设置成功'
      }
    }
    return {
      errorCode: -1,
      msg: '用户名或密码错误'
    }
  } else {
    if(req.cookie.username){
      return {
        errorCode: 0,
        msg: '已查询到cookie'
      }
    }
    return {
      errorCode: -1,
      msg: '请登录'
    }
  }
}

module.exports = handleUserRouter