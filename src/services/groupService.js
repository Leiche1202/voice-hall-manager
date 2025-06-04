export const PERMISSIONS = [
  '档表管理',
  '工资管理',
  '用户编辑',
  '权限管理',
  '分厅管理',
  '团队管理'
];

const API = '/api/groups';
// Local fallback when the API is unreachable
const LOCAL_GROUPS_URL = '/groups.json';


export async function getGroups() {
  try {
    const res = await fetch(API);
    if (!res.ok) throw new Error('network');
    return await res.json();
  } catch (err) {
    const localRes = await fetch(LOCAL_GROUPS_URL);
    return localRes.json();
  }
}

export async function updateGroup(id, group) {
  const res = await fetch(`${API}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(group)
  });
  return res.json();
}
