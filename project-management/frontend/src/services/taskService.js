// src/services/taskService.js

const API = "http://localhost:8080";

// Připraví standardní hlavičky včetně JWT
function authHeaders() {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    Authorization: `Bearer ${token}`,
  };
}

/** Načte všechny úkoly */
export async function getTasks() {
  const res = await fetch(`${API}/api/tasks`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch tasks");
  return res.json();
}

/** Vytvoří nový úkol */
export async function createTask({ title, description, status, dueDate, projectId, assigneeId }) {
  const res = await fetch(`${API}/api/tasks`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ title, description, status, dueDate, projectId, assigneeId }),
  });
  if (!res.ok) throw new Error("Failed to create task");
  return res.json();
}


/** Aktualizuje existující úkol */
export async function updateTask(id, updates) {
  const res = await fetch(`${API}/api/tasks/${id}`, {
    method: "PUT",
    headers: authHeaders(),
    body: JSON.stringify(updates),
  });
  if (!res.ok) throw new Error("Failed to update task");
  return res.json();
}
// GET /api/tasks/project/:projectId
export async function getTasksByProject(projectId) {
  const res = await fetch(`${API}/api/tasks/project/${projectId}`, {
    headers: authHeaders(),
  });
  if (!res.ok) throw new Error("Failed to fetch project tasks");
  return res.json();
}

// PATCH /api/tasks/:id/status
export async function updateTaskStatus(taskId, newStatus) {
  const res = await fetch(`${API}/api/tasks/${taskId}/status`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify({ status: newStatus }),
  });
  if (!res.ok) throw new Error("Failed to update task status");
}