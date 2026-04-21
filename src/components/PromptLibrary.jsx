import { useState, useEffect } from 'react'
import LibrarySidebar from './LibrarySidebar'

// All available prompt categories. Must match exact MongoDB category_label values.
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
  // Stores the list of prompts returned from the API
  const [prompts, setPrompts] = useState([])

  // Tracks which category button is currently selected
  const [activeCategory, setActiveCategory] = useState('All')

  // Tracks what the user is typing in the search input
  const [searchQuery, setSearchQuery] = useState('')

  // Controls loading state while fetching from API
  const [loading, setLoading] = useState(false)

  // Tracks which prompt was just copied. Resets after 2 seconds.
  const [copiedId, setCopiedId] = useState(null)

  // Tracks which sidebar panel is currently open. null means no panel is open.
  const [activePanel, setActivePanel] = useState(null)

  // Fetch prompts whenever the active category changes
  useEffect(() => {
    fetchPrompts()
  }, [activeCategory])

  // Fetches prompts from MongoDB via the backend API.
  // If a category is selected it filters by that category.
  // If All is selected it fetches everything.
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

  // Handles search input changes.
  // If input is empty it falls back to fetching by active category.
  // Otherwise it calls the search endpoint with the keyword.
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

  // Handles category selection from the sidebar panel.
  // Updates active category and clears search query.
  // Closes the categories panel after selection.
  function handleCategorySelect(cat) {
    setActiveCategory(cat)
    setSearchQuery('')
    setActivePanel(null)
  }

  // Copies the prompt title and description to clipboard.
  // Shows Copied confirmation for 2 seconds then resets.
  function handleCopy(prompt) {
    navigator.clipboard.writeText(prompt.title + '\n\n' + prompt.description)
    setCopiedId(prompt.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Toggles a sidebar panel open or closed.
  // If the clicked panel is already open it closes it.
  // If a different panel is clicked it switches to that one.
  // Only one panel can be open at a time.
  function handlePanelToggle(panel) {
    setActivePanel(prev => prev === panel ? null : panel)
  }

  return (
    <div className="library-layout">
      {/* Invisible overlay. Clicking outside the panel closes it. */}
{activePanel && (
  <div
    className="panel-overlay"
    onClick={() => setActivePanel(null)}
  />
)}

      {/* Sidebar on the left. Contains search, categories, and history icons. */}
      <LibrarySidebar
        activePanel={activePanel}
        onPanelToggle={handlePanelToggle}
        categories={CATEGORIES}
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
        onSearch={handleSearch}
        searchQuery={searchQuery}
      />

      {/* Main content area on the right. Shows prompt cards. */}
      <div className="library-main">

        {/* Show active category or search query as context for the user */}
        <div className="library-context">
          {searchQuery
            ? <span>Search results for: <strong>{searchQuery}</strong></span>
            : <span>Category: <strong>{activeCategory}</strong></span>
          }
        </div>

        {loading && <p className="library-loading">Loading prompts...</p>}

        <div className="prompt-grid">
          {!loading && prompts.map(prompt => (
            <div key={prompt.id} className="prompt-card">
              <h3 className="prompt-title">{prompt.title}</h3>
              <p className="prompt-desc">{prompt.description}</p>
              <div className="prompt-tags">
                <span className="tag difficulty">{prompt.difficulty}</span>
                <span className={`tag tier ${prompt.tier}`}>{prompt.tier}</span>
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
          <div className="library-empty">
            <p>😕 No prompts found</p>
            <p>Try a different keyword or browse by category</p>
          </div>
        )}

      </div>
    </div>
  )
}