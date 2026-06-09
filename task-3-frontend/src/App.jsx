// =============================================
//  TASKFLOW — App.jsx
//  Root component — manages all state
// =============================================

import { useState, useEffect } from 'react'
import Header from './components/Header.jsx'
import AddTask from './components/AddTask.jsx'
import FilterBar from './components/FilterBar.jsx'
import TaskList from './components/TaskList.jsx'
import StatsBar from './components/StatsBar.jsx'
import styles from './App.module.css'

// Initial sample tasks
const INITIAL_TASKS = [
  { id: 1, text: 'Complete Task 1 — Portfolio Website', priority: 'high', completed: true, createdAt: new Date('2024-01-01') },
  { id: 2, text: 'Complete Task 2 — E-Commerce Landing Page', priority: 'high', completed: true, createdAt: new Date('2024-01-02') },
  { id: 3, text: 'Complete Task 3 — React To-Do App', priority: 'high', completed: false, createdAt: new Date('2024-01-03') },
  { id: 4, text: 'Complete Task 4 — REST API with Node.js', priority: 'medium', completed: false, createdAt: new Date('2024-01-04') },
  { id: 5, text: 'Complete Task 5 — Database Integration', priority: 'medium', completed: false, createdAt: new Date('2024-01-05') },
  { id: 6, text: 'Complete Task 6 — Full Stack Application', priority: 'low', completed: false, createdAt: new Date('2024-01-06') },
]

function App() {
  // Load from localStorage or use initial tasks
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('taskflow-tasks')
    if (saved) {
      const parsed = JSON.parse(saved)
      return parsed.map(t => ({ ...t, createdAt: new Date(t.createdAt) }))
    }
    return INITIAL_TASKS
  })

  const [filter, setFilter] = useState('all')       // all | active | completed
  const [priority, setPriority] = useState('all')   // all | high | medium | low
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState('newest')    // newest | oldest | priority | alpha

  // Persist to localStorage on every change
  useEffect(() => {
    localStorage.setItem('taskflow-tasks', JSON.stringify(tasks))
  }, [tasks])

  // ---- CRUD Operations ----

  const addTask = (text, priorityLevel) => {
    const newTask = {
      id: Date.now(),
      text: text.trim(),
      priority: priorityLevel,
      completed: false,
      createdAt: new Date(),
    }
    setTasks(prev => [newTask, ...prev])
  }

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id))
  }

  const toggleTask = (id) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t)
    )
  }

  const editTask = (id, newText, newPriority) => {
    setTasks(prev =>
      prev.map(t => t.id === id ? { ...t, text: newText, priority: newPriority } : t)
    )
  }

  const clearCompleted = () => {
    setTasks(prev => prev.filter(t => !t.completed))
  }

  const markAllComplete = () => {
    const allDone = tasks.every(t => t.completed)
    setTasks(prev => prev.map(t => ({ ...t, completed: !allDone })))
  }

  // ---- Filtering & Sorting ----
  const getFilteredTasks = () => {
    let result = [...tasks]

    // Status filter
    if (filter === 'active') result = result.filter(t => !t.completed)
    if (filter === 'completed') result = result.filter(t => t.completed)

    // Priority filter
    if (priority !== 'all') result = result.filter(t => t.priority === priority)

    // Search
    if (searchQuery.trim()) {
      result = result.filter(t =>
        t.text.toLowerCase().includes(searchQuery.toLowerCase())
      )
    }

    // Sort
    const priorityOrder = { high: 0, medium: 1, low: 2 }
    if (sortBy === 'newest') result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (sortBy === 'oldest') result.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt))
    if (sortBy === 'priority') result.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority])
    if (sortBy === 'alpha') result.sort((a, b) => a.text.localeCompare(b.text))

    return result
  }

  const filteredTasks = getFilteredTasks()
  const stats = {
    total: tasks.length,
    completed: tasks.filter(t => t.completed).length,
    active: tasks.filter(t => !t.completed).length,
    high: tasks.filter(t => t.priority === 'high' && !t.completed).length,
  }

  return (
    <div className={styles.app}>
      {/* Background decoration */}
      <div className={styles.bgGlow1} />
      <div className={styles.bgGlow2} />

      <div className={styles.container}>
        <Header
          searchQuery={searchQuery}
          onSearch={setSearchQuery}
          onMarkAll={markAllComplete}
          onClearCompleted={clearCompleted}
          hasCompleted={stats.completed > 0}
          allCompleted={stats.completed === stats.total && stats.total > 0}
        />

        <StatsBar stats={stats} />

        <AddTask onAdd={addTask} />

        <FilterBar
          filter={filter}
          onFilter={setFilter}
          priority={priority}
          onPriority={setPriority}
          sortBy={sortBy}
          onSort={setSortBy}
          count={filteredTasks.length}
        />

        <TaskList
          tasks={filteredTasks}
          onToggle={toggleTask}
          onDelete={deleteTask}
          onEdit={editTask}
          filter={filter}
          searchQuery={searchQuery}
        />
      </div>
    </div>
  )
}

export default App
