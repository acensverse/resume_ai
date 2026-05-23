import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, GoogleAuthProvider, signInWithPopup, signOut, Auth,
  createUserWithEmailAndPassword, signInWithEmailAndPassword, updateProfile 
} from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, Firestore } from 'firebase/firestore';
import { ResumeData } from '../types/resume';

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Check if Firebase is properly configured
export const isFirebaseConfigured = (): boolean => {
  return !!(
    firebaseConfig.apiKey &&
    firebaseConfig.apiKey !== 'your_api_key_here' &&
    firebaseConfig.authDomain &&
    firebaseConfig.authDomain !== 'your_project_id.firebaseapp.com' &&
    firebaseConfig.projectId &&
    firebaseConfig.projectId !== 'your_project_id'
  );
};

let app;
let auth: Auth | null = null;
let db: Firestore | null = null;
let googleProvider: GoogleAuthProvider | null = null;

if (isFirebaseConfigured()) {
  try {
    app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    auth = getAuth(app);
    db = getFirestore(app);
    googleProvider = new GoogleAuthProvider();
    // Prompt Google sign-in to always select account if needed
    googleProvider.setCustomParameters({ prompt: 'select_account' });
  } catch (error) {
    console.error('Error initializing Firebase services:', error);
  }
} else {
  if (typeof window !== 'undefined') {
    console.warn(
      'Firebase is not configured. Please copy .env.local.example to .env.local and fill in your Firebase credentials.'
    );
  }
}

export { auth, db };

/**
 * Triggers Google Sign-in Popup
 */
export const loginWithGoogle = async () => {
  if (!isFirebaseConfigured() || !auth || !googleProvider) {
    throw new Error('Firebase Auth is not configured. Setup environment variables first.');
  }
  try {
    const result = await signInWithPopup(auth, googleProvider);
    return result.user;
  } catch (error) {
    console.error('Google Auth Login Error:', error);
    throw error;
  }
};

/**
 * Signs out the active user session
 */
export const logoutUser = async () => {
  if (!isFirebaseConfigured() || !auth) {
    return;
  }
  try {
    await signOut(auth);
  } catch (error) {
    console.error('Logout Error:', error);
    throw error;
  }
};

/**
 * Save user resume state to Cloud Firestore
 */
export const saveResumeToCloud = async (userId: string, data: ResumeData): Promise<void> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase Firestore is not configured.');
  }
  try {
    const userResumeRef = doc(db, 'resumes', userId);
    await setDoc(userResumeRef, {
      ...data,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.error('Failed to save resume to cloud:', error);
    throw error;
  }
};

/**
 * Retrieve user resume state from Cloud Firestore
 */
export const getResumeFromCloud = async (userId: string): Promise<ResumeData | null> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase Firestore is not configured.');
  }
  try {
    const userResumeRef = doc(db, 'resumes', userId);
    const docSnap = await getDoc(userResumeRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      // Remove any firestore-specific properties if they aren't part of ResumeData
      const { updatedAt, ...resumeData } = data;
      return resumeData as ResumeData;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch resume from cloud:', error);
    throw error;
  }
};

export const savePresetsToCloud = async (userId: string, presets: any[]): Promise<void> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase Firestore is not configured.');
  }
  try {
    const userPresetsRef = doc(db, 'resumes', userId);
    await setDoc(userPresetsRef, {
      savedPresets: presets,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    console.error('Failed to save presets to cloud:', error);
    throw error;
  }
};

export const getPresetsFromCloud = async (userId: string): Promise<any[]> => {
  if (!isFirebaseConfigured() || !db) {
    throw new Error('Firebase Firestore is not configured.');
  }
  try {
    const userPresetsRef = doc(db, 'resumes', userId);
    const docSnap = await getDoc(userPresetsRef);
    if (docSnap.exists()) {
      return docSnap.data().savedPresets || [];
    }
    return [];
  } catch (error) {
    console.error('Failed to fetch presets from cloud:', error);
    throw error;
  }
};

/**
 * Register a user with Email and Password, setting their Display Name
 */
export const registerWithEmail = async (email: string, password: string, displayName: string) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('Firebase Auth is not configured. Setup environment variables first.');
  }
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(userCredential.user, { displayName });
    return userCredential.user;
  } catch (error) {
    console.error('Email registration error:', error);
    throw error;
  }
};

/**
 * Sign in a user with Email and Password
 */
export const loginWithEmail = async (email: string, password: string) => {
  if (!isFirebaseConfigured() || !auth) {
    throw new Error('Firebase Auth is not configured. Setup environment variables first.');
  }
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    return userCredential.user;
  } catch (error) {
    console.error('Email login error:', error);
    throw error;
  }
};
