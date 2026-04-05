import Header from './components/Header'
import InputBox from './components/InputBox'
import ChatWindow from './components/ChatWindow'
import { useState } from 'react'

function App() {
  const [messages, setMessages] = useState([])
  const [history, setHistory] = useState([])

  async function sendMessage(question) {
    if (!question) return

    setMessages(prev => [...prev, { text: question, type: 'user' }])
    setMessages(prev => [...prev, { text: 'Searching your documents...', type: 'thinking' }])

    try {
      const response = await fetch('https://Mozaicteck-mozaicteck-rag.hf.space/ask', {
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

    } catch (error) {
      setMessages(prev => prev.filter(m => m.type !== 'thinking'))
      setMessages(prev => [...prev, { text: 'Something went wrong. Please try again.', type: 'bot' }])
    }
  }

  return (
    <div className="chat-container">
      <Header />
      <ChatWindow messages={messages} />
      <InputBox onSend={sendMessage} />
    </div>
  )
}

export default App