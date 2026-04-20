import axios from 'axios'
import { API } from '../../../api/base.js'

const adminApiInstance = axios.create({
  baseURL: `${API}/api/admin`
})

adminApiInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('qs_token') || localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

adminApiInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized, but not logging out immediately')
    }
    const message = error.response?.data?.message || 'Request failed'
    return Promise.reject(new Error(message))
  }
)

export const adminApi = {
  getProfile: () => adminApiInstance.get('/profile').then((response) => response.data),
  changePassword: (payload) =>
    adminApiInstance.put('/change-password', payload).then((response) => response.data)
}
