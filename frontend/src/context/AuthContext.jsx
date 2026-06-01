import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export function useAuth() {
    return useContext(AuthContext);
}

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [priceAlerts, setPriceAlerts] = useState([]);
    const [watchlist, setWatchlist] = useState([]);

    // Load from localStorage on mount
    useEffect(() => {
        const storedUser = localStorage.getItem('tb_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
            const alerts = localStorage.getItem('tb_alerts');
            if (alerts) setPriceAlerts(JSON.parse(alerts));
            const watch = localStorage.getItem('tb_watchlist');
            if (watch) setWatchlist(JSON.parse(watch));
        }
    }, []);

    const login = () => {
        const dummyUser = {
            id: 'u_123',
            name: 'Tech Enthusiast',
            email: 'techfan@example.com',
            avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Felix'
        };
        setUser(dummyUser);
        localStorage.setItem('tb_user', JSON.stringify(dummyUser));
    };

    const logout = () => {
        setUser(null);
        setPriceAlerts([]);
        setWatchlist([]);
        localStorage.removeItem('tb_user');
        localStorage.removeItem('tb_alerts');
        localStorage.removeItem('tb_watchlist');
    };

    const addAlert = (product, targetPrice) => {
        const newAlert = {
            id: Date.now().toString(),
            product,
            targetPrice,
            dateAdded: new Date().toISOString()
        };
        const updated = [...priceAlerts, newAlert];
        setPriceAlerts(updated);
        localStorage.setItem('tb_alerts', JSON.stringify(updated));
    };
    
    const removeAlert = (id) => {
        const updated = priceAlerts.filter(a => a.id !== id);
        setPriceAlerts(updated);
        localStorage.setItem('tb_alerts', JSON.stringify(updated));
    };

    const toggleWatchlist = (product) => {
        const exists = watchlist.find(p => p.id === product.id);
        let updated;
        if (exists) {
            updated = watchlist.filter(p => p.id !== product.id);
        } else {
            updated = [...watchlist, product];
        }
        setWatchlist(updated);
        localStorage.setItem('tb_watchlist', JSON.stringify(updated));
    };

    return (
        <AuthContext.Provider value={{ user, priceAlerts, watchlist, login, logout, addAlert, removeAlert, toggleWatchlist }}>
            {children}
        </AuthContext.Provider>
    );
}
