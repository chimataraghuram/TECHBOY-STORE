import React, { useRef, useEffect } from 'react';
import './IntroScreen.css';
import { motion } from 'framer-motion';
import introVideo from '../../images/techboy-intro.mp4';

const IntroScreen = ({ onComplete }) => {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (video) {
      video.play().catch(error => {
        console.error("Video autoplay failed", error);
        // Fallback in case autoplay is blocked
        setTimeout(onComplete, 3000); 
      });

      video.addEventListener('ended', onComplete);
      // Timeout fallback if video event doesn't trigger
      const introTimeout = setTimeout(onComplete, 3500);
      return () => {
        video.removeEventListener('ended', onComplete);
        clearTimeout(introTimeout);
      };
    }
  }, [onComplete]);

  return (
    <motion.div 
      className="intro-container"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
    >
      <div className="intro-content">
        <video 
          ref={videoRef}
          className="intro-video"
          src={introVideo}
          muted
          playsInline
          autoPlay
        />
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
