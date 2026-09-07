import React, { useState, useEffect, useRef } from 'react';
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
            case 'price_drop': return <TrendingDown size={15} className="text-green-500" />;
            case 'launch': return <Rocket size={15} className="text-blue-500" />;
            case 'trending': return <Flame size={15} className="text-orange-500" />;
            case 'pick': return <Star size={15} className="text-purple-500" />;
            default: return <Bell size={15} className="text-red-500" />;
        }
    };

    const unreadCount = activeNotifications.filter(n => n.unread).length;

    return (
        <div className="relative flex items-center justify-center" ref={panelRef}>
            <button 
                className="relative p-2.5 text-gray-200 hover:text-white transition-colors rounded-full hover:bg-white/10 flex items-center justify-center" 
                onClick={togglePanel}
                aria-label="Notifications"
            >
                <Bell size={24} className="shrink-0" />
                {hasUnread && unreadCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[18px] h-[18px] px-1 bg-red-600 rounded-full border-[1.5px] border-[#08080c] flex items-center justify-center text-[9.5px] font-black text-white shadow-sm leading-none z-10 pointer-events-none">
                        {unreadCount}
                    </span>
                )}
            </button>

            <AnimatePresence>
                {isOpen && (
                    <m.div 
                        className="absolute top-full right-0 mt-3.5 w-76 sm:w-80 bg-[#101018] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50 backdrop-blur-xl"
                        initial={{ opacity: 0, y: 8, scale: 0.96 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 8, scale: 0.96 }}
                        transition={{ duration: 0.15 }}
                    >
                        <div className="p-3.5 border-b border-white/5 flex justify-between items-center bg-white/[0.03]">
                            <h4 className="text-white font-semibold text-xs">TechBoy Updates</h4>
                            <span className="flex items-center gap-1 text-[9px] font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded-full">
                                <span className="w-1 h-1 rounded-full bg-red-500 animate-pulse"></span> Live
                            </span>
                        </div>

                        <div className="max-h-72 overflow-y-auto divide-y divide-white/5">
                            {activeNotifications.length === 0 ? (
                                <div className="p-6 text-center text-gray-500 text-xs">
                                    No new updates right now.
                                </div>
                            ) : (
                                activeNotifications.map((notif) => (
                                    <div 
                                        key={notif.id} 
                                        className={`flex gap-3 p-3.5 cursor-pointer hover:bg-white/5 transition-colors ${notif.unread ? 'bg-white/[0.02]' : ''}`}
                                        onClick={() => handleNotificationClick(notif.id)}
                                    >
                                        <div className="w-10 h-10 rounded-lg bg-black/60 border border-white/5 flex items-center justify-center p-1 shrink-0">
                                            <img 
                                                src={notif.image} 
                                                alt="alert" 
                                                className="max-w-full max-h-full object-contain" 
                                                onError={(e) => { e.target.src = '/images/phones/apple-iphone-17-pro-max.jpg'; }} 
                                            />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between items-start mb-0.5">
                                                <h5 className="text-white text-xs font-semibold truncate flex items-center gap-1.5">
                                                    {getIcon(notif.type)} {notif.title}
                                                </h5>
                                                <span className="text-gray-500 text-[9px] whitespace-nowrap ml-2">{notif.time}</span>
                                            </div>
                                            <p className="text-gray-400 text-[11px] line-clamp-2 leading-relaxed">{notif.desc}</p>
                                        </div>
                                        {notif.unread && (
                                            <div className="w-1.5 h-1.5 rounded-full bg-red-500 mt-1 shrink-0 self-center"></div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                        
                        <div className="p-2.5 text-center bg-black/40 border-t border-white/5">
                            <p className="text-[9px] font-bold text-gray-500 tracking-wider">POWERED BY TECHBOY AI</p>
                        </div>
                    </m.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationSystem;
