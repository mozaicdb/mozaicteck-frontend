import Header from './components/Header'
import InputBox from './components/InputBox'
import ChatWindow from './components/ChatWindow'
import PromptLibrary from './components/PromptLibrary'
import { useState } from 'react'

const API_BASE = 'https://Mozaicteck-mozaicteck-rag.hf.space'

// Generate a unique session id when the app first loads.
// This id stays the same for the entire session.
// It will be linked to a real user account after authentication is built.
const sessionId = crypto.randomUUID()

function App() {
  const [messages, setMessages] = useState([])
  const [history, setHistory] = useState([])
  const [view, setView] = useState('chat')

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

      // Save the conversation to MongoDB after every message exchange.
      // Uses the session id generated when the app loaded.
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

export default App