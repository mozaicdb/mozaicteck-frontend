import { useState } from 'react'

// LibrarySidebar.jsx
// This component renders the collapsible icon sidebar for the Prompt Library.
// It receives all state and handlers from PromptLibrary.jsx as props.

function LibrarySidebar({
  activePanel,
  onPanelToggle,
  categories,
  activeCategory,
  onCategorySelect,
  onSearch,
  searchQuery
}) {
  // Track whether the sidebar is collapsed or expanded
  const [collapsed, setCollapsed] = useState(true)

  // Handles sidebar collapse and expand.
  // Also closes any open panel when the sidebar is toggled.
  function handleToggle(e) {
    e.stopPropagation()
    setCollapsed(!collapsed)
    if (activePanel) {
      onPanelToggle(activePanel)
    }
  }

  return (
    // Main sidebar wrapper. Narrow when collapsed. Wide when expanded.
    // stopPropagation prevents sidebar clicks from reaching the overlay.
    <div
      className={`library-sidebar ${collapsed ? 'collapsed' : 'expanded'}`}
      onClick={e => e.stopPropagation()}
    >

      {/* Toggle button to collapse or expand the sidebar.
          Also closes any open panel when clicked. */}
      <button
        className="sidebar-toggle"
        style={{ cursor: 'pointer' }}
        onClick={handleToggle}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? '→' : '←'}
      </button>

      {/* Search icon button. Glows orange when search panel is open. */}
      <button
        className={`sidebar-icon-btn ${activePanel === 'search' ? 'active' : ''}`}
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation()
          onPanelToggle('search')
        }}
        title="Search prompts"
      >
        🔍
        {!collapsed && <span>Search</span>}
      </button>

      {/* Categories icon button. Glows orange when categories panel is open. */}
      <button
        className={`sidebar-icon-btn ${activePanel === 'categories' ? 'active' : ''}`}
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation()
          onPanelToggle('categories')
        }}
        title="Browse categories"
      >
        📚
        {!collapsed && <span>Categories</span>}
      </button>

      {/* History icon button. Shows coming soon until authentication is built. */}
      <button
        className="sidebar-icon-btn"
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation()
          onPanelToggle('history')
        }}
        title="History - Coming soon"
      >
        🕐
        {!collapsed && <span>History</span>}
      </button>

      {/* Floating search panel. Appears when search icon is clicked. */}
      {activePanel === 'search' && (
        <div className="sidebar-panel" onClick={e => e.stopPropagation()}>
          {/* Panel header with title and close button */}
          <div className="panel-header">
            <span>Search Prompts</span>
            <button
              className="panel-close"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation()
                onPanelToggle('search')
              }}
            >✕</button>
          </div>
          {/* Search input. Calls onSearch as user types. */}
          <input
            className="panel-search-input"
            type="text"
            placeholder="Type a keyword..."
            value={searchQuery}
            onChange={onSearch}
            autoFocus
          />
        </div>
      )}

      {/* Floating categories panel. Appears when categories icon is clicked. */}
      {activePanel === 'categories' && (
        <div className="sidebar-panel" onClick={e => e.stopPropagation()}>
          {/* Panel header with title and close button */}
          <div className="panel-header">
            <span>Categories</span>
            <button
              className="panel-close"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation()
                onPanelToggle('categories')
              }}
            >✕</button>
          </div>
          {/* List of category buttons. Active category is highlighted orange. */}
          <div className="panel-categories">
            {categories.map(cat => (
              <button
                key={cat}
                className={`panel-category-btn ${activeCategory === cat ? 'active' : ''}`}
                style={{ cursor: 'pointer' }}
                onClick={(e) => {
                  e.stopPropagation()
                  onCategorySelect(cat)
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Floating history panel. Coming soon until authentication is built in Days 31 to 40. */}
      {activePanel === 'history' && (
        <div className="sidebar-panel" onClick={e => e.stopPropagation()}>
          <div className="panel-header">
            <span>History</span>
            <button
              className="panel-close"
              style={{ cursor: 'pointer' }}
              onClick={(e) => {
                e.stopPropagation()
                onPanelToggle('history')
              }}
            >✕</button>
          </div>
          <div className="panel-coming-soon">
            <p>🔒 Coming soon</p>
            <p>History will be available after you create an account.</p>
          </div>
        </div>
      )}

    </div>
  )
}

export default LibrarySidebar