import { useState, useEffect } from 'react'

const CATEGORIES = [
  'All',
  'Business Owners',
  'Students',
  'Content Creators',
  'Marketers and Copywriters',
  'Creative Design',
  'Coding',
  'Educators',
  'Career and Jobs'
]

const API_BASE = 'https://Mozaicteck-mozaicteck-rag.hf.space'

export default function PromptLibrary() {
  const [prompts, setPrompts] = useState([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [searchQuery, setSearchQuery] = useState('')
  const [loading, setLoading] = useState(false)
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    fetchPrompts()
  }, [activeCategory])

  async function fetchPrompts() {
    setLoading(true)
    try {
      const url = activeCategory === 'All'
        ? `${API_BASE}/prompts`
        : `${API_BASE}/prompts?category=${encodeURIComponent(activeCategory)}`
      const res = await fetch(url)
      const data = await res.json()
      setPrompts(data.prompts)
    } catch (error) {
      console.error('Failed to fetch prompts:', error)
    }
    setLoading(false)
  }

  async function handleSearch(e) {
    const value = e.target.value
    setSearchQuery(value)
    if (value.trim() === '') {
      fetchPrompts()
      return
    }
    setLoading(true)
    try {
      const res = await fetch(`${API_BASE}/prompts/search?q=${encodeURIComponent(value)}`)
      const data = await res.json()
      setPrompts(data.prompts)
    } catch (error) {
      console.error('Search failed:', error)
    }
    setLoading(false)
  }

  function handleCopy(prompt) {
    navigator.clipboard.writeText(prompt.title + '\n\n' + prompt.description)
    setCopiedId(prompt.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  return (
    <div className="library-container">
      <div className="library-search-wrapper">
        <input
          className="library-search"
          type="text"
          placeholder="Search for a prompt..."
          value={searchQuery}
          onChange={handleSearch}
        />
      </div>

      <div className="library-categories">
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            className={`category-btn ${activeCategory === cat ? 'active' : ''}`}
            onClick={() => {
              setActiveCategory(cat)
              setSearchQuery('')
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      {loading && <p className="library-loading">Loading prompts...</p>}

      <div className="prompt-grid">
        {!loading && prompts.map(prompt => (
          <div key={prompt.id} className="prompt-card">
            <h3 className="prompt-title">{prompt.title}</h3>
            <p className="prompt-desc">{prompt.description}</p>
            <div className="prompt-tags">
              <span className="tag difficulty">{prompt.difficulty}</span>
              <span className="tag tier">{prompt.tier}</span>
            </div>
            <button
              className={`copy-btn ${copiedId === prompt.id ? 'copied' : ''}`}
              onClick={() => handleCopy(prompt)}
            >
              {copiedId === prompt.id ? 'Copied!' : 'Copy'}
            </button>
          </div>
        ))}
      </div>

      {!loading && prompts.length === 0 && (
        <p className="library-empty">No prompts found. Try a different search or category.</p>
      )}
    </div>
  )
}