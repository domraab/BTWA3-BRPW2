// src/services/projectService.js
const API = "http://localhost:8080/api";

/**
 * Vrátí hlavičky s JWT tokenem. Pokud json=true, přidá i Content-Type.
 */
function authHeaders(json = false) {
  const token = localStorage.getItem("token");
  const headers = {};
  if (json) headers["Content-Type"] = "application/json";
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return headers;
}

/** GET /api/projects */
export async function getProjects() {
  const res = await fetch(`${API}/projects`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Chyba při načítání projektů: ${res.status} ${res.statusText}`);
  }
  return res.json();
}
export async function assignTeamToProject(projectId, teamId) {
  const res = await fetch(`${API}/teams/assign-to-project/${projectId}/${teamId}`, {
    method: "POST",
    headers: authHeaders()
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Chyba při přiřazování týmu (${res.status})`);
  }
}
/** GET /api/projects/{id} */
export async function getProjectById(id) {
  const res = await fetch(`${API}/projects/${id}`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    throw new Error(`Projekt ${id} nenalezen: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/** POST /api/projects */
export async function createProject({ name, description, status, managerId }) {
  const res = await fetch(`${API}/projects`, {
    method: "POST",
    headers: authHeaders(true),
    body: JSON.stringify({ name, description, status, managerId }),
  });
  if (!res.ok) {
    throw new Error(`Chyba při vytváření projektu: ${res.status} ${res.statusText}`);
  }
  return res.json();
}

/**
 * Částečná změna pouze statusu přes PATCH endpoint.
 */
export async function updateProjectStatus(id, newStatus) {
  const res = await fetch(`${API}/projects/${id}/status`, {
    method: "PATCH",
    headers: authHeaders(true),
    body: JSON.stringify({ status: newStatus }),
  });
  if (!res.ok) {
    throw new Error(`Chyba při aktualizaci stavu: ${res.status} ${res.statusText}`);
  }
}
