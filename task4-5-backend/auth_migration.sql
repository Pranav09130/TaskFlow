-- ============================================================
-- TaskFlow Auth Migration
-- Run this SQL in your Railway MySQL database (or locally)
-- ============================================================

-- 1. Create users table
CREATE TABLE IF NOT EXISTS users (
  id         INT AUTO_INCREMENT PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(255)  NOT NULL UNIQUE,
  password   VARCHAR(255)  NOT NULL,
  created_at TIMESTAMP     DEFAULT CURRENT_TIMESTAMP
);

-- 2. Add user_id column to tasks table (if it doesn't already have it)
ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS user_id INT,
  ADD CONSTRAINT fk_tasks_user
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;

-- 3. (Optional) If you have existing tasks without a user_id and want
--    to keep them, you can assign them to a default "admin" user:
--
--   INSERT INTO users (name, email, password) VALUES ('Admin', 'admin@taskflow.com', '<hashed>');
--   UPDATE tasks SET user_id = (SELECT id FROM users WHERE email = 'admin@taskflow.com')
--   WHERE user_id IS NULL;
--
--   Then make user_id NOT NULL:
--   ALTER TABLE tasks MODIFY COLUMN user_id INT NOT NULL;

-- ============================================================
-- Final tasks table structure (for reference):
-- ============================================================
-- CREATE TABLE tasks (
--   id          INT AUTO_INCREMENT PRIMARY KEY,
--   user_id     INT NOT NULL,
--   title       VARCHAR(255) NOT NULL,
--   description TEXT,
--   status      ENUM('pending', 'in-progress', 'completed') DEFAULT 'pending',
--   created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
-- );
