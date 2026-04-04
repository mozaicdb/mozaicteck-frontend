import ChatBubble from './ChatBubble'

function ChatWindow({ messages }) {
  return (
    <div className="chat-messages">
      {messages.length === 0 && (
        <div className="welcome-message">
          <span>MozaicTeck RAG Chatbot</span> is ready 🚀<br/>
          Ask me anything about AI prompts and writing techniques.<br/>
          <small style={{color:'#333', marginTop:'8px', display:'block'}}>
            Powered by Moses Iluyemi
          </small>
        </div>
      )}
      {messages.map((msg, index) => (
        <ChatBubble key={index} text={msg.text} type={msg.type} />
      ))}
    </div>
  )
}

export default ChatWindow