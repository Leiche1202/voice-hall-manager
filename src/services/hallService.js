import { collection, getDocs, addDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';
import { getTeams } from './teamService';

const hallsCol = collection(db, 'halls');

export async function getHalls() {
  const snap = await getDocs(hallsCol);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addHall(hall) {
  const ref = await addDoc(hallsCol, hall);
  return { id: ref.id };
}

export async function updateHall(id, hall) {
  await setDoc(doc(db, 'halls', id), hall);
  return true;
}

export async function deleteHall(id) {
  await deleteDoc(doc(db, 'halls', id));
  return true;
}

export async function getAccessibleHalls(userId) {
  const all = await getHalls();
  if (!userId) return all;
  const teams = await getTeams();
  const teamIds = teams
    .filter(t => t.ownerId === userId || t.parentId === userId)
    .map(t => t.id);
  return all.filter(h => h.managerId === userId || teamIds.includes(h.teamId));
}

