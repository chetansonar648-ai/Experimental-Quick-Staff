import axios from 'axios'

// Use /api base - Vite proxy will forward to backend
const instance = axios.create({
  baseURL: '/api'
})

const tokenStore = { token: null }

instance.interceptors.request.use((config) => {
  if (tokenStore.token) config.headers.Authorization = `Bearer ${tokenStore.token}`
  return config
})

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    const message = err.response?.data?.message || 'Request failed'
    return Promise.reject(new Error(message))
  }
)

export const api = {
  setToken: (token) => {
    tokenStore.token = token
  },
  login: (data) => instance.post('/auth/login', data).then((r) => r.data),
  register: (data) => instance.post('/auth/register', data).then((r) => r.data),
  requestOtp: (data) => instance.post('/auth/request-otp', data).then((r) => r.data),
  verifyOtp: (data) => instance.post('/auth/verify-otp', data).then((r) => r.data),
  changePassword: (data) => instance.post('/auth/change-password', data).then((r) => r.data),
  services: () => instance.get('/services').then((r) => r.data),
  createBooking: (data) => instance.post('/bookings', data).then((r) => r.data),
  workerBookings: () => instance.get('/bookings/worker').then((r) => r.data),
  workerProfile: () => instance.get('/worker-profiles/me').then((r) => r.data),
  saveWorkerProfile: (data) => instance.post('/worker-profiles/me', data).then((r) => r.data),
  workerServices: () => instance.get('/worker-services').then((r) => r.data),
  upsertWorkerService: (data) => instance.post('/worker-services', data).then((r) => r.data),
  toggleWorkerService: (id) => instance.patch(`/worker-services/${id}/toggle`).then((r) => r.data),
  workerJobsByStatus: (status) => instance.get('/bookings/worker').then((r) => r.data.filter((b) => b.status === status)),
  workerSavedClients: () => instance.get('/saved-clients').then((r) => r.data),
  saveClient: (clientId) => instance.post('/saved-clients', { client_id: clientId }).then((r) => r.data),
  removeSavedClient: (clientId) => instance.delete(`/saved-clients/${clientId}`).then((r) => r.data),
  workerAcceptReject: (id, status) => instance.patch(`/bookings/${id}/status`, { status }).then((r) => r.data)
}

