export const DEFAULT_ACCOUNTS = [
  {
    id: '1',
    username: 'admin',
    password: '111',
    role: 'admin',
    displayName: '系统管理员'
  }
];

export function getAccounts() {
  const stored = localStorage.getItem('accounts');
  return stored ? JSON.parse(stored) : DEFAULT_ACCOUNTS.slice();
}

export function saveAccounts(accounts) {
  localStorage.setItem('accounts', JSON.stringify(accounts));
}

export function addAccount(account) {
  const accounts = getAccounts();
  accounts.push(account);
  saveAccounts(accounts);
}

export function updateAccount(index, account) {
  const accounts = getAccounts();
  accounts[index] = account;
  saveAccounts(accounts);
}

export function deleteAccount(index) {
  const accounts = getAccounts();
  accounts.splice(index, 1);
  saveAccounts(accounts);
}
