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

const groupsCol = collection(db, 'groups');

export async function getGroups() {
  const snap = await getDocs(groupsCol);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function updateGroup(id, group) {
  await setDoc(doc(db, 'groups', id), group);
  return true;
}

