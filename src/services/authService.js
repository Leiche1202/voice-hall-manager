import { signInWithEmailAndPassword, signOut } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { auth, db } from './firebase';
import { getAccountByEmail } from './accountService';

export async function login(email, password) {
  const accountByEmail = await getAccountByEmail(email);
  const cred = await signInWithEmailAndPassword(auth, email, password);
  if (accountByEmail) {
    const ref = doc(db, 'accounts', accountByEmail.id);
    const snap = await getDoc(ref);
    const account = snap.exists() ? snap.data() : { email, username: accountByEmail.username };
    return { user: { id: accountByEmail.id, ...account }, token: await cred.user.getIdToken() };
  }
  const ref = doc(db, 'accounts', cred.user.uid);
  const snap = await getDoc(ref);
  const account = snap.exists() ? snap.data() : { email, username: email };
  return { user: { id: cred.user.uid, ...account }, token: await cred.user.getIdToken() };
}

export async function logout() {
  await signOut(auth);
  return true;
}

