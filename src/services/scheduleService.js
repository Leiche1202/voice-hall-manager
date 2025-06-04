const API = '/api/schedules';

export async function addSchedule(data) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  const result = await res.json();
  return result.id;
}

export async function getScheduleByDate(dateString, hall = '') {
  const params = new URLSearchParams();
  if (dateString) params.append('date', dateString);
  if (hall) params.append('hall', hall);
  const res = await fetch(`${API}?${params.toString()}`);
  if (!res.ok) throw new Error('failed');
  const list = await res.json();
  return list[0] || null;
}

export async function updateSchedule(id, data) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  });
  if (!res.ok) throw new Error('failed');
  return true;
}

export async function deleteSchedule(id) {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('failed');
  return true;
}

export async function getAllSchedules() {
  const res = await fetch(API);
  if (!res.ok) throw new Error('failed');
  return res.json();
}
