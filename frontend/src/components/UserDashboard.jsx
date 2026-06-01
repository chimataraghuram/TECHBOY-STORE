import React from 'react';
import { motion as m, AnimatePresence } from 'framer-motion';
import { X, Bell, Bookmark, Settings, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useMediaQuery } from '../hooks/useMediaQuery';
import './UserDashboard.css';

const UserDashboard = ({ isOpen, onClose }) => {
    const { user, priceAlerts, removeAlert, logout } = useAuth();
    const isMobile = useMediaQuery('(max-width: 768px)');

    if (!isOpen || !user) return null;

    const desktopVariants = {
      hidden: { opacity: 0, scale: 0.9, y: 20 },
      visible: { opacity: 1, scale: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
      exit: { opacity: 0, scale: 0.9, y: 20, transition: { duration: 0.2 } }
    };

    const mobileVariants = {
      hidden: { opacity: 1, y: "100%" },
      visible: { opacity: 1, y: 0, transition: { type: "spring", damping: 25, stiffness: 300 } },
      exit: { opacity: 1, y: "100%", transition: { duration: 0.2 } }
    };

    const modalStyle = isMobile ? {
      position: 'fixed', bottom: 0, left: 0, width: '100%', maxWidth: '100%',
      margin: 0, maxHeight: '90vh', borderBottomLeftRadius: 0, borderBottomRightRadius: 0, overflowY: 'auto'
    } : { width: '100%', maxWidth: '700px', margin: '0 auto', maxHeight: '85vh', overflowY: 'auto' };

    return (
        <AnimatePresence>
            <div className="dashboard-overlay" onClick={onClose} style={isMobile ? { alignItems: 'flex-end', padding: 0 } : {}}>
                <m.div 
                    className="dashboard-modal glass-panel"
                    variants={isMobile ? mobileVariants : desktopVariants}
                    initial="hidden" animate="visible" exit="exit"
                    onClick={e => e.stopPropagation()}
                    style={modalStyle}
                >
                    <button className="dashboard-close" onClick={onClose}><X size={20} /></button>
                    
                    <div className="dashboard-header">
                        <img src={user.avatar || 'https://api.dicebear.com/7.x/avataaars/svg?seed=TechBoy'} alt="Avatar" className="dash-avatar" />
                        <div>
                            <h2>Welcome back, {user.name}</h2>
                            <p>{user.email}</p>
                        </div>
                    </div>

                    <div className="dashboard-body">
                        <h3><Bell size={18} /> Active Price Alerts</h3>
                        {priceAlerts.length === 0 ? (
                            <div className="empty-state">No active price alerts.</div>
                        ) : (
                            <div className="alerts-list">
                                {priceAlerts.map(alert => (
                                    <div key={alert.id} className="alert-card glass-card">
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                            <img src={alert.product.image} alt={alert.product.name} style={{ width: '40px', height: '40px', objectFit: 'contain' }} />
                                            <div>
                                                <h4>{alert.product.name}</h4>
                                                <p>Target: ₹{alert.targetPrice.toLocaleString('en-IN')}</p>
                                            </div>
                                        </div>
                                        <button className="remove-btn" onClick={() => removeAlert(alert.id)}>Remove</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    
                    <div className="dashboard-footer">
                        <button className="logout-btn" onClick={() => { onClose(); logout(); }}>Logout</button>
                    </div>
                </m.div>
            </div>
        </AnimatePresence>
    );
};

export default UserDashboard;
