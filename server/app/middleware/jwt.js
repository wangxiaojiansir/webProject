// 解析token
const jwt = require('jsonwebtoken')
module.exports = ({ app }) => {
  return async function verify(ctx, next) {
    if (!ctx.request.header.authorization) {
      ctx.body = {
        code: -1,
        message: 'token不存在',
      }
      return
    }
    const token = ctx.request.header.authorization.replace('Bearer ', '')
    try {
      const ret = await jwt.verify(token, app.config.jwt.secret)
      ctx.state.email = ret.email
      ctx.state.userId = ret._id
      await next()
    } catch (error) {
      if (error.name == 'TokenExpiredError') {
        ctx.body = {
          code: 403,
          message: '登录过期',
        }
      } else {
        ctx.body = {
          code: -1,
          message: '用户信息出错',
        }
      }
    }
  }
}
