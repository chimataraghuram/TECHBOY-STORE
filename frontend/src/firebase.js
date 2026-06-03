import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const cleanEnv = (val, fallback) => {
  let clean = val || fallback;
  if (typeof clean === 'string') {
    clean = clean.replace(/["']/g, "").trim();
  }
  return clean;
};

const firebaseConfig = {
  apiKey: cleanEnv(import.meta.env.VITE_FIREBASE_API_KEY, "AIzaSyC1YBEt0-8V4Ag_1K-wTTcLIHwYsdqGTf0"),
  authDomain: cleanEnv(import.meta.env.VITE_FIREBASE_AUTH_DOMAIN, "techboy-store.firebaseapp.com"),
  projectId: cleanEnv(import.meta.env.VITE_FIREBASE_PROJECT_ID, "techboy-store"),
  storageBucket: cleanEnv(import.meta.env.VITE_FIREBASE_STORAGE_BUCKET, "techboy-store.firebasestorage.app"),
  messagingSenderId: cleanEnv(import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID, "127168496451"),
  appId: cleanEnv(import.meta.env.VITE_FIREBASE_APP_ID, "1:127168496451:web:c7b1ddda615f2bef9625f6")
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, signOut };
