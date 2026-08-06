-- =============================================
--  setup.sql — Database Setup Script (PostgreSQL / Neon)
--  Task 5: Database Integration
--  Run this ONCE against your Neon database, before first deploy.
--  Every statement is idempotent, so it's also safe to re-run.
-- =============================================

-- Neon already gives you a ready-to-use database (e.g. "neondb") as part
-- of your connection string, so there's no CREATE DATABASE / USE step
-- like MySQL needed — just run this whole file against that database.

-- Users table (matches routes/auth.js)
CREATE TABLE IF NOT EXISTS users (
  id         SERIAL        PRIMARY KEY,
  name       VARCHAR(100)  NOT NULL,
  email      VARCHAR(255)  NOT NULL UNIQUE,
  password   VARCHAR(255)  NOT NULL,
  created_at TIMESTAMP     NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table (matches routes/tasks.js)
CREATE TABLE IF NOT EXISTS tasks (
  id          SERIAL       PRIMARY KEY,
  user_id     INTEGER      NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  status      VARCHAR(20)  NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in-progress', 'completed')),
  priority    VARCHAR(10)  NOT NULL DEFAULT 'medium'  CHECK (priority IN ('high', 'medium', 'low')),
  completed   BOOLEAN      NOT NULL DEFAULT FALSE,
  created_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at  TIMESTAMP    NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Every task query filters by user_id — index it
CREATE INDEX IF NOT EXISTS idx_tasks_user_id ON tasks(user_id);

-- Postgres has no "ON UPDATE CURRENT_TIMESTAMP" column option like MySQL —
-- a trigger is the standard way to keep updated_at current automatically.
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_tasks_updated_at ON tasks;
CREATE TRIGGER trigger_tasks_updated_at
  BEFORE UPDATE ON tasks
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- NOTE: no sample data is inserted here on purpose — the old MySQL version
-- of this file seeded a users row with a plaintext password, which doesn't
-- fit the hashed-password schema above. Create your first account the real
-- way, through the API: POST /api/auth/register.

-- Verify tables after running this — either check the "Tables" tab in the
-- Neon console, or run:
-- SELECT table_name FROM information_schema.tables WHERE table_schema = 'public';
