import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { getMe, logoutUser } from '../utils/auth'

function Profile() {
  const navigate = useNavigate()
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    getMe().then(result => {
      if (result && result.user) {
        setUser(result.user)
      } else {
        setError('Could not load profile. Please login again.')
      }
      setLoading(false)
    })
  }, [])

  async function handleLogout() {
    await logoutUser()
    navigate('/login')
  }

  if (loading) return (
    <div className="auth-container">
      <div className="auth-card">
        <p className="auth-subtitle">Loading profile...</p>
      </div>
    </div>
  )

  if (error) return (
    <div className="auth-container">
      <div className="auth-card">
        <p className="auth-error">{error}</p>
        <button className="auth-btn" onClick={() => navigate('/login')}>
          Go to Login
        </button>
      </div>
    </div>
  )

  return (
    <div className="auth-container">
      <div className="profile-wrapper">
        <div className="profile-avatar">
          {user.firstName.charAt(0)}{user.lastName.charAt(0)}
        </div>
        <div className="auth-card">
          <div className="profile-header">
            <h2 className="auth-title">{user.firstName} {user.lastName}</h2>
            <p className="auth-subtitle">{user.email}</p>
            <span className={`profile-badge ${user.isEmailVerified ? 'verified' : 'unverified'}`}>
              {user.isEmailVerified ? '✓ Verified' : '✗ Not Verified'}
            </span>
          </div>

          <div className="profile-details">
            <div className="profile-field">
              <span className="profile-label">First Name</span>
              <span className="profile-value">{user.firstName}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Last Name</span>
              <span className="profile-value">{user.lastName}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Email</span>
              <span className="profile-value">{user.email}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Phone Number</span>
              <span className="profile-value">{user.phoneNumber || 'Not provided'}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Bio</span>
              <span className="profile-value">{user.bio || 'No bio yet'}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Member Since</span>
              <span className="profile-value">{new Date(user.createdAt).toDateString()}</span>
            </div>
            <div className="profile-field">
              <span className="profile-label">Two Factor Auth</span>
              <span className="profile-value">{user.isTwoFAEnabled ? 'Enabled' : 'Disabled'}</span>
            </div>
          </div>

          <div className="profile-actions">
            <button className="auth-btn" onClick={() => navigate('/chatbot')}>
              Back to Chatbot
            </button>
            <button className="toggle-btn logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile