// src/services/userService.js

const API = "http://localhost:8080/api";

/**
 * Vloží do requestu Authorization hlavičku s JWT tokem.
 * Pokud je potřeba posílat JSON tělo, zavolej authHeaders(true).
 */
function authHeaders(json = false) {
  const headers = {};
  const token = localStorage.getItem("token");
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }
  if (json) {
    headers["Content-Type"] = "application/json";
  }
  return headers;
}

/** Manager‑only: GET /api/users */
export async function getUsers() {
  const res = await fetch(`${API}/users`, { headers: authHeaders() });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Chyba při načítání uživatelů (${res.status})`);
  }
  return res.json();
}

/** Manager‑only: GET /api/users/:id */
export async function getUserById(id) {
  const res = await fetch(`${API}/users/${id}`, { headers: authHeaders() });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Chyba při načítání uživatele ${id} (${res.status})`);
  }
  return res.json();
}

/** Alias pro UserEditPage */
export const getUser = getUserById;

/** Manager‑only: POST /api/users */
export async function createUser(userDto) {
  const res = await fetch(`${API}/users`, {
    method: "POST",
    headers: authHeaders(true),
    body: JSON.stringify(userDto),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Chyba při vytváření uživatele (${res.status})`);
  }
  return res.json();
}

/** Manager‑only: PUT /api/users/:id */
export async function updateUser(id, userDto) {
  const res = await fetch(`${API}/users/${id}`, {
    method: "PUT",
    headers: authHeaders(true),
    body: JSON.stringify(userDto),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Chyba při aktualizaci uživatele ${id} (${res.status})`);
  }
  return res.json();
}

/** Manager‑only: DELETE /api/users/:id */
export async function deleteUser(id) {
  const res = await fetch(`${API}/users/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Chyba při mazání uživatele ${id} (${res.status})`);
  }
  return true;
}

/** Každý přihlášený: GET /api/users/me */
export async function getCurrentUser() {
  const res = await fetch(`${API}/users/me`, { headers: authHeaders() });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Chyba při načítání profilu (${res.status})`);
  }
  return res.json();
}

/** Každý přihlášený: PUT /api/users/me */
export async function updateCurrentUser(dto) {
  const res = await fetch(`${API}/users/me`, {
    method: "PUT",
    headers: authHeaders(true),
    body: JSON.stringify(dto),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Chyba při ukládání profilu (${res.status})`);
  }
  return res.json();
}