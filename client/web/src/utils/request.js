import axios from 'axios'
// import { Message, MessageBox } from 'element-ui'
import { Message } from 'element-ui'
import { getToken } from '@/utils/auth'

const baseURL = '/api'

// 创建axios实例
const option = {
  baseURL, // api的base_url
  timeout: 15000 // 请求超时时间
}
const service = axios.create(option)

// request拦截器
service.interceptors.request.use(config => {
  if (getToken()) {
    // config.headers['authorization'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    config.headers.common['Authorization'] = 'Bearer ' + getToken()
  }
  return config
}, error => {
  // Do something with request error
  console.log(error) // for debug
  Promise.reject(error)
})

// respone拦截器
service.interceptors.response.use(
  response => {
    const res = response.data
    if (res.code === 200) {
      return response.data
    } else if (res.code === 204) {
      return response.data
    } else {
      console.log(res)
      Message({
        type: 'error',
        message: res.msg
      })
      return Promise.reject('error')
    }
  },
  error => {
    console.log(error)// for debug
    Message({
      message: error.message,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)
export default service
