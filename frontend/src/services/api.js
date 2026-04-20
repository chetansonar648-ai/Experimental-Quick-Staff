import apiClient, { setAuthToken } from '../api/axios.js'

apiClient.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      console.warn('Unauthorized, but not logging out immediately')
    } else {
      console.warn('API error:', err.response?.status)
    }
    const message = err.response?.data?.message || 'Request failed'
    return Promise.reject(new Error(message))
  }
)

export const api = {
  setToken: (token) => {
    setAuthToken(token)
  },
  login: (data) => apiClient.post('/auth/login', data).then((r) => r.data),
  register: (data) => apiClient.post('/auth/register', data).then((r) => r.data),
  googleAuth: (token) => apiClient.post('/auth/google', { token }).then((r) => r.data),
  requestOtp: (data) => apiClient.post('/auth/request-otp', data).then((r) => r.data),
  verifyOtp: (data) => apiClient.post('/auth/verify-otp', data).then((r) => r.data),
  changePassword: (data) => apiClient.post('/auth/change-password', data).then((r) => r.data),
  services: () => apiClient.get('/services').then((r) => r.data),
  createBooking: (data) => apiClient.post('/bookings', data).then((r) => r.data),
  workerBookings: () => apiClient.get('/bookings/worker').then((r) => r.data),
  workerProfile: () => apiClient.get('/worker-profiles/me').then((r) => r.data),
  saveWorkerProfile: (data) => apiClient.post('/worker-profiles/me', data).then((r) => r.data),
  workerServices: () => apiClient.get('/worker-services').then((r) => r.data),
  upsertWorkerService: (data) => apiClient.post('/worker-services', data).then((r) => r.data),
  toggleWorkerService: (id) => apiClient.patch(`/worker-services/${id}/toggle`).then((r) => r.data),
  workerJobsByStatus: (status) =>
    apiClient.get('/bookings/worker').then((r) => r.data.filter((b) => b.status === status)),
  workerSavedClients: () => apiClient.get('/saved-clients').then((r) => r.data),
  saveClient: (clientId) => apiClient.post('/saved-clients', { client_id: clientId }).then((r) => r.data),
  removeSavedClient: (clientId) => apiClient.delete(`/saved-clients/${clientId}`).then((r) => r.data),
  workerAcceptReject: (id, status) =>
    apiClient.patch(`/bookings/${id}/status`, { status }).then((r) => r.data)
}
