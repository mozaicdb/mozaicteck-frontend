import { useNavigate } from 'react-router-dom'

function Landing() {
  const navigate = useNavigate()

  return (
    <div className="landing-container">
      <div className="landing-content">
        <h1 className="landing-title">MozaicTeck</h1>
        <p className="landing-tagline">Find the right prompt for any task, instantly</p>
        <div className="landing-buttons">
          <button className="landing-btn-primary" onClick={() => navigate('/register')}>
            Get Started
          </button>
          <button className="landing-btn-secondary" onClick={() => navigate('/login')}>
            Login
          </button>
        </div>
      </div>
    </div>
  )
}

export default Landing