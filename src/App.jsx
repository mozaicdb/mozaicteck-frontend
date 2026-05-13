import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import Chatbot from './pages/Chatbot'
import Landing from './pages/Landing'
import Register from './pages/Register'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import Profile from './pages/Profile'
import { getMe } from './utils/auth'

function PrivateRoute({ children }) {
  const [status, setStatus] = useState('checking')

  useEffect(() => {
    getMe()
      .then(result => {
        if (result && result.user) {
          setStatus('allowed')
        } else {
          setStatus('denied')
        }
      })
      .catch(() => setStatus('denied'))
  }, [])

  if (status === 'checking') return <div style={{ padding: '2rem', textAlign: 'center' }}>Checking session...</div>
  if (status === 'denied') return <Navigate to="/login" replace />
  return children
}

function App() {
  return (
    <BrowserRouter basename="/mozaicteck-frontend">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/chatbot" element={<PrivateRoute><Chatbot /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App