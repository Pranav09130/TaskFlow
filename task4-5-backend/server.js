// =============================================
//  server.js — Main Express Server
//  Task 4: Node.js + Express REST API
//  Task 5: MySQL Database Integration
// =============================================

const express    = require('express');
const cors       = require('cors');
require('dotenv').config();

const userRoutes = require('./routes/userRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app  = express();
const PORT = process.env.PORT || 5000;

// ---- Middleware ----
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ---- Routes ----
app.use('/api/users', userRoutes);
app.use('/api/tasks', taskRoutes);

// ---- Root endpoint ----
app.get('/', (req, res) => {
  res.json({
    message: 'TaskFlow REST API is running!',
    developer: 'Pranav Medhe',
    internship: 'SaiKet Systems - Task 4 & 5',
    endpoints: {
      users: {
        'GET    /api/users':        'Get all users',
        'GET    /api/users/:id':    'Get one user',
        'POST   /api/users':        'Create user',
        'PUT    /api/users/:id':    'Update user',
        'DELETE /api/users/:id':    'Delete user',
      },
      tasks: {
        'GET    /api/tasks':           'Get all tasks',
        'GET    /api/tasks/:id':       'Get one task',
        'POST   /api/tasks':           'Create task',
        'PUT    /api/tasks/:id':       'Update task',
        'PATCH  /api/tasks/:id/toggle':'Toggle complete',
        'DELETE /api/tasks/:id':       'Delete task',
      }
    }
  });
});

// ---- 404 handler ----
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found.` });
});

// ---- Error handler ----
app.use((err, req, res, next) => {
  console.error('Server Error:', err.stack);
  res.status(500).json({ success: false, message: 'Something went wrong on the server.' });
});

// ---- Start server ----
app.listen(PORT, () => {
  console.log('=============================================');
  console.log('  TaskFlow REST API');
  console.log('  SaiKet Systems Internship - Task 4 & 5');
  console.log('  Developer: Pranav Medhe');
  console.log('=============================================');
  console.log(`  Server running at http://localhost:${PORT}`);
  console.log(`  Users API:  http://localhost:${PORT}/api/users`);
  console.log(`  Tasks API:  http://localhost:${PORT}/api/tasks`);
  console.log('=============================================');
});
