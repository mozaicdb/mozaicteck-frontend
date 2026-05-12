import Header from '../components/Header'
import InputBox from '../components/InputBox'
import ChatWindow from '../components/ChatWindow'
import PromptLibrary from '../components/PromptLibrary'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { logoutUser } from '../utils/auth'

const API_BASE = 'https://Mozaicteck-mozaicteck-rag.hf.space'

const sessionId = crypto.randomUUID()

function Chatbot() {
  const [messages, setMessages] = useState([])
  const [history, setHistory] = useState([])
  const [view, setView] = useState('chat')
  const navigate = useNavigate()

  async function handleLogout() {
    await logoutUser()
    navigate('/login')
  }

  async function sendMessage(question) {
    if (!question) return

    setMessages(prev => [...prev, { text: question, type: 'user' }])
    setMessages(prev => [...prev, { text: 'Searching your documents...', type: 'thinking' }])

    try {
      const response = await fetch(`${API_BASE}/ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: question, history: history })
      })

      const data = await response.json()

      setMessages(prev => prev.filter(m => m.type !== 'thinking'))
      setMessages(prev => [...prev, { text: data.answer, type: 'bot' }])
      setHistory(prev => [...prev,
        { role: "user", content: question },
        { role: "assistant", content: data.answer }
      ])

      await fetch(`${API_BASE}/conversations/save`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          session_id: sessionId,
          user_message: question,
          bot_response: data.answer
        })
      })

    } catch (error) {
      setMessages(prev => prev.filter(m => m.type !== 'thinking'))
      setMessages(prev => [...prev, { text: 'Something went wrong. Please try again.', type: 'bot' }])
    }
  }

  return (
    <div className="chat-container">
      <Header />
      <div className="view-toggle">
        <div className="toggle-left">
          <button
            className={`toggle-btn ${view === 'chat' ? 'active' : ''}`}
            onClick={() => setView('chat')}
          >
            Chat
          </button>
          <button
            className={`toggle-btn ${view === 'library' ? 'active' : ''}`}
            onClick={() => setView('library')}
          >
            Browse Library
          </button>
        </div>
        <button className="toggle-btn logout-btn" onClick={handleLogout}>
          Logout
        </button>
      </div>

      {view === 'chat' ? (
        <>
          <ChatWindow messages={messages} onSend={sendMessage} />
          <InputBox onSend={sendMessage} />
        </>
      ) : (
        <PromptLibrary />
      )}
    </div>
  )
}

export default Chatbot