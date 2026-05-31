import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Bell, TrendingDown, Rocket, Flame, Star, Scale, TrendingUp, Cpu, Battery, Camera } from 'lucide-react';
import '../redline.css'; // Make sure styles are pulled in

export const PREDEFINED_NOTIFICATIONS = [
    { id: 1, type: 'price_drop', icon: TrendingDown, title: 'Price Drop Alert', desc: 'OnePlus 13R price dropped by ₹7,000', time: 'Just now', unread: true, name: 'OnePlus 13R', specs: 'Snapdragon 8 Gen 2', current: 42999, prev: 49999, pct: 14, savings: 7000, image: '/images/phones/oneplus-13r.jpg', buyLink: 'https://amazon.in/' },
    { id: 2, type: 'launch', icon: Rocket, title: 'New Launch', desc: 'Google Pixel 9 Pro is now available', time: '15 mins ago', unread: true, name: 'Google Pixel 9 Pro', specs: 'Tensor G4', current: 95999, prev: 109999, pct: 12, savings: 14000, image: '/images/phones/google-pixel-9-pro.jpg', buyLink: 'https://flipkart.com/' },
    { id: 3, type: 'trending', icon: Flame, title: 'Trending Now', desc: 'iQOO 13 5G is trending among gamers', time: '1 hour ago', unread: true, name: 'iQOO 13 5G', specs: 'Snapdragon 8 Gen 3', current: 54999, prev: 59999, pct: 8, savings: 5000, image: '/images/phones/iqoo-13-5g.jpg', buyLink: 'https://amazon.in/' },
    { id: 4, type: 'price_drop', icon: TrendingDown, title: 'Price Cut', desc: 'Nothing Phone (3a) now available at a lower price', time: '3 hours ago', unread: true, name: 'Nothing Phone (3a)', specs: 'Dimensity 7200 Pro', current: 25999, prev: 29999, pct: 13, savings: 4000, image: '/images/phones/nothing-phone-3a.jpg', buyLink: 'https://flipkart.com/' },
    { id: 5, type: 'launch', icon: Rocket, title: 'New Market Entry', desc: 'POCO F7 5G added to the market', time: '4 hours ago', unread: true, name: 'POCO F7 5G', specs: 'Snapdragon 8s Gen 3', current: 29999, prev: 34999, pct: 14, savings: 5000, image: '/images/phones/poco-f7-5g.jpg', buyLink: 'https://flipkart.com/' },
    { id: 6, type: 'trending', icon: Flame, title: 'Most Viewed', desc: 'Samsung Galaxy S26 Ultra gaining popularity', time: '5 hours ago', unread: true, name: 'Galaxy S26 Ultra', specs: 'Snapdragon 8 Gen 4', current: 129999, prev: 139999, pct: 7, savings: 10000, image: '/images/phones/samsung-galaxy-s26-ultra.jpg', buyLink: 'https://amazon.in/' },
    { id: 7, type: 'pick', icon: Star, title: 'TechBoy Pick', desc: 'Realme GT 7 Pro is a top performance pick', time: '8 hours ago', unread: true, name: 'Realme GT 7 Pro', specs: 'Snapdragon 8 Gen 4', current: 45999, prev: 52999, pct: 13, savings: 7000, image: '/images/phones/realme-gt7-pro.jpg', buyLink: 'https://amazon.in/' },
    { id: 8, type: 'price_drop', icon: TrendingDown, title: 'Major Discount', desc: 'Vivo V70 FE received a major discount', time: 'Yesterday', unread: true, name: 'Vivo V70 FE', specs: 'Dimensity 8200', current: 32999, prev: 37999, pct: 13, savings: 5000, image: '/images/phones/vivo-v70-fe.jpg', buyLink: 'https://flipkart.com/' },
    { id: 9, type: 'trending', icon: Flame, title: 'Community Trend', desc: 'iPhone 17 Pro is trending across the community', time: 'Yesterday', unread: true, name: 'iPhone 17 Pro', specs: 'Apple A19 Pro', current: 119999, prev: 129999, pct: 8, savings: 10000, image: '/images/phones/apple-iphone-17-pro.jpg', buyLink: 'https://amazon.in/' }
];

export const CURRENT_LIVE_ALERTS = [...PREDEFINED_NOTIFICATIONS];

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
