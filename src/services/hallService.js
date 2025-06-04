export const DEFAULT_HALLS = [];
const HALLS_KEY = 'halls';

export function getHalls() {
  const stored = localStorage.getItem(HALLS_KEY);
  if (!stored) {
    localStorage.setItem(HALLS_KEY, JSON.stringify(DEFAULT_HALLS));
    return DEFAULT_HALLS.slice();
  }
  try {
    const halls = JSON.parse(stored);
    // 向后兼容旧数据结构
    let changed = false;
    const { getAccounts } = require('./accountService');
    const { getTeams } = require('./teamService');
    const accounts = getAccounts();
    const teams = getTeams();
    halls.forEach((h) => {
      if (!h.managerId && h.manager) {
        const acc = accounts.find((a) => a.username === h.manager);
        if (acc) {
          h.managerId = acc.id;
          changed = true;
        }
      }
      if (!h.teamId && h.team) {
        const tm = teams.find((t) => t.name === h.team);
        if (tm) {
          h.teamId = tm.id;
          changed = true;
        }
      }
    });
    if (changed) {
      saveHalls(halls);
    }
    return halls;
  } catch {
    return DEFAULT_HALLS.slice();
  }
}

export function saveHalls(halls) {
  localStorage.setItem(HALLS_KEY, JSON.stringify(halls));
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

export function getAccessibleHalls(userId) {
  const halls = getHalls();
  if (!userId) return halls;
  try {
    const { getTeams } = require('./teamService');
    const teams = getTeams();
    const teamIds = teams
      .filter((t) => t.ownerId === userId || t.parentId === userId)
      .map((t) => t.id);
    return halls.filter(
      (h) => h.managerId === userId || teamIds.includes(h.teamId)
    );
  } catch {
    return halls.filter((h) => h.managerId === userId);
  }
}
