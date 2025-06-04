export const DEFAULT_ACCOUNTS = [
  {
    id: '1',
    username: 'admin',
    password: '111',
    groups: ['管理员'],
  },
];

const ACCOUNTS_KEY = 'accounts';

export function getAccounts() {
  const stored = localStorage.getItem(ACCOUNTS_KEY);
  if (!stored) {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS.slice();
  }
  try {
    const accounts = JSON.parse(stored);
    if (!accounts.some((a) => a.username === 'admin')) {
      accounts.unshift(DEFAULT_ACCOUNTS[0]);
      saveAccounts(accounts);
    }
    return accounts;
  } catch {
    localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS.slice();
  }
}

export function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts));
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

export function resetAccounts() {
  saveAccounts(DEFAULT_ACCOUNTS.slice());
}
