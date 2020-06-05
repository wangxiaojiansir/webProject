'use strict'
const svgCaptcha = require('svg-captcha')
// const Controller = require('egg').Controller
const BaseController = require('./base')

const fse = require('fs-extra')

class UtilController extends BaseController {
  async captcha() {
    const { ctx } = this

    const captcha = svgCaptcha.create({
      size: 4,
      fontSize: 50,
      width: 100,
      height: 40,
      noise: 3,
    })
    ctx.session.captcha = captcha.text
    console.log('captcha=>', captcha.text)
    ctx.response.type = 'image/svg+xml'
    ctx.body = captcha.data
  }

  async sendcode() {
    const { ctx } = this
    const email = ctx.query.email
    const code = Math.random().toString().slice(2, 6)
    ctx.session.emailcode = code

    const subject = '开课吧验证码'
    const text = ''

    const html = `<h2>小开社区</h2><p>验证码${code}</p>`
    console.log('emailCode=>', code)
    const hasSend = await this.service.tools.sendMail(email, subject, text, html)
    if (hasSend) {
      this.message('发送成功')
    } else {
      this.error('发送失败')
    }
  }


  async uploadfile() {
    const { ctx } = this
    console.log(ctx.request)

    const file = ctx.request.files[0]
    const { name } = ctx.request.body
    console.log('file', name, file)
    await fse.move(file.filepath, this.config.UPLOAD_DIR + '/' + file.filename)
    this.success({
      url: `/publick/${file.filename}`,
    })

  }
}

module.exports = UtilController
