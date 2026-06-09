// =============================================
//  FilterBar.jsx — Filter, sort, and count bar
// =============================================

import styles from './FilterBar.module.css'

function FilterBar({ filter, onFilter, priority, onPriority, sortBy, onSort, count }) {
  return (
    <div className={styles.bar}>
      <div className={styles.left}>
        {/* Status filter */}
        <div className={styles.tabGroup}>
          {['all', 'active', 'completed'].map(f => (
            <button
              key={f}
              className={`${styles.tab} ${filter === f ? styles.active : ''}`}
              onClick={() => onFilter(f)}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>

        {/* Priority filter */}
        <div className={styles.tabGroup}>
          {['all', 'high', 'medium', 'low'].map(p => (
            <button
              key={p}
              className={`${styles.tab} ${styles[p]} ${priority === p ? styles.active : ''}`}
              onClick={() => onPriority(p)}
            >
              {p === 'all' ? '● All' : p === 'high' ? '🔴' : p === 'medium' ? '🟡' : '🟢'}
              {p !== 'all' && ` ${p.charAt(0).toUpperCase() + p.slice(1)}`}
            </button>
          ))}
        </div>
      </div>

      <div className={styles.right}>
        <span className={styles.count}>{count} task{count !== 1 ? 's' : ''}</span>
        <select
          className={styles.sortSelect}
          value={sortBy}
          onChange={e => onSort(e.target.value)}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="priority">By Priority</option>
          <option value="alpha">A → Z</option>
        </select>
      </div>
    </div>
  )
}

export default FilterBar
