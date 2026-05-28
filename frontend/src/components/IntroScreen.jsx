import React, { useEffect } from 'react';
import './IntroScreen.css';
import { motion } from 'framer-motion';
import CyberLogo from './CyberLogo';

const IntroScreen = ({ onComplete }) => {
  useEffect(() => {
    // Cyber boot sequence simulation time
    const introTimeout = setTimeout(onComplete, 3500);
    return () => clearTimeout(introTimeout);
  }, [onComplete]);

  return (
    <motion.div 
      className="intro-container"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="intro-content">
        {/* Code-based Animated HUD instead of missing video asset */}
        <div className="intro-logo-wrapper">
          <div className="scanner-line" />
          <CyberLogo size={120} className="intro-cyber-logo" />
          <div className="intro-ring-pulse" />
        </div>

        <motion.h1 
          className="intro-title jelly-text"
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.8 }}
        >
          TECHBOY STORE
        </motion.h1>

        <motion.div 
          className="intro-loading-dots"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <span></span>
          <span></span>
          <span></span>
        </motion.div>
      </div>

      <motion.p
        className="intro-footer"
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.6, duration: 0.8 }}
      >
        COOKED BY RAGHU❤️
      </motion.p>
    </motion.div>
  );
};

export default IntroScreen;
