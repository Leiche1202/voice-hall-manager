const API = '/api/accounts';

export async function getAccounts() {
  const res = await fetch(API);
  return res.json();
}

export async function addAccount(account) {
  const res = await fetch(API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account)
  });
  return res.json();
}

export async function updateAccount(id, account) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(account)
  });
  return res.json();
}

export async function deleteAccount(id) {
  const res = await fetch(`${API}/${id}`, { method: 'DELETE' });
  return res.json();
}
