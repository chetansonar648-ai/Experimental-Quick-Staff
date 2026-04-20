import api from '../../../api/axios.js'

function adminErrorMessage (err) {
  return err.response?.data?.message || err.message || 'Request failed'
}

export const adminApi = {
  getProfile: () =>
    api.get('/admin/profile').then((r) => r.data).catch((err) => {
      console.error('ADMIN PROFILE ERROR:', err.response || err.message)
      return Promise.reject(new Error(adminErrorMessage(err)))
    }),
  changePassword: (payload) =>
    api.put('/admin/change-password', payload).then((r) => r.data).catch((err) => {
      console.error('ADMIN CHANGE PASSWORD ERROR:', err.response || err.message)
      return Promise.reject(new Error(adminErrorMessage(err)))
    })
}
