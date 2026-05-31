import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Bell, TrendingDown, Rocket, Flame, Star, Scale, TrendingUp, Cpu, Battery, Camera } from 'lucide-react';
import '../redline.css'; // Make sure styles are pulled in

export const PREDEFINED_NOTIFICATIONS = [
    { id: 20, type: 'pick', icon: Star, title: 'TechBoy Pick', desc: 'TechBoy Pick updated for Best Camera Phone Under ₹30K', time: '2 hours ago', unread: true },
    { id: 21, type: 'pick', icon: Star, title: 'TechBoy Pick', desc: 'TechBoy Pick updated for Best Battery Phone', time: '3 hours ago', unread: true },
    { id: 22, type: 'pick', icon: Star, title: 'TechBoy Pick', desc: 'TechBoy Pick updated for Best Student Smartphone', time: '6 hours ago', unread: true },
    { id: 23, type: 'pick', icon: Star, title: 'TechBoy Pick', desc: 'TechBoy Pick updated for Best Value-for-Money Device', time: '12 hours ago', unread: true },
    { id: 24, type: 'pick', icon: Star, title: 'TechBoy Pick', desc: 'TechBoy Pick updated for Premium Flagship Recommendation', time: 'Yesterday', unread: true },
    
    // Popular Comparisons (25-27)
    { id: 25, type: 'compare', icon: Scale, title: 'Comparisons', desc: 'Most Compared Phones updated this week', time: '45 mins ago', unread: true },
    { id: 26, type: 'compare', icon: Scale, title: 'Trending Matchup', desc: 'Nothing Phone vs iQOO Neo comparison is trending', time: '1.5 hours ago', unread: true },
    { id: 27, type: 'compare', icon: Scale, title: 'Popular Compare', desc: 'Poco F Series vs Realme GT comparison gaining attention', time: '3 hours ago', unread: true },
    
    // Market Updates (28-30)
    { id: 28, type: 'market', icon: TrendingUp, title: 'Market Rankings', desc: 'Smartphone market rankings updated', time: 'Just now', unread: true },
    { id: 29, type: 'market', icon: TrendingUp, title: 'Leaderboard', desc: 'Gaming smartphone leaderboard refreshed', time: '5 hours ago', unread: true },
    { id: 30, type: 'market', icon: TrendingUp, title: 'Camera Rankings', desc: 'Top camera smartphone rankings updated', time: '12 hours ago', unread: true }
];

export const getAlertImage = (text) => {
    const t = text.toLowerCase();
    if (t.includes('iqoo neo')) return '/images/phones/iqoo-neo-10r.jpg';
    if (t.includes('iqoo')) return '/images/phones/iqoo-13-5g.jpg';
    if (t.includes('nothing')) return '/images/phones/nothing-phone-3a.jpg';
    if (t.includes('poco')) return '/images/phones/poco-f7-5g.jpg';
    if (t.includes('samsung') || t.includes('galaxy')) return '/images/phones/samsung-galaxy-s26-ultra.jpg';
    if (t.includes('motorola') || t.includes('edge')) return '/images/phones/google-pixel-9-pro.jpg'; 
    if (t.includes('realme')) return '/images/phones/realme-gt7-pro.jpg';
    if (t.includes('vivo')) return '/images/phones/vivo-v70-fe.jpg';
    if (t.includes('oneplus')) return '/images/phones/oneplus-13.jpg';
    return '/images/phones/apple-iphone-17-pro.jpg';
};

export const CURRENT_LIVE_ALERTS = [...PREDEFINED_NOTIFICATIONS]
    .sort(() => 0.5 - Math.random())
    .slice(0, 9)
    .map(alert => ({
        ...alert,
        image: getAlertImage(alert.title + ' ' + alert.desc)
    }));

const NotificationSystem = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeNotifications, setActiveNotifications] = useState([]);
    const [hasUnread, setHasUnread] = useState(false);
    const [isVibrating, setIsVibrating] = useState(false);
    const [toastNotification, setToastNotification] = useState(null);
    const panelRef = useRef(null);

    // Initial load and rotation logic
    useEffect(() => {
        setActiveNotifications(CURRENT_LIVE_ALERTS);
        setHasUnread(true);
        
        // Delay initial animation slightly so user notices it
        const initTimeout = setTimeout(() => {
            // Trigger bell vibration - Big Animation
            setIsVibrating(true);
            setTimeout(() => setIsVibrating(false), 2500); // Vibrate for 2.5 seconds
            
            // Trigger Toast Alert
            setToastNotification(CURRENT_LIVE_ALERTS[0]); // Show the first one as a toast
            setTimeout(() => setToastNotification(null), 6000); // Hide toast after 6 seconds
        }, 3000);

        return () => {
            clearTimeout(initTimeout);
        };
    }, []);

    // Close panel when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (panelRef.current && !panelRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const togglePanel = () => {
        setIsOpen(!isOpen);
        if (!isOpen) {
            setHasUnread(false);
            // Mark all active as read
            setActiveNotifications(prev => prev.map(n => ({ ...n, unread: false })));
        }
    };
    
    const handleNotificationClick = (notifId) => {
        // Close dropdown
        setIsOpen(false);
        // Navigate/Scroll to specific alert in Trends
        const targetAlert = document.getElementById(`trend-alert-${notifId}`);
        if (targetAlert) {
            targetAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            // Temporary highlight effect
            const originalShadow = targetAlert.style.boxShadow;
            const originalBorder = targetAlert.style.borderColor;
            targetAlert.style.transition = 'all 0.3s ease-out';
            targetAlert.style.boxShadow = '0 0 30px rgba(255, 50, 50, 0.8)';
            targetAlert.style.borderColor = 'rgba(255, 50, 50, 0.9)';
            
            setTimeout(() => {
                targetAlert.style.boxShadow = originalShadow;
                targetAlert.style.borderColor = originalBorder;
            }, 2000);
        } else {
            // Fallback to trends section
            const trendsSection = document.getElementById('trends');
            if (trendsSection) {
                trendsSection.scrollIntoView({ behavior: 'smooth' });
            }
        }
    };

    return (
        <div className="navbar-notification-container" ref={panelRef}>
            <button 
                className={`bell-btn premium-bell ${isVibrating ? 'vibrating-big' : ''}`} 
                onClick={togglePanel}
                title="TechBoy Updates"
                aria-label="TechBoy Updates"
            >
                <Bell size={18} className={isVibrating ? 'bell-icon-glow' : ''} />
                {hasUnread && <span className="bell-pulse-dot big-pulse"></span>}
            </button>

            {/* BIG TOAST ALERT */}
            {typeof document !== 'undefined' && createPortal(
                <AnimatePresence>
                    {toastNotification && (
                        <m.div
                            className="notification-toast glass-card"
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            exit={{ opacity: 0, x: 50, scale: 0.9 }}
                            transition={{ type: "spring", stiffness: 200, damping: 20 }}
                            onClick={() => handleNotificationClick(toastNotification.id)}
                        >
                            <div className="toast-icon-wrapper" style={{ overflow: 'hidden', padding: 0, background: 'transparent', border: 'none', width: '40px', height: '40px', flexShrink: 0 }}>
                                <img src={toastNotification.image} alt="alert" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} onError={(e) => { e.target.src = '/images/phones/apple-iphone-17-pro.jpg'; }} />
                            </div>
                            <div className="toast-content">
                                <h4>{toastNotification.title}</h4>
                                <p>{toastNotification.desc}</p>
                            </div>
                            <div className="toast-action">
                                <span>View Trends ➔</span>
                            </div>
                        </m.div>
                    )}
                </AnimatePresence>,
                document.body
            )}

            <AnimatePresence>
                {isOpen && (
                    <m.div 
                        className="alerts-dropdown premium-notification-panel"
                        initial={{ opacity: 0, y: 15, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: 'easeOut' }}
                    >
                        <div className="alerts-dropdown-header notification-header">
                            <h4>TechBoy Updates</h4>
                            <span className="live-indicator"><span className="pulse-circle"></span> Live</span>
                        </div>

                        <div className="notification-list">
                            {activeNotifications.length === 0 ? (
                                <div className="alerts-empty-state">
                                    <p>No new updates right now.</p>
                                </div>
                            ) : (
                                activeNotifications.map((notif) => (
                                    <div 
                                        key={notif.id} 
                                        className={`notification-item ${notif.unread ? 'unread' : ''}`}
                                        onClick={() => handleNotificationClick(notif.id)}
                                        style={{ cursor: 'pointer' }}
                                    >
                                        <div className="notif-icon-wrapper" style={{ overflow: 'hidden', padding: 0, background: 'transparent', border: 'none' }}>
                                            <img src={notif.image} alt="alert" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '8px' }} onError={(e) => { e.target.src = '/images/phones/apple-iphone-17-pro.jpg'; }} />
                                        </div>
                                        <div className="notif-content">
                                            <div className="notif-title-row">
                                                <h5>{notif.title}</h5>
                                                <span className="notif-time">{notif.time}</span>
                                            </div>
                                            <p>{notif.desc}</p>
                                        </div>
                                        {notif.unread && <div className="unread-dot"></div>}
                                    </div>
                                ))
                            )}
                        </div>
                        
                        <div className="notification-footer">
                            <p>Powered by TechBoy AI Intelligence</p>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationSystem;
