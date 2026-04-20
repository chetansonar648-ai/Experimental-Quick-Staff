import { createContext, useContext, useMemo } from 'react'
import { useAdminProfile } from '../hooks/useAdminProfile'

const AdminProfileContext = createContext(null)

export const AdminProfileProvider = ({ children }) => {
  const adminProfileState = useAdminProfile()
  const value = useMemo(() => adminProfileState, [adminProfileState])

  return <AdminProfileContext.Provider value={value}>{children}</AdminProfileContext.Provider>
}

export const useAdminProfileContext = () => {
  const context = useContext(AdminProfileContext)
  if (!context) {
    throw new Error('useAdminProfileContext must be used within AdminProfileProvider')
  }
  return context
}
