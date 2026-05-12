import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { forgotPassword } from '../utils/auth'

function ForgotPassword() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    const result = await forgotPassword(email)

    setLoading(false)

    if (result.message) {
      setMessage(result.message)
    } else {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Forgot Password</h2>
        <p className="auth-subtitle">Enter your email and we will send you a reset link.</p>

        {message && <div className="auth-success">{message}</div>}
        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="john@example.com"
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <p className="auth-switch">
          Remember your password?{' '}
          <span onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  )
}

export default ForgotPassword