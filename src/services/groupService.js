import { collection, getDocs, doc, setDoc } from 'firebase/firestore';
import { db } from './firebase';

export const PERMISSIONS = [
  '档表管理',
  '工资管理',
  '用户编辑',
  '权限管理',
  '分厅管理',
  '团队管理'
];

let groupsCol;
if (db) {
  groupsCol = collection(db, 'groups');
}

export async function getGroups() {
  if (!groupsCol) {
    // Fallback groups when running without Firebase
    const allPerms = PERMISSIONS.reduce((acc, p) => {
      acc[p] = { view: true, edit: true };
      return acc;
    }, {});
    return [
      { id: 'admin', name: '管理员', permissions: allPerms }
    ];
  }
  const snap = await getDocs(groupsCol);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateGroup(id, group) {
  if (!db) {
    console.warn('No backend configured; updateGroup skipped');
    return true;
  }
  await setDoc(doc(db, 'groups', id), group);
  return true;
}

