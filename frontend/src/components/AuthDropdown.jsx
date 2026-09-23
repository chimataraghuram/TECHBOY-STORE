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
  const fullName = user.name || user.displayName || 'TechBoy User';

  const menuItems = [
    { icon: User,       label: 'My Profile',    tab: 'profile',  accent: 'text-red-400',  bg: 'bg-red-500/10' },
    { icon: Bell,       label: 'My Alerts',     tab: 'alerts',   accent: 'text-yellow-400', bg: 'bg-yellow-500/10' },
    { icon: Heart,      label: 'Wishlist',      tab: 'wishlist', accent: 'text-pink-400',  bg: 'bg-pink-500/10' },
    { icon: GitCompare, label: 'Compare List',  tab: 'compare',  accent: 'text-blue-400',  bg: 'bg-blue-500/10' },
    { icon: Settings,   label: 'Settings',      tab: 'settings', accent: 'text-purple-400', bg: 'bg-purple-500/10' },
  ];

  const handleNavigate = (tab) => {
    if (onViewChange) {
      onViewChange('profile', tab);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar trigger button */}
      <button
        className="flex items-center gap-2 p-1.5 pr-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-500/50 transition-all group"
        onClick={() => handleNavigate('profile')}
        onContextMenu={(e) => { e.preventDefault(); setIsOpen(!isOpen); }}
        aria-label="Profile"
        title="Click to open profile | Right-click for menu"
      >
        <div className="relative">
          <img src={photoURL} alt="Profile" className="w-9 h-9 rounded-full object-cover border-2 border-red-500/70 shadow-[0_0_10px_rgba(255,31,61,0.4)] transition-all group-hover:scale-105" />
          <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none"></div>
        </div>
        <span className="text-white text-sm font-semibold hidden md:block">{displayName}</span>
        <button
          type="button"
          className="p-0.5 rounded-full hover:bg-white/10 transition-colors"
          onClick={(e) => { e.stopPropagation(); setIsOpen(!isOpen); }}
          aria-label="Open profile menu"
        >
          <m.div animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <ChevronDown size={14} className="text-gray-400 group-hover:text-white" />
          </m.div>
        </button>
      </button>

      {/* Dropdown menu */}
      <AnimatePresence>
        {isOpen && (
          <m.div
            className="absolute top-full right-0 mt-2 w-68 bg-[#0f0f18]/98 border border-white/12 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85),0_0_30px_rgba(255,31,61,0.2)] overflow-hidden z-[200] backdrop-blur-2xl"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* User header */}
            <div className="p-4 border-b border-white/[0.07] flex items-center gap-3 bg-gradient-to-r from-red-500/5 to-transparent">
              <img src={photoURL} alt="Profile" className="w-11 h-11 rounded-full border-2 border-red-500/50 shadow-[0_0_12px_rgba(255,31,61,0.35)]" />
              <div className="flex flex-col overflow-hidden min-w-0">
                <span className="text-white text-sm font-bold truncate">{fullName}</span>
                <span className="text-gray-500 text-xs truncate">{user.email || ''}</span>
              </div>
            </div>

            {/* Menu items */}
            <div className="p-2 flex flex-col gap-0.5">
              {menuItems.map((item, idx) => {
                const Icon = item.icon;
                return (
                  <button
                    key={idx}
                    onClick={() => handleNavigate(item.tab)}
                    className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/[0.06] transition-all text-sm font-semibold w-full text-left group"
                  >
                    <span className={`w-7 h-7 rounded-xl ${item.bg} flex items-center justify-center shrink-0 group-hover:scale-105 transition-transform`}>
                      <Icon size={14} className={item.accent} />
                    </span>
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Logout */}
            <div className="p-2 pt-0 border-t border-white/[0.07] mt-1">
              <button
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-400 hover:text-white hover:bg-red-600 transition-all text-sm font-bold w-full text-left group mt-1"
                onClick={() => { setIsOpen(false); logout(); }}
              >
                <span className="w-7 h-7 rounded-xl bg-red-500/15 group-hover:bg-red-500/30 flex items-center justify-center shrink-0 transition-all">
                  <LogOut size={14} className="text-red-400 group-hover:text-white" />
                </span>
                Sign Out
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthDropdown;
