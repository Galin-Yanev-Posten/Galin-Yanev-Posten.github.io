import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "firebase/auth";
import { doc, setDoc, getDoc } from "firebase/firestore";
import { auth, db } from "./config";

export async function signUp(email, password, displayName) {
  const userCredential = await createUserWithEmailAndPassword(
    auth,
    email,
    password
  );
  const user = userCredential.user;

  await setDoc(doc(db, "users", user.uid), {
    displayName,
    email,
    createdAt: new Date().toISOString(),
  });

  return user;
}

export async function signIn(email, password) {
  return await signInWithEmailAndPassword(auth, email, password);
}

export async function logOut() {
  return await signOut(auth);
}

export async function getUserProfile(userId) {
  const docRef = doc(db, "users", userId);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? docSnap.data() : null;
}

export async function updateUserProfile(userId, data) {
  const docRef = doc(db, "users", userId);
  await setDoc(docRef, data, { merge: true });
}

export { auth, onAuthStateChanged };
