import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { loginUser } from '../utils/auth'

function Login() {
  const navigate = useNavigate()
  const location = useLocation()
  const [formData, setFormData] = useState({ email: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const successMessage = location.state?.message
  window.history.replaceState({}, document.title)

  function handleChange(e) {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await loginUser(formData)

    setLoading(false)

    if (result.detail) {
      setError(result.detail)
      return
    }

    navigate('/chatbot')
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Welcome Back</h2>
        <p className="auth-subtitle">Login to your MozaicTeck account</p>

        {successMessage && <div className="auth-success">{successMessage}</div>}
        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="john@example.com"
              required
            />
          </div>

          <div className="auth-field">
            <label>Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter password"
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </form>

        <p className="auth-switch">
          <span onClick={() => navigate('/forgot-password')}>Forgot password?</span>
        </p>

        <p className="auth-switch">
          Don't have an account?{' '}
          <span onClick={() => navigate('/register')}>Create one</span>
        </p>
      </div>
    </div>
  )
}

export default Login