import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { resetPassword } from '../utils/auth'

function ResetPassword() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({ password: '', confirmPassword: '' })
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [touched, setTouched] = useState(false)
  const [rules, setRules] = useState({
    length: false,
    upper: false,
    lower: false,
    number: false,
    special: false
  })

  function handleChange(e) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))

    if (name === 'password') {
      setTouched(true)
      setRules({
        length: value.length >= 8,
        upper: /[A-Z]/.test(value),
        lower: /[a-z]/.test(value),
        number: /[0-9]/.test(value),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(value)
      })
    }
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setMessage('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    const token = searchParams.get('token')
    if (!token) {
      setError('Invalid reset link. Please request a new one.')
      return
    }

    setLoading(true)

    const result = await resetPassword({
      token: token,
      new_password: formData.password
    })

    setLoading(false)

    if (result.message) {
      setMessage(result.message)
      setTimeout(() => navigate('/login'), 3000)
    } else if (result.detail) {
      setError(result.detail)
    } else {
      setError('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Reset Password</h2>
        <p className="auth-subtitle">Enter your new password below.</p>

        {message && <div className="auth-success">{message} Redirecting to login...</div>}
        {error && <div className="auth-error">{error}</div>}

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label>New Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter new password"
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowPassword(prev => !prev)}
              >
                {showPassword ? '🙈' : '👁️'}
              </span>
            </div>
            <div className="password-rules">
  <span className={rules.length ? 'rule valid' : touched ? 'rule error' : 'rule'}>{rules.length ? '✓' : touched ? '✗' : '✓'} At least 8 characters</span>
  <span className={rules.upper ? 'rule valid' : touched ? 'rule error' : 'rule'}>{rules.upper ? '✓' : touched ? '✗' : '✓'} One uppercase letter</span>
  <span className={rules.lower ? 'rule valid' : touched ? 'rule error' : 'rule'}>{rules.lower ? '✓' : touched ? '✗' : '✓'} One lowercase letter</span>
  <span className={rules.number ? 'rule valid' : touched ? 'rule error' : 'rule'}>{rules.number ? '✓' : touched ? '✗' : '✓'} One number</span>
  <span className={rules.special ? 'rule valid' : touched ? 'rule error' : 'rule'}>{rules.special ? '✓' : touched ? '✗' : '✓'} One special character</span>
</div>
          </div>

          <div className="auth-field">
            <label>Confirm Password</label>
            <div className="password-wrapper">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm new password"
                required
              />
              <span
                className="eye-icon"
                onClick={() => setShowConfirmPassword(prev => !prev)}
              >
                {showConfirmPassword ? '🙈' : '👁️'}
              </span>
            </div>
            {formData.confirmPassword && (
  <span className={formData.password === formData.confirmPassword ? 'rule valid' : 'rule error'}>
    {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
  </span>
)}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Resetting...' : 'Reset Password'}
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

export default ResetPassword