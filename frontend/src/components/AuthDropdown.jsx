import React, { useState, useRef, useEffect } from 'react';
import {} from 'framer-motion';
import { User, Bookmark, LogOut, Settings, History, Heart } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import './AuthDropdown.css';

const AuthDropdown = ({ onWatchlistClick }) => {
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

  // Fallback to a default image if no photo URL is available
  const photoURL = user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.uid;
  // Get first name or default to 'User'
  const displayName = user.displayName ? user.displayName.split(' ')[0] : 'User';

  return (
    <div className="auth-dropdown-container" ref={dropdownRef}>
      <button 
        className="profile-trigger-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <div className="profile-img-wrapper">
          <img src={photoURL} alt="Profile" className="profile-img" />
          <div className="profile-ring"></div>
        </div>
        <span className="profile-name">{displayName}</span>
        <m.span 
          className="chevron-icon"
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          ▼
        </m.span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <m.div 
            className="dropdown-menu glass-panel"
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
          >
            <div className="dropdown-header">
              <img src={photoURL} alt="Profile" className="dropdown-header-img" />
              <div className="dropdown-user-info">
                <span className="dropdown-full-name">{user.displayName || 'TechBoy User'}</span>
                <span className="dropdown-email">{user.email || ''}</span>
              </div>
            </div>
            
            <div className="dropdown-divider"></div>

            <div className="dropdown-items">
              <button className="dropdown-item">
                <User size={16} className="dropdown-icon" />
                <span>My Profile</span>
              </button>
              
              <button className="dropdown-item" onClick={() => { setIsOpen(false); onWatchlistClick && onWatchlistClick(); }}>
                <Bookmark size={16} className="dropdown-icon" />
                <span>Saved Phones</span>
              </button>

              <button className="dropdown-item">
                <Heart size={16} className="dropdown-icon" />
                <span>Wishlist</span>
              </button>
              
              <button className="dropdown-item">
                <History size={16} className="dropdown-icon" />
                <span>Compare History</span>
              </button>

              <div className="dropdown-divider"></div>

              <button className="dropdown-item">
                <Settings size={16} className="dropdown-icon" />
                <span>Settings</span>
              </button>
              
              <button className="dropdown-item logout-action" onClick={() => { setIsOpen(false); logout(); }}>
                <LogOut size={16} className="dropdown-icon" />
                <span>Logout</span>
              </button>
            </div>
          </m.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AuthDropdown;
