import { useState } from 'react'

function ChatBubble({ text, type }) {
  const [copied, setCopied] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className={`message ${type}`}>
      {type === 'thinking' ? (
  <div className="typing-indicator">
    <span></span>
    <span></span>
    <span></span>
  </div>
) : text}
      {type === 'bot' && (
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      )}
    </div>
  )
}

export default ChatBubble