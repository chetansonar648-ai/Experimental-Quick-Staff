import { Navigate } from 'react-router-dom'
import { useAdminProfileContext } from '../context/AdminProfileContext'

const AdminOnlyRoute = ({ children }) => {
  const { profile, loading } = useAdminProfileContext()
  const token = localStorage.getItem('qs_token') || localStorage.getItem('token')

  if (!token) {
    return <Navigate to="/login" replace />
  }

  if (loading) {
    return <div className="page-state">Loading...</div>
  }

  if (profile && profile.role !== 'admin') {
    return <Navigate to="/" replace />
  }

  return children
}

export default AdminOnlyRoute
