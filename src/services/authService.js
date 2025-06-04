import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { getAccountByPhone } from './accountService';

export async function login(phone, password) {
  const accountByPhone = await getAccountByPhone(phone);
  if (!accountByPhone) {
    throw new Error('Phone not found');
  }
  const cred = await signInWithEmailAndPassword(auth, accountByPhone.email, password);
  const ref = doc(db, 'accounts', accountByPhone.id);
  const snap = await getDoc(ref);
  const account = snap.exists() ? snap.data() : { phone, username: accountByPhone.username };
  return { user: { id: accountByPhone.id, ...account }, token: await cred.user.getIdToken() };
}

export async function logout() {
  await signOut(auth);
  return true;
}

