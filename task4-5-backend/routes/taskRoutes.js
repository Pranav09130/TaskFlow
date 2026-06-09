// =============================================
//  taskRoutes.js — Task CRUD API Endpoints
//  Task 3+4+5: Todo App integrated with MySQL
// =============================================

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// GET /api/tasks — Get ALL tasks
router.get('/', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tasks ORDER BY created_at DESC');
    res.json({ success: true, count: rows.length, data: rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/tasks/:id — Get ONE task
router.get('/:id', async (req, res) => {
  try {
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (rows.length === 0)
      return res.status(404).json({ success: false, message: 'Task not found.' });
    res.json({ success: true, data: rows[0] });
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
    const [result] = await db.query(
      'INSERT INTO tasks (text, priority) VALUES (?, ?)',
      [text.trim(), priority]
    );
    const [newTask] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json({ success: true, message: 'Task created!', data: newTask[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/tasks/:id — Update task (text, priority, completed)
router.put('/:id', async (req, res) => {
  const { text, priority, completed } = req.body;
  try {
    const [existing] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (existing.length === 0)
      return res.status(404).json({ success: false, message: 'Task not found.' });

    const updatedText      = text      !== undefined ? text.trim()  : existing[0].text;
    const updatedPriority  = priority  !== undefined ? priority     : existing[0].priority;
    const updatedCompleted = completed !== undefined ? completed     : existing[0].completed;

    if (updatedText.length < 3)
      return res.status(400).json({ success: false, message: 'Task text must be at least 3 characters.' });

    await db.query(
      'UPDATE tasks SET text = ?, priority = ?, completed = ? WHERE id = ?',
      [updatedText, updatedPriority, updatedCompleted, req.params.id]
    );
    const [updated] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Task updated!', data: updated[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// PATCH /api/tasks/:id/toggle — Toggle completed status
router.patch('/:id/toggle', async (req, res) => {
  try {
    const [existing] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (existing.length === 0)
      return res.status(404).json({ success: false, message: 'Task not found.' });
    const newStatus = !existing[0].completed;
    await db.query('UPDATE tasks SET completed = ? WHERE id = ?', [newStatus, req.params.id]);
    const [updated] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: `Task marked as ${newStatus ? 'completed' : 'active'}!`, data: updated[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/tasks/:id — Delete task
router.delete('/:id', async (req, res) => {
  try {
    const [existing] = await db.query('SELECT * FROM tasks WHERE id = ?', [req.params.id]);
    if (existing.length === 0)
      return res.status(404).json({ success: false, message: 'Task not found.' });
    await db.query('DELETE FROM tasks WHERE id = ?', [req.params.id]);
    res.json({ success: true, message: 'Task deleted!' });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
