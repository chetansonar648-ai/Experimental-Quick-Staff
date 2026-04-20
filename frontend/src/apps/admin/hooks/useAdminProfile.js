import { useCallback, useEffect, useState } from 'react'
import { adminApi } from '../services/adminApi'

const ADMIN_PROFILE_KEY = 'admin_profile'

const getCachedProfile = () => {
  try {
    const cached = localStorage.getItem(ADMIN_PROFILE_KEY)
    return cached ? JSON.parse(cached) : null
  } catch {
    return null
  }
}

export const useAdminProfile = () => {
  const [profile, setProfile] = useState(() => getCachedProfile())
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const refreshProfile = useCallback(async () => {
    const token = localStorage.getItem('token') || localStorage.getItem('qs_token')
    if (!token) {
      setLoading(false)
      setError('')
      return
    }

    setLoading(true)
    setError('')
    try {
      const data = await adminApi.getProfile()
      const nextProfile = data?.profile || null
      setProfile(nextProfile)
      if (nextProfile) {
        localStorage.setItem(ADMIN_PROFILE_KEY, JSON.stringify(nextProfile))
      } else {
        localStorage.removeItem(ADMIN_PROFILE_KEY)
      }
    } catch (err) {
      setError(err.message || 'Unable to load admin profile')
      setProfile(null)
      localStorage.removeItem(ADMIN_PROFILE_KEY)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const token = localStorage.getItem('token') || localStorage.getItem('qs_token')
    if (token) {
      refreshProfile()
    } else {
      setLoading(false)
    }
  }, [refreshProfile])

  return {
    profile,
    loading,
    error,
    refreshProfile,
    setProfile
  }
}
