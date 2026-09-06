import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { Bell, BellOff, Settings2, Trash2, TrendingDown, Target, Loader2 } from 'lucide-react';
import { resolveProductImage } from '../utils/imageResolver';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

const TrackHub = () => {
    const { user, authFetch, isAuthenticated } = useAuth();
    const [alerts, setAlerts] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [editingAlert, setEditingAlert] = useState(null);
    const [editPrice, setEditPrice] = useState('');

    useEffect(() => {
        if (!isAuthenticated) {
            setIsLoading(false);
            return;
        }
        fetchAlerts();
    }, [isAuthenticated]);

    const fetchAlerts = async () => {
        try {
            setIsLoading(true);
            const res = await authFetch(`${API_BASE_URL}/alerts/`);
            if (res.ok) {
                const data = await res.json();
                setAlerts(data.results || data || []);
            }
        } catch (err) {
            console.error('Failed to fetch alerts', err);
        } finally {
            setIsLoading(false);
        }
    };

    const handleToggleActive = async (id, currentStatus) => {
        try {
            const res = await authFetch(`${API_BASE_URL}/alerts/${id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ is_active: !currentStatus })
            });
            if (res.ok) {
                fetchAlerts();
            }
        } catch (err) {
            console.error('Failed to toggle alert', err);
        }
    };

    const handleRemove = async (id) => {
        if (!window.confirm('Are you sure you want to remove this alert?')) return;
        try {
            const res = await authFetch(`${API_BASE_URL}/alerts/${id}/`, {
                method: 'DELETE'
            });
            if (res.ok || res.status === 204) {
                setAlerts(prev => prev.filter(a => a.id !== id));
            }
        } catch (err) {
            console.error('Failed to delete alert', err);
        }
    };

    const handleSaveEdit = async () => {
        if (!editingAlert || !editPrice) return;
        try {
            const res = await authFetch(`${API_BASE_URL}/alerts/${editingAlert.id}/`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ target_price: parseInt(editPrice) })
            });
            if (res.ok) {
                setEditingAlert(null);
                fetchAlerts();
            }
        } catch (err) {
            console.error('Failed to update target price', err);
        }
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-[80vh] flex items-center justify-center bg-[#060101]">
                <div className="text-center p-8 bg-white/5 border border-white/10 rounded-2xl">
                    <Bell className="w-12 h-12 text-red-500 mx-auto mb-4" />
                    <h2 className="text-2xl font-bold text-white mb-2">Sign in required</h2>
                    <p className="text-gray-400 mb-6">Please sign in to view and manage your tracked smartphones.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#060101] pt-32 pb-20 px-4 md:px-8">
            <div className="max-w-6xl mx-auto">
                <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-4">
                    <div>
                        <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">TrackHub</h1>
                        <p className="text-gray-400 text-lg">Your automated price monitoring dashboard.</p>
                    </div>
                    <div className="bg-red-500/10 border border-red-500/20 px-4 py-2 rounded-lg flex items-center gap-2">
                        <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                        <span className="text-red-500 font-semibold text-sm">Monitoring {alerts.length} devices</span>
                    </div>
                </div>

                {isLoading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="w-8 h-8 text-red-500 animate-spin" />
                    </div>
                ) : alerts.length === 0 ? (
                    <div className="bg-[#0d0d12] border border-white/5 rounded-2xl p-12 text-center">
                        <Target className="w-16 h-16 text-gray-500 mx-auto mb-6" />
                        <h3 className="text-xl font-bold text-white mb-2">No active alerts</h3>
                        <p className="text-gray-400 max-w-md mx-auto">
                            You aren't tracking any smartphones yet. Browse the store and set price alerts to see them here.
                        </p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <AnimatePresence>
                            {alerts.map(alert => {
                                const currentPrice = alert.product?.price || 0;
                                const targetPrice = alert.target_price || 0;
                                const diff = currentPrice - targetPrice;
                                const isReached = currentPrice <= targetPrice;

                                return (
                                    <m.div
                                        key={alert.id}
                                        layout
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.95 }}
                                        className={`bg-[#0d0d12] border rounded-2xl overflow-hidden relative group transition-colors ${alert.is_active ? (isReached ? 'border-green-500/50 shadow-[0_0_20px_rgba(34,197,94,0.1)]' : 'border-white/10 hover:border-red-500/30') : 'border-white/5 opacity-60'}`}
                                    >
                                        {!alert.is_active && (
                                            <div className="absolute inset-0 bg-black/40 z-10 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                                                <button onClick={() => handleToggleActive(alert.id, alert.is_active)} className="px-4 py-2 bg-red-600 text-white font-bold rounded-lg shadow-lg">Resume Tracking</button>
                                            </div>
                                        )}

                                        <div className="p-6">
                                            <div className="flex justify-between items-start mb-6">
                                                <div className="w-16 h-16 bg-white/5 rounded-xl p-2 flex items-center justify-center border border-white/5">
                                                    <img src={resolveProductImage(alert.product?.image, alert.product?.name)} alt={alert.product?.name} className="max-w-full max-h-full object-contain" onError={(e) => e.target.src='/images/phones/apple-iphone-17-pro.jpg'} />
                                                </div>
                                                <div className="flex gap-2 relative z-20">
                                                    <button onClick={() => setEditingAlert(alert)} className="p-2 text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors">
                                                        <Settings2 size={16} />
                                                    </button>
                                                    <button onClick={() => handleToggleActive(alert.id, alert.is_active)} className={`p-2 rounded-lg transition-colors ${alert.is_active ? 'text-red-500 bg-red-500/10 hover:bg-red-500/20' : 'text-gray-400 bg-white/5 hover:bg-white/10'}`}>
                                                        {alert.is_active ? <Bell size={16} /> : <BellOff size={16} />}
                                                    </button>
                                                    <button onClick={() => handleRemove(alert.id)} className="p-2 text-gray-400 hover:text-red-500 bg-white/5 hover:bg-red-500/10 rounded-lg transition-colors">
                                                        <Trash2 size={16} />
                                                    </button>
                                                </div>
                                            </div>

                                            <div className="mb-6">
                                                <h3 className="text-white font-bold text-lg leading-tight mb-1">{alert.product?.name || 'Unknown Phone'}</h3>
                                                <div className="flex items-center gap-2">
                                                    <span className={`text-xs font-bold px-2 py-0.5 rounded ${alert.is_active ? 'bg-red-500/10 text-red-500' : 'bg-gray-500/10 text-gray-400'}`}>
                                                        {alert.is_active ? (isReached ? 'TARGET REACHED' : 'MONITORING') : 'PAUSED'}
                                                    </span>
                                                    <span className="text-gray-500 text-xs">Since {new Date(alert.created_at).toLocaleDateString()}</span>
                                                </div>
                                            </div>

                                            <div className="space-y-3">
                                                <div className="flex justify-between items-center p-3 bg-white/5 rounded-xl border border-white/5">
                                                    <span className="text-gray-400 text-sm">Current Price</span>
                                                    <span className="text-white font-bold">₹{currentPrice.toLocaleString('en-IN')}</span>
                                                </div>
                                                
                                                <div className={`flex justify-between items-center p-3 rounded-xl border ${isReached && alert.is_active ? 'bg-green-500/10 border-green-500/30' : 'bg-red-500/5 border-red-500/20'}`}>
                                                    <span className="text-gray-300 text-sm font-semibold">Target Price</span>
                                                    <span className={isReached && alert.is_active ? 'text-green-500 font-bold' : 'text-red-500 font-bold'}>₹{targetPrice.toLocaleString('en-IN')}</span>
                                                </div>
                                            </div>

                                            {alert.is_active && !isReached && diff > 0 && (
                                                <div className="mt-4 flex items-center gap-2 text-xs text-gray-400">
                                                    <TrendingDown size={14} className="text-orange-500" />
                                                    Needs to drop by <strong className="text-white">₹{diff.toLocaleString('en-IN')}</strong>
                                                </div>
                                            )}
                                        </div>
                                    </m.div>
                                );
                            })}
                        </AnimatePresence>
                    </div>
                )}
            </div>

            {/* Edit Modal */}
            <AnimatePresence>
                {editingAlert && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <m.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setEditingAlert(null)} />
                        <m.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }} className="relative bg-[#0d0d12] border border-white/10 rounded-2xl p-6 w-full max-w-md shadow-2xl">
                            <h3 className="text-xl font-bold text-white mb-2">Edit Target Price</h3>
                            <p className="text-gray-400 text-sm mb-6">Set a new target price for {editingAlert.product?.name}</p>
                            
                            <div className="mb-6">
                                <label className="block text-gray-400 text-xs font-bold mb-2">TARGET PRICE (₹)</label>
                                <input 
                                    type="number" 
                                    value={editPrice}
                                    onChange={(e) => setEditPrice(e.target.value)}
                                    placeholder={editingAlert.target_price}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:bg-red-500/5 transition-colors"
                                />
                                <p className="text-xs text-gray-500 mt-2">Current price is ₹{editingAlert.product?.price?.toLocaleString('en-IN')}</p>
                            </div>

                            <div className="flex gap-3">
                                <button onClick={() => setEditingAlert(null)} className="flex-1 px-4 py-2 bg-white/5 hover:bg-white/10 text-white font-bold rounded-xl transition-colors">Cancel</button>
                                <button onClick={handleSaveEdit} className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-bold rounded-xl transition-colors shadow-lg">Save Changes</button>
                            </div>
                        </m.div>
                    </div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default TrackHub;
