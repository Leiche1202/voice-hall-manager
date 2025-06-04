export const DEFAULT_ACCOUNTS = [
  {
    id: "1",
    username: "admin",
    password: "111",
    groups: ["管理员"],
    hall: "",
    manager: "",
    team: "",
  },
];

const ACCOUNTS_VERSION = 1;

export function getAccounts() {
  const storedVersion = Number(localStorage.getItem("accounts_version") || "0");
  const stored = localStorage.getItem("accounts");
  if (!storedVersion || storedVersion < ACCOUNTS_VERSION || !stored) {
    localStorage.setItem("accounts_version", ACCOUNTS_VERSION);
    localStorage.setItem("accounts", JSON.stringify(DEFAULT_ACCOUNTS));
    return DEFAULT_ACCOUNTS.slice();
  }
  const list = JSON.parse(stored);
  return list.map((a) => ({ hall: "", manager: "", team: "", ...a }));
}

export function saveAccounts(accounts) {
  localStorage.setItem("accounts", JSON.stringify(accounts));
  localStorage.setItem("accounts_version", ACCOUNTS_VERSION);
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
