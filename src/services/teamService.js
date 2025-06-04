export const DEFAULT_TEAMS = [];
const TEAMS_VERSION = 1;

export function getTeams() {
  const ver = Number(localStorage.getItem('teams_version') || '0');
  const stored = localStorage.getItem("teams");
  if (!stored || ver !== TEAMS_VERSION) {
    localStorage.setItem('teams_version', TEAMS_VERSION);
    localStorage.setItem('teams', JSON.stringify(DEFAULT_TEAMS));
    return DEFAULT_TEAMS.slice();
  }
  return JSON.parse(stored);
}

export function saveTeams(teams) {
  localStorage.setItem("teams", JSON.stringify(teams));
  localStorage.setItem('teams_version', TEAMS_VERSION);
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
