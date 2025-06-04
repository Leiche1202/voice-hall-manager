const API = '/api/halls';

export async function getHalls() {
  const res = await fetch(API);
  return res.json();
}

export async function addHall(hall) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hall)
  });
  return res.json();
}

export async function updateHall(id, hall) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(hall)
  });
  return res.json();
}

export async function deleteHall(id) {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  return res.json();
}

export async function getAccessibleHalls(userId) {
  const all = await getHalls();
  if (!userId) return all;
  const teamsRes = await fetch('/api/teams');
  const teams = await teamsRes.json();
  const teamIds = teams
    .filter((t) => t.ownerId === userId || t.parentId === userId)
    .map((t) => t.id);
  return all.filter((h) => h.managerId === userId || teamIds.includes(h.teamId));
}
