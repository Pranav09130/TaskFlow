const express = require('express');
const router = express.Router();
const db = require('../db');
const authenticateToken = require('../middleware/auth');

// All task routes are protected — user must be logged in
router.use(authenticateToken);

// GET /api/tasks — get only the logged-in user's tasks
router.get('/', async (req, res) => {
  const userId = req.user.userId;
  try {
    const [rows] = await db.promise().query(
      'SELECT * FROM tasks WHERE user_id = ? ORDER BY created_at DESC',
      [userId]
    );
    res.json(rows);
  } catch (err) {
    console.error('Fetch tasks error:', err);
    res.status(500).json({ error: 'Failed to fetch tasks.' });
  }
});

// POST /api/tasks — create a task for the logged-in user
router.post('/', async (req, res) => {
  const userId = req.user.userId;
  const { title, description, status } = req.body;

  if (!title) {
    return res.status(400).json({ error: 'Task title is required.' });
  }

  try {
    const [result] = await db.promise().query(
      'INSERT INTO tasks (user_id, title, description, status) VALUES (?, ?, ?, ?)',
      [userId, title, description || '', status || 'pending']
    );
    const [rows] = await db.promise().query('SELECT * FROM tasks WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Create task error:', err);
    res.status(500).json({ error: 'Failed to create task.' });
  }
});

// PUT /api/tasks/:id — update a task (only if it belongs to this user)
router.put('/:id', async (req, res) => {
  const userId = req.user.userId;
  const taskId = req.params.id;
  const { title, description, status } = req.body;

  try {
    const [existing] = await db.promise().query(
      'SELECT * FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Task not found or access denied.' });
    }

    await db.promise().query(
      'UPDATE tasks SET title = ?, description = ?, status = ? WHERE id = ? AND user_id = ?',
      [
        title || existing[0].title,
        description !== undefined ? description : existing[0].description,
        status || existing[0].status,
        taskId,
        userId
      ]
    );

    const [updated] = await db.promise().query('SELECT * FROM tasks WHERE id = ?', [taskId]);
    res.json(updated[0]);
  } catch (err) {
    console.error('Update task error:', err);
    res.status(500).json({ error: 'Failed to update task.' });
  }
});

// DELETE /api/tasks/:id — delete (only if it belongs to this user)
router.delete('/:id', async (req, res) => {
  const userId = req.user.userId;
  const taskId = req.params.id;

  try {
    const [existing] = await db.promise().query(
      'SELECT id FROM tasks WHERE id = ? AND user_id = ?',
      [taskId, userId]
    );

    if (existing.length === 0) {
      return res.status(404).json({ error: 'Task not found or access denied.' });
    }

    await db.promise().query('DELETE FROM tasks WHERE id = ? AND user_id = ?', [taskId, userId]);
    res.json({ message: 'Task deleted successfully.' });
  } catch (err) {
    console.error('Delete task error:', err);
    res.status(500).json({ error: 'Failed to delete task.' });
  }
});

module.exports = router;
