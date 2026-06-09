// =============================================
//  TaskItem.jsx — Single task row with edit
// =============================================

import { useState } from 'react'
import styles from './TaskItem.module.css'

const PRIORITY_CONFIG = {
  high:   { color: 'var(--red)',    label: 'High',   dot: '🔴' },
  medium: { color: 'var(--yellow)', label: 'Medium', dot: '🟡' },
  low:    { color: 'var(--green)',  label: 'Low',    dot: '🟢' },
}

// Highlight matching search text
function HighlightText({ text, query }) {
  if (!query.trim()) return <>{text}</>
  const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi')
  const parts = text.split(regex)
  return (
    <>
      {parts.map((part, i) =>
        regex.test(part)
          ? <mark key={i} className={styles.highlight}>{part}</mark>
          : part
      )}
    </>
  )
}

function TaskItem({ task, index, onToggle, onDelete, onEdit, searchQuery }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editText, setEditText] = useState(task.text)
  const [editPriority, setEditPriority] = useState(task.priority)
  const [editError, setEditError] = useState('')
  const [confirmDelete, setConfirmDelete] = useState(false)

  const config = PRIORITY_CONFIG[task.priority]

  const saveEdit = () => {
    if (!editText.trim()) { setEditError('Task cannot be empty!'); return }
    if (editText.trim().length < 3) { setEditError('Min 3 characters.'); return }
    onEdit(task.id, editText.trim(), editPriority)
    setIsEditing(false)
    setEditError('')
  }

  const cancelEdit = () => {
    setEditText(task.text)
    setEditPriority(task.priority)
    setIsEditing(false)
    setEditError('')
  }

  const handleDeleteClick = () => {
    if (confirmDelete) { onDelete(task.id) }
    else {
      setConfirmDelete(true)
      setTimeout(() => setConfirmDelete(false), 3000)
    }
  }

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })
  }

  return (
    <li
      className={`${styles.item} ${task.completed ? styles.done : ''}`}
      style={{ '--priority-color': config.color, animationDelay: `${index * 0.04}s` }}
    >
      {isEditing ? (
        /* ---- EDIT MODE ---- */
        <div className={styles.editMode}>
          <input
            className={`${styles.editInput} ${editError ? styles.inputError : ''}`}
            value={editText}
            onChange={e => { setEditText(e.target.value); setEditError('') }}
            onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') cancelEdit() }}
            autoFocus
            maxLength={150}
          />
          {editError && <p className={styles.editError}>⚠ {editError}</p>}
          <div className={styles.editBottom}>
            <div className={styles.editPriority}>
              {['high', 'medium', 'low'].map(p => (
                <button
                  key={p}
                  type="button"
                  className={`${styles.pBtn} ${editPriority === p ? styles.pActive : ''}`}
                  style={editPriority === p ? { borderColor: PRIORITY_CONFIG[p].color, color: PRIORITY_CONFIG[p].color } : {}}
                  onClick={() => setEditPriority(p)}
                >
                  {PRIORITY_CONFIG[p].dot} {p}
                </button>
              ))}
            </div>
            <div className={styles.editActions}>
              <button className={styles.saveBtn} onClick={saveEdit}>Save</button>
              <button className={styles.cancelBtn} onClick={cancelEdit}>Cancel</button>
            </div>
          </div>
        </div>
      ) : (
        /* ---- VIEW MODE ---- */
        <div className={styles.viewMode}>
          <button
            className={`${styles.checkbox} ${task.completed ? styles.checked : ''}`}
            onClick={() => onToggle(task.id)}
            aria-label={task.completed ? 'Mark incomplete' : 'Mark complete'}
          >
            {task.completed && <span className={styles.checkmark}>✓</span>}
          </button>

          <div className={styles.content}>
            <p className={`${styles.text} ${task.completed ? styles.strikethrough : ''}`}>
              <HighlightText text={task.text} query={searchQuery} />
            </p>
            <div className={styles.meta}>
              <span className={styles.priorityTag} style={{ color: config.color, borderColor: config.color }}>
                {config.dot} {config.label}
              </span>
              <span className={styles.date}>{formatDate(task.createdAt)}</span>
              {task.completed && <span className={styles.doneBadge}>✓ Done</span>}
            </div>
          </div>

          <div className={styles.itemActions}>
            <button
              className={styles.editBtn}
              onClick={() => setIsEditing(true)}
              title="Edit task"
            >✎</button>
            <button
              className={`${styles.deleteBtn} ${confirmDelete ? styles.confirmDelete : ''}`}
              onClick={handleDeleteClick}
              title={confirmDelete ? 'Click again to confirm' : 'Delete task'}
            >
              {confirmDelete ? '?' : '✕'}
            </button>
          </div>
        </div>
      )}
    </li>
  )
}

export default TaskItem
