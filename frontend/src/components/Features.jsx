import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck, Bolt, BatteryCharging, ScanSearch, Shield, Sparkles } from 'lucide-react';

const Features = () => {
    const cardVariants = {
        hidden: { opacity: 0, y: 30, rotateX: 8 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                delay: i * 0.12,
                duration: 0.62,
                ease: [0.16, 1, 0.3, 1]
            }
        })
    };

    const features = [
        { icon: <BadgeCheck size={28} />, title: 'Verified Picks', text: 'Every recommendation is tuned around performance, value, update support, and real buying intent.' },
        { icon: <Bolt size={28} />, title: 'Speed Signals', text: 'Spot gaming, camera, display, and daily-use winners without drowning in spec sheets.' },
        { icon: <BatteryCharging size={28} />, title: 'Battery Focus', text: 'Quickly find phones that can survive long days, heavy scrolling, and game sessions.' },
        { icon: <ScanSearch size={28} />, title: 'Instant Search', text: 'Search across names, tags, categories, and descriptions with animated highlighted matches.' },
        { icon: <Shield size={28} />, title: 'Watchlist Ready', text: 'Save phones and set price alerts when the backend account system is connected.' },
        { icon: <Sparkles size={28} />, title: 'AI Verdicts', text: 'Open a product for a short buying summary designed to help you decide faster.' }
    ];

    return (
        <section id="features" className="features-section">
            <div className="container">
                <div className="section-header text-center">
                    <motion.span
                        initial={{ opacity: 0, y: 14 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="badge analyst-badge"
                    >
                        REDLINE FEATURES
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="section-title"
                    >
                        Why Choose <span className="text-gradient">TECHBOY</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="section-subtitle"
                        style={{ margin: '0 auto' }}
                    >
                        A sharper way to explore phones: visual, fast, animated, and built around decisions.
                    </motion.p>
                </div>

                <div className="features-grid">
                    {features.map((f, i) => (
                        <motion.div
                            key={f.title}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={cardVariants}
                            whileHover={{ y: -10, rotateX: 3, rotateY: -3, transition: { duration: 0.2 } }}
                            className="feature-card glass-card"
                        >
                            <div className="feature-icon">{f.icon}</div>
                            <h3>{f.title}</h3>
                            <p>{f.text}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default Features;
