const API = '/api/accounts';

// Local fallback when the API is unreachable
// Use a simple relative path so it works both locally and when deployed
const LOCAL_ACCOUNTS_URL = '/accounts.json';

export async function getAccounts() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error('network');
    return await res.json();
  } catch (err) {
    const localRes = await fetch(LOCAL_ACCOUNTS_URL);
    return localRes.json();
  }
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
