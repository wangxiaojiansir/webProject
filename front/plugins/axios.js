
import Vue from 'vue'
import axios from 'axios'


const service = axios.create({
  baseURL: '/api'
})



// 请求拦截
// service.interceptors.request.use(
//   async config => {
//     config.headers = { 'Content-Type': 'application/x-www-form-urlencoded' }


//     return config
//   }
// )

//响应拦截
service.interceptors.response.use(
  async response => {
    let { data } = response

    return data
  }
)


Vue.prototype.$http = service

export const http = service