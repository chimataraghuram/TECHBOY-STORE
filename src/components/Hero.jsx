import React from 'react';
import { motion } from 'framer-motion';
import heroImg from '../assets/hero-cyber.png';
import { Zap, Diamond, Smartphone } from 'lucide-react';

const Hero = () => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.2,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.8, ease: [0.6, 0.05, -0.01, 0.9] }
        }
    };

    return (
        <section id="home" className="hero-section">
            <div className="liquid-glow"></div>
            <div className="background-glows">
                <div className="glow glow-1"></div>
                <div className="glow glow-2"></div>
            </div>

            <motion.div 
                className="container hero-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="hero-text">
                    <motion.div variants={itemVariants} className="badge-wrapper">
                        <span className="badge analyst-badge">TECHBOY ANALYST PICK</span>
                    </motion.div>
                    
                    <motion.h1 variants={itemVariants} className="premium-title">
                        Find Your Next <br />
                        <span className="text-gradient">Tech Evolution</span>
                    </motion.h1>
                    
                    <motion.p variants={itemVariants} className="premium-subtitle">
                        Expert analysis meeting unbeatable deals. We curate the best smartphones so you always stay ahead of the curve.
                    </motion.p>
                    
                    <motion.div variants={itemVariants} className="hero-buttons">
                        <button className="primary-btn large jelly-btn">Start Exploring</button>
                        <button className="secondary-btn large jelly-btn">Top Collections</button>
                    </motion.div>

                    <motion.div variants={itemVariants} className="trust-badges">
                        <div className="trust-item">
                            <span>★ ★ ★ ★ ★</span>
                            <p>Premium Expert Support</p>
                        </div>
                    </motion.div>
                </div>

                <motion.div 
                    className="hero-visual-wrapper"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.2, ease: "easeOut" }}
                >
                    <motion.div 
                        className="hero-main-visual glass-card"
                        animate={{ 
                            y: [0, -10, 0],
                            rotate: [0, 1, 0] 
                        }}
                        transition={{ 
                            duration: 5, 
                            repeat: Infinity, 
                            ease: "easeInOut" 
                        }}
                    >
                        <img src={heroImg} alt="Cyber Workstation" className="hero-img" />
                    </motion.div>
                    
                    <div className="floating-elements">
                        <motion.div 
                            className="float-icon icon-1"
                            animate={{ y: [0, -15, 0], x: [0, 5, 0] }}
                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Zap size={24} fill="#ff4500" stroke="#ff4500" />
                        </motion.div>
                        <motion.div 
                            className="float-icon icon-2"
                            animate={{ y: [0, -25, 0], x: [0, -5, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Diamond size={24} fill="#ff4500" stroke="#ff4500" />
                        </motion.div>
                        <motion.div 
                            className="float-icon icon-3"
                            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Smartphone size={24} fill="#ff4500" stroke="#ff4500" />
                        </motion.div>
                    </div>
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
