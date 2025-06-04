export const PERMISSIONS = [
  '档表管理',
  '工资管理',
  '用户编辑',
  '权限管理',
  '分厅管理',
  '团队管理'
];

const GROUPS_KEY = 'groups';

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
    name: '多厅厅管',
    permissions: {
      ...buildDefaultPerms(false, false),
      '档表管理': { view: true, edit: true },
      '工资管理': { view: true, edit: true },
      '分厅管理': { view: true, edit: true },
    }
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
  const stored = localStorage.getItem(GROUPS_KEY);
  if (!stored) {
    localStorage.setItem(GROUPS_KEY, JSON.stringify(DEFAULT_GROUPS));
    return DEFAULT_GROUPS.slice();
  }
  try {
    const groups = JSON.parse(stored);
    // 兼容旧数据，将 "ID 编辑" 权限字段重命名为 "用户编辑"
    if (groups.length && groups[0].permissions && 'ID 编辑' in groups[0].permissions) {
      groups.forEach(g => {
        g.permissions['用户编辑'] = g.permissions['ID 编辑'];
        delete g.permissions['ID 编辑'];
      });
      saveGroups(groups);
    }
    return groups;
  } catch {
    localStorage.setItem(GROUPS_KEY, JSON.stringify(DEFAULT_GROUPS));
    return DEFAULT_GROUPS.slice();
  }
}

export function saveGroups(groups) {
  localStorage.setItem(GROUPS_KEY, JSON.stringify(groups));
}

export function updateGroup(index, group) {
  const groups = getGroups();
  groups[index] = group;
  saveGroups(groups);
}
