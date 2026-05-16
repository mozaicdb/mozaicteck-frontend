import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import PhoneInput from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { registerUser } from '../utils/auth'

const API_BASE = 'https://Mozaicteck-mozaicteck-rag.hf.space'

function Register() {
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  const [phone, setPhone] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [touched, setTouched] = useState(false)

  const passwordRules = [
    { label: 'At least 8 characters', test: (p) => p.length >= 8 },
    { label: 'One uppercase letter', test: (p) => /[A-Z]/.test(p) },
    { label: 'One lowercase letter', test: (p) => /[a-z]/.test(p) },
    { label: 'One number', test: (p) => /[0-9]/.test(p) },
    { label: 'One special character', test: (p) => /[^A-Za-z0-9]/.test(p) }
  ]

  function handleChange(e) {
    if (e.target.name === 'password') setTouched(true)
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match')
      return
    }

    setLoading(true)

    const result = await registerUser({
      firstName: formData.firstName,
      lastName: formData.lastName,
      email: formData.email,
      phoneNumber: phone,
      password: formData.password
    })

    setLoading(false)

    if (result.detail) {
      setError(result.detail)
      return
    }

    navigate('/login', { state: { message: 'Registration successful. Please check your email to verify your account.' } })
  }

  async function handleGoogleLogin() {
  const response = await fetch(`${API_BASE}/auth/google/login`)
  const data = await response.json()
  if (data.url) {
    window.location.href = data.url
  }
}

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Create Account</h2>
        <p className="auth-subtitle">Join MozaicTeck today</p>

        {error && <div className="auth-error">{error}</div>}

        <div className="auth-divider">
          <span>REGISTER WITH</span>
        </div>

        <button className="google-btn" onClick={handleGoogleLogin}>
          <svg width="20" height="20" viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            <path fill="none" d="M0 0h48v48H0z"/>
          </svg>
          Continue with Google
        </button>

        <div className="auth-divider">
          <span>OR REGISTER MANUALLY</span>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-row">
            <div className="auth-field">
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                placeholder="John"
                required
              />
            </div>
            <div className="auth-field">
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                placeholder="Doe"
                required
              />
            </div>
          </div>

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
            <label>Phone Number</label>
            <PhoneInput
              international
              defaultCountry="NG"
              value={phone}
              onChange={setPhone}
              className="phone-input"
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
            <div className="password-rules">
              {passwordRules.map((rule, index) => (
                <p
                  key={index}
                  className={rule.test(formData.password) ? 'rule valid' : touched ? 'rule error' : 'rule'}
                >
                  {rule.test(formData.password) ? '✓' : touched ? '✗' : '✓'} {rule.label}
                </p>
              ))}
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
                placeholder="Repeat password"
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
              <p className={formData.password === formData.confirmPassword ? 'rule valid' : 'rule error'}>
                {formData.password === formData.confirmPassword ? '✓ Passwords match' : '✗ Passwords do not match'}
              </p>
            )}
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-switch">
          Already have an account?{' '}
          <span onClick={() => navigate('/login')}>Login</span>
        </p>
      </div>
    </div>
  )
}

export default Register