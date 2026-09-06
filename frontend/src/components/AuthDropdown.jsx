import React, { useState, useRef, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { User, Bell, Heart, GitCompare, Settings, LogOut, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const AuthDropdown = ({ onViewChange }) => {
  const { user, logout } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) return null;

  const photoURL = user.avatar || user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.uid;
  const displayName = user.name ? user.name.split(' ')[0] : (user.displayName ? user.displayName.split(' ')[0] : 'User');

  const menuItems = [
    { icon: User, label: 'My Profile', view: 'profile' },
    { icon: Bell, label: 'My Alerts', view: 'trackhub' },
    { icon: Heart, label: 'Wishlist', view: 'wishlist' },
    { icon: GitCompare, label: 'Compare List', view: 'compare' },
    { icon: Settings, label: 'Settings', view: 'settings' }
  ];

  const handleNavigate = (view) => {
    if (view === 'trackhub' && onViewChange) {
        onViewChange('trackhub');
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button 
        className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-500/50 transition-all group"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="relative">
          <img src={photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-transparent group-hover:border-red-500 transition-colors" />
          <div className="absolute inset-0 rounded-full border border-white/10"></div>
        </div>
        <span className="text-white text-sm font-semibold hidden md:block">{displayName}</span>
        <m.div 
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown size={14} className="text-gray-400 group-hover:text-white" />
        </m.div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <m.div 
            className="absolute top-full right-0 mt-2 w-64 bg-[#12121a] border border-white/10 rounded-2xl shadow-2xl overflow-hidden z-50"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="p-4 border-b border-white/5 flex items-center gap-3 bg-white/5">
              <img src={photoURL} alt="Profile" className="w-10 h-10 rounded-full border border-white/20" />
              <div className="flex flex-col overflow-hidden">
                <span className="text-white text-sm font-bold truncate">{user.name || user.displayName || 'TechBoy User'}</span>
                <span className="text-gray-500 text-xs truncate">{user.email || ''}</span>
              </div>
            </div>

            <div className="p-2 flex flex-col gap-1">
              {menuItems.map((item, idx) => (
                <button 
                    key={idx}
                    onClick={() => handleNavigate(item.view)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors text-sm font-semibold w-full text-left"
                >
                    <item.icon size={16} className="text-gray-500" />
                    {item.label}
                </button>
              ))}
            </div>

            <div className="p-2 border-t border-white/5">
              <button 
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:text-white hover:bg-red-500 transition-colors text-sm font-semibold w-full text-left group" 
                onClick={() => { setIsOpen(false); logout(); }}
              >
                <LogOut size={16} className="text-red-500 group-hover:text-white" />
                Logout
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthDropdown;
