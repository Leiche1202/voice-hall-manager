export const DEFAULT_HALLS = [];

export function getHalls() {
  const stored = localStorage.getItem('halls');
  return stored ? JSON.parse(stored) : DEFAULT_HALLS.slice();
}

export function saveHalls(halls) {
  localStorage.setItem('halls', JSON.stringify(halls));
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
