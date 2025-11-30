import { auth, db } from '../src/firebaseConfig';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword, updateProfile, signOut } from 'firebase/auth';
import { doc, setDoc } from 'firebase/firestore';
import { UserRole } from '../types';

export const login = async (email: string, password: string): Promise<void> => {
  await signInWithEmailAndPassword(auth, email, password);
};

export const signup = async (name: string, email: string, password: string, role: UserRole): Promise<void> => {
  const userCredential = await createUserWithEmailAndPassword(auth, email, password);
  const user = userCredential.user;

  await updateProfile(user, { displayName: name });

  await setDoc(doc(db, 'users', user.uid), {
    uid: user.uid,
    name,
    email,
    role,
    createdAt: new Date().toISOString(),
  });
};

export const logout = async (): Promise<void> => {
  await signOut(auth);
}; 