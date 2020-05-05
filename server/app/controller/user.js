'use strict'

const md5 = require('md5')
const jwt = require('jsonwebtoken')
const BaseController = require('./base')

const Hashsalt = 'wangxiaojian'

const creatRule = {
  email: { type: 'email' },
  nickName: { type: 'string' },
  captcha: { type: 'string' },
  password: { type: 'string' },
}
class UserController extends BaseController {
  async login() {
    const { ctx, app } = this

    const { email, password, captcha } = ctx.request.body
    console.log(captcha)

    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误')

    }
    const user = await this.ctx.model.User.findOne({ email, password: md5(password + Hashsalt) })
    if (!user) {
      return this.error('用户不存在')
    }
    const token = jwt.sign({
      email,
      _id: user._id,
    }, app.config.jwt.secret, { expiresIn: '1h' })
    this.success({ token, email, nickName: user.nickName })
  }
  async info() {
    const { ctx } = this

  }
  async register() {
    const { ctx } = this
    try {
      ctx.validate(creatRule)

    } catch (error) {
      return this.error('参数校验失败', -1, error.error)
    }

    const { email, password, captcha, nickName } = ctx.request.body
    if (captcha.toUpperCase() !== ctx.session.captcha.toUpperCase()) {
      return this.error('验证码错误')

    }
    if (await this.checkEmail(email)) {
      return this.error('邮箱重复')

    }
    const res = await ctx.model.User.create({
      email,
      nickName,
      password: md5(password + Hashsalt)
    })
    if (res._id) {
      this.message('注册成功')
    }
    // console.log(email, nickName)
    // this.success({ name: '注册成功' })


  }
  async checkEmail(email) {
    const user = await this.ctx.model.User.findOne({ email })
    return user
  }
  async verify() {
    const { ctx } = this

  }
}


module.exports = UserController