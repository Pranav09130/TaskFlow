// =============================================
//  App.jsx — Root with Navigation
//  Task 6: Full Stack Application
// =============================================

import { Routes, Route, NavLink } from 'react-router-dom'
import TasksPage from './pages/TasksPage.jsx'
import UsersPage from './pages/UsersPage.jsx'
import styles from './App.module.css'

function App() {
  return (
    <div className={styles.app}>
      {/* Background glows */}
      <div className={styles.glow1} />
      <div className={styles.glow2} />

      {/* Navbar */}
      <nav className={styles.nav}>
        <div className={styles.navInner}>
          <div className={styles.brand}>
            <span className={styles.brandIcon}>✦</span>
            <div>
              <h1 className={styles.brandTitle}>TaskFlow</h1>
              <p className={styles.brandSub}>SaiKet Systems · Task 6 · Pranav Medhe</p>
            </div>
          </div>
          <div className={styles.navLinks}>
            <NavLink
              to="/"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              ✓ Tasks
            </NavLink>
            <NavLink
              to="/users"
              className={({ isActive }) => `${styles.navLink} ${isActive ? styles.active : ''}`}
            >
              👤 Users
            </NavLink>
          </div>
          <div className={styles.apiStatus}>
            <span className={styles.dot}></span>
            <span>API: localhost:5000</span>
          </div>
        </div>
      </nav>

      {/* Pages */}
      <main className={styles.main}>
        <Routes>
          <Route path="/"      element={<TasksPage />} />
          <Route path="/users" element={<UsersPage />} />
        </Routes>
      </main>
    </div>
  )
}

export default App
