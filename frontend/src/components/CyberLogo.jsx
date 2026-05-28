import React from 'react';

export const CyberLogo = ({ size = 32, className = '' }) => {
    return (
        <svg 
            width={size} 
            height={size} 
            viewBox="0 0 100 100" 
            fill="none" 
            xmlns="http://www.w3.org/2000/svg" 
            className={`cyber-logo-svg ${className}`}
            style={{ filter: 'drop-shadow(0 0 8px rgba(255, 0, 60, 0.6))' }}
        >
            {/* Outer Cyber Shield */}
            <path 
                d="M50 5L90 25V65L50 95L10 65V25L50 5Z" 
                stroke="#ff003c" 
                strokeWidth="6" 
                strokeLinejoin="round" 
                fill="rgba(255, 0, 60, 0.08)" 
            />
            {/* Inner Tech Ring / Circuit lines */}
            <path 
                d="M50 20L78 34V60L50 80L22 60V34L50 20Z" 
                stroke="#ff003c" 
                strokeWidth="3" 
                strokeDasharray="6 3" 
                fill="none" 
                opacity="0.8"
            />
            {/* Core Energy Cell */}
            <path 
                d="M50 35L62 42V54L50 63L38 54V42L50 35Z" 
                fill="#ff003c" 
            />
            {/* Diagonal Grid Accents */}
            <line x1="50" y1="5" x2="50" y2="20" stroke="#ff003c" strokeWidth="4" />
            <line x1="50" y1="80" x2="50" y2="95" stroke="#ff003c" strokeWidth="4" />
            <line x1="10" y1="25" x2="22" y2="34" stroke="#ff003c" strokeWidth="4" />
            <line x1="90" y1="25" x2="78" y2="34" stroke="#ff003c" strokeWidth="4" />
            <line x1="10" y1="65" x2="22" y2="60" stroke="#ff003c" strokeWidth="4" />
            <line x1="90" y1="65" x2="78" y2="60" stroke="#ff003c" strokeWidth="4" />
        </svg>
    );
};

export default CyberLogo;
