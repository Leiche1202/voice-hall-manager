import { collection, getDocs, addDoc, doc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from './firebase';

const teamsCol = collection(db, 'teams');

export async function getTeams() {
  const snap = await getDocs(teamsCol);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function addTeam(team) {
  const ref = await addDoc(teamsCol, team);
  return { id: ref.id };
}

export async function updateTeam(id, team) {
  await setDoc(doc(db, 'teams', id), team);
  return true;
}

export async function deleteTeam(id) {
  await deleteDoc(doc(db, 'teams', id));
  return true;
}

