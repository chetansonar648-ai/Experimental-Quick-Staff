import { useMemo, useState } from 'react'
import { useToast } from '../../../context/ToastContext.jsx'
import { useAdminProfileContext } from '../context/AdminProfileContext'
import { adminApi } from '../services/adminApi'
import './Settings.css'

const Settings = () => {
  const { showToast } = useToast()
  const { profile, loading, error, refreshProfile } = useAdminProfileContext()
  const [showPasswordModal, setShowPasswordModal] = useState(false)
  const [passwordLoading, setPasswordLoading] = useState(false)
  const [passForm, setPassForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const adminProfile = useMemo(() => {
    if (!profile) {
      return {
        name: '',
        email: '',
        role: '',
        userId: '',
        joinedDate: null
      }
    }
    return {
      name: profile.name || '',
      email: profile.email || '',
      role: profile.role || '',
      userId: profile.id || '',
      joinedDate: profile.created_at || null
    }
  }, [profile])

  const formatMemberSince = (joinedDate) => {
    if (!joinedDate) return '-'
    return new Date(joinedDate).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()

    if (passForm.newPassword !== passForm.confirmPassword) {
      showToast("New passwords don't match", 'error')
      return
    }

    if (!passForm.currentPassword || !passForm.newPassword) {
      showToast('Please fill all fields', 'error')
      return
    }

    try {
      setPasswordLoading(true)
      await adminApi.changePassword({
        currentPassword: passForm.currentPassword,
        newPassword: passForm.newPassword
      })

      showToast('Password updated successfully', 'success')
      setShowPasswordModal(false)
      setPassForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
    } catch (err) {
      showToast(err.message || 'Error changing password', 'error')
    } finally {
      setPasswordLoading(false)
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
                {(adminProfile.name || '?').charAt(0).toUpperCase()}
              </div>
            </div>
            <div className="profile-details">
              {loading ? (
                <p>Loading profile...</p>
              ) : error ? (
                <div>
                  <p>{error}</p>
                  <button type="button" className="action-button" onClick={refreshProfile}>
                    Retry
                  </button>
                </div>
              ) : (
                <>
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
                <p>{formatMemberSince(adminProfile.joinedDate)}</p>
              </div>
                </>
              )}
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
                <button type="submit" className="submit-btn" disabled={passwordLoading}>
                  {passwordLoading ? 'Updating...' : 'Update Password'}
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
