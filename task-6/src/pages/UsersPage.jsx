// =============================================
//  UsersPage.jsx — User Management (Task 4+6)
//  Full CRUD with MySQL via Express API
// =============================================

import { useState, useEffect } from 'react'
import { userAPI } from '../api/api.js'
import styles from './Page.module.css'

const EMPTY_FORM = { name: '', email: '', age: '' }

export default function UsersPage() {
  const [users, setUsers]       = useState([])
  const [loading, setLoading]   = useState(true)
  const [error, setError]       = useState('')
  const [form, setForm]         = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [editId, setEditId]     = useState(null)
  const [toast, setToast]       = useState('')
  const [search, setSearch]     = useState('')
  const [showForm, setShowForm] = useState(true)

  useEffect(() => { fetchUsers() }, [])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const res = await userAPI.getAll()
      setUsers(res.data)
      setError('')
    } catch (err) {
      setError('❌ Cannot connect to backend. Make sure server is running on port 5000.')
    } finally {
      setLoading(false)
    }
  }

  const showToast = (msg) => { setToast(msg); setTimeout(() => setToast(''), 3000) }

  const validate = () => {
    const errs = {}
    if (!form.name.trim() || form.name.trim().length < 2) errs.name = 'Name must be at least 2 characters.'
    if (!form.email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = 'Enter a valid email.'
    if (!form.age || isNaN(form.age) || form.age < 1 || form.age > 120) errs.age = 'Age must be between 1 and 120.'
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    try {
      if (editId) {
        const res = await userAPI.update(editId, form)
        setUsers(prev => prev.map(u => u.id === editId ? res.data : u))
        showToast('✓ User updated!')
      } else {
        const res = await userAPI.create(form)
        setUsers(prev => [res.data, ...prev])
        showToast('✓ User created!')
      }
      setForm(EMPTY_FORM); setEditId(null); setFormErrors({})
    } catch (err) { showToast('❌ ' + err.message) }
  }

  const handleEdit = (user) => {
    setEditId(user.id)
    setForm({ name: user.name, email: user.email, age: user.age })
    setShowForm(true)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"?`)) return
    try {
      await userAPI.delete(id)
      setUsers(prev => prev.filter(u => u.id !== id))
      showToast('🗑 User deleted!')
      if (editId === id) { setEditId(null); setForm(EMPTY_FORM) }
    } catch (err) { showToast('❌ ' + err.message) }
  }

  const handleCancel = () => { setEditId(null); setForm(EMPTY_FORM); setFormErrors({}) }

  const filtered = users.filter(u =>
    u.name.toLowerCase().includes(search.toLowerCase()) ||
    u.email.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <div className={styles.pageHead}>
        <div>
          <p className={styles.eyebrow}>Task 4 + 5 + 6</p>
          <h2 className={styles.pageTitle}>User <span>Management</span></h2>
          <p className={styles.pageSub}>CRUD operations connected to MySQL database</p>
        </div>
        <button className={styles.refreshBtn} onClick={fetchUsers}>↺ Refresh</button>
      </div>

      {/* Stats */}
      <div className={styles.statsRow}>
        <div className={styles.statCard}><span className={styles.statNum} style={{color:'var(--accent-light)'}}>{users.length}</span><span className={styles.statLabel}>Total Users</span></div>
        <div className={styles.statCard}><span className={styles.statNum} style={{color:'var(--green)'}}>MySQL</span><span className={styles.statLabel}>Database</span></div>
        <div className={styles.statCard}><span className={styles.statNum} style={{color:'var(--yellow)'}}>REST</span><span className={styles.statLabel}>API Type</span></div>
        <div className={styles.statCard}><span className={styles.statNum} style={{color:'var(--red)'}}>5000</span><span className={styles.statLabel}>API Port</span></div>
      </div>

      {/* Form */}
      <div className={styles.formCard}>
        <div className={styles.formCardHead}>
          <h3 className={styles.formCardTitle}>{editId ? '✎ Edit User' : '+ Add New User'}</h3>
          <button className={styles.toggleFormBtn} onClick={() => setShowForm(p => !p)}>{showForm ? 'Hide' : 'Show'}</button>
        </div>
        {showForm && (
          <form onSubmit={handleSubmit} noValidate>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label className={styles.label}>Full Name *</label>
                <input className={`${styles.input} ${formErrors.name ? styles.inputErr : ''}`} value={form.name} onChange={e => { setForm(p=>({...p,name:e.target.value})); setFormErrors(p=>({...p,name:''})) }} placeholder="Pranav Medhe" />
                {formErrors.name && <p className={styles.formErr}>⚠ {formErrors.name}</p>}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Email Address *</label>
                <input className={`${styles.input} ${formErrors.email ? styles.inputErr : ''}`} value={form.email} onChange={e => { setForm(p=>({...p,email:e.target.value})); setFormErrors(p=>({...p,email:''})) }} placeholder="pranav@example.com" type="email" />
                {formErrors.email && <p className={styles.formErr}>⚠ {formErrors.email}</p>}
              </div>
              <div className={styles.formGroup}>
                <label className={styles.label}>Age *</label>
                <input className={`${styles.input} ${formErrors.age ? styles.inputErr : ''}`} value={form.age} onChange={e => { setForm(p=>({...p,age:e.target.value})); setFormErrors(p=>({...p,age:''})) }} placeholder="21" type="number" min="1" max="120" />
                {formErrors.age && <p className={styles.formErr}>⚠ {formErrors.age}</p>}
              </div>
            </div>
            <div className={styles.formBtns}>
              <button type="submit" className={styles.addBtn}>{editId ? 'Update User →' : 'Create User →'}</button>
              {editId && <button type="button" className={styles.cancelBtn} onClick={handleCancel}>Cancel</button>}
            </div>
          </form>
        )}
      </div>

      {/* Search */}
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>⌕</span>
        <input className={styles.searchInput} value={search} onChange={e => setSearch(e.target.value)} placeholder="Search users by name or email..." />
        {search && <button className={styles.clearSearch} onClick={() => setSearch('')}>✕</button>}
      </div>

      {error && <div className={styles.errorBox}>{error}</div>}
      {loading && <div className={styles.loading}><div className={styles.spinner} />Loading from database...</div>}

      {/* Users Table */}
      {!loading && !error && (
        <div className={styles.tableWrap}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Age</th>
                <th>Created</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="6" className={styles.emptyRow}>No users found.</td></tr>
              ) : (
                filtered.map(user => (
                  <tr key={user.id} className={editId === user.id ? styles.editingRow : ''}>
                    <td><span className={styles.idBadge}>#{user.id}</span></td>
                    <td><strong>{user.name}</strong></td>
                    <td><a href={`mailto:${user.email}`} className={styles.emailLink}>{user.email}</a></td>
                    <td>{user.age}</td>
                    <td className={styles.dateCell}>{new Date(user.created_at).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'})}</td>
                    <td>
                      <div className={styles.rowActions}>
                        <button className={styles.editBtn} onClick={() => handleEdit(user)}>✎ Edit</button>
                        <button className={styles.deleteBtn} onClick={() => handleDelete(user.id, user.name)}>✕ Delete</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {toast && <div className={styles.toast}>{toast}</div>}
    </div>
  )
}
