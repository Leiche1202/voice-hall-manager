export const DEFAULT_ACCOUNTS = [
  {
    id: '1',
    username: 'admin',
    password: '111',
    role: 'admin',
    group: '管理员'
  },
  {
    id: '10001',
    username: '10001',
    password: '123456',
    role: 'host',
    group: '主持'
  },
  {
    id: '10002',
    username: '10002',
    password: '123456',
    role: 'host',
    group: '主持'
  },
  {
    id: '10003',
    username: '10003',
    password: '123456',
    role: 'host',
    group: '主持'
  },
  {
    id: '10004',
    username: '10004',
    password: '123456',
    role: 'host',
    group: '主持'
  },
  {
    id: '10005',
    username: '10005',
    password: '123456',
    role: 'host',
    group: '主持'
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
