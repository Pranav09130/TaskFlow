// =============================================
//  api.js — API Service Layer
//  Connects React frontend to Express backend
//  Task 6: Full Stack Integration
// =============================================

const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Generic fetch helper
async function request(endpoint, options = {}) {
  const config = {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  };
  const res = await fetch(`${BASE_URL}${endpoint}`, config);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || data.errors?.join(', ') || 'Something went wrong');
  return data;
}

// =============================================
//  TASK API CALLS
// =============================================
export const taskAPI = {
  getAll:  ()           => request('/tasks'),
  getOne:  (id)         => request(`/tasks/${id}`),
  create:  (body)       => request('/tasks',       { method: 'POST',   body: JSON.stringify(body) }),
  update:  (id, body)   => request(`/tasks/${id}`, { method: 'PUT',    body: JSON.stringify(body) }),
  toggle:  (id)         => request(`/tasks/${id}/toggle`, { method: 'PATCH' }),
  delete:  (id)         => request(`/tasks/${id}`, { method: 'DELETE' }),
};

// =============================================
//  USER API CALLS
// =============================================
export const userAPI = {
  getAll:  ()           => request('/users'),
  getOne:  (id)         => request(`/users/${id}`),
  create:  (body)       => request('/users',       { method: 'POST',   body: JSON.stringify(body) }),
  update:  (id, body)   => request(`/users/${id}`, { method: 'PUT',    body: JSON.stringify(body) }),
  delete:  (id)         => request(`/users/${id}`, { method: 'DELETE' }),
};
