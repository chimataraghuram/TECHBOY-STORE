import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { m, AnimatePresence } from 'framer-motion';
import { Bell, TrendingDown, Rocket, Flame, Star, GitCompare } from 'lucide-react';
import { PREDEFINED_NOTIFICATIONS } from './NotificationSystemData';

export const refreshAlerts = () => {};

const NotificationSystem = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [activeNotifications, setActiveNotifications] = useState([]);
    const [hasUnread, setHasUnread] = useState(false);
    const panelRef = useRef(null);

    useEffect(() => {
        setHasUnread(true);
        const mockAlerts = [
            { id: 1, type: 'pick', title: 'Analyst Pick', desc: 'Tecno Spark 30C is a top pick', time: 'Just now', unread: true, image: '/images/phones/apple-iphone-17-pro-max.jpg' },
            { id: 3, type: 'price_drop', title: 'Price Drop', desc: 'Samsung Galaxy M07 dropped by ₹2,000', time: '1 hour ago', unread: true, image: '/images/phones/samsung-galaxy-s26-ultra.jpg' },
            { id: 4, type: 'launch', title: 'New Launch', desc: 'Realme C75 now available', time: '3 hours ago', unread: false, image: '/images/phones/nothing-phone-3a.jpg' }
        ];
        setActiveNotifications(mockAlerts);
    }, []);

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
            setActiveNotifications(prev => prev.map(n => ({ ...n, unread: false })));
        }
    };
    
    const handleNotificationClick = (notifId) => {
        setIsOpen(false);
        const targetAlert = document.getElementById(`trend-alert-${notifId}`);
        if (targetAlert) {
            targetAlert.scrollIntoView({ behavior: 'smooth', block: 'center' });
            const originalShadow = targetAlert.style.boxShadow;
            const originalBorder = targetAlert.style.borderColor;
            targetAlert.style.transition = 'all 0.3s ease-out';
            targetAlert.style.boxShadow = '0 0 20px rgba(255, 50, 50, 0.6)';
            targetAlert.style.borderColor = 'rgba(255, 50, 50, 0.8)';
            setTimeout(() => {
                targetAlert.style.boxShadow = originalShadow;
                targetAlert.style.borderColor = originalBorder;
            }, 2000);
        } else {
            const trendsSection = document.getElementById('trends');
            if (trendsSection) trendsSection.scrollIntoView({ behavior: 'smooth' });
        }
    };

    const getIcon = (type) => {
        switch(type) {
            case 'price_drop': return <TrendingDown size={12} className="text-green-500" />;
            case 'launch': return <Rocket size={12} className="text-blue-500" />;
            case 'trending': return <Flame size={12} className="text-orange-500" />;
            case 'pick': return <Star size={12} className="text-purple-500" />;
            default: return <Bell size={12} className="text-red-500" />;
        }
    };

    return (
        <div className="relative" ref={panelRef}>
            <button 
                className="relative p-1.5 text-gray-400 hover:text-white transition-colors" 
                onClick={togglePanel}
                aria-label="Notifications"
            >
                <Bell size={18} />
                {hasUnread && (
                    <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 bg-red-600 rounded-full border-[1.5px] border-[#12121a] flex items-center justify-center text-[7px] font-bold text-white">
                        {activeNotifications.filter(n => n.unread).length}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <m.div 
                        className="absolute top-full right-0 mt-3 w-72 bg-[#12121a] border border-white/10 rounded-xl shadow-2xl overflow-hidden z-50"
                        initial={{ opacity: 0, y: 8, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.95 }}
                        transition={{ duration: 0.15 }}
                    >
                        <div className="p-3 border-b border-white/5 flex justify-between items-center bg-white/[0.03]">
                            <h4 className="text-white font-semibold text-xs">TechBoy Updates</h4>
                            <span className="flex items-center gap-1 text-[9px] font-bold text-red-500 bg-red-500/10 px-1.5 py-0.5 rounded-full">
                                <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></span> Live
                            </span>
                        </div>

                        <div className="max-h-72 overflow-y-auto">
                            {activeNotifications.length === 0 ? (
                                <div className="p-6 text-center text-gray-500 text-xs">
                                    No new updates right now.
                                </div>
                            ) : (
                                activeNotifications.map((notif) => (
                                    <div 
                                        key={notif.id} 
                                        className={`flex gap-2.5 p-3 border-b border-white/5 cursor-pointer hover:bg-white/5 transition-colors ${notif.unread ? 'bg-white/[0.02]' : ''}`}
                                        onClick={() => handleNotificationClick(notif.id)}
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-black/50 border border-white/5 flex items-center justify-center p-1 shrink-0">
                                            <img src={notif.image} alt="alert" className="max-w-full max-h-full object-contain" onError={(e) => { e.target.src = '/images/phones/apple-iphone-17-pro-max.jpg'; }} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <h5 className="text-white text-[11px] font-semibold truncate flex items-center gap-1">
                                                    {getIcon(notif.type)} {notif.title}
                                                </h5>
                                                <span className="text-gray-600 text-[8px] whitespace-nowrap ml-2">{notif.time}</span>
                                            </div>
                                            <p className="text-gray-500 text-[10px] line-clamp-2">{notif.desc}</p>
                                        </div>
                                        {notif.unread && <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1.5 shrink-0"></div>}
                                    </div>
                                ))
                            )}
                        </div>
                        
                        <div className="p-2 text-center bg-black/30 border-t border-white/5">
                            <p className="text-[8px] font-bold text-gray-600 tracking-wider">POWERED BY TECHBOY AI</p>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationSystem;
