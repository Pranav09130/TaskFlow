# Task 4 & 5 — REST API + MySQL

**Developer:** Pranav Medhe  
**Internship:** SaiKet Systems — Full Stack Development

## Setup Instructions

### Step 1 — Run the database setup
Open MySQL and run:
```bash
"C:\Program Files\MySQL\MySQL Server 8.0\bin\mysql.exe" -u root -p < setup.sql
```
Or paste the contents of `setup.sql` manually in MySQL.

### Step 2 — Install dependencies
```bash
npm install
```

### Step 3 — Start the server
```bash
npm run dev
```
Server runs at: `http://localhost:5000`

---

## API Endpoints

### Users
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/users | Get all users |
| GET | /api/users/:id | Get one user |
| POST | /api/users | Create user |
| PUT | /api/users/:id | Update user |
| DELETE | /api/users/:id | Delete user |

### Tasks
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/tasks | Get all tasks |
| GET | /api/tasks/:id | Get one task |
| POST | /api/tasks | Create task |
| PUT | /api/tasks/:id | Update task |
| PATCH | /api/tasks/:id/toggle | Toggle complete |
| DELETE | /api/tasks/:id | Delete task |

---

## Postman Testing Examples

### Create User
```
POST http://localhost:5000/api/users
Body (JSON):
{
  "name": "Pranav Medhe",
  "email": "pranav@example.com",
  "age": 21
}
```

### Create Task
```
POST http://localhost:5000/api/tasks
Body (JSON):
{
  "text": "My new task",
  "priority": "high"
}
```
