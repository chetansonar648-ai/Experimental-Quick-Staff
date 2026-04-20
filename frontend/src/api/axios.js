import axios from 'axios'
import { tokenStore } from './tokenStore.js'

/**
 * Normalizes VITE_API_URL:
 * - Use full Render origin only, e.g. https://your-app.onrender.com (no trailing /api required)
 * - If env already ends with /api, it is used as-is
 */
export function getApiBaseUrl () {
  const raw = import.meta.env.VITE_API_URL
  if (typeof raw === 'string' && raw.trim()) {
    const trimmed = raw.trim().replace(/\/$/, '')
    if (trimmed.endsWith('/api')) {
      return trimmed
    }
    return `${trimmed}/api`
  }
  if (import.meta.env.DEV) {
    return 'http://localhost:4000/api'
  }
  return ''
}

/** Sync token from login before localStorage effect runs */
export function setAuthToken (token) {
  tokenStore.token = token || null
}

const api = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true
})

api.interceptors.request.use((config) => {
  const token =
    tokenStore.token ||
    localStorage.getItem('token') ||
    localStorage.getItem('qs_token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized, but not logging out immediately')
    } else {
      console.warn('API error:', error.response?.status)
    }
    return Promise.reject(error)
  }
)

export default api
