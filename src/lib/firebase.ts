import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut as fbSignOut } from 'firebase/auth';
import { getFirestore, doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { UserProfile, Course, AttendanceRecord, DailySchedule } from '../types';

export const app = initializeApp(firebaseConfig);
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth();

export const provider = new GoogleAuthProvider();

export const signInWithGoogle = async () => {
  try {
    const result = await signInWithPopup(auth, provider);
    return result.user;
  } catch (error) {
    console.error("Google Sign-In Error:", error);
    throw error;
  }
};

export const signOut = async () => {
  try {
    await fbSignOut(auth);
  } catch (error) {
    console.error("Sign Out Error:", error);
  }
};

export const getUserDocument = async (userId: string) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
    return null;
  } catch (error) {
    console.error("Error fetching user document:", error);
    return null;
  }
};

export const syncUserDocument = async (
  userId: string,
  profile: UserProfile,
  courses: Course[],
  records: AttendanceRecord[],
  schedule: DailySchedule[]
) => {
  try {
    const docRef = doc(db, 'users', userId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      await updateDoc(docRef, {
        profile,
        courses,
        records,
        schedule,
        updatedAt: serverTimestamp()
      });
    } else {
      await setDoc(docRef, {
        userId,
        profile,
        courses,
        records,
        schedule,
        updatedAt: serverTimestamp()
      });
    }
  } catch (error) {
    console.error("Error syncing user document:", error);
    throw error;
  }
};
