import { collection, addDoc, doc, setDoc, deleteDoc, getDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from './firebase';

const schedulesCol = collection(db, 'schedules');

export async function addSchedule(data) {
  const ref = await addDoc(schedulesCol, data);
  return ref.id;
}

export async function getScheduleByDate(dateString, hall = '') {
  let q = query(schedulesCol, where('date', '==', dateString));
  if (hall) {
    q = query(schedulesCol, where('date', '==', dateString), where('hall', '==', hall));
  }
  const snap = await getDocs(q);
  const docSnap = snap.docs[0];
  return docSnap ? { id: docSnap.id, ...docSnap.data() } : null;
}

export async function updateSchedule(id, data) {
  await setDoc(doc(db, 'schedules', id), data);
  return true;
}

export async function deleteSchedule(id) {
  await deleteDoc(doc(db, 'schedules', id));
  return true;
}

export async function getAllSchedules() {
  const snap = await getDocs(schedulesCol);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

