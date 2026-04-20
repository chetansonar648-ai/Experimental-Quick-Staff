import { useState } from 'react'
import { Link, useLocation, Outlet, useNavigate } from 'react-router-dom'
import './DashboardLayout.css'
import { useAdminProfileContext } from '../context/AdminProfileContext'

const DashboardLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const location = useLocation()
  const navigate = useNavigate()
  const { profile } = useAdminProfileContext()

  const menuItems = [
    { path: '/admin', label: 'Dashboard', icon: '📊' },
    { path: '/admin/workers', label: 'Workers', icon: '🧑‍🔧' },
    { path: '/admin/clients', label: 'Clients', icon: '👥' },
    { path: '/admin/bookings', label: 'Bookings', icon: '📅' },
    { path: '/admin/ratings-reviews', label: 'Ratings & Reviews', icon: '⭐' },
    { path: '/admin/analytics', label: 'Analytics', icon: '📈' },
    { path: '/admin/settings', label: 'Settings', icon: '⚙️' },
  ]

  const isActive = (path) => {
    if (path === '/admin') {
      return location.pathname === '/admin' || location.pathname === '/admin/'
    }
    return location.pathname.startsWith(path)
  }

  return (
    <div className={`dashboard-container ${sidebarOpen ? '' : 'sidebar-closed'}`}>
      <aside className={`sidebar ${sidebarOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h2>Admin Panel</h2>
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? '◀' : '▶'}
          </button>
        </div>
        <nav className="sidebar-nav">
          {(menuItems || []).map((item) => (
            <Link
              key={item.path}
              to={item.path || '/'}
              className={`nav-item ${isActive(item.path) ? 'active' : ''}`}
            >
              <span className="nav-icon">{item.icon || '📄'}</span>
              {sidebarOpen && <span className="nav-label">{item.label || 'Menu'}</span>}
            </Link>
          ))}

        </nav>
      </aside>

      <main className="main-content">
        <header className="top-header">
          <h1>Admin Dashboard</h1>
          <div className="header-actions">
            <button
              type="button"
              className="user-info"
              onClick={() => navigate('/admin/settings')}
            >
              👤 {profile?.name || 'Admin'}
            </button>
          </div>
        </header>
        <div className="content-area">
          <Outlet />
        </div>
      </main>
    </div>
  )
}

export default DashboardLayout

