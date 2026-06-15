// src/services/api.js
// All API calls automatically include the auth token from localStorage

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

function getToken() {
  return localStorage.getItem('tf_token');
}

function authHeaders() {
  const token = getToken();
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

// ── Tasks ────────────────────────────────────────────────────────────────────

export async function fetchTasks() {
  const res = await fetch(`${API_URL}/api/tasks`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to fetch tasks');
  return res.json();
}

export async function createTask(taskData) {
  const res = await fetch(`${API_URL}/api/tasks`, {
    method: 'POST',
    headers: authHeaders(),
    body: JSON.stringify(taskData)
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to create task');
  return res.json();
}

export async function updateTask(id, taskData) {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'PUT',
    headers: authHeaders(),
    body: JSON.stringify(taskData)
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to update task');
  return res.json();
}

export async function deleteTask(id) {
  const res = await fetch(`${API_URL}/api/tasks/${id}`, {
    method: 'DELETE',
    headers: authHeaders()
  });
  if (!res.ok) throw new Error((await res.json()).error || 'Failed to delete task');
  return res.json();
}
