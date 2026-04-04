import { useState } from 'react'

function InputBox({ onSend }) {
  const [input, setInput] = useState('')

  function handleSend() {
    if (!input.trim()) return
    onSend(input)
    setInput('')
  }

  return (
    <div className="chat-input-area">
      <textarea
        className="chat-input"
        placeholder="Ask a question from your documents..."
        rows="1"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault()
            handleSend()
          }
        }}
      ></textarea>
      <button className="send-btn" onClick={handleSend}>
        <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path d="M2 21l21-9L2 3v7l15 2-15 2v7z"/>
        </svg>
      </button>
    </div>
  )
}

export default InputBox