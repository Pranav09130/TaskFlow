// =============================================
//  userRoutes.js — User CRUD API Endpoints
//  Task 4: REST API Design
//
//  NOTE: not mounted in server.js (server.js uses routes/auth.js for the
//  live users table, which stores a hashed password instead of age).
//  Kept for reference. If you want to use it, it needs its own table
//  shape, since it isn't compatible with the users table setup.sql creates.
// =============================================

const express = require('express');
const router  = express.Router();
const db      = require('../db');

// Validate user fields
function validateUser(name, email, age) {
  const errors = [];
  if (!name || name.trim().length < 2)
    errors.push('Name must be at least 2 characters.');
  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
    errors.push('Please provide a valid email address.');
  if (!age || isNaN(age) || age < 1 || age > 120)
    errors.push('Age must be a number between 1 and 120.');
  return errors;
}

// GET /api/users — Get ALL users
router.get('/', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users ORDER BY created_at DESC');
    res.json({ success: true, count: result.rows.length, data: result.rows });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// GET /api/users/:id — Get ONE user
router.get('/:id', async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (result.rows.length === 0)
      return res.status(404).json({ success: false, message: 'User not found.' });
    res.json({ success: true, data: result.rows[0] });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

// POST /api/users — Create user
router.post('/', async (req, res) => {
  const { name, email, age } = req.body;
  const errors = validateUser(name, email, age);
  if (errors.length > 0) return res.status(400).json({ success: false, errors });
  try {
    const result = await db.query(
      'INSERT INTO users (name, email, age) VALUES ($1, $2, $3) RETURNING *',
      [name.trim(), email.trim().toLowerCase(), parseInt(age)]
    );
    res.status(201).json({ success: true, message: 'User created!', data: result.rows[0] });
  } catch (err) {
    if (err.code === '23505')
      return res.status(400).json({ success: false, message: 'Email already exists.' });
    res.status(500).json({ success: false, message: err.message });
  }
});

// PUT /api/users/:id — Update user
router.put('/:id', async (req, res) => {
  const { name, email, age } = req.body;
  const errors = validateUser(name, email, age);
  if (errors.length > 0) return res.status(400).json({ success: false, errors });
  try {
    const existing = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (existing.rows.length === 0)
      return res.status(404).json({ success: false, message: 'User not found.' });
    const updated = await db.query(
      'UPDATE users SET name = $1, email = $2, age = $3 WHERE id = $4 RETURNING *',
      [name.trim(), email.trim().toLowerCase(), parseInt(age), req.params.id]
    );
    res.json({ success: true, message: 'User updated!', data: updated.rows[0] });
  } catch (err) {
    if (err.code === '23505')
      return res.status(400).json({ success: false, message: 'Email already exists.' });
    res.status(500).json({ success: false, message: err.message });
  }
});

// DELETE /api/users/:id — Delete user
router.delete('/:id', async (req, res) => {
  try {
    const existing = await db.query('SELECT * FROM users WHERE id = $1', [req.params.id]);
    if (existing.rows.length === 0)
      return res.status(404).json({ success: false, message: 'User not found.' });
    await db.query('DELETE FROM users WHERE id = $1', [req.params.id]);
    res.json({ success: true, message: `User "${existing.rows[0].name}" deleted!` });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
