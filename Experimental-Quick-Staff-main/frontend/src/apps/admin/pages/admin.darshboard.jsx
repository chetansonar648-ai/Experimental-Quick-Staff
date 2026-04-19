import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

const Dashboard = () => {
  const navigate = useNavigate()

  const stats = [
    { label: 'Total Users', value: '12,543', change: '+12.5%', icon: '👥', color: '#3b82f6' },
    { label: 'Revenue', value: '$45,231', change: '+8.2%', icon: '💰', color: '#10b981' },
    { label: 'Orders', value: '1,234', change: '+5.1%', icon: '🛒', color: '#f59e0b' },
    { label: 'Growth', value: '23.8%', change: '+2.4%', icon: '📈', color: '#8b5cf6' },
  ]

  const recentActivities = [
    { user: 'John Doe', action: 'Created new account', time: '2 minutes ago' },
    { user: 'Jane Smith', action: 'Updated profile', time: '15 minutes ago' },
    { user: 'Mike Johnson', action: 'Made a purchase', time: '1 hour ago' },
    { user: 'Sarah Williams', action: 'Submitted feedback', time: '2 hours ago' },
  ]

  const handleAddUser = () => navigate('/clients')
  const handleViewReports = () => navigate('/analytics')
  const handleManageSettings = () => navigate('/settings')
  const handleSendNotification = () => alert('Notification sender not wired yet. Connect to your messaging service.')

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
            {recentActivities.map((activity, index) => (
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
            ))}
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

