// =============================================
//  AddTask.jsx — Form to add a new task
// =============================================

import { useState } from 'react'
import styles from './AddTask.module.css'

function AddTask({ onAdd }) {
  const [text, setText] = useState('')
  const [priority, setPriority] = useState('medium')
  const [error, setError] = useState('')
  const [isOpen, setIsOpen] = useState(true)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!text.trim()) {
      setError('Task cannot be empty!')
      return
    }
    if (text.trim().length < 3) {
      setError('Task must be at least 3 characters.')
      return
    }
    if (text.trim().length > 150) {
      setError('Task must be under 150 characters.')
      return
    }
    onAdd(text, priority)
    setText('')
    setPriority('medium')
    setError('')
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setText('')
      setError('')
    }
  }

  return (
    <div className={styles.addWrap}>
      <button
        className={styles.toggleBtn}
        onClick={() => setIsOpen(p => !p)}
        type="button"
      >
        <span className={`${styles.plusIcon} ${isOpen ? styles.rotated : ''}`}>+</span>
        {isOpen ? 'Hide Form' : 'Add New Task'}
      </button>

      {isOpen && (
        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          <div className={styles.inputRow}>
            <input
              type="text"
              className={`${styles.input} ${error ? styles.inputError : ''}`}
              placeholder="What needs to be done?"
              value={text}
              onChange={e => { setText(e.target.value); setError('') }}
              onKeyDown={handleKeyDown}
              maxLength={150}
              autoFocus
            />
            <div className={styles.charCount}>{text.length}/150</div>
          </div>

          {error && <p className={styles.error}>⚠ {error}</p>}

          <div className={styles.formBottom}>
            <div className={styles.priorityGroup}>
              <span className={styles.priorityLabel}>Priority:</span>
              {['high', 'medium', 'low'].map(p => (
                <button
                  key={p}
                  type="button"
                  className={`${styles.priorityBtn} ${styles[p]} ${priority === p ? styles.active : ''}`}
                  onClick={() => setPriority(p)}
                >
                  {p === 'high' && '🔴'}
                  {p === 'medium' && '🟡'}
                  {p === 'low' && '🟢'}
                  {' '}{p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
            <button type="submit" className={styles.submitBtn}>
              Add Task →
            </button>
          </div>
        </form>
      )}
    </div>
  )
}

export default AddTask
