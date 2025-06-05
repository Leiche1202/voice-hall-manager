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

const groupsCol = db ? collection(db, 'groups') : null;

export async function getGroups() {
  if (!groupsCol) {
    throw new Error('No backend connection');
  }
  const snap = await getDocs(groupsCol);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateGroup(id, group) {
  if (!groupsCol) {
    throw new Error('No backend connection');
  }
  await setDoc(doc(db, 'groups', id), group);
  return true;
}

