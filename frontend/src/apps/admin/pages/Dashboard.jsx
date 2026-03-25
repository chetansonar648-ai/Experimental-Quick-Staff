import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()
  const [stats, setStats] = useState([
    { label: 'Total Users', value: '0', change: '+0%', icon: '👥', color: '#3b82f6' },
    { label: 'Total Workers', value: '0', change: '+0%', icon: '🧑‍🔧', color: '#10b981' },
    { label: 'Total Clients', value: '0', change: '+0%', icon: '🛒', color: '#f59e0b' },
    { label: 'Total Bookings', value: '0', change: '+0%', icon: '📈', color: '#8b5cf6' },
  ])
  const [recentActivities, setRecentActivities] = useState([])

  useEffect(() => {
    // Fetch admin summary
    fetch('http://localhost:4000/admin/summary')
      .then(res => res.json())
      .then(data => {
        setStats([
          { label: 'Total Users', value: data.total_users, change: '+0%', icon: '👥', color: '#3b82f6' },
          { label: 'Total Workers', value: data.total_workers, change: '+0%', icon: '🧑‍🔧', color: '#10b981' },
          { label: 'Total Clients', value: data.total_clients, change: '+0%', icon: '🛒', color: '#f59e0b' },
          { label: 'Total Bookings', value: data.total_bookings, change: '+0%', icon: '📈', color: '#8b5cf6' },
        ])
      })
      .catch(err => console.error('Error fetching admin summary:', err))

    // Fetch recent activities (latest bookings + reviews)
    fetch('http://localhost:4000/bookings')
      .then(res => res.json())
      .then(bookings => {
        // Take latest 5 bookings as "recent activity"
        const activities = bookings.slice(-5).map(b => ({
          user: `Client ID ${b.client_id}`,
          action: `Booked Service ID ${b.service_id}`,
          time: new Date(b.booking_date).toLocaleString(),
        }))
        setRecentActivities(activities.reverse()) // newest first
      })
      .catch(err => console.error('Error fetching bookings:', err))
  }, [])

  const handleAddUser = () => navigate('/admin/clients')
  const handleViewReports = () => navigate('/admin/analytics')
  const handleManageSettings = () => navigate('/admin/settings')
  const handleSendNotification = () => alert('Notification sender not wired yet.')

  return (
    <div className="dashboard-page">
      <div className="page-header">
        <h2>Dashboard Overview</h2>
        <p>Welcome back! Here's what's happening today.</p>
      </div>

      <div className="stats-grid">
        {stats.map((stat, index) => (
          <div key={index} className="stat-card">
            <div className="stat-icon" style={{ background: `${stat.color}20`, color: stat.color }}>
              {stat.icon}
            </div>
            <div className="stat-content">
              <p className="stat-label">{stat.label}</p>
              <h3 className="stat-value">{stat.value}</h3>
              <span className="stat-change positive">{stat.change}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        <div className="dashboard-card">
          <h3>Recent Activity</h3>
          <div className="activity-list">
            {recentActivities.length > 0 ? recentActivities.map((activity, index) => (
              <div key={index} className="activity-item">
                <div className="activity-avatar">
                  {activity.user && activity.user.charAt(0) ? activity.user.charAt(0) : '?'}
                </div>
                <div className="activity-content">
                  <p className="activity-text">
                    <strong>{activity.user || 'Unknown'}</strong> {activity.action || ''}
                  </p>
                  <span className="activity-time">{activity.time || ''}</span>
                </div>
              </div>
            )) : <p>No recent activity</p>}
          </div>
        </div>

        <div className="dashboard-card">
          <h3>Quick Actions</h3>
          <div className="quick-actions">
            <button className="action-btn" onClick={handleAddUser}>+ Add User</button>
            <button className="action-btn" onClick={handleViewReports}>📊 View Reports</button>
            <button className="action-btn" onClick={handleManageSettings}>⚙️ Manage Settings</button>
            <button className="action-btn" onClick={handleSendNotification}>📧 Send Notification</button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
