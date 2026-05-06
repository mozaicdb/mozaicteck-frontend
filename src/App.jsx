import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Chatbot from './pages/Chatbot'
import Landing from './pages/Landing'
import Register from './pages/Register'
import Login from './pages/Login'
import VerifyEmail from './pages/VerifyEmail'

function App() {
  return (
    <BrowserRouter basename="/mozaicteck-frontend">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App