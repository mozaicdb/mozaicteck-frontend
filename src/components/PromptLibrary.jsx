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
  // Uses the dedicated /prompts/categories endpoint for efficiency.
  useEffect(() => {
    fetchCategories()
  }, [])

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

  // Fetches all unique category names from MongoDB.
  // Adds All at the beginning so users can reset to full list.
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
// Toggles a prompt card open or closed.
// If the clicked card is already open it closes it.
function handleExpand(id) {
  setExpandedId(prev => prev === id ? null : id)
}
  // Toggles a sidebar panel open or closed.
  // If the clicked panel is already open it closes it.
  // If a different panel is clicked it switches to that one.
  // Only one panel can be open at a time.
  function handlePanelToggle(panel) {
    setActivePanel(prev => prev === panel ? null : panel)
  }

  return (
    <div className={`library-layout ${mobileSidebarOpen ? 'sidebar-open' : ''}`}>

      {/* Overlay closes both the panel and the mobile sidebar */}
{(activePanel || mobileSidebarOpen) && (
  <div
    className="panel-overlay"
    style={{ background: mobileSidebarOpen ? 'rgba(0,0,0,0.5)' : 'transparent' }}
    onClick={() => {
      setActivePanel(null)
      setMobileSidebarOpen(false)
    }}
  />
)}
      {/* Sidebar on the left. Contains search, categories, and history icons. */}
      {/* categories prop now receives live data from MongoDB not a hardcoded array. */}
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

  <button
    className={`copy-btn ${copiedId === prompt.id ? 'copied' : ''}`}
    onClick={(e) => {
      e.stopPropagation()
      handleCopy(prompt)
    }}
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