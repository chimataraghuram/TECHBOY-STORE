import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

const WatchlistModal = ({ isOpen, onClose }) => {
    const [watchlistItems, setWatchlistItems] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!isOpen) return;
        let mounted = true;
        
        const loadWatchlist = async () => {
            setLoading(true);
            const token = localStorage.getItem('techboy_token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const res = await fetch(`${API_BASE_URL}/watchlist/`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                const data = await res.json();
                if (mounted && res.ok) {
                    setWatchlistItems(data.results || data);
                }
            } catch (err) {
                console.error("Fetch watchlist failed", err);
            } finally {
                if (mounted) setLoading(false);
            }
        };

        loadWatchlist();
        return () => { mounted = false; };
    }, [isOpen]);

    const handleRemove = async (id) => {
        const token = localStorage.getItem('techboy_token');
        try {
            const res = await fetch(`${API_BASE_URL}/watchlist/${id}/`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
                setWatchlistItems(prev => prev.filter(item => item.id !== id));
            }
        } catch (err) {
            console.error("Failed to remove item", err);
        }
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay" onClick={onClose} style={{ zIndex: 1000 }}>
            <motion.div 
                className="modal-content glass-card watchlist-modal"
                onClick={e => e.stopPropagation()}
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                style={{ maxWidth: '600px', width: '90%', padding: '24px'}}
            >
                <div className="modal-header" style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                    <h2 style={{ margin: 0 }}>Your Watchlist</h2>
                    <button className="close-btn" style={{ background: 'none', border: 'none', color: 'white', fontSize: '24px', cursor: 'pointer'}} onClick={onClose}>&times;</button>
                </div>
                <div className="modal-body watchlist-body">
                    {loading ? (
                        <p>Loading your saved items...</p>
                    ) : watchlistItems.length === 0 ? (
                        <p className="empty-msg">Your watchlist is empty. Go save some products!</p>
                    ) : (
                        <div className="watchlist-grid" style={{ display: 'grid', gap: '16px'}}>
                            {watchlistItems.map(item => (
                                <div key={item.id} className="watchlist-item glass" style={{ display: 'flex', padding: '12px', borderRadius: '12px', gap: '16px', position: 'relative' }}>
                                    <div className="watchlist-item-img" style={{ width: '80px', height: '80px', flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                        <img src={item.product_details.image} alt={item.product_details.name} style={{ maxHeight: '100%', maxWidth: '100%', objectFit: 'contain' }} />
                                    </div>
                                    <div className="watchlist-item-info" style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                                        <h4 style={{ margin: '0 0 8px 0' }}>{item.product_details.name}</h4>
                                        <span className="price text-gradient" style={{ fontWeight: 'bold', marginBottom: '8px' }}>₹{item.product_details.price?.toLocaleString()}</span>
                                        <a href={item.product_details.amazon_link} target="_blank" rel="noopener noreferrer" className="jelly-btn" style={{ padding: '6px 12px', fontSize: '12px', alignSelf: 'flex-start' }}>Get Deal</a>
                                    </div>
                                    <button className="remove-btn" onClick={() => handleRemove(item.id)} title="Remove" style={{ position: 'absolute', top: '8px', right: '8px', background: 'rgba(255,0,0,0.2)', border: 'none', color: 'white', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer' }}>
                                        &times;
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </motion.div>
        </div>
    );
};

export default WatchlistModal;
