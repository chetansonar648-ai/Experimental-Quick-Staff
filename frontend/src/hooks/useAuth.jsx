import React, { createContext, useContext, useEffect, useState } from 'react'
import { api } from '../services/api'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = localStorage.getItem('qs_user')
    return cached ? JSON.parse(cached) : null
  })
  const [token, setToken] = useState(() => localStorage.getItem('qs_token'))

  useEffect(() => {
    if (user) localStorage.setItem('qs_user', JSON.stringify(user))
    else localStorage.removeItem('qs_user')
  }, [user])

  useEffect(() => {
    if (token) {
      localStorage.setItem('qs_token', token)
      api.setToken(token)
    } else {
      localStorage.removeItem('qs_token')
      api.setToken(null)
    }
  }, [token])

  const login = (data) => {
    setUser(data.user)
    setToken(data.token)
  }

  const logout = () => {
    setUser(null)
    setToken(null)
  }

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)

