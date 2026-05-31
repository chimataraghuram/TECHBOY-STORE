import React, { useState, useEffect, useRef } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Bell, TrendingDown, Rocket, Flame, Star, Scale, TrendingUp, Cpu, Battery, Camera } from 'lucide-react';
import '../redline.css'; // Make sure styles are pulled in

const PREDEFINED_NOTIFICATIONS = [
    // Price Drops
    { id: 1, type: 'price_drop', icon: TrendingDown, title: 'Price Drop Alert', desc: 'iQOO Neo 10 just dropped by ₹2,000.', time: '2 mins ago', unread: true },
    { id: 2, type: 'price_drop', icon: TrendingDown, title: 'Massive Discount', desc: 'Poco F Series is now officially under ₹25K.', time: '1 hour ago', unread: true },
    { id: 3, type: 'price_drop', icon: TrendingDown, title: 'Steal Deal', desc: 'Nothing Phone (3a) discount available for next 24 hours.', time: '3 hours ago', unread: true },
    { id: 4, type: 'price_drop', icon: TrendingDown, title: 'Price Cut', desc: 'Samsung Galaxy S24 Ultra sees a ₹5,000 price drop.', time: '5 hours ago', unread: true },
    { id: 5, type: 'price_drop', icon: TrendingDown, title: 'Flash Sale', desc: 'Realme GT 7 Pro flash sale begins in 10 minutes.', time: 'Just now', unread: true },
    // New Launches
    { id: 6, type: 'launch', icon: Rocket, title: 'New Launch', desc: 'The new Nothing Phone has officially launched.', time: '45 mins ago', unread: true },
    { id: 7, type: 'launch', icon: Rocket, title: 'Series Announced', desc: 'Samsung Galaxy S25 series specs leaked.', time: '2 hours ago', unread: true },
    { id: 8, type: 'launch', icon: Rocket, title: 'Device Revealed', desc: 'New Poco X8 Pro Max revealed in global event.', time: 'Yesterday', unread: true },
    { id: 9, type: 'launch', icon: Rocket, title: 'Coming Soon', desc: 'OnePlus 14 early teasers just dropped.', time: '4 hours ago', unread: true },
    { id: 10, type: 'launch', icon: Rocket, title: 'Launch Event', desc: 'Apple announces upcoming September event.', time: '1 day ago', unread: true },
    // Trending Phones
    { id: 11, type: 'trending', icon: Flame, title: 'Trending This Week', desc: 'iQOO Neo 10 is dominating our trending charts.', time: '12 mins ago', unread: true },
    { id: 12, type: 'trending', icon: Flame, title: 'Most Viewed', desc: 'Most viewed gaming phone leaderboard updated.', time: '3 hours ago', unread: true },
    { id: 13, type: 'trending', icon: Camera, title: 'Camera Rankings', desc: 'Top camera phone rankings have shifted.', time: '5 hours ago', unread: true },
    { id: 14, type: 'trending', icon: Flame, title: 'Hot Device', desc: 'Redmi Note 14 Pro+ is gaining massive traction.', time: '10 hours ago', unread: true },
    { id: 15, type: 'trending', icon: Battery, title: 'Battery Beasts', desc: 'New endurance test results are in.', time: 'Yesterday', unread: true },
    // TechBoy Picks
    { id: 16, type: 'pick', icon: Star, title: 'TechBoy Pick', desc: 'Best phone under ₹20K guide updated.', time: '30 mins ago', unread: true },
    { id: 17, type: 'pick', icon: Star, title: 'Value Champion', desc: 'New value-for-money recommendation published.', time: '2 hours ago', unread: true },
    { id: 18, type: 'pick', icon: Star, title: 'Gaming List Updated', desc: 'Top gaming phones for BGMI refreshed.', time: '6 hours ago', unread: true },
    { id: 19, type: 'pick', icon: Cpu, title: 'Performance King', desc: 'Our AI has selected the new raw performance king.', time: '1 day ago', unread: true },
    { id: 20, type: 'pick', icon: Star, title: 'Premium Tier', desc: 'Best ultra-premium smartphone list updated.', time: '2 days ago', unread: true },
    // Comparisons
    { id: 21, type: 'compare', icon: Scale, title: 'Popular Compare', desc: 'iPhone 15 vs S24 comparison just went live.', time: '15 mins ago', unread: true },
    { id: 22, type: 'compare', icon: Scale, title: 'New Insights', desc: 'Deep dive comparison: Pixel 9 Pro vs iPhone 16 Pro.', time: '1 hour ago', unread: true },
    { id: 23, type: 'compare', icon: TrendingUp, title: 'Market Shift', desc: 'Most compared phones data updated for this month.', time: '4 hours ago', unread: true },
    { id: 24, type: 'compare', icon: Scale, title: 'Processor Battle', desc: 'Snapdragon 8 Gen 4 vs A18 Pro benchmark analysis.', time: '8 hours ago', unread: true },
    { id: 25, type: 'compare', icon: Scale, title: 'Mid-Range Kings', desc: 'Poco vs iQOO: The ultimate mid-range comparison.', time: 'Yesterday', unread: true }
];

const NotificationSystem = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeNotifications, setActiveNotifications] = useState([]);
    const [hasUnread, setHasUnread] = useState(false);
    const [isVibrating, setIsVibrating] = useState(false);
    const panelRef = useRef(null);

    // Initial load and rotation logic
    useEffect(() => {
        const rotateNotifications = () => {
            // Pick 3 to 5 random notifications
            const count = Math.floor(Math.random() * 3) + 3; // 3, 4, or 5
            const shuffled = [...PREDEFINED_NOTIFICATIONS].sort(() => 0.5 - Math.random());
            const selected = shuffled.slice(0, count);
            
            setActiveNotifications(selected);
            setHasUnread(true);
            
            // Trigger bell vibration
            setIsVibrating(true);
            setTimeout(() => setIsVibrating(false), 2000); // Vibrate for 2 seconds then stop
        };

        rotateNotifications(); // Initial load

        // Rotate every 45-60 seconds to simulate a live platform
        const intervalTime = Math.floor(Math.random() * 15000) + 45000;
        const interval = setInterval(rotateNotifications, intervalTime);

        return () => clearInterval(interval);
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

    return (
        <div className="navbar-notification-container" ref={panelRef}>
            <button 
                className={`bell-btn premium-bell ${isVibrating ? 'vibrating' : ''}`} 
                onClick={togglePanel}
                title="TechBoy Updates"
                aria-label="TechBoy Updates"
            >
                <Bell size={18} />
                {hasUnread && <span className="bell-pulse-dot"></span>}
            </button>

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
                                    <div key={notif.id} className={`notification-item ${notif.unread ? 'unread' : ''}`}>
                                        <div className="notif-icon-wrapper">
                                            <notif.icon size={16} />
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
