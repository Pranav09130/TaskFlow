const express = require('express');
const router = express.Router();
const db = require('../db'); // ← changed
const authenticateToken = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', async (req, res) => {
  const userId = req.user.userId;
  try {
    // ← removed: const db = await getDb();
    const [rows] = await db.query('SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC', [userId]);
    res.json(rows);
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
    // ← removed: const db = await getDb();
    const [result] = await db.query(
      'INSERT INTO tasks (user_id, title, description, status, priority) VALUES (?, ?, ?, ?, ?)',
      [userId, taskTitle, description || '', status || 'pending', priority || 'medium']
    );
    const [rows] = await db.query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
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
    // ← removed: const db = await getDb();
    const [existing] = await db.query('SELECT * FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);
    if (existing.length === 0) return res.status(404).json({ error: 'Task not found or access denied.' });
    const t = existing[0];
    const newTitle = text || title || t.title;
    const newCompleted = completed !== undefined ? completed : t.completed;
    const newPriority = priority || t.priority;
    const newStatus = status || t.status;
    const newDesc = description !== undefined ? description : t.description;
    await db.query(
      'UPDATE tasks SET title = ?, description = ?, status = ?, priority = ?, completed = ? WHERE id = ? AND user_id = ?',
      [newTitle, newDesc, newStatus, newPriority, newCompleted, taskId, userId]
    );
    const [updated] = await db.query('SELECT * FROM tasks WHERE id = ?', [taskId]);
    res.json(updated[0]);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ error: 'Failed to update task.' });
  }
});

router.delete('/:id', async (req, res) => {
  const userId = req.user.userId;
  const taskId = req.params.id;
  try {
    // ← removed: const db = await getDb();
    const [existing] = await db.query('SELECT id FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);
    if (existing.length === 0) return res.status(404).json({ error: 'Task not found or access denied.' });
    await db.query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);
    res.json({ message: 'Task deleted successfully.' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ error: 'Failed to delete task.' });
  }
});

module.exports = router;