import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import heroImg from '../../images/hero_banners/hero-cyber.png';
import { Zap, Diamond, Smartphone, Timer } from 'lucide-react';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

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

    const [dealOfDay, setDealOfDay] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 23, seconds: 59 });

    useEffect(() => {
        const fetchDeal = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/products/deal_of_the_day/`);
                if (res.ok) {
                    const data = await res.json();
                    setDealOfDay(data);
                }
            } catch (err) {
                console.error("Failed to fetch deal of the day", err);
            }
        };
        fetchDeal();

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;
                if (seconds > 0) { seconds--; }
                else if (minutes > 0) { minutes--; seconds = 59; }
                else if (hours > 0) { hours--; minutes = 59; seconds = 59; }
                return { hours, minutes, seconds };
            });
        }, 1000);
        
        return () => clearInterval(timer);
    }, []);

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
                        <button className="primary-btn large jelly-btn" onClick={() => {
                            document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
                        }}>Start Exploring</button>
                        <button className="secondary-btn large jelly-btn" onClick={() => {
                            document.getElementById('how-it-works')?.scrollIntoView({ behavior: 'smooth' });
                        }}>Top Collections</button>
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
                            <Zap size={24} fill="var(--accent-primary)" stroke="var(--accent-primary)" />
                        </motion.div>
                        <motion.div 
                            className="float-icon icon-2"
                            animate={{ y: [0, -25, 0], x: [0, -5, 0] }}
                            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Diamond size={24} fill="var(--accent-secondary)" stroke="var(--accent-secondary)" />
                        </motion.div>
                        <motion.div 
                            className="float-icon icon-3"
                            animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }}
                            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                        >
                            <Smartphone size={24} fill="var(--accent-primary)" stroke="var(--accent-primary)" />
                        </motion.div>
                    </div>

                    {dealOfDay && (
                        <motion.div 
                            className="deal-of-day-card glass-card tech-deal-card"
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ delay: 1.5, duration: 0.8 }}
                            whileHover={{ scale: 1.03, y: -5 }}
                        >
                            <div className="deal-header-row">
                                <span className="deal-pulse-dot"></span>
                                <Timer size={14} className="deal-timer-icon" />
                                <span className="deal-title-label">FLASH SALE ENDS IN</span>
                            </div>
                            <div className="led-countdown">
                                <div className="led-unit">
                                    <span className="led-digits">{String(timeLeft.hours).padStart(2, '0')}</span>
                                    <span className="led-label">HRS</span>
                                </div>
                                <span className="led-separator">:</span>
                                <div className="led-unit">
                                    <span className="led-digits">{String(timeLeft.minutes).padStart(2, '0')}</span>
                                    <span className="led-label">MIN</span>
                                </div>
                                <span className="led-separator">:</span>
                                <div className="led-unit">
                                    <span className="led-digits">{String(timeLeft.seconds).padStart(2, '0')}</span>
                                    <span className="led-label">SEC</span>
                                </div>
                            </div>
                            <div className="deal-product-row">
                                <div className="deal-img-container">
                                    <img src={dealOfDay.image} alt={dealOfDay.name} className="deal-product-img" />
                                </div>
                                <div className="deal-product-info">
                                    <h4 className="deal-product-title">{dealOfDay.name}</h4>
                                    <div className="deal-price-wrapper">
                                        <span className="deal-price-old">₹{(dealOfDay.price * 1.2).toLocaleString()}</span>
                                        <span className="deal-price-new">₹{dealOfDay.price.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    )}
                </motion.div>
            </motion.div>
        </section>
    );
};

export default Hero;
