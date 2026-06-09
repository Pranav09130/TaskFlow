-- =============================================
--  setup.sql — Database Setup Script
--  Task 5: Database Integration
--  Run this ONCE to create the database & tables
-- =============================================

-- Create database
CREATE DATABASE IF NOT EXISTS todoapp;

-- Use the database
USE todoapp;

-- Create users table (Task 4 requirement)
CREATE TABLE IF NOT EXISTS users (
  id        INT AUTO_INCREMENT PRIMARY KEY,
  name      VARCHAR(100)        NOT NULL,
  email     VARCHAR(150)        NOT NULL UNIQUE,
  age       INT                 NOT NULL,
  created_at DATETIME           DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create tasks table (To-Do app - Task 3 integration)
CREATE TABLE IF NOT EXISTS tasks (
  id          INT AUTO_INCREMENT PRIMARY KEY,
  text        VARCHAR(255)       NOT NULL,
  priority    ENUM('high','medium','low') DEFAULT 'medium',
  completed   BOOLEAN            DEFAULT FALSE,
  created_at  DATETIME           DEFAULT CURRENT_TIMESTAMP,
  updated_at  DATETIME           DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Insert sample users
INSERT INTO users (name, email, age) VALUES
  ('Pranav Medhe',  'pranavmedhe15@gmail.com', 21),
  ('Rahul Sharma',  'rahul@example.com',       22),
  ('Priya Patel',   'priya@example.com',        20)
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- Insert sample tasks
INSERT INTO tasks (text, priority, completed) VALUES
  ('Complete Task 1 - Portfolio Website',         'high',   TRUE),
  ('Complete Task 2 - E-Commerce Landing Page',   'high',   TRUE),
  ('Complete Task 3 - React To-Do App',           'high',   FALSE),
  ('Complete Task 4 - REST API with Node.js',     'medium', FALSE),
  ('Complete Task 5 - Database Integration',      'medium', FALSE),
  ('Complete Task 6 - Full Stack Application',    'low',    FALSE);

-- Verify tables created
SHOW TABLES;
SELECT * FROM users;
SELECT * FROM tasks;
