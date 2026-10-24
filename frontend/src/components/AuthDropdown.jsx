import React from 'react';
import { useAuth } from '../context/AuthContext';

const AuthDropdown = ({ onViewChange }) => {
  const { user } = useAuth();

  if (!user) return null;

  const photoURL = user.avatar || user.photoURL || 'https://api.dicebear.com/7.x/avataaars/svg?seed=' + user.uid;
  const displayName = user.name ? user.name.split(' ')[0] : (user.displayName ? user.displayName.split(' ')[0] : 'User');

  const handleClick = () => {
    if (onViewChange) {
      onViewChange('profile', 'profile');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <button
      className="flex items-center gap-2.5 p-1.5 pr-4 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(255,31,61,0.3)] transition-all group cursor-pointer"
      onClick={handleClick}
      aria-label="View Profile"
      title="View Profile"
    >
      <div className="relative">
        <img 
          src={photoURL} 
          alt="Profile" 
          className="w-9 h-9 rounded-full object-cover border-2 border-red-500/70 shadow-[0_0_10px_rgba(255,31,61,0.4)] transition-all group-hover:scale-105" 
        />
        <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none"></div>
      </div>
      <span className="text-white text-sm font-bold tracking-wide uppercase transition-colors group-hover:text-red-400">
        {displayName}
      </span>
    </button>
  );
};

export default AuthDropdown;
