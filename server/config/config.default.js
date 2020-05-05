/* eslint valid-jsdoc: "off" */

'use strict'

/**
 * @param {Egg.EggAppInfo} appInfo app info
 */
module.exports = appInfo => {
  /**
   * built-in config
   * @type {Egg.EggAppConfig}
   **/
  const config = exports = {}

  // use for cookie sign key, should change to your own and keep security
  config.keys = appInfo.name + '_1587809052090_673'

  // add your middleware config here
  config.middleware = []

  // add your user config here
  const userConfig = {
    // myAppName: 'egg',
  }
  // config.security: {
  //   csrf = {
  //     enable: false,
  //   }
  // }
  return {
    ...config,
    ...userConfig,
    security: {
      csrf: { enable: false },
    },
    mongoose: {
      client: {
        url: 'mongodb://101.201.57.140:27017/kkbhub',
        options: {},
      },
    },
    jwt: {
      secret: 'wangxiaojian@163.com'
    }
  }
}
