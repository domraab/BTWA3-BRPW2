const API = "http://localhost:8080/api";

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

export async function getTeams() {
  const res = await fetch(`${API}/teams`, { headers: authHeaders() });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Chyba při načítání týmů (${res.status})`);
  }
  return res.json();
}

export async function createTeam(teamDto) {
  const res = await fetch(`${API}/teams`, {
    method: "POST",
    headers: authHeaders(true),
    body: JSON.stringify(teamDto),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Chyba při vytváření týmu (${res.status})`);
  }
  return res.json();
}

export async function getTeamMembers(teamId) {
  const res = await fetch(`${API}/teams/${teamId}/members`, {
    headers: authHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Chyba při načítání členů (${res.status})`);
  }
  return res.json();
}

export async function addMemberToTeam(teamId, userId) {
  const res = await fetch(`${API}/teams/${teamId}/add-member/${userId}`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Chyba při přidávání člena (${res.status})`);
  }
}

export async function removeMemberFromTeam(teamId, userId) {
  const res = await fetch(`${API}/teams/${teamId}/remove-member/${userId}`, {
    method: "PATCH",
    headers: authHeaders(),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Chyba při odebírání člena (${res.status})`);
  }
}
