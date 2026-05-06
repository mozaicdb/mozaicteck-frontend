import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { verifyEmail } from '../utils/auth'

function VerifyEmail() {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying')

  useEffect(() => {
    const token = searchParams.get('token')

    if (!token) {
      setStatus('invalid')
      return
    }

    verifyEmail(token).then(result => {
      if (result.message) {
        setStatus('success')
      } else {
        setStatus('failed')
      }
    })
  }, [])

  return (
    <div className="auth-container">
      <div className="auth-card">
        {status === 'verifying' && (
          <>
            <h2 className="auth-title">Verifying...</h2>
            <p className="auth-subtitle">Please wait while we verify your email.</p>
          </>
        )}

        {status === 'success' && (
          <>
            <h2 className="auth-title">Email Verified</h2>
            <p className="auth-subtitle">Your account is now active. You can login.</p>
            <button className="auth-btn" onClick={() => navigate('/login')}>
              Go to Login
            </button>
          </>
        )}

        {status === 'failed' && (
          <>
            <h2 className="auth-title">Verification Failed</h2>
            <p className="auth-subtitle">The link may have expired or already been used.</p>
            <button className="auth-btn" onClick={() => navigate('/register')}>
              Back to Register
            </button>
          </>
        )}

        {status === 'invalid' && (
          <>
            <h2 className="auth-title">Invalid Link</h2>
            <p className="auth-subtitle">No verification token was found in the link.</p>
            <button className="auth-btn" onClick={() => navigate('/register')}>
              Back to Register
            </button>
          </>
        )}
      </div>
    </div>
  )
}

export default VerifyEmail