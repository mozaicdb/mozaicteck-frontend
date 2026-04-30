import { useState } from 'react'

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
  const [collapsed, setCollapsed] = useState(true)

  function handleToggle(e) {
    e.stopPropagation()
    setCollapsed(!collapsed)
    if (activePanel) {
      onPanelToggle(activePanel)
    }
  }

  return (
    <div
      className={`library-sidebar ${collapsed ? 'collapsed' : 'expanded'} ${mobileOpen ? 'mobile-open' : ''}`}
      onClick={e => e.stopPropagation()}
    >

      {/* Collapse / expand arrow */}
      <button
        className="sidebar-toggle"
        style={{ cursor: 'pointer' }}
        onClick={handleToggle}
        title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
      >
        {collapsed ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="9 18 15 12 9 6" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <polyline points="15 18 9 12 15 6" />
          </svg>
        )}
      </button>

      {/* Search */}
      <button
        className={`sidebar-icon-btn ${activePanel === 'search' ? 'active' : ''}`}
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation()
          onPanelToggle('search')
        }}
        title="Search prompts"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="11" cy="11" r="8" />
          <line x1="21" y1="21" x2="16.65" y2="16.65" />
        </svg>
        {!collapsed && <span>Search</span>}
      </button>

      {/* Categories */}
      <button
        className={`sidebar-icon-btn ${activePanel === 'categories' ? 'active' : ''}`}
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation()
          onPanelToggle('categories')
        }}
        title="Browse categories"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="3" y="3" width="7" height="7" />
          <rect x="14" y="3" width="7" height="7" />
          <rect x="3" y="14" width="7" height="7" />
          <rect x="14" y="14" width="7" height="7" />
        </svg>
        {!collapsed && <span>Categories</span>}
      </button>

      {/* History */}
      <button
        className="sidebar-icon-btn"
        style={{ cursor: 'pointer' }}
        onClick={(e) => {
          e.stopPropagation()
          onPanelToggle('history')
        }}
        title="History - Coming soon"
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10" />
          <polyline points="12 6 12 12 16 14" />
        </svg>
        {!collapsed && <span>History</span>}
      </button>

    </div>
  )
}

export default LibrarySidebar