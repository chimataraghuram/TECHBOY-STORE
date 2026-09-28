import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, signInWithPopup, signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyC1YBEtO-8V4Ag_1K-wTTcLIHwYsdqGTf0",
  authDomain: "techboy-store.firebaseapp.com",
  projectId: "techboy-store",
  storageBucket: "techboy-store.firebasestorage.app",
  messagingSenderId: "127168496451",
  appId: "1:127168496451:web:c7b1ddda615f2bef9625f6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

export { auth, googleProvider, signInWithPopup, signOut };
