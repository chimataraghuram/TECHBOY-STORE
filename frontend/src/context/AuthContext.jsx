import React, { createContext, useContext, useEffect, useState } from 'react';
import { auth, googleProvider, signInWithPopup, signOut } from '../firebase';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = auth.onAuthStateChanged(async (firebaseUser) => {
      if (firebaseUser) {
        try {
          // Get Firebase token
          const token = await firebaseUser.getIdToken();
          
          // Send to Django backend
          const res = await fetch(`${import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api'}/auth/google/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ token })
          });
          
          if (res.ok) {
            const data = await res.json();
            // Store django token for API calls
            localStorage.setItem('techboy_token', data.token);
            // Store user profile combined from Firebase/Django
            const userData = {
              uid: firebaseUser.uid,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              photoURL: firebaseUser.photoURL,
              ...data.user
            };
            localStorage.setItem('techboy_user', JSON.stringify(userData));
            setUser(userData);
          } else {
            console.error('Failed to verify token with backend');
            // If backend fails, log out from firebase too to keep in sync
            await auth.signOut();
            setUser(null);
            localStorage.removeItem('techboy_token');
            localStorage.removeItem('techboy_user');
          }
        } catch (error) {
          console.error("Auth context error:", error);
          setUser(null);
        }
      } else {
        setUser(null);
        localStorage.removeItem('techboy_token');
        localStorage.removeItem('techboy_user');
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Google sign in failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      localStorage.removeItem('techboy_token');
      localStorage.removeItem('techboy_user');
      setUser(null);
    } catch (error) {
      console.error("Sign out error:", error);
    }
  };

  const value = {
    user,
    loading,
    loginWithGoogle,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
