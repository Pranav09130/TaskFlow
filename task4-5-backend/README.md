# Task 4 & 5 — REST API + PostgreSQL

**Developer:** Pranav Medhe
**Internship:** SaiKet Systems — Full Stack Development

REST API for the TaskFlow to-do app: Node.js + Express, PostgreSQL (hosted on [Neon](https://neon.tech)), JWT authentication. Deploys to [Render](https://render.com); frontend deploys separately to [Vercel](https://vercel.com).

## Local Setup

### Step 1 — Create the database schema
Run `setup.sql` against your Neon database. Easiest way: paste its contents into the Neon SQL Editor (Neon dashboard → your project → SQL Editor) and run it. Or, via `psql`:
```bash
psql "$DATABASE_URL" -f setup.sql
```

### Step 2 — Configure environment variables
Copy `.env.example` to `.env` and fill in real values:
```bash
cp .env.example .env
```

| Variable | Description |
|---|---|
| `PORT` | Port the server listens on locally (Render sets this automatically in prod) |
| `DATABASE_URL` | Neon **pooled** connection string, from Neon dashboard → Connection Details |
| `JWT_SECRET` | Any long random string, used to sign auth tokens |
| `FRONTEND_URL` | Comma-separated list of allowed CORS origins, e.g. `http://localhost:5173,https://your-app.vercel.app` |

### Step 3 — Install & run
```bash
npm install
npm run dev      # nodemon, auto-restarts on changes
# or
npm start
```
Server runs at `http://localhost:5000`.

---

## Final Deployment Steps (Render + Vercel + Neon)

### 1. Neon (database)
1. Sign in at [neon.tech](https://neon.tech) and open your project (or create one).
2. Open the **SQL Editor** and run all of `setup.sql`.
3. Copy the **pooled** connection string from **Connection Details** (hostname contains `-pooler`) — it handles many short-lived connections from Render much better than the direct one.

### 2. Render (backend)
1. Push this backend folder to GitHub.
2. On [render.com](https://render.com): **New → Web Service** → connect the repo.
3. If it's a subfolder of a monorepo, set **Root Directory** to this folder.
4. Settings:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
5. Add environment variables under **Environment**:
   - `DATABASE_URL` → your Neon pooled connection string
   - `JWT_SECRET` → a long random string (don't reuse any placeholder)
   - `FRONTEND_URL` → `http://localhost:5173` for now; update after Step 3
   - Leave `PORT` unset — Render provides it automatically.
6. Deploy, then note your backend URL, e.g. `https://taskflow-api.onrender.com`.

   On Render's free tier the service spins down after inactivity, so the first request after idle time can take 30–60s to wake up.

### 3. Vercel (frontend)
1. Push the frontend project to GitHub (separate repo/folder from this backend).
2. On [vercel.com](https://vercel.com): **Add New → Project** → import the frontend repo.
3. Set the frontend's API base URL env var (e.g. `VITE_API_URL`) to your Render backend URL from Step 2.
4. Deploy, then note your Vercel URL, e.g. `https://taskflow.vercel.app`.

### 4. Connect them
Back on Render → your service → **Environment** → update `FRONTEND_URL` to your real Vercel URL (comma-separate it with `http://localhost:5173` if you still want local dev to reach the deployed API) → redeploy.

### Verify
- `GET https://your-backend.onrender.com/` → `{"status": "TaskFlow API is running ✅"}`
- Register a user from the deployed frontend, then confirm it landed in Neon: SQL Editor → `SELECT * FROM users;`

---

## API Endpoints (mounted in server.js)

### Auth — `/api/auth`
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Create account |
| POST | /api/auth/login | Log in, get a JWT |

### Tasks — `/api/tasks` (require header `Authorization: Bearer <token>`)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get the current user's tasks |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| DELETE | /api/tasks/:id | Delete task |

> `routes/taskRoutes.js` and `routes/userRoutes.js` are earlier Task 3/4 versions (no auth, different schema — `age` instead of `password`, `text` instead of `title`). They're kept for reference but aren't mounted in `server.js`.

---

## Postman Testing Examples

### Register
```
POST http://localhost:5000/api/auth/register
Body (JSON):
{
  "name": "Pranav Medhe",
  "email": "pranav@example.com",
  "password": "yourpassword"
}
```

### Create Task
```
POST http://localhost:5000/api/tasks
Headers: Authorization: Bearer <token from register/login>
Body (JSON):
{
  "title": "My new task",
  "priority": "high"
}
```
