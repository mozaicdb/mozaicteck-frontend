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
        <div className="welcome-message" style={{ paddingTop: '50px', justifyContent: 'flex-start' }}>
          <div className="welcome-icon">
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#ff6b00" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
    <circle cx="9" cy="10" r="1" fill="#ff6b00" />
    <circle cx="12" cy="10" r="1" fill="#ff6b00" />
    <circle cx="15" cy="10" r="1" fill="#ff6b00" />
  </svg>
</div>
          <h2 className="welcome-title">MozaicTeck</h2>
          <p className="welcome-subtitle">Find the right prompt for any task, instantly</p>
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