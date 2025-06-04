export const PERMISSIONS = [
  '档表管理',
  '工资管理',
  '用户编辑',
  '权限管理',
  '分厅管理',
  '团队管理'
];

const API = '/api/groups';

export async function getGroups() {
  const res = await fetch(API);
  return res.json();
}

export async function updateGroup(id, group) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(group)
  });
  return res.json();
}
