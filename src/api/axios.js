import axios from 'axios'
import { Message } from 'iview'

const baseURL = '';
const instance = axios.create({timeout: 30000})

// 请求统一处理
instance.interceptors.request.use(config => {
  if (config.url && config.url.charAt(0) === '/') config.url = `${baseURL}${config.url}`
  return config
}, error => Promise.reject(error))

// 对返回的内容做统一处理
instance.interceptors.response.use(response => {
  if (response.status === 200) {
    const content = response.data.statusText
    content && Message.warning({ content, duration: 5 })
    return response
  }
  return;
}, error => {
  if (error.response && error.response.status === 500)
    vm.$router.push({ name: 'search-error' });
  if (error.response && error.response.status !== 500 && error.response.data && error.response.data.message) {
    Message.error({ content: error.response.data.message, duration: 5 })
  }
  return Promise.reject(error)
})

export default instance
