export const DEFAULT_GROUPS = [
  { name: '管理员', permissions: ['档表管理', '工资管理', 'ID 编辑', '分组管理'] },
  { name: '厅管', permissions: ['档表管理', '工资管理'] },
  { name: '主持', permissions: [] }
];

export function getGroups() {
  const stored = localStorage.getItem('groups');
  return stored ? JSON.parse(stored) : DEFAULT_GROUPS.slice();
}

export function saveGroups(groups) {
  localStorage.setItem('groups', JSON.stringify(groups));
}

export function addGroup(group) {
  const groups = getGroups();
  groups.push(group);
  saveGroups(groups);
}

export function updateGroup(index, group) {
  const groups = getGroups();
  groups[index] = group;
  saveGroups(groups);
}

export function deleteGroup(index) {
  const groups = getGroups();
  groups.splice(index, 1);
  saveGroups(groups);
}
