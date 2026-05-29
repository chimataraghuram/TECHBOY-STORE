import React from 'react';
import { motion } from 'framer-motion';
import { Search, Brain, ShieldCheck, BatteryCharging, ArrowRight } from 'lucide-react';

const HowItWorks = () => {
    const bentoVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                delay: i * 0.1,
                duration: 0.6,
                ease: [0.16, 1, 0.3, 1]
            }
        })
    };

    return (
        <section id="how-it-works" className="bento-section">
            <div className="container">
                <div className="section-header text-center">
                    <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="badge analyst-badge"
                    >
                        THE PLATFORM
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="section-title"
                    >
                        How It <span className="text-gradient">Works</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="section-subtitle"
                        style={{ margin: '0 auto' }}
                    >
                        Everything you need to find the perfect smartphone, packed into one seamless experience.
                    </motion.p>
                </div>

                <div className="bento-grid">
                    {/* Big Feature: The 4-Step Process */}
                    <motion.div 
                        custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={bentoVariants}
                        className="bento-card glass-card bento-wide process-card"
                    >
                        <div className="bento-content">
                            <h3>The Buying Process</h3>
                            <p>We've simplified smartphone shopping into four easy steps.</p>
                            <div className="process-steps">
                                <div className="p-step">
                                    <div className="p-dot">1</div>
                                    <span>Set Budget</span>
                                </div>
                                <ArrowRight className="p-arrow" size={16} />
                                <div className="p-step">
                                    <div className="p-dot">2</div>
                                    <span>Compare</span>
                                </div>
                                <ArrowRight className="p-arrow" size={16} />
                                <div className="p-step">
                                    <div className="p-dot">3</div>
                                    <span>AI Verdict</span>
                                </div>
                                <ArrowRight className="p-arrow" size={16} />
                                <div className="p-step">
                                    <div className="p-dot">4</div>
                                    <span>Best Deal</span>
                                </div>
                            </div>
                        </div>
                    </motion.div>

                    {/* Tall Feature: AI */}
                    <motion.div 
                        custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={bentoVariants}
                        className="bento-card glass-card bento-tall ai-card"
                    >
                        <Brain size={48} className="bento-icon pulse-icon" />
                        <div className="bento-content">
                            <h3>AI Verdicts</h3>
                            <p>Instantly know if a phone is right for you. Our AI reads the specs and gives you a straight answer—no jargon.</p>
                        </div>
                    </motion.div>

                    {/* Square: Instant Search */}
                    <motion.div 
                        custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={bentoVariants}
                        className="bento-card glass-card"
                    >
                        <Search size={32} className="bento-icon" />
                        <div className="bento-content">
                            <h3>Instant Search</h3>
                            <p>Filter exactly what you want in milliseconds.</p>
                        </div>
                    </motion.div>

                    {/* Square: Verified Picks */}
                    <motion.div 
                        custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={bentoVariants}
                        className="bento-card glass-card"
                    >
                        <ShieldCheck size={32} className="bento-icon" />
                        <div className="bento-content">
                            <h3>Verified Picks</h3>
                            <p>Only the best phones make it to the store.</p>
                        </div>
                    </motion.div>

                    {/* Wide: Battery Focus */}
                    <motion.div 
                        custom={4} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={bentoVariants}
                        className="bento-card glass-card bento-wide"
                        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px' }}
                    >
                        <BatteryCharging size={48} className="bento-icon" style={{ margin: 0 }} />
                        <div className="bento-content">
                            <h3>Battery & Performance Signals</h3>
                            <p>Spot the gaming champions and battery beasts at a glance with our custom tech-signals.</p>
                        </div>
                    </motion.div>

                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
