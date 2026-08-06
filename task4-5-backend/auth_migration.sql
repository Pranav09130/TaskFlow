-- ============================================================
-- TaskFlow Auth Migration (PostgreSQL / Neon)
--
-- Only needed if you already have an OLDER "tasks" table (from before
-- auth was added) that's missing the user_id column. A brand-new Neon
-- database only needs setup.sql — you can skip this file entirely.
-- ============================================================

-- 1. Create users table
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL        PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(255)  NOT NULL UNIQUE,
  password   VARCHAR(255)  NOT NULL,
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- 2. Add user_id column to tasks table (if it doesn't already have it)
ALTER TABLE tasks
  ADD COLUMN IF NOT EXISTS user_id INTEGER;

-- Postgres has no "ADD CONSTRAINT IF NOT EXISTS", so guard it manually
-- to keep this script safe to re-run.
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'fk_tasks_user'
  ) THEN
    ALTER TABLE tasks
      ADD CONSTRAINT fk_tasks_user
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE;
  END IF;
END $$;

-- 3. (Optional) If you have existing tasks without a user_id and want to
--    keep them, register a normal "admin" account through
--    POST /api/auth/register first, then run:
--
--   UPDATE tasks SET user_id = (SELECT id FROM users WHERE email = 'admin@taskflow.com')
--   WHERE user_id IS NULL;
--
--   Then make user_id required, same as in setup.sql:
--   ALTER TABLE tasks ALTER COLUMN user_id SET NOT NULL;

-- ============================================================
-- Final tasks table structure (for reference — setup.sql has the full,
-- current CREATE TABLE statement including the CHECK constraints, index,
-- and updated_at trigger):
-- ============================================================
-- CREATE TABLE tasks (
--   id          SERIAL PRIMARY KEY,
--   user_id     INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
--   title       VARCHAR(255) NOT NULL,
--   description TEXT,
--   status      VARCHAR(20) DEFAULT 'pending',
--   priority    VARCHAR(10) DEFAULT 'medium',
--   completed   BOOLEAN DEFAULT FALSE,
--   created_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
--   updated_at  TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );
