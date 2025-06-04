export const DEFAULT_TEAMS = [];
const TEAMS_KEY = 'teams';

export function getTeams() {
  const stored = localStorage.getItem(TEAMS_KEY);
  if (!stored) {
    localStorage.setItem(TEAMS_KEY, JSON.stringify(DEFAULT_TEAMS));
    return DEFAULT_TEAMS.slice();
  }
  try {
    const teams = JSON.parse(stored);
    const { getAccounts } = require('./accountService');
    const accounts = getAccounts();
    let changed = false;
    teams.forEach((t) => {
      if (!t.ownerId && t.owner) {
        const acc = accounts.find((a) => a.username === t.owner);
        if (acc) {
          t.ownerId = acc.id;
          changed = true;
        }
      }
      if (!t.parentId && t.parent) {
        const acc = accounts.find((a) => a.username === t.parent);
        if (acc) {
          t.parentId = acc.id;
          changed = true;
        }
      }
    });
    if (changed) saveTeams(teams);
    return teams;
  } catch {
    return DEFAULT_TEAMS.slice();
  }
}

export function saveTeams(teams) {
  localStorage.setItem(TEAMS_KEY, JSON.stringify(teams));
}

export function addTeam(team) {
  const teams = getTeams();
  teams.push(team);
  saveTeams(teams);
}

export function updateTeam(index, team) {
  const teams = getTeams();
  teams[index] = team;
  saveTeams(teams);
}

export function deleteTeam(index) {
  const teams = getTeams();
  teams.splice(index, 1);
  saveTeams(teams);
}
