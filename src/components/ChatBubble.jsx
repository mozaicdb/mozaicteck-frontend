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
      {text}
      {type === 'bot' && (
        <button className="copy-btn" onClick={handleCopy}>
          {copied ? 'Copied!' : 'Copy'}
        </button>
      )}
    </div>
  )
}

export default ChatBubble