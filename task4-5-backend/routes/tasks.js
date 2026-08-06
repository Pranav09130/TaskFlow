const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', async (req, res) => {
  const userId = req.user.userId;
  try {
    const result = await db.query('SELECT * FROM tasks WHERE user_id = $1 ORDER BY created_at DESC', [userId]);
    res.json(result.rows);
  } catch (err) {
    console.error('Fetch tasks error:', err);
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
});

router.post('/', async (req, res) => {
  const userId = req.user.userId;
  const { text, title, priority, description, status } = req.body;
  const taskTitle = text || title;
  if (!taskTitle) return res.status(400).json({ error: 'Task title is required.' });
  try {
    const result = await db.query(
      'INSERT INTO tasks (user_id, title, description, status, priority) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [userId, taskTitle, description || '', status || 'pending', priority || 'medium']
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ error: 'Failed to create task.' });
  }
});

router.put('/:id', async (req, res) => {
  const userId = req.user.userId;
  const taskId = req.params.id;
  const { text, title, priority, description, status, completed } = req.body;
  try {
    const existing = await db.query('SELECT * FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Task not found or access denied.' });
    const t = existing.rows[0];
    const newTitle = text || title || t.title;
    const newCompleted = completed !== undefined ? completed : t.completed;
    const newPriority = priority || t.priority;
    const newStatus = status || t.status;
    const newDesc = description !== undefined ? description : t.description;
    const updated = await db.query(
      'UPDATE tasks SET title = $1, description = $2, status = $3, priority = $4, completed = $5 WHERE id = $6 AND user_id = $7 RETURNING *',
      [newTitle, newDesc, newStatus, newPriority, newCompleted, taskId, userId]
    );
    res.json(updated.rows[0]);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ error: 'Failed to update task.' });
  }
});

router.delete('/:id', async (req, res) => {
  const userId = req.user.userId;
  const taskId = req.params.id;
  try {
    const existing = await db.query('SELECT id FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
    if (existing.rows.length === 0) return res.status(404).json({ error: 'Task not found or access denied.' });
    await db.query('DELETE FROM tasks WHERE id = $1 AND user_id = $2', [taskId, userId]);
    res.json({ message: 'Task deleted successfully.' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ error: 'Failed to delete task.' });
  }
});

module.exports = router;
