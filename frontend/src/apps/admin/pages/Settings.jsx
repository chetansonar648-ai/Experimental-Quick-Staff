import { useState } from 'react'
import './Settings.css'

const Settings = () => {
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  // Admin Profile Data (hardcoded for now)
  const [adminProfile] = useState({
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'Administrator',
    userId: '1',
    joinedDate: '2024-01-15'
  })

  const apiBase = import.meta.env.VITE_API_URL || 'http://localhost:4000'

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (passForm.newPassword !== passForm.confirmPassword) {
      alert("New passwords don't match!")
      return
    }

    if (!passForm.currentPassword || !passForm.newPassword) {
      return alert("Please fill all fields")
    }

    try {
      // Using admin user ID = 1
      const res = await fetch(`${apiBase}/users/1/password`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: passForm.newPassword })
      })

      if (res.ok) {
        alert("Password updated successfully!")
        setShowPasswordModal(false)
        setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        const err = await res.json()
        alert("Failed: " + err.error)
      }
    } catch (err) {
      console.error(err)
      alert("Error changing password")
    }
  }

  return (
    <div className="settings-page">
      <div className="page-header">
        <h2>Settings</h2>
        <p>Manage your admin profile and security settings</p>
      </div>

      <div className="settings-grid">
        {/* Admin Profile Section */}
        <div className="settings-section">
          <h3>👤 Admin Profile</h3>
          <div className="settings-card profile-card">
            <div className="profile-avatar">
              <div className="avatar-circle">
                {adminProfile.name.charAt(0)}
              </div>
            </div>
            <div className="profile-details">
              <div className="profile-item">
                <label>Name</label>
                <p>{adminProfile.name}</p>
              </div>
              <div className="profile-item">
                <label>Email</label>
                <p>{adminProfile.email}</p>
              </div>
              <div className="profile-item">
                <label>Role</label>
                <p><span className="role-badge">{adminProfile.role}</span></p>
              </div>
              <div className="profile-item">
                <label>User ID</label>
                <p>#{adminProfile.userId}</p>
              </div>
              <div className="profile-item">
                <label>Member Since</label>
                <p>{new Date(adminProfile.joinedDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Security Section - Change Password Only */}
        <div className="settings-section">
          <h3>🔒 Security</h3>
          <div className="settings-card">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Change Password</h4>
                <p>Update your admin account password for better security</p>
              </div>
              <button
                className="action-button"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Password Change Modal */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content password-modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>🔐 Change Password</h3>
              <button className="close-btn" onClick={() => setShowPasswordModal(false)}>×</button>
            </div>
            <form className="modal-form" onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>Current Password</label>
                <input
                  type="password"
                  placeholder="Enter current password"
                  value={passForm.currentPassword}
                  onChange={e => setPassForm({ ...passForm, currentPassword: e.target.value })}
                  required
                />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  placeholder="Enter new password"
                  value={passForm.newPassword}
                  onChange={e => setPassForm({ ...passForm, newPassword: e.target.value })}
                  required
                  minLength="6"
                />
              </div>
              <div className="form-group">
                <label>Confirm New Password</label>
                <input
                  type="password"
                  placeholder="Confirm new password"
                  value={passForm.confirmPassword}
                  onChange={e => setPassForm({ ...passForm, confirmPassword: e.target.value })}
                  required
                  minLength="6"
                />
              </div>
              <div className="password-hint">
                <small>⚠️ Password must be at least 6 characters long</small>
              </div>
              <div className="modal-actions">
                <button type="button" className="cancel-btn" onClick={() => setShowPasswordModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="submit-btn">
                  Update Password
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default Settings
