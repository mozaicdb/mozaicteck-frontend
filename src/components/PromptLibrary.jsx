import { useState, useEffect } from 'react'
import LibrarySidebar from './LibrarySidebar'

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

  // Tracks which prompt card is currently expanded. null means none are expanded.
  const [expandedId, setExpandedId] = useState(null)

  // Tracks which sidebar panel is currently open. null means no panel is open.
  const [activePanel, setActivePanel] = useState(null)

  // Controls whether the sidebar is open on mobile
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false)

  // Stores the list of categories fetched from MongoDB.
  // Starts with All only. Updates when the API responds.
  const [categories, setCategories] = useState(['All'])

  // Fetch prompts whenever the active category changes
  useEffect(() => {
    fetchPrompts()
  }, [activeCategory])

  // Fetches categories from MongoDB when the page first loads.
  useEffect(() => {
    fetchCategories()
  }, [])

  // Fetches prompts from MongoDB via the backend API.
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

  // Fetches all unique category names from MongoDB.
  async function fetchCategories() {
    try {
      const res = await fetch(`${API_BASE}/prompts/categories`)
      const data = await res.json()
      setCategories(['All', ...data.categories])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  // Handles search input changes.
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
  function handleCategorySelect(cat) {
    setActiveCategory(cat)
    setSearchQuery('')
    setActivePanel(null)
  }

  // Copies the prompt title and description to clipboard.
  function handleCopy(prompt) {
    navigator.clipboard.writeText(prompt.title + '\n\n' + prompt.description)
    setCopiedId(prompt.id)
    setTimeout(() => setCopiedId(null), 2000)
  }

  // Toggles a prompt card open or closed.
  function handleExpand(id) {
    setExpandedId(prev => prev === id ? null : id)
  }

  // Toggles a sidebar panel open or closed.
  // Also closes mobile sidebar when a panel opens.
  function handlePanelToggle(panel) {
    setActivePanel(prev => prev === panel ? null : panel)
    setMobileSidebarOpen(false)
  }

  return (
    <div className={`library-layout ${mobileSidebarOpen ? 'sidebar-open' : ''}`}>

      {/* Overlay closes both the panel and the mobile sidebar */}
      {(activePanel || mobileSidebarOpen) && (
        <div
          className="panel-overlay"
          style={{ background: activePanel || mobileSidebarOpen ? 'rgba(0,0,0,0.5)' : 'transparent' }}
          onClick={() => {
            setActivePanel(null)
            setMobileSidebarOpen(false)
          }}
        />
      )}

      {/* Search panel. Lives here so it can take full width on mobile. */}
      {activePanel === 'search' && (
        <div className="sidebar-panel" onClick={e => e.stopPropagation()}>
          <div className="panel-header">
            <span>Search Prompts</span>
            <button
              className="panel-close"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation()
                setActivePanel(null)
              }}
            >✕</button>
          </div>
          <input
            className="panel-search-input"
            type="text"
            placeholder="Type a keyword..."
            value={searchQuery}
            onChange={handleSearch}
            autoFocus
          />
        </div>
      )}

      {/* Categories panel. Lives here so it can take full width on mobile. */}
      {activePanel === 'categories' && (
        <div className="sidebar-panel" onClick={e => e.stopPropagation()}>
          <div className="panel-header">
            <span>Categories</span>
            <button
              className="panel-close"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation()
                setActivePanel(null)
              }}
            >✕</button>
          </div>
          <div className="panel-categories">
            {categories.map(cat => (
              <button
                key={cat}
                className={`panel-category-btn ${activeCategory === cat ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation()
                  handleCategorySelect(cat)
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* History panel. Lives here so it can take full width on mobile. */}
      {activePanel === 'history' && (
        <div className="sidebar-panel" onClick={e => e.stopPropagation()}>
          <div className="panel-header">
            <span>History</span>
            <button
              className="panel-close"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation()
                setActivePanel(null)
              }}
            >✕</button>
          </div>
          <div className="panel-coming-soon">
            <p>🔒 Coming soon</p>
            <p>History will be available after you create an account.</p>
          </div>
        </div>
      )}

      {/* Sidebar on the left. Contains search, categories, and history icons. */}
      <LibrarySidebar
        activePanel={activePanel}
        onPanelToggle={handlePanelToggle}
        categories={categories}
        activeCategory={activeCategory}
        onCategorySelect={handleCategorySelect}
        onSearch={handleSearch}
        searchQuery={searchQuery}
        mobileOpen={mobileSidebarOpen}
        onMobileClose={() => setMobileSidebarOpen(false)}
        panelActive={!!activePanel}
      />

      {/* Main content area on the right. Shows prompt cards. */}
      <div className="library-main">

        {/* Floating mobile menu button. Visible only on mobile. */}
        <button
          className={`mobile-menu-btn ${mobileSidebarOpen ? 'is-open' : ''}`}
          onClick={() => setMobileSidebarOpen(prev => !prev)}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>

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
            <div
              key={prompt.id}
              className={`prompt-card ${expandedId === prompt.id ? 'expanded' : ''}`}
              onClick={() => handleExpand(prompt.id)}
            >
              <h3 className="prompt-title">{prompt.title}</h3>
              <p className="prompt-desc">{prompt.description}</p>
              <div className="prompt-tags">
                <span className="tag difficulty">{prompt.difficulty}</span>
                <span className={`tag tier ${prompt.tier}`}>{prompt.tier}</span>
              </div>

              {/* Guided stages. Visible only when card is expanded. */}
              {expandedId === prompt.id && prompt.stages && (
                <div className="prompt-stages" onClick={e => e.stopPropagation()}>
                  <p className="stages-title">Guided Stages</p>
                  {prompt.stages.map((stage, index) => (
                    <div key={index} className="stage-item">
                      <span className="stage-number">Stage {index + 1}</span>
                      <p className="stage-text">{stage}</p>
                    </div>
                  ))}
                </div>
              )}

              {/* Arrow hint showing the card is expandable */}
              <div className="card-expand-arrow">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
                <span>{expandedId === prompt.id ? 'Collapse' : 'Expand'}</span>
              </div>

              {/* Copy button with icon only. No text. */}
              <button
                className={`copy-btn ${copiedId === prompt.id ? 'copied' : ''}`}
                onClick={(e) => {
                  e.stopPropagation()
                  handleCopy(prompt)
                }}
                title="Copy prompt"
              >
                {copiedId === prompt.id ? (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <polyline points="20 6 9 17 4 12" />
                  </svg>
                ) : (
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="9" y="9" width="13" height="13" rx="2" ry="2" />
                    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
                  </svg>
                )}
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