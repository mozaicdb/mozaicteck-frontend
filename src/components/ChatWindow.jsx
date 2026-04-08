import ChatBubble from './ChatBubble'
import { useRef, useEffect } from 'react'

function ChatWindow({ messages, onSend }) {
  const bottomRef = useRef(null)
  useEffect(() => {
  bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
}, [messages])
  return (
    <div className="chat-messages">
      {messages.length === 0 && (
  <div className="welcome-message">
    <div className="welcome-icon">💬</div>
    <h2 className="welcome-title">MozaicTeck RAG Chatbot</h2>
    <p className="welcome-subtitle">Ask me anything about AI prompts</p>
    <div className="suggestion-chips">
      <button className="chip" onClick={() => onSend('Give me a prompt for a graphic designer')}>
        Give me a prompt for a graphic designer
      </button>
      <button className="chip" onClick={() => onSend('What prompt can I use for YouTube scripting?')}>
        What prompt can I use for YouTube scripting?
      </button>
      <button className="chip" onClick={() => onSend('Give me a coding prompt')}>
        Give me a coding prompt
      </button>
    </div>
  </div>
)}
      {messages.map((msg, index) => (
        <ChatBubble key={index} text={msg.text} type={msg.type} />
      ))}
      <div ref={bottomRef} />
    </div>
  )
}

export default ChatWindow