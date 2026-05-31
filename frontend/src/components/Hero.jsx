import React, { useState, useEffect } from 'react';
import { m } from 'framer-motion';

const heroImages = [
    "https://images.unsplash.com/photo-1616348436168-de43ad0db179?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1556656793-08538906a9f8?auto=format&fit=crop&w=600&q=80",
    "https://images.unsplash.com/photo-1598327105666-5b89351cb31b?auto=format&fit=crop&w=600&q=80"
];

import {
    Zap,
    Diamond,
    Smartphone,
    Timer,
    Cpu,
    Gauge,
    ShieldCheck,
    RadioTower,
    Search
} from 'lucide-react';

import { resolveProductImage } from '../utils/imageResolver';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

const Hero = ({ onOpenAdvisor, searchTerm, onSearch }) => {
    const [dealOfDay, setDealOfDay] = useState(null);
    const [timeLeft, setTimeLeft] = useState({ hours: 14, minutes: 23, seconds: 59 });
    const [currentImage, setCurrentImage] = useState(heroImages[0]);

    useEffect(() => {
        // Pick a random image on mount to keep it fresh
        const randomIndex = Math.floor(Math.random() * heroImages.length);
        setCurrentImage(heroImages[randomIndex]);

        const fetchDeal = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/products/deal_of_the_day/`);
                if (res.ok) {
                    const data = await res.json();
                    setDealOfDay(data);
                }
            } catch (err) {
                console.error('Failed to fetch deal of the day', err);
            }
        };

        fetchDeal();

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                let { hours, minutes, seconds } = prev;
                if (seconds > 0) seconds -= 1;
                else if (minutes > 0) {
                    minutes -= 1;
                    seconds = 59;
                } else if (hours > 0) {
                    hours -= 1;
                    minutes = 59;
                    seconds = 59;
                }
                return { hours, minutes, seconds };
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.16, delayChildren: 0.18 }
        }
    };

    const itemVariants = {
        hidden: { y: 24, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.72, ease: [0.16, 1, 0.3, 1] }
        }
    };

    const handleSearchSubmit = (e) => {
        e.preventDefault();
        document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
    };

    return (
        <section id="home" className="hero-section redesigned-hero">
            <div className="redesign-grid-bg"></div>
            <div className="redesign-beam redesign-beam-1"></div>
            <div className="redesign-beam redesign-beam-2"></div>
            <div className="background-glows">
                <div className="glow glow-1"></div>
                <div className="glow glow-2"></div>
            </div>

            <m.div
                className="container hero-content"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="hero-text">
                    <m.div variants={itemVariants} className="badge-wrapper">
                        <span className="badge analyst-badge">SMART TECH ADVISOR</span>
                    </m.div>

                    <m.h1 variants={itemVariants} className="premium-title">
                        Find Your Perfect <br />
                        <span className="text-gradient">Smartphone</span>
                    </m.h1>

                    <m.p variants={itemVariants} className="premium-subtitle">
                        AI-assisted recommendations based on your budget, gaming needs, camera preferences, and daily usage. Stop browsing, start deciding.
                    </m.p>
                    


                    <m.div variants={itemVariants} className="hero-buttons">
                        <button
                            className="primary-btn large jelly-btn recommend-btn"
                            onClick={onOpenAdvisor}
                        >
                            <Zap size={18} /> Recommend Me
                        </button>
                        <button
                            className="secondary-btn large jelly-btn"
                            onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                        >
                            Browse All
                        </button>
                    </m.div>

                    <m.div variants={itemVariants} className="trust-badges">
                        <div className="trust-item">
                            <span>5.0</span>
                            <p>Expert-curated picks</p>
                        </div>
                        <div className="trust-item">
                            <span>AI</span>
                            <p>Instant buying verdicts</p>
                        </div>
                    </m.div>
                </div>

                <m.div
                    className="hero-visual-wrapper"
                    initial={{ opacity: 0, scale: 0.84, rotateY: -10 }}
                    animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                    transition={{ duration: 1.05, ease: [0.16, 1, 0.3, 1] }}
                >
                    <m.div
                        className="hero-main-visual glass-card hero-device-stage"
                        animate={{ y: [0, -12, 0], rotateZ: [0, 0.8, 0] }}
                        transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
                    >
                        <div className="hero-stage-rings">
                            <span></span>
                            <span></span>
                            <span></span>
                        </div>

                        <div className="hero-phone-3d">
                            <div className="phone-side phone-side-left"></div>
                            <div className="phone-face">
                                <img src={currentImage} alt="TECHBOY red 3D phone showcase" className="hero-img" />
                                <div className="phone-screen-scan"></div>
                            </div>
                            <div className="phone-side phone-side-right"></div>
                        </div>

                        <div className="hero-hud-card hud-card-top">
                            <Cpu size={16} />
                            <span>Performance Rank</span>
                            <strong>98</strong>
                        </div>
                        <div className="hero-hud-card hud-card-bottom">
                            <Gauge size={16} />
                            <span>Deal Score</span>
                            <strong>Hot</strong>
                        </div>
                    </m.div>

                    <div className="floating-elements">
                        <m.div className="float-icon icon-1" animate={{ y: [0, -15, 0], x: [0, 5, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
                            <Zap size={24} fill="var(--accent-primary)" stroke="var(--accent-primary)" />
                        </m.div>
                        <m.div className="float-icon icon-3" animate={{ y: [0, -20, 0], rotate: [0, 10, 0] }} transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}>
                            <Smartphone size={24} fill="var(--accent-primary)" stroke="var(--accent-primary)" />
                        </m.div>
                        <m.div className="float-icon icon-5" animate={{ y: [0, -16, 0], x: [0, 8, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}>
                            <RadioTower size={24} stroke="var(--accent-primary)" />
                        </m.div>
                    </div>

                    {dealOfDay && (
                        <m.div
                            className="deal-of-day-card glass-card tech-deal-card"
                            initial={{ opacity: 0, x: 50, scale: 0.9 }}
                            animate={{ opacity: 1, x: 0, scale: 1 }}
                            transition={{ delay: 1.1, duration: 0.8 }}
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
                                    <img src={resolveProductImage(dealOfDay.image, dealOfDay.name)} alt={dealOfDay.name} className="deal-product-img" />
                                </div>
                                <div className="deal-product-info">
                                    <h4 className="deal-product-title">{dealOfDay.name}</h4>
                                    <div className="deal-price-wrapper">
                                        <span className="deal-price-old">Rs {Math.round(dealOfDay.price * 1.2).toLocaleString('en-IN')}</span>
                                        <span className="deal-price-new">Rs {dealOfDay.price.toLocaleString('en-IN')}</span>
                                    </div>
                                </div>
                            </div>
                        </m.div>
                    )}
                </m.div>
            </m.div>
        </section>
    );
};

export default Hero;
