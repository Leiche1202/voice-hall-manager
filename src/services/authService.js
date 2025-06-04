import { getAccounts } from './accountService';

export async function login(username, password) {
  const accounts = await getAccounts();
  const user = accounts.find(
    (acc) => acc.username === username && acc.password === password
  );
  if (user) {
    return { user: { ...user }, token: 'mock-token' };
  }
  throw new Error('用户名或密码错误');
}

export async function logout() {
  return true;
}
