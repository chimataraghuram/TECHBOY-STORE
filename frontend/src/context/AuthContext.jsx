import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, googleProvider, signInWithPopup, signOut } from '../firebase';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');
const AuthContext = createContext(null);

const TOKEN_KEY = 'techboy_token';
const REFRESH_KEY = 'techboy_refresh';
const USER_KEY = 'techboy_user';

const normalizeUser = (apiUser, firebaseUser = null) => {
    if (!apiUser && !firebaseUser) return null;

    return {
        id: apiUser?.id || firebaseUser?.uid,
        uid: apiUser?.google_id || apiUser?.firebase_uid || firebaseUser?.uid,
        google_id: apiUser?.google_id || firebaseUser?.uid,
        firebase_uid: apiUser?.firebase_uid || firebaseUser?.uid,
        username: apiUser?.username || firebaseUser?.displayName || firebaseUser?.email,
        name: apiUser?.name || apiUser?.display_name || firebaseUser?.displayName || apiUser?.username || 'TechBoy User',
        displayName: apiUser?.display_name || apiUser?.name || firebaseUser?.displayName || 'TechBoy User',
        email: apiUser?.email || firebaseUser?.email || '',
        avatar: apiUser?.avatar || apiUser?.profile_picture || firebaseUser?.photoURL || '',
        photoURL: apiUser?.profile_picture || firebaseUser?.photoURL || '',
        created_at: apiUser?.created_at
    };
};

const saveSession = ({ token, refresh, user }) => {
    if (token) {
        localStorage.setItem(TOKEN_KEY, token);
    }
    if (refresh) {
        localStorage.setItem(REFRESH_KEY, refresh);
    }
    if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
    }
};

const clearSession = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(REFRESH_KEY);
    localStorage.removeItem(USER_KEY);
};

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [authLoading, setAuthLoading] = useState(true);
    const [authError, setAuthError] = useState('');

    const restoreFromBackendToken = async () => {
        const token = localStorage.getItem(TOKEN_KEY);
        if (!token) return null;

        const res = await fetch(`${API_BASE_URL}/auth/profile/`, {
            headers: { Authorization: `Bearer ${token}` }
        });
        if (!res.ok) {
            clearSession();
            return null;
        }

        const apiUser = await res.json();
        const normalized = normalizeUser(apiUser);
        saveSession({ token, refresh: localStorage.getItem(REFRESH_KEY), user: normalized });
        setUser(normalized);
        return normalized;
    };

    const exchangeFirebaseToken = async (firebaseUser) => {
        try {
            const idToken = await firebaseUser.getIdToken(true);
            const res = await fetch(`${API_BASE_URL}/auth/google/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: idToken })
            });

            const data = await res.json().catch(() => ({}));
            if (!res.ok) {
                throw new Error(data.error || 'Backend auth failed');
            }

            const normalized = normalizeUser(data.user, firebaseUser);
            saveSession({ token: data.token, refresh: data.refresh, user: normalized });
            setUser(normalized);
            return normalized;
        } catch (backendErr) {
            console.warn('Backend exchange failed, using Firebase profile directly:', backendErr.message);
            const fallbackUser = normalizeUser(null, firebaseUser);
            saveSession({ user: fallbackUser });
            setUser(fallbackUser);
            return fallbackUser;
        }
    };

    useEffect(() => {
        const storedUser = localStorage.getItem(USER_KEY);
        if (storedUser) {
            try {
                setUser(JSON.parse(storedUser));
            } catch {
                clearSession();
            }
        }

        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            try {
                setAuthLoading(true);
                setAuthError('');

                if (!firebaseUser) {
                    await restoreFromBackendToken();
                    setAuthLoading(false);
                    return;
                }

                await exchangeFirebaseToken(firebaseUser);
            } catch (err) {
                console.error('Failed to restore Google session:', err);
                setAuthError(err.message || 'Could not restore Google session.');
                clearSession();
                setUser(null);
            } finally {
                setAuthLoading(false);
            }
        });

        return () => unsubscribe();
    }, []);

    const loginWithGoogle = async () => {
        setAuthLoading(true);
        setAuthError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            return await exchangeFirebaseToken(result.user);
        } catch (err) {
            console.error('Google sign in failed:', err);
            const message = err.code === 'auth/popup-closed-by-user'
                ? 'Google sign-in was closed before it finished.'
                : (err.message || 'Google sign-in failed.');
            setAuthError(message);
            throw err;
        } finally {
            setAuthLoading(false);
        }
    };

    const logout = async () => {
        setAuthLoading(true);
        setAuthError('');
        try {
            await signOut(auth);
        } finally {
            clearSession();
            setUser(null);
            setAuthLoading(false);
        }
    };

    const authFetch = async (url, options = {}) => {
        const token = localStorage.getItem(TOKEN_KEY);
        const headers = {
            ...(options.headers || {}),
            ...(token ? { Authorization: `Bearer ${token}` } : {})
        };

        return fetch(url, { ...options, headers });
    };

    const createPriceAlert = async ({ product, alertType, targetPrice }) => {
        if (!user) {
            throw new Error('Please sign in with Google to create price alerts.');
        }

        const res = await authFetch(`${API_BASE_URL}/alerts/`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                product: product.id,
                alert_type: alertType,
                target_price: alertType === 'TARGET' ? targetPrice : null
            })
        });

        const data = await res.json().catch(() => ({}));
        if (!res.ok) {
            throw new Error(data.detail || data.error || 'Failed to create price alert.');
        }
        return data;
    };

    const value = useMemo(() => ({
        user,
        authLoading,
        authError,
        token: localStorage.getItem(TOKEN_KEY),
        login: loginWithGoogle,
        loginWithGoogle,
        logout,
        authFetch,
        createPriceAlert,
        isAuthenticated: !!user
    }), [user, authLoading, authError]);

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}
