// =============================================
//  Header.jsx — Top bar with search & actions
// =============================================

import styles from './Header.module.css'

function Header({ searchQuery, onSearch, onMarkAll, onClearCompleted, hasCompleted, allCompleted }) {
  return (
    <header className={styles.header}>
      <div className={styles.top}>
        <div className={styles.brand}>
          <span className={styles.logo}>✦</span>
          <div>
            <h1 className={styles.title}>TaskFlow</h1>
            <p className={styles.subtitle}>Pranav Medhe</p>
          </div>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.actionBtn}
            onClick={onMarkAll}
            title={allCompleted ? 'Mark all active' : 'Mark all complete'}
          >
            {allCompleted ? '↺ Reset All' : '✓ Mark All'}
          </button>
          {hasCompleted && (
            <button
              className={`${styles.actionBtn} ${styles.danger}`}
              onClick={onClearCompleted}
              title="Clear completed tasks"
            >
              🗑 Clear Done
            </button>
          )}
        </div>
      </div>

      {/* Search bar */}
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>⌕</span>
        <input
          type="text"
          className={styles.searchInput}
          placeholder="Search tasks..."
          value={searchQuery}
          onChange={e => onSearch(e.target.value)}
        />
        {searchQuery && (
          <button className={styles.clearSearch} onClick={() => onSearch('')}>✕</button>
        )}
      </div>
    </header>
  )
}

export default Header
