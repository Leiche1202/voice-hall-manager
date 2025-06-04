export const DEFAULT_HALLS = [];
const HALLS_VERSION = 1;

export function getHalls() {
  const ver = Number(localStorage.getItem('halls_version') || '0');
  const stored = localStorage.getItem('halls');
  if (!stored || ver !== HALLS_VERSION) {
    localStorage.setItem('halls_version', HALLS_VERSION);
    localStorage.setItem('halls', JSON.stringify(DEFAULT_HALLS));
    return DEFAULT_HALLS.slice();
  }
  return JSON.parse(stored);
}

export function saveHalls(halls) {
  localStorage.setItem('halls', JSON.stringify(halls));
  localStorage.setItem('halls_version', HALLS_VERSION);
}

export function addHall(hall) {
  const halls = getHalls();
  halls.push(hall);
  saveHalls(halls);
}

export function updateHall(index, hall) {
  const halls = getHalls();
  halls[index] = hall;
  saveHalls(halls);
}

export function deleteHall(index) {
  const halls = getHalls();
  const removed = halls.splice(index, 1);
  saveHalls(halls);
  return removed[0];
}

export function getAccessibleHalls(username) {
  const halls = getHalls();
  if (!username) return halls;
  try {
    const { getTeams } = require('./teamService');
    const teams = getTeams();
    const teamNames = teams
      .filter((t) => t.owner === username || t.parent === username)
      .map((t) => t.name);
    return halls.filter(
      (h) => h.manager === username || teamNames.includes(h.team)
    );
  } catch {
    return halls.filter((h) => h.manager === username);
  }
}
