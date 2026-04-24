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
  searchQuery,
  mobileOpen,
  onMobileClose,
  panelActive
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
      className={`library-sidebar ${collapsed ? 'collapsed' : 'expanded'} ${mobileOpen ? 'mobile-open' : ''}`}
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

    </div>
  )
}

export default LibrarySidebar