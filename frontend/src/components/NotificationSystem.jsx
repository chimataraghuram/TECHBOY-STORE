import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Bell, TrendingDown, Rocket, Flame, Star, Scale, TrendingUp, Cpu, Battery, Camera } from 'lucide-react';
import '../redline.css'; // Make sure styles are pulled in

export const PREDEFINED_NOTIFICATIONS = [
    // Price Drops (1-6)
    { id: 1, type: 'price_drop', icon: TrendingDown, title: 'Price Drop Alert', desc: 'iQOO Neo 10 price dropped by ₹2,000', time: 'Just now', unread: true },
    { id: 2, type: 'price_drop', icon: TrendingDown, title: 'Price Drop Alert', desc: 'Nothing Phone (3a) now available at a lower price', time: '15 mins ago', unread: true },
    { id: 3, type: 'price_drop', icon: TrendingDown, title: 'Major Discount', desc: 'Poco F Series received a major discount this week', time: '1 hour ago', unread: true },
    { id: 4, type: 'price_drop', icon: TrendingDown, title: 'Price Reduced', desc: 'Samsung Galaxy A Series price reduced', time: '3 hours ago', unread: true },
    { id: 5, type: 'price_drop', icon: TrendingDown, title: 'Price Cut', desc: 'Motorola Edge Series now available below previous pricing', time: '4 hours ago', unread: true },
    { id: 6, type: 'price_drop', icon: TrendingDown, title: 'Special Price Cut', desc: 'Realme GT Series received a special price cut', time: '5 hours ago', unread: true },
    
    // New Launches (7-12)
    { id: 7, type: 'launch', icon: Rocket, title: 'New Launch', desc: 'New Nothing smartphone officially launched', time: '20 mins ago', unread: true },
    { id: 8, type: 'launch', icon: Rocket, title: 'Device Announced', desc: 'Latest Samsung Galaxy device announced', time: '2 hours ago', unread: true },
    { id: 9, type: 'launch', icon: Rocket, title: 'New Market Entry', desc: 'New Poco smartphone added to the market', time: '4 hours ago', unread: true },
    { id: 10, type: 'launch', icon: Rocket, title: 'Device Launched', desc: 'Motorola launched a new mid-range device', time: '6 hours ago', unread: true },
    { id: 11, type: 'launch', icon: Rocket, title: 'New Introduction', desc: 'Realme introduced a new performance-focused smartphone', time: '8 hours ago', unread: true },
    { id: 12, type: 'launch', icon: Rocket, title: 'Device Unveiled', desc: 'Vivo unveiled a new camera-centric smartphone', time: 'Yesterday', unread: true },
    
    // Trending Phones (13-18)
    { id: 13, type: 'trending', icon: Flame, title: 'Trending Now', desc: 'iQOO Neo 10 is trending among gamers', time: '10 mins ago', unread: true },
    { id: 14, type: 'trending', icon: Flame, title: 'Most Viewed', desc: 'Poco F Series is one of the most viewed phones this week', time: '30 mins ago', unread: true },
    { id: 15, type: 'trending', icon: Flame, title: 'Community Trend', desc: 'Nothing Phone is trending across the community', time: '1 hour ago', unread: true },
    { id: 16, type: 'trending', icon: Flame, title: 'Gaining Popularity', desc: 'Samsung Galaxy devices are gaining popularity', time: '2 hours ago', unread: true },
    { id: 17, type: 'trending', icon: Flame, title: 'Trending List', desc: 'Motorola Edge Series is trending in value-for-money rankings', time: '5 hours ago', unread: true },
    { id: 18, type: 'trending', icon: Flame, title: 'Performance Trend', desc: 'Realme GT Series is trending among performance users', time: 'Yesterday', unread: true },
    
    // TechBoy Picks (19-24)
    { id: 19, type: 'pick', icon: Star, title: 'TechBoy Pick', desc: 'TechBoy Pick updated for Best Gaming Phone Under ₹25K', time: 'Just now', unread: true },
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
