import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import {
    User, Bell, Heart, GitCompare, Settings, ShieldCheck, Mail, Calendar,
    ArrowLeft, LogOut, CheckCircle2, Smartphone, Sparkles, TrendingDown,
    Target, Trash2, Edit3, Check, X, Package, Star, ExternalLink, BarChart2,
    BellOff, Zap
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { resolveProductImage } from '../utils/imageResolver';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

/* ─── Smooth tab change transition ─── */
const pageVariants = {
    initial: { opacity: 0, y: 10, filter: 'blur(3px)' },
    animate: { opacity: 1, y: 0, filter: 'blur(0px)' },
    exit:    { opacity: 0, y: -6, filter: 'blur(3px)' }
};
const pageTransition = { duration: 0.22, ease: [0.22, 1, 0.36, 1] };

/* ─── Toggle switch component ─── */
const Toggle = ({ checked, onChange }) => (
    <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={onChange}
        className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-all duration-300 focus:outline-none ${checked ? 'bg-gradient-to-r from-[#ff1f3d] to-[#e60023] shadow-[0_0_12px_rgba(255,31,61,0.5)]' : 'bg-white/10 border border-white/15'}`}
    >
        <span className={`inline-block h-4 w-4 rounded-full bg-white shadow-sm transform transition-transform duration-300 ${checked ? 'translate-x-6' : 'translate-x-1'}`} />
    </button>
);

/* ─── Star rating display ─── */
const Stars = ({ rating }) => (
    <div className="flex gap-0.5">
        {[1,2,3,4,5].map(i => (
            <Star key={i} size={11} className={i <= Math.round(rating) ? 'text-yellow-400 fill-yellow-400' : 'text-gray-600'} />
        ))}
    </div>
);

const ProfilePage = ({ setCurrentView, initialTab, onSearch }) => {
    const { user, authFetch, logout, login, isAuthenticated } = useAuth();
    const [activeTab, setActiveTab] = useState(initialTab || 'profile');

    // Profile
    const [isEditingName, setIsEditingName] = useState(false);
    const [customName, setCustomName] = useState('');

    // Alerts
    const [alerts, setAlerts] = useState([]);
    const [isLoadingAlerts, setIsLoadingAlerts] = useState(false);

    // Wishlist
    const [wishlist, setWishlist] = useState([]);

    // Compare List
    const [compareList, setCompareList] = useState([]);

    // Settings
    const [notifications, setNotifications] = useState({
        priceDrops: true,
        weeklyDigest: false,
        launchAlerts: true
    });

    /* ── Load user saved name ── */
    useEffect(() => {
        if (user) {
            const saved = localStorage.getItem(`tb_custom_name_${user.uid || user.id}`);
            setCustomName(saved || user.name || user.displayName || 'TechBoy Explorer');
        }
    }, [user]);

    /* ── Load alerts ── */
    useEffect(() => {
        if (isAuthenticated) fetchAlerts();
    }, [isAuthenticated]);

    /* ── Load wishlist from localStorage ── */
    useEffect(() => {
        const loadWishlist = () => {
            try {
                setWishlist(JSON.parse(localStorage.getItem('tb_wishlist') || '[]'));
            } catch { setWishlist([]); }
        };
        loadWishlist();
        window.addEventListener('tb_wishlist_updated', loadWishlist);
        return () => window.removeEventListener('tb_wishlist_updated', loadWishlist);
    }, []);

    /* ── Load compare list from localStorage ── */
    useEffect(() => {
        const loadCompare = () => {
            try {
                setCompareList(JSON.parse(localStorage.getItem('tb_compare_list') || '[]'));
            } catch { setCompareList([]); }
        };
        loadCompare();
        window.addEventListener('tb_compare_updated', loadCompare);
        return () => window.removeEventListener('tb_compare_updated', loadCompare);
    }, []);

    /* ── Support initial tab from nav ── */
    useEffect(() => {
        if (initialTab) setActiveTab(initialTab);
    }, [initialTab]);

    const fetchAlerts = async () => {
        try {
            setIsLoadingAlerts(true);
            const res = await authFetch(`${API_BASE_URL}/alerts/`);
            if (res.ok) {
                const data = await res.json();
                setAlerts(data.results || data || []);
            }
        } catch (err) {
            console.error('Failed to fetch alerts', err);
        } finally {
            setIsLoadingAlerts(false);
        }
    };

    const handleSaveName = () => {
        if (customName.trim() && user) {
            localStorage.setItem(`tb_custom_name_${user.uid || user.id}`, customName.trim());
            user.name = customName.trim();
            user.displayName = customName.trim();
        }
        setIsEditingName(false);
    };

    const handleToggleAlert = async (id, currentStatus) => {
        try {
            const res = await authFetch(`${API_BASE_URL}/alerts/${id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !currentStatus })
            });
            if (res.ok) fetchAlerts();
        } catch (err) { console.error('Toggle alert error', err); }
    };

    const handleDeleteAlert = async (id) => {
        if (!window.confirm('Remove this price tracker?')) return;
        try {
            const res = await authFetch(`${API_BASE_URL}/alerts/${id}/`, { method: 'DELETE' });
            if (res.ok || res.status === 204) setAlerts(prev => prev.filter(a => a.id !== id));
        } catch (err) { console.error('Delete alert error', err); }
    };

    const handleRemoveWishlist = (item) => {
        try {
            const stored = JSON.parse(localStorage.getItem('tb_wishlist') || '[]');
            const updated = stored.filter(p => p.id !== item.id && p.name !== item.name);
            localStorage.setItem('tb_wishlist', JSON.stringify(updated));
            setWishlist(updated);
            window.dispatchEvent(new Event('tb_wishlist_updated'));
        } catch (e) {}
    };

    const handleRemoveCompare = (item) => {
        try {
            const stored = JSON.parse(localStorage.getItem('tb_compare_list') || '[]');
            const updated = stored.filter(p => p.id !== item.id);
            localStorage.setItem('tb_compare_list', JSON.stringify(updated));
            setCompareList(updated);
            window.dispatchEvent(new Event('tb_compare_updated'));
        } catch (e) {}
    };

    const handleClearCompare = () => {
        localStorage.setItem('tb_compare_list', '[]');
        setCompareList([]);
        window.dispatchEvent(new Event('tb_compare_updated'));
    };

    /* ─── GUEST / NOT LOGGED IN ─── */
    if (!user) {
        return (
            <div className="min-h-[80vh] pt-28 pb-20 px-4 flex items-center justify-center">
                <m.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-md w-full bg-[#0d0d16]/90 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-2xl shadow-[0_25px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(255,31,61,0.2)]"
                >
                    <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-red-500/10 border-2 border-red-500/40 flex items-center justify-center text-red-500 shadow-[0_0_25px_rgba(255,31,61,0.4)]">
                        <User size={38} className="stroke-[2]" />
                    </div>
                    <h2 className="text-2xl font-black text-white mb-2">Sign In to Your Profile</h2>
                    <p className="text-gray-400 text-sm mb-7 leading-relaxed">
                        Access your price alerts, wishlist, compare list, and account settings.
                    </p>
                    <button
                        onClick={login}
                        className="w-full py-4 rounded-2xl bg-gradient-to-r from-[#ff3d55] to-[#e60023] hover:from-[#ff4d64] hover:to-[#ff1030] text-white font-extrabold text-sm tracking-wide shadow-[0_0_25px_rgba(230,0,35,0.45)] hover:shadow-[0_0_35px_rgba(255,31,61,0.7)] transition-all active:scale-95 mb-4"
                    >
                        Sign In with Google
                    </button>
                    <button onClick={() => setCurrentView('home')} className="text-xs text-gray-400 hover:text-white transition-colors">
                        ← Back to Catalog
                    </button>
                </m.div>
            </div>
        );
    }

    const avatarUrl = user.avatar || user.photoURL || ('https://api.dicebear.com/7.x/avataaars/svg?seed=' + (user.uid || 'user'));
    const memberSince = user.created_at ? new Date(user.created_at).getFullYear() : '2026';

    const TABS = [
        { id: 'profile',  icon: User,       label: 'My Profile' },
        { id: 'alerts',   icon: Bell,       label: 'Alerts',     count: alerts.length },
        { id: 'wishlist', icon: Heart,      label: 'Wishlist',   count: wishlist.length },
        { id: 'compare',  icon: GitCompare, label: 'Compare',    count: compareList.length },
        { id: 'settings', icon: Settings,   label: 'Settings' },
    ];

    return (
        <div className="min-h-screen pt-24 sm:pt-28 pb-28 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
            {/* Back & Logout bar */}
            <div className="mb-5 flex items-center justify-between">
                <button
                    onClick={() => { setCurrentView('home'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                    className="inline-flex items-center gap-2 text-xs sm:text-sm font-bold text-gray-300 hover:text-white bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 px-4 py-2 rounded-full transition-all"
                >
                    <ArrowLeft size={15} /> Back to Store
                </button>
                <button
                    onClick={logout}
                    className="inline-flex items-center gap-2 text-xs font-bold text-red-400 hover:text-white hover:bg-red-500/20 border border-red-500/30 px-3.5 py-1.5 rounded-full transition-all"
                >
                    <LogOut size={13} /> Sign Out
                </button>
            </div>

            {/* ─── Profile Banner ─── */}
            <m.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#12121e]/95 via-[#0b0b12]/95 to-[#08080d]/95 border border-white/15 p-5 sm:p-7 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_35px_rgba(255,31,61,0.18)] mb-6"
            >
                <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/15 rounded-full blur-[80px] pointer-events-none" />
                <div className="absolute -bottom-10 left-10 w-64 h-64 bg-red-600/10 rounded-full blur-[70px] pointer-events-none" />

                <div className="relative z-10 flex flex-col sm:flex-row items-center sm:items-start gap-5 sm:gap-6">
                    {/* Avatar */}
                    <div className="relative shrink-0 group">
                        <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-4 border-red-500/80 shadow-[0_0_30px_rgba(255,31,61,0.55)] overflow-hidden bg-black/40">
                            <img src={avatarUrl} alt={customName} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                        </div>
                        <span className="absolute bottom-1 right-1 w-6 h-6 rounded-full bg-green-500 border-2 border-[#0d0d16] flex items-center justify-center shadow-lg" title="Online">
                            <CheckCircle2 size={13} className="text-white stroke-[3]" />
                        </span>
                    </div>

                    {/* User info */}
                    <div className="flex-1 min-w-0 text-center sm:text-left">
                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mb-2">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-red-500/15 border border-red-500/30 text-red-400 shadow-[0_0_12px_rgba(255,31,61,0.3)]">
                                <Sparkles size={11} /> VIP Explorer
                            </span>
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-semibold text-gray-400 bg-white/5 border border-white/10">
                                <ShieldCheck size={11} className="text-green-400" /> Verified
                            </span>
                        </div>

                        {/* Editable name */}
                        <div className="flex items-center justify-center sm:justify-start gap-2 mb-1.5">
                            {isEditingName ? (
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={customName}
                                        onChange={e => setCustomName(e.target.value)}
                                        onKeyDown={e => e.key === 'Enter' && handleSaveName()}
                                        autoFocus
                                        className="bg-black/60 border border-red-500/60 rounded-xl px-3 py-1 text-white text-xl font-bold outline-none focus:ring-2 focus:ring-red-500/50"
                                    />
                                    <button onClick={handleSaveName} className="p-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white" title="Save">
                                        <Check size={14} />
                                    </button>
                                    <button onClick={() => setIsEditingName(false)} className="p-1.5 rounded-lg bg-white/10 text-white" title="Cancel">
                                        <X size={14} />
                                    </button>
                                </div>
                            ) : (
                                <>
                                    <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">{customName}</h1>
                                    <button onClick={() => setIsEditingName(true)} className="text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors" title="Edit name">
                                        <Edit3 size={14} />
                                    </button>
                                </>
                            )}
                        </div>

                        <div className="flex flex-wrap items-center justify-center sm:justify-start gap-4 text-xs text-gray-400">
                            <span className="inline-flex items-center gap-1.5"><Mail size={13} className="text-red-400" />{user.email || 'Google Account'}</span>
                            <span className="inline-flex items-center gap-1.5"><Calendar size={13} className="text-red-400" />Member since {memberSince}</span>
                        </div>
                    </div>

                    {/* Quick stats */}
                    <div className="grid grid-cols-4 sm:grid-cols-2 gap-2 shrink-0">
                        {[
                            { label: 'Alerts', value: alerts.length, color: 'text-red-400' },
                            { label: 'Wishlist', value: wishlist.length, color: 'text-pink-400' },
                            { label: 'Compare', value: compareList.length, color: 'text-blue-400' },
                            { label: 'Tier', value: 'VIP', color: 'text-yellow-400' },
                        ].map(s => (
                            <div key={s.label} className="rounded-2xl bg-white/[0.04] border border-white/10 p-3 text-center min-w-[70px]">
                                <div className={`text-xl font-black ${s.color}`}>{s.value}</div>
                                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">{s.label}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </m.div>

            {/* ─── Tab Navigation ─── */}
            <div className="flex items-center gap-1 mb-6 p-1 rounded-2xl bg-white/[0.03] border border-white/10 overflow-x-auto hide-scrollbar">
                {TABS.map(tab => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`relative flex items-center gap-1.5 px-3 sm:px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all shrink-0 ${
                                isActive
                                    ? 'bg-gradient-to-r from-[#ff1f3d] to-[#e60023] text-white shadow-[0_2px_14px_rgba(230,0,35,0.45)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/5'
                            }`}
                        >
                            {isActive && (
                                <m.div
                                    layoutId="profileTabPill"
                                    className="absolute inset-0 rounded-xl bg-gradient-to-r from-[#ff1f3d] to-[#e60023] -z-10"
                                    transition={{ type: 'spring', stiffness: 380, damping: 28 }}
                                />
                            )}
                            <Icon size={14} />
                            <span>{tab.label}</span>
                            {tab.count !== undefined && tab.count > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-black ${isActive ? 'bg-white/25 text-white' : 'bg-red-500/20 text-red-400'}`}>
                                    {tab.count}
                                </span>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* ─── Tab Content ─── */}
            <AnimatePresence mode="wait">
                {/* ════ MY PROFILE ════ */}
                {activeTab === 'profile' && (
                    <m.div key="profile" {...pageVariants} animate={pageVariants.animate} transition={pageTransition}>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                            {/* Account Info Card */}
                            <div className="rounded-3xl bg-[#0f0f18]/90 border border-white/10 p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-8 h-8 rounded-xl bg-red-500/15 flex items-center justify-center">
                                        <User size={16} className="text-red-400" />
                                    </div>
                                    <h3 className="text-base font-bold text-white">Account Information</h3>
                                </div>
                                <div className="space-y-4">
                                    {[
                                        { label: 'Display Name', value: customName, action: () => setIsEditingName(true) },
                                        { label: 'Email Address', value: user.email || 'Google Account', action: null },
                                        { label: 'Member Since', value: `Since ${memberSince}`, action: null },
                                        { label: 'Account Type', value: 'Google Firebase Auth', action: null },
                                    ].map(row => (
                                        <div key={row.label} className="flex items-center justify-between p-3 rounded-2xl bg-white/[0.03] border border-white/5">
                                            <div>
                                                <p className="text-[11px] font-semibold text-gray-500 uppercase tracking-wider mb-0.5">{row.label}</p>
                                                <p className="text-sm text-white font-semibold">{row.value}</p>
                                            </div>
                                            {row.action && (
                                                <button onClick={row.action} className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition-colors">
                                                    <Edit3 size={13} />
                                                </button>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Activity Summary */}
                            <div className="rounded-3xl bg-[#0f0f18]/90 border border-white/10 p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-8 h-8 rounded-xl bg-blue-500/15 flex items-center justify-center">
                                        <BarChart2 size={16} className="text-blue-400" />
                                    </div>
                                    <h3 className="text-base font-bold text-white">Activity Overview</h3>
                                </div>
                                <div className="grid grid-cols-2 gap-3 mb-6">
                                    {[
                                        { icon: Bell, label: 'Price Alerts', value: alerts.length, color: 'text-red-400', bg: 'bg-red-500/10' },
                                        { icon: Heart, label: 'Wishlist Items', value: wishlist.length, color: 'text-pink-400', bg: 'bg-pink-500/10' },
                                        { icon: GitCompare, label: 'In Compare', value: compareList.length, color: 'text-blue-400', bg: 'bg-blue-500/10' },
                                        { icon: Zap, label: 'Status', value: 'Active', color: 'text-green-400', bg: 'bg-green-500/10' },
                                    ].map(stat => {
                                        const Icon = stat.icon;
                                        return (
                                            <div key={stat.label} className="rounded-2xl bg-white/[0.03] border border-white/5 p-4">
                                                <div className={`w-8 h-8 rounded-xl ${stat.bg} flex items-center justify-center mb-2`}>
                                                    <Icon size={15} className={stat.color} />
                                                </div>
                                                <div className={`text-2xl font-black ${stat.color}`}>{stat.value}</div>
                                                <div className="text-[10px] font-bold uppercase tracking-wider text-gray-500 mt-0.5">{stat.label}</div>
                                            </div>
                                        );
                                    })}
                                </div>

                                {/* Quick nav shortcuts */}
                                <div className="space-y-2">
                                    <p className="text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-2">Quick Access</p>
                                    {[
                                        { tab: 'alerts',   icon: Bell,       label: 'View Price Alerts',  count: alerts.length },
                                        { tab: 'wishlist', icon: Heart,      label: 'My Wishlist',         count: wishlist.length },
                                        { tab: 'compare',  icon: GitCompare, label: 'Compare List',        count: compareList.length },
                                    ].map(row => {
                                        const Icon = row.icon;
                                        return (
                                            <button
                                                key={row.tab}
                                                onClick={() => setActiveTab(row.tab)}
                                                className="w-full flex items-center justify-between p-3 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-red-500/30 transition-all text-left group"
                                            >
                                                <div className="flex items-center gap-3">
                                                    <Icon size={15} className="text-gray-400 group-hover:text-red-400 transition-colors" />
                                                    <span className="text-sm font-semibold text-gray-300 group-hover:text-white transition-colors">{row.label}</span>
                                                </div>
                                                <span className="text-[11px] px-2 py-0.5 rounded-full bg-white/5 text-gray-500 font-bold">{row.count}</span>
                                            </button>
                                        );
                                    })}
                                </div>
                            </div>
                        </div>
                    </m.div>
                )}

                {/* ════ MY ALERTS ════ */}
                {activeTab === 'alerts' && (
                    <m.div key="alerts" {...pageVariants} animate={pageVariants.animate} transition={pageTransition}>
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-lg font-bold text-white">Active Smartphone Watches</h3>
                                <p className="text-xs text-gray-400">Get notified the second a target price is reached</p>
                            </div>
                            <button
                                onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 80); }}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 px-3.5 py-2 rounded-full transition-all"
                            >
                                <Smartphone size={13} /> + Track Phone
                            </button>
                        </div>

                        {isLoadingAlerts ? (
                            <div className="py-16 text-center text-gray-400 text-sm">Loading your price trackers...</div>
                        ) : alerts.length === 0 ? (
                            <div className="rounded-3xl bg-white/[0.02] border border-white/10 p-12 text-center">
                                <span className="text-5xl mb-4 block">🔔</span>
                                <h4 className="text-base font-bold text-white mb-2">No active price alerts</h4>
                                <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">Set a price alert on any smartphone to get notified instantly when prices drop.</p>
                                <button
                                    onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 80); }}
                                    className="px-6 py-2.5 rounded-full bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-[0_0_20px_rgba(255,31,61,0.35)] transition-all"
                                >Browse Smartphones</button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {alerts.map(alert => (
                                    <div key={alert.id} className="rounded-2xl bg-[#0f0f18]/90 border border-white/10 hover:border-red-500/35 p-4 transition-all flex items-center justify-between gap-4">
                                        <div className="flex items-center gap-3.5 min-w-0">
                                            <div className="w-14 h-14 rounded-xl bg-white/[0.03] border border-white/10 p-1.5 shrink-0 flex items-center justify-center">
                                                <img src={resolveProductImage(alert.product_image, alert.product_name)} alt={alert.product_name} className="w-full h-full object-contain" />
                                            </div>
                                            <div className="min-w-0">
                                                <h4 className="text-white text-sm font-bold truncate">{alert.product_name}</h4>
                                                <div className="flex flex-wrap items-center gap-2 mt-1">
                                                    <span className="inline-flex items-center gap-1 text-[11px] font-extrabold text-red-400">
                                                        <Target size={11} /> ₹{Number(alert.target_price).toLocaleString()}
                                                    </span>
                                                    {alert.current_price && (
                                                        <span className="text-[11px] text-gray-500">Now: ₹{Number(alert.current_price).toLocaleString()}</span>
                                                    )}
                                                </div>
                                                <span className={`inline-flex items-center gap-1 text-[10px] font-bold mt-1 px-2 py-0.5 rounded-full ${alert.is_active ? 'bg-green-500/15 text-green-400' : 'bg-gray-500/15 text-gray-500'}`}>
                                                    {alert.is_active ? '🟢 Active' : '⏸ Paused'}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 shrink-0">
                                            <button onClick={() => handleToggleAlert(alert.id, alert.is_active)} className={`p-2 rounded-xl transition-all ${alert.is_active ? 'bg-green-500/15 text-green-400 border border-green-500/30 hover:bg-red-500/15 hover:text-red-400 hover:border-red-500/30' : 'bg-white/5 text-gray-500 border border-white/10 hover:bg-green-500/15 hover:text-green-400'}`} title={alert.is_active ? 'Pause Alert' : 'Activate Alert'}>
                                                {alert.is_active ? <Bell size={15} /> : <BellOff size={15} />}
                                            </button>
                                            <button onClick={() => handleDeleteAlert(alert.id)} className="p-2 rounded-xl text-gray-400 hover:text-red-400 hover:bg-red-500/10 transition-colors" title="Delete">
                                                <Trash2 size={15} />
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </m.div>
                )}

                {/* ════ WISHLIST ════ */}
                {activeTab === 'wishlist' && (
                    <m.div key="wishlist" {...pageVariants} animate={pageVariants.animate} transition={pageTransition}>
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-lg font-bold text-white">My Wishlist</h3>
                                <p className="text-xs text-gray-400">{wishlist.length} saved smartphone{wishlist.length !== 1 ? 's' : ''}</p>
                            </div>
                            <button
                                onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 80); }}
                                className="inline-flex items-center gap-1.5 text-xs font-bold text-pink-400 hover:text-white bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 px-3.5 py-2 rounded-full transition-all"
                            >
                                <Heart size={13} /> + Add More
                            </button>
                        </div>

                        {wishlist.length === 0 ? (
                            <div className="rounded-3xl bg-white/[0.02] border border-white/10 p-12 text-center">
                                <span className="text-5xl mb-4 block">🤍</span>
                                <h4 className="text-base font-bold text-white mb-2">Your wishlist is empty</h4>
                                <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">Tap the ❤️ on any phone card to save it here for later.</p>
                                <button onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 80); }} className="px-6 py-2.5 rounded-full bg-pink-600 hover:bg-pink-500 text-white text-xs font-bold transition-all">
                                    Browse Phones
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                {wishlist.map((item, i) => {
                                    const imgSrc = resolveProductImage(item.image, item.name);
                                    const price = item.price || item.current_price || 0;
                                    return (
                                        <div key={item.id || i} className="rounded-2xl bg-[#0f0f18]/90 border border-white/10 hover:border-pink-500/35 overflow-hidden transition-all group">
                                            {/* Image */}
                                            <div className="relative h-44 bg-gradient-to-b from-white/[0.03] to-transparent flex items-center justify-center p-4">
                                                <img src={imgSrc} alt={item.name} className="h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-400" />
                                                <button onClick={() => handleRemoveWishlist(item)} className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 border border-white/15 text-gray-400 hover:text-red-400 hover:border-red-500/50 flex items-center justify-center transition-all">
                                                    <X size={13} />
                                                </button>
                                            </div>
                                            {/* Info */}
                                            <div className="p-4">
                                                <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{item.brand || 'Smartphone'}</p>
                                                <h4 className="text-sm font-bold text-white truncate mb-1">{item.name}</h4>
                                                <div className="flex items-center gap-2">
                                                    <Stars rating={item.rating || 4.5} />
                                                    <span className="text-[10px] text-gray-500">{item.review_count || '1.2K'} reviews</span>
                                                </div>
                                                <p className="text-lg font-extrabold text-red-400 mt-2">₹{Number(price).toLocaleString()}</p>
                                                <div className="flex gap-2 mt-3">
                                                    <button
                                                        onClick={() => { setCurrentView('home'); onSearch?.(item.name); setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 80); }}
                                                        className="flex-1 py-2 rounded-xl text-xs font-bold text-white bg-gradient-to-r from-[#ff1f3d] to-[#e60023] hover:from-[#ff4d64] hover:to-[#ff1030] transition-all shadow-[0_0_14px_rgba(255,31,61,0.35)]"
                                                    >
                                                        View Phone
                                                    </button>
                                                    <button onClick={() => handleRemoveWishlist(item)} className="py-2 px-3 rounded-xl text-xs font-bold text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-white/10 transition-all">
                                                        <Trash2 size={13} />
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </m.div>
                )}

                {/* ════ COMPARE LIST ════ */}
                {activeTab === 'compare' && (
                    <m.div key="compare" {...pageVariants} animate={pageVariants.animate} transition={pageTransition}>
                        <div className="flex items-center justify-between mb-5">
                            <div>
                                <h3 className="text-lg font-bold text-white">Compare List</h3>
                                <p className="text-xs text-gray-400">{compareList.length}/3 phones selected for side-by-side comparison</p>
                            </div>
                            {compareList.length > 0 && (
                                <button onClick={handleClearCompare} className="inline-flex items-center gap-1.5 text-xs font-bold text-gray-400 hover:text-red-400 bg-white/5 hover:bg-red-500/10 border border-white/10 hover:border-red-500/30 px-3.5 py-2 rounded-full transition-all">
                                    <Trash2 size={13} /> Clear All
                                </button>
                            )}
                        </div>

                        {compareList.length === 0 ? (
                            <div className="rounded-3xl bg-white/[0.02] border border-white/10 p-12 text-center">
                                <span className="text-5xl mb-4 block">⚖️</span>
                                <h4 className="text-base font-bold text-white mb-2">Nothing to compare yet</h4>
                                <p className="text-gray-400 text-sm max-w-sm mx-auto mb-6">Hit the Compare button on any phone card to add it here. Compare up to 3 phones side-by-side.</p>
                                <button onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 80); }} className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold transition-all">
                                    Browse Phones
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {/* Cards */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {compareList.map((item, i) => {
                                        const imgSrc = resolveProductImage(item.image, item.name);
                                        const price = item.price || item.current_price || 0;
                                        return (
                                            <div key={item.id || i} className="rounded-2xl bg-[#0f0f18]/90 border border-blue-500/25 hover:border-blue-500/50 overflow-hidden transition-all group">
                                                <div className="relative h-44 bg-gradient-to-b from-blue-500/5 to-transparent flex items-center justify-center p-4">
                                                    <span className="absolute top-2.5 left-2.5 w-6 h-6 rounded-full bg-blue-500/25 border border-blue-500/50 flex items-center justify-center text-[11px] font-black text-blue-400">{i + 1}</span>
                                                    <img src={imgSrc} alt={item.name} className="h-full object-contain drop-shadow-lg group-hover:scale-105 transition-transform duration-400" />
                                                    <button onClick={() => handleRemoveCompare(item)} className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-black/60 border border-white/15 text-gray-400 hover:text-red-400 hover:border-red-500/50 flex items-center justify-center transition-all">
                                                        <X size={13} />
                                                    </button>
                                                </div>
                                                <div className="p-4">
                                                    <p className="text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-1">{item.brand || 'Smartphone'}</p>
                                                    <h4 className="text-sm font-bold text-white truncate mb-1">{item.name}</h4>
                                                    <p className="text-lg font-extrabold text-blue-400">₹{Number(price).toLocaleString()}</p>
                                                    {item.tag && <p className="text-[11px] text-gray-500 mt-1 truncate">{item.tag}</p>}
                                                </div>
                                            </div>
                                        );
                                    })}

                                    {/* Empty slots */}
                                    {Array.from({ length: Math.max(0, 3 - compareList.length) }).map((_, i) => (
                                        <button
                                            key={'empty_' + i}
                                            onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 80); }}
                                            className="rounded-2xl border-2 border-dashed border-white/10 hover:border-blue-500/40 p-8 flex flex-col items-center justify-center gap-2 transition-all min-h-[200px] group"
                                        >
                                            <GitCompare size={28} className="text-gray-600 group-hover:text-blue-400 transition-colors" />
                                            <span className="text-xs font-bold text-gray-500 group-hover:text-blue-400 transition-colors">+ Add Phone</span>
                                        </button>
                                    ))}
                                </div>

                                {/* Compare button */}
                                {compareList.length >= 2 && (
                                    <div className="flex justify-center pt-2">
                                        <button
                                            onClick={() => { setCurrentView('home'); setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 80); }}
                                            className="inline-flex items-center gap-2 px-8 py-3 rounded-full bg-gradient-to-r from-blue-600 to-blue-500 hover:from-blue-500 hover:to-blue-400 text-white font-extrabold text-sm shadow-[0_0_20px_rgba(59,130,246,0.45)] hover:shadow-[0_0_30px_rgba(59,130,246,0.65)] transition-all active:scale-95"
                                        >
                                            <GitCompare size={16} />
                                            Compare {compareList.length} Phones Side-by-Side
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </m.div>
                )}

                {/* ════ SETTINGS ════ */}
                {activeTab === 'settings' && (
                    <m.div key="settings" {...pageVariants} animate={pageVariants.animate} transition={pageTransition}>
                        <div className="max-w-2xl space-y-5">
                            {/* Notifications */}
                            <div className="rounded-3xl bg-[#0f0f18]/90 border border-white/10 p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-8 h-8 rounded-xl bg-yellow-500/15 flex items-center justify-center">
                                        <Bell size={15} className="text-yellow-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-white">Notification Preferences</h3>
                                        <p className="text-xs text-gray-400">Choose how TechBoy communicates with you</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    {[
                                        { key: 'priceDrops', label: 'Instant Price Drop Alerts', desc: 'Get notified the moment a tracked phone drops in price', icon: TrendingDown },
                                        { key: 'launchAlerts', label: 'New Flagship Launches', desc: 'Alerts when iPhone, Galaxy, OnePlus and others launch', icon: Zap },
                                        { key: 'weeklyDigest', label: 'Weekly Market Digest', desc: 'Curated weekly highlights of best-value phones per budget', icon: Package },
                                    ].map(n => {
                                        const Icon = n.icon;
                                        return (
                                            <div key={n.key} className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5 hover:border-white/10 transition-all">
                                                <div className="flex items-start gap-3">
                                                    <Icon size={16} className="text-gray-400 mt-0.5 shrink-0" />
                                                    <div>
                                                        <p className="text-sm font-bold text-white">{n.label}</p>
                                                        <p className="text-xs text-gray-400 mt-0.5">{n.desc}</p>
                                                    </div>
                                                </div>
                                                <Toggle checked={notifications[n.key]} onChange={() => setNotifications(prev => ({ ...prev, [n.key]: !prev[n.key] }))} />
                                            </div>
                                        );
                                    })}
                                </div>
                            </div>

                            {/* Account Settings */}
                            <div className="rounded-3xl bg-[#0f0f18]/90 border border-white/10 p-6">
                                <div className="flex items-center gap-2 mb-5">
                                    <div className="w-8 h-8 rounded-xl bg-purple-500/15 flex items-center justify-center">
                                        <Settings size={15} className="text-purple-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-white">Account Settings</h3>
                                        <p className="text-xs text-gray-400">Manage your account and data</p>
                                    </div>
                                </div>
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                        <div>
                                            <p className="text-sm font-bold text-white">Display Name</p>
                                            <p className="text-xs text-gray-400">{customName}</p>
                                        </div>
                                        <button onClick={() => { setActiveTab('profile'); setIsEditingName(true); }} className="text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 px-3 py-1.5 rounded-xl transition-all">Edit</button>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                        <div>
                                            <p className="text-sm font-bold text-white">Email</p>
                                            <p className="text-xs text-gray-400">{user.email}</p>
                                        </div>
                                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-green-500/15 text-green-400 border border-green-500/30">Verified</span>
                                    </div>
                                    <div className="flex items-center justify-between p-4 rounded-2xl bg-white/[0.03] border border-white/5">
                                        <div>
                                            <p className="text-sm font-bold text-white">Auth Provider</p>
                                            <p className="text-xs text-gray-400">Google Firebase Authentication</p>
                                        </div>
                                        <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-blue-500/15 text-blue-400 border border-blue-500/30">Google</span>
                                    </div>
                                </div>

                                <div className="mt-5 pt-5 border-t border-white/10">
                                    <button
                                        onClick={logout}
                                        className="w-full flex items-center justify-center gap-2.5 py-3.5 rounded-2xl text-sm font-extrabold text-red-400 hover:text-white bg-red-500/10 hover:bg-red-600 border border-red-500/30 hover:border-red-600 transition-all shadow-[0_0_0_0_rgba(255,31,61,0)] hover:shadow-[0_0_20px_rgba(255,31,61,0.4)] active:scale-95"
                                    >
                                        <LogOut size={16} /> Sign Out of TechBoy Store
                                    </button>
                                </div>
                            </div>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default ProfilePage;
