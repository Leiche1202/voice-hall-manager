export const DEFAULT_TEAMS = [];

export function getTeams() {
  const stored = localStorage.getItem("teams");
  return stored ? JSON.parse(stored) : DEFAULT_TEAMS.slice();
}

export function saveTeams(teams) {
  localStorage.setItem("teams", JSON.stringify(teams));
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
