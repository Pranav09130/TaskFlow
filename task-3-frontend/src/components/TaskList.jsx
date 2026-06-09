// =============================================
//  TaskList.jsx — Renders the list of tasks
// =============================================

import TaskItem from './TaskItem.jsx'
import styles from './TaskList.module.css'

function TaskList({ tasks, onToggle, onDelete, onEdit, filter, searchQuery }) {
  if (tasks.length === 0) {
    return (
      <div className={styles.empty}>
        <div className={styles.emptyIcon}>
          {searchQuery ? '🔍' : filter === 'completed' ? '🎉' : '✦'}
        </div>
        <p className={styles.emptyTitle}>
          {searchQuery
            ? `No tasks match "${searchQuery}"`
            : filter === 'completed'
            ? 'No completed tasks yet'
            : filter === 'active'
            ? 'No active tasks — you\'re all caught up!'
            : 'No tasks yet. Add one above!'}
        </p>
        <p className={styles.emptyHint}>
          {!searchQuery && filter === 'all' && 'Use the form above to add your first task.'}
        </p>
      </div>
    )
  }

  return (
    <ul className={styles.list}>
      {tasks.map((task, index) => (
        <TaskItem
          key={task.id}
          task={task}
          index={index}
          onToggle={onToggle}
          onDelete={onDelete}
          onEdit={onEdit}
          searchQuery={searchQuery}
        />
      ))}
    </ul>
  )
}

export default TaskList
