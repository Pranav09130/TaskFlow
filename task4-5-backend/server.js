const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// ── Middleware ──────────────────────────────────────────────────────────────
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:5173',
  credentials: true
}));
app.use(express.json());

// ── Routes ──────────────────────────────────────────────────────────────────
const authRoutes  = require('./routes/auth');
const taskRoutes  = require('./routes/tasks');

app.use('/api/auth',  authRoutes);
app.use('/api/tasks', taskRoutes); // protected inside the router

// ── Health check ─────────────────────────────────────────────────────────────
app.get('/', (req, res) => {
  res.json({ status: 'TaskFlow API is running ✅' });
});

// ── Start Server ─────────────────────────────────────────────────────────────
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
