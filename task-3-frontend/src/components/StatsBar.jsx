// =============================================
//  StatsBar.jsx — Shows task statistics
// =============================================

import styles from './StatsBar.module.css'

function StatsBar({ stats }) {
  const percent = stats.total > 0
    ? Math.round((stats.completed / stats.total) * 100)
    : 0

  return (
    <div className={styles.stats}>
      <div className={styles.statCards}>
        <div className={styles.card}>
          <span className={styles.cardNum}>{stats.total}</span>
          <span className={styles.cardLabel}>Total</span>
        </div>
        <div className={`${styles.card} ${styles.cardGreen}`}>
          <span className={styles.cardNum}>{stats.completed}</span>
          <span className={styles.cardLabel}>Done</span>
        </div>
        <div className={`${styles.card} ${styles.cardAccent}`}>
          <span className={styles.cardNum}>{stats.active}</span>
          <span className={styles.cardLabel}>Active</span>
        </div>
        <div className={`${styles.card} ${styles.cardRed}`}>
          <span className={styles.cardNum}>{stats.high}</span>
          <span className={styles.cardLabel}>Urgent</span>
        </div>
      </div>

      {/* Progress bar */}
      <div className={styles.progressWrap}>
        <div className={styles.progressTop}>
          <span className={styles.progressLabel}>Overall Progress</span>
          <span className={styles.progressPct}>{percent}%</span>
        </div>
        <div className={styles.progressTrack}>
          <div
            className={styles.progressFill}
            style={{ width: `${percent}%` }}
          />
        </div>
      </div>
    </div>
  )
}

export default StatsBar
