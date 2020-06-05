
import Vue from 'vue'
import axios from 'axios'
import { MessageBox } from 'element-ui'

const service = axios.create({
  baseURL: '/api'
})


export default ({ store, redirect }) => {
  // 请求拦截
  service.interceptors.request.use(
    async config => {
      console.log(config);
      const token = localStorage.getItem('token')
      if (token) {
        config.headers['Authorization'] = 'Bearer ' + token
      }
      return config
    }
  )

  //响应拦截
  service.interceptors.response.use(
    async response => {
      let { data } = response
      if (data.code != 0) {
        MessageBox.confirm('登录过期', '登录', {
          confirmButtonText: '登录',
          showCancelButton: false,
          type: 'warning'
        }).then(() => {
          localStorage.removeItem('token')
          redirect({ path: 'login' })
        })
      }
      return data
    }
  )

}


Vue.prototype.$http = service

// export const http = service