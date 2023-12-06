import axios from 'axios'

export const api = axios.create({
  baseURL: 'http://192.168.8.102:3000',
})

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')

    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }

    return config
  },
  (e) => {
    return Promise.reject(e)
  }
)

api.interceptors.response.use(
  (r) => r,
  (e) => {
    if (e.response.status === 401) {
      console.log(localStorage.getItem('token'))
    }

    return Promise.reject(e.response.data)
  }
)
