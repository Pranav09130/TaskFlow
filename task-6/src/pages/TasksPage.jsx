// =============================================
//  TasksPage.jsx — Full Stack Tasks Manager
//  Fetches from MySQL via Express API
// =============================================

import { useState, useEffect } from 'react'
import { taskAPI } from '../api/api.js'
import styles from './Page.module.css'

const PRIORITY = { high: { color: 'var(--red)', dot: '🔴' }, medium: { color: 'var(--yellow)', dot: '🟡' }, low: { color: 'var(--green)', dot: '🟢' } }

export default function TasksPage() {
  const [tasks, setTasks]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [filter, setFilter]     = useState('all')
  const [newText, setNewText]   = useState('')
  const [newPri, setNewPri]     = useState('medium')
  const [formErr, setFormErr]   = useState('')
  const [editId, setEditId]     = useState(null)
  const [editText, setEditText] = useState('')
  const [editPri, setEditPri]   = useState('medium')
  const [toast, setToast]       = useState('')

  // Load tasks from backend
  useEffect(() => { fetchTasks() }, [])

  const fetchTasks = async () => {
    try {
      setLoading(true)
      const res = await taskAPI.getAll()
      setTasks(res.data)
      setError('')
    } catch (err) {
      setError('❌ Cannot connect to backend. Make sure server is running on port 5000.')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg) => {
    setToast(msg)
    setTimeout(() => setToast(''), 3000)
  }

  // Add task
  const handleAdd = async (e) => {
    e.preventDefault()
    if (!newText.trim() || newText.trim().length < 3) { setFormErr('Task must be at least 3 characters.'); return }
    try {
      const res = await taskAPI.create({ text: newText.trim(), priority: newPri })
      setTasks(prev => [res.data, ...prev])
      setNewText(''); setFormErr('')
      showToast('✓ Task added!')
    } catch (err) { setFormErr(err.message) }
  }

  // Toggle complete
  const handleToggle = async (id) => {
    try {
      const res = await taskAPI.toggle(id)
      setTasks(prev => prev.map(t => t.id === id ? res.data : t))
    } catch (err) { showToast('❌ ' + err.message) }
  }

  // Delete task
  const handleDelete = async (id) => {
    try {
      await taskAPI.delete(id)
      setTasks(prev => prev.filter(t => t.id !== id))
      showToast('🗑 Task deleted!')
    } catch (err) { showToast('❌ ' + err.message) }
  }

  // Save edit
  const handleSaveEdit = async (id) => {
    if (!editText.trim() || editText.trim().length < 3) return
    try {
      const res = await taskAPI.update(id, { text: editText.trim(), priority: editPri })
      setTasks(prev => prev.map(t => t.id === id ? res.data : t))
      setEditId(null)
      showToast('✓ Task updated!')
    } catch (err) { showToast('❌ ' + err.message) }
  }

  const filtered = tasks.filter(t =>
    filter === 'all' ? true : filter === 'active' ? !t.completed : t.completed
  )
  const stats = { total: tasks.length, done: tasks.filter(t => t.completed).length, active: tasks.filter(t => !t.completed).length }
  const pct = stats.total > 0 ? Math.round((stats.done / stats.total) * 100) : 0

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>Task 3 + 4 + 5 + 6</p>
          <h2 className={styles.pageTitle}>Task <span>Manager</span></h2>
          <p className={styles.pageSub}>Connected to MySQL via Express REST API</p>
        </div>
        <button className={styles.refreshBtn} onClick={fetchTasks}>↺ Refresh</button>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}><span className={styles.statNum} style={{color:'var(--accent-light)'}}>{stats.total}</span><span className={styles.statLabel}>Total</span></div>
        <div className={styles.statCard}><span className={styles.statNum} style={{color:'var(--green)'}}>{stats.done}</span><span className={styles.statLabel}>Done</span></div>
        <div className={styles.statCard}><span className={styles.statNum} style={{color:'var(--yellow)'}}>{stats.active}</span><span className={styles.statLabel}>Active</span></div>
        <div className={styles.statCard} style={{gridColumn:'span 1'}}>
          <span className={styles.statNum} style={{color:'var(--accent)'}}>{pct}%</span>
          <span className={styles.statLabel}>Progress</span>
        </div>
      </div>
      <div className={styles.progressTrack}><div className={styles.progressFill} style={{width:`${pct}%`}} /></div>

      {/* Add Task Form */}
      <form className={styles.form} onSubmit={handleAdd}>
        <div className={styles.formRow}>
          <input
            className={`${styles.input} ${formErr ? styles.inputErr : ''}`}
            value={newText}
            onChange={e => { setNewText(e.target.value); setFormErr('') }}
            placeholder="Add a new task..."
            maxLength={255}
          />
          <select className={styles.select} value={newPri} onChange={e => setNewPri(e.target.value)}>
            <option value="high">🔴 High</option>
            <option value="medium">🟡 Medium</option>
            <option value="low">🟢 Low</option>
          </select>
          <button type="submit" className={styles.addBtn}>Add Task →</button>
        </div>
        {formErr && <p className={styles.formErr}>⚠ {formErr}</p>}
      </form>

      {/* Filter tabs */}
      <div className={styles.filterRow}>
        {['all','active','completed'].map(f => (
          <button key={f} className={`${styles.filterTab} ${filter===f ? styles.filterActive : ''}`} onClick={() => setFilter(f)}>
            {f.charAt(0).toUpperCase()+f.slice(1)}
          </button>
        ))}
        <span className={styles.count}>{filtered.length} task{filtered.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Error */}
      {error && <div className={styles.errorBox}>{error}</div>}

      {/* Loading */}
      {loading && <div className={styles.loading}><div className={styles.spinner} />Loading from database...</div>}

      {/* Task List */}
      {!loading && !error && (
        <ul className={styles.list}>
          {filtered.length === 0 && (
            <div className={styles.empty}>
              <p>✦</p>
              <p>{filter === 'completed' ? 'No completed tasks yet!' : filter === 'active' ? 'All tasks done! 🎉' : 'No tasks yet. Add one above!'}</p>
            </div>
          )}
          {filtered.map(task => (
            <li key={task.id} className={`${styles.taskItem} ${task.completed ? styles.taskDone : ''}`} style={{'--pc': PRIORITY[task.priority]?.color || 'var(--border)'}}>
              {editId === task.id ? (
                <div className={styles.editMode}>
                  <input className={styles.editInput} value={editText} onChange={e => setEditText(e.target.value)} autoFocus onKeyDown={e => { if(e.key==='Enter') handleSaveEdit(task.id); if(e.key==='Escape') setEditId(null) }} />
                  <div className={styles.editBottom}>
                    <div className={styles.editPriority}>
                      {['high','medium','low'].map(p => (
                        <button key={p} type="button" className={`${styles.pBtn} ${editPri===p ? styles.pActive : ''}`} style={editPri===p ? {borderColor:PRIORITY[p].color,color:PRIORITY[p].color}:{}} onClick={() => setEditPri(p)}>
                          {PRIORITY[p].dot} {p}
                        </button>
                      ))}
                    </div>
                    <div className={styles.editActions}>
                      <button className={styles.saveBtn} onClick={() => handleSaveEdit(task.id)}>Save</button>
                      <button className={styles.cancelBtn} onClick={() => setEditId(null)}>Cancel</button>
                    </div>
                  </div>
                </div>
              ) : (
                <div className={styles.taskView}>
                  <button className={`${styles.checkbox} ${task.completed ? styles.checked : ''}`} onClick={() => handleToggle(task.id)}>
                    {task.completed && '✓'}
                  </button>
                  <div className={styles.taskContent}>
                    <p className={`${styles.taskText} ${task.completed ? styles.strike : ''}`}>{task.text}</p>
                    <div className={styles.taskMeta}>
                      <span className={styles.priorityTag} style={{color:PRIORITY[task.priority]?.color, borderColor:PRIORITY[task.priority]?.color}}>
                        {PRIORITY[task.priority]?.dot} {task.priority}
                      </span>
                      <span className={styles.taskId}>id: {task.id}</span>
                      {task.completed && <span className={styles.doneBadge}>✓ Done</span>}
                    </div>
                  </div>
                  <div className={styles.taskActions}>
                    <button className={styles.editBtn} onClick={() => { setEditId(task.id); setEditText(task.text); setEditPri(task.priority) }}>✎</button>
                    <button className={styles.deleteBtn} onClick={() => handleDelete(task.id)}>✕</button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      {/* Toast */}
      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  )
}
