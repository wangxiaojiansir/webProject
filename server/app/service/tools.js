'use strict'
const { Service } = require('egg')

const nodemailer = require('nodemailer')

const userEmail = 'wangxiaojiansir@163.com'
const transporter = nodemailer.createTransport({
  service: '163',
  secureConnection: true,
  auth: {
    user: userEmail,
    pass: 'DGPXFIOBCRRLJKKY',
  },
})
class ToolService extends Service {
  async sendMail(email, subject, text, html) {
    const mailOption = {
      from: userEmail,
      cc: userEmail,
      to: email,
      subject,
      text,
      html,
    }
    try {
      await transporter.sendMail(mailOption)
      return true
    } catch (error) {
      console.log('email error', error)

      return false
    }
  }
}

module.exports = ToolService
