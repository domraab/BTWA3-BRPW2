// src/services/authService.js

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:8080";

export async function login(username, password) {
  const res = await fetch(`${API_URL}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  });
  if (!res.ok) {
    const err = await res.text();
    throw new Error(err || "Login failed");
  }
  const { token } = await res.json();
  localStorage.setItem("token", token);
  return token;
}

export async function register({ username, password, email, fullName, phone, jobTitle }) {
  const res = await fetch(`${API_URL}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password, email, fullName, phone, jobTitle })
  });
  if (!res.ok) {
    const data = await res.json().catch(() => null);
    const errMsg = data?.error || (await res.text()) || "Registration failed";
    throw new Error(errMsg);
  }
  const { token } = await res.json();
  localStorage.setItem("token", token);
  return token;
}

export async function getCurrentUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  const res = await fetch(`${API_URL}/api/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`
    }
  });
  if (res.status === 401 || res.status === 403) {
    logout();
    return null;
  }
  if (!res.ok) {
    throw new Error("Failed to fetch current user");
  }
  return await res.json();
}

export function logout() {
  localStorage.removeItem("token");
}

export function isLoggedIn() {
  return !!localStorage.getItem("token");
}

export function authHeader() {
  const token = localStorage.getItem("token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}
