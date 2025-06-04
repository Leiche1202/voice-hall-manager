export const PERMISSIONS = [
  '档表管理',
  '工资管理',
  'ID 编辑',
  '权限管理',
  '分厅管理',
  '团队管理'
];

const GROUPS_VERSION = 2;

function buildDefaultPerms(view = false, edit = false) {
  return PERMISSIONS.reduce((acc, p) => {
    acc[p] = { view, edit };
    return acc;
  }, {});
}

export const DEFAULT_GROUPS = [
  {
    name: '管理员',
    permissions: buildDefaultPerms(true, true)
  },
  {
    name: '厅管',
    permissions: {
      ...buildDefaultPerms(false, false),
      '档表管理': { view: true, edit: true },
      '工资管理': { view: true, edit: true }
    }
  },
  {
    name: '预备厅管',
    permissions: {
      ...buildDefaultPerms(false, false),
      '档表管理': { view: true, edit: true },
      '工资管理': { view: true, edit: false }
    }
  },
  {
    name: '主持',
    permissions: {
      ...buildDefaultPerms(false, false),
      '档表管理': { view: true, edit: false }
    }
  }
];

export function getGroups() {
  const storedVer = Number(localStorage.getItem('groups_version') || '0');
  const stored = localStorage.getItem('groups');
  if (!stored || storedVer !== GROUPS_VERSION) {
    localStorage.setItem('groups_version', GROUPS_VERSION);
    localStorage.setItem('groups', JSON.stringify(DEFAULT_GROUPS));
    return DEFAULT_GROUPS.slice();
  }
  return JSON.parse(stored);
}

export function saveGroups(groups) {
  localStorage.setItem('groups', JSON.stringify(groups));
  localStorage.setItem('groups_version', GROUPS_VERSION);
}

export function updateGroup(index, group) {
  const groups = getGroups();
  groups[index] = group;
  saveGroups(groups);
}
