// =============================================
//  taskRoutes.js — Task CRUD API Endpoints
//  Task 3+4+5: Todo App integrated with PostgreSQL
//
//  NOTE: not mounted in server.js (server.js uses routes/tasks.js, the
//  auth-protected version). This file matches the OLDER tasks schema
//  (text, priority, completed — no user_id) from before auth was added.
//  Kept for reference. If you want to use it, it needs its own table
//  shape, since it isn't compatible with the tasks table setup.sql creates.
// =============================================

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/tasks — Get ALL tasks
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/tasks/:id — Get ONE task
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Task not found.' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/tasks — Create task
router.post('/', async (req, res) => {
  const { text, priority = 'medium' } = req.body;
  if (!text || text.trim().length < 3)
    return res.status(400).json({ success: false, message: 'Task text must be at least 3 characters.' });
  const validPriorities = ['high', 'medium', 'low'];
  if (!validPriorities.includes(priority))
    return res.status(400).json({ success: false, message: 'Priority must be high, medium, or low.' });
  try {
    const result = await db.query(
      'INSERT INTO tasks (text, priority) VALUES ($1, $2) RETURNING *',
      [text.trim(), priority]
    );
    res.status(201).json({ success: true, message: 'Task created!', data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/tasks/:id — Update task (text, priority, completed)
router.put('/:id', async (req, res) => {
  const { text, priority, completed } = req.body;
  try {
    const existing = await db.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (existing.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Task not found.' });

    const updatedText      = text      !== undefined ? text.trim() : existing.rows[0].text;
    const updatedPriority  = priority  !== undefined ? priority    : existing.rows[0].priority;
    const updatedCompleted = completed !== undefined ? completed   : existing.rows[0].completed;

    if (updatedText.length < 3)
      return res.status(400).json({ success: false, message: 'Task text must be at least 3 characters.' });

    const updated = await db.query(
      'UPDATE tasks SET text = $1, priority = $2, completed = $3 WHERE id = $4 RETURNING *',
      [updatedText, updatedPriority, updatedCompleted, req.params.id]
    );
    res.json({ success: true, message: 'Task updated!', data: updated.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/tasks/:id/toggle — Toggle completed status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const existing = await db.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (existing.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Task not found.' });
    const newStatus = !existing.rows[0].completed;
    const updated = await db.query(
      'UPDATE tasks SET completed = $1 WHERE id = $2 RETURNING *',
      [newStatus, req.params.id]
    );
    res.json({ success: true, message: `Task marked as ${newStatus ? 'completed' : 'active'}!`, data: updated.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/tasks/:id — Delete task
router.delete('/:id', async (req, res) => {
  try {
    const existing = await db.query('SELECT * FROM tasks WHERE id = $1', [req.params.id]);
    if (existing.rows.length === 0)
      return res.status(404).json({ success: false, message: 'Task not found.' });
    await db.query('DELETE FROM tasks WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: 'Task deleted!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
