import { collection, getDocs, addDoc, doc, setDoc, deleteDoc, getDoc, query, where } from 'firebase/firestore';
import { db } from './firebase';

const accountsCol = db ? collection(db, 'accounts') : null;

export async function getAccounts() {
  if (!accountsCol) {
    throw new Error('No backend connection');
  }
  const snap = await getDocs(accountsCol);
  return snap.docs.map(d => ({ id: d.id, ...d.data() }));
}

export async function getAccount(id) {
  if (!accountsCol) {
    throw new Error('No backend connection');
  }
  const ref = doc(db, 'accounts', id);
  const snap = await getDoc(ref);
  return snap.exists() ? { id: snap.id, ...snap.data() } : null;
}

export async function addAccount(account) {
  const withEmail = {
    ...account,
    email: account.email || `${account.username}@gmail.com`,
    phone: account.phone || ''
  };
  if (!accountsCol) {
    throw new Error('No backend connection');
  }
  const ref = await addDoc(accountsCol, withEmail);
  return { id: ref.id };
}

export async function updateAccount(id, account) {
  const existing = !account.email || !account.phone ? await getAccount(id) : null;
  const data = {
    ...account,
    email: account.email || existing?.email || `${account.username}@gmail.com`,
    phone: account.phone || existing?.phone || ''
  };
  if (!accountsCol) {
    throw new Error('No backend connection');
  }
  await setDoc(doc(db, 'accounts', id), data);
  return true;
}

export async function deleteAccount(id) {
  if (!accountsCol) {
    throw new Error('No backend connection');
  }
  await deleteDoc(doc(db, 'accounts', id));
  return true;
}

export async function getAccountByEmail(email) {
  if (!accountsCol) {
    throw new Error('No backend connection');
  }
  const q = query(accountsCol, where('email', '==', email));
  const snap = await getDocs(q);
  const docSnap = snap.docs[0];
  return docSnap ? { id: docSnap.id, ...docSnap.data() } : null;
}

export async function getAccountByPhone(phone) {
  if (!accountsCol) {
    throw new Error('No backend connection');
  }
  const q = query(accountsCol, where('phone', '==', phone));
  const snap = await getDocs(q);
  const docSnap = snap.docs[0];
  return docSnap ? { id: docSnap.id, ...docSnap.data() } : null;
}

