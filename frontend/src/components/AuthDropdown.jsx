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
      className="flex items-center gap-2 p-1.5 pr-3.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(255,31,61,0.3)] transition-all group cursor-pointer max-w-[175px] shrink-0"
      onClick={handleClick}
      aria-label="View Profile"
      title="View Profile"
    >
      <div className="relative shrink-0">
        <img 
          src={photoURL} 
          alt="Profile" 
          className="w-8 h-8 xl:w-9 xl:h-9 rounded-full object-cover border-2 border-red-500/70 shadow-[0_0_10px_rgba(255,31,61,0.4)] transition-all group-hover:scale-105" 
        />
        <div className="absolute inset-0 rounded-full border border-white/10 pointer-events-none"></div>
      </div>
      <span className="text-white text-xs xl:text-sm font-bold tracking-wide uppercase transition-colors group-hover:text-red-400 truncate max-w-[110px]">
        {displayName}
      </span>
    </button>
  );
};

export default AuthDropdown;
