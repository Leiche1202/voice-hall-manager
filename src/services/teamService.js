const API = '/api/teams';

export async function getTeams() {
  const res = await fetch(API);
  return res.json();
}

export async function addTeam(team) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(team)
  });
  return res.json();
}

export async function updateTeam(id, team) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(team)
  });
  return res.json();
}

export async function deleteTeam(id) {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  return res.json();
}
