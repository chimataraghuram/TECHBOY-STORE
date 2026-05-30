import React from 'react';
import { m } from 'framer-motion';
import { Search, Brain, ShieldCheck, BatteryCharging, ArrowRight } from 'lucide-react';
import { CountUp } from './AnimationEngine';

const BentoCard = ({ className, custom, children, style, variants, initial, whileInView, viewport }) => {
    const [theme, setTheme] = React.useState('default');
    const cycleTheme = (e) => {
        if (e.target.closest('button, a, input, select')) return;
        const themes = ['default', 'cyberpunk', 'matrix', 'aurum', 'nebula', 'inferno'];
        const next = themes[(themes.indexOf(theme) + 1) % themes.length];
        setTheme(next);
    };
    
    return (
        <m.div
            custom={custom}
            initial={initial}
            whileInView={whileInView}
            viewport={viewport}
            variants={variants}
            className={`${className} ${theme !== 'default' ? `theme-${theme}` : ''}`}
            onClick={cycleTheme}
            style={{ ...style, cursor: 'pointer' }}
        >
            {children}
        </m.div>
    );
};

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
                    <m.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        className="badge analyst-badge"
                    >
                        THE PLATFORM
                    </m.span>
                    <m.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.1 }}
                        viewport={{ once: true }}
                        className="section-title"
                    >
                        How It <span className="text-gradient">Works</span>
                    </m.h2>
                    <m.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="section-subtitle"
                        style={{ margin: '0 auto' }}
                    >
                        Everything you need to find the perfect smartphone, packed into one seamless experience.
                    </m.p>
                </div>

                <div className="bento-grid">
                    {/* Big Feature: The 4-Step Process */}
                    <BentoCard 
                        custom={0} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={bentoVariants}
                        className="bento-card glass-card bento-pos-1 process-card"
                    >
                        <div className="bento-content">
                            <h3>The Buying Process</h3>
                            <p>We've simplified smartphone shopping into four easy steps.</p>
                            <div className="process-steps">
                                <div className="p-step">
                                    <div className="p-dot"><CountUp end={1} /></div>
                                    <span>Set Budget</span>
                                </div>
                                <ArrowRight className="p-arrow" size={16} />
                                <div className="p-step">
                                    <div className="p-dot"><CountUp end={2} /></div>
                                    <span>Compare</span>
                                </div>
                                <ArrowRight className="p-arrow" size={16} />
                                <div className="p-step">
                                    <div className="p-dot"><CountUp end={3} /></div>
                                    <span>AI Verdict</span>
                                </div>
                                <ArrowRight className="p-arrow" size={16} />
                                <div className="p-step">
                                    <div className="p-dot"><CountUp end={4} /></div>
                                    <span>Best Deal</span>
                                </div>
                            </div>
                        </div>
                    </BentoCard>

                    {/* Tall Feature: AI */}
                    <BentoCard 
                        custom={1} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={bentoVariants}
                        className="bento-card glass-card bento-pos-2 ai-card"
                    >
                        <Brain size={48} className="bento-icon pulse-icon" />
                        <div className="bento-content">
                            <h3>AI Verdicts</h3>
                            <p>Instantly know if a phone is right for you. Our AI reads the specs and gives you a straight answer—no jargon.</p>
                        </div>
                    </BentoCard>

                    {/* Square: Instant Search */}
                    <BentoCard 
                        custom={2} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={bentoVariants}
                        className="bento-card glass-card bento-pos-3"
                    >
                        <Search size={32} className="bento-icon" />
                        <div className="bento-content">
                            <h3>Instant Search</h3>
                            <p>Filter exactly what you want in milliseconds.</p>
                        </div>
                    </BentoCard>

                    {/* Square: Verified Picks */}
                    <BentoCard 
                        custom={3} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={bentoVariants}
                        className="bento-card glass-card bento-pos-4"
                    >
                        <ShieldCheck size={32} className="bento-icon" />
                        <div className="bento-content">
                            <h3>Verified Picks</h3>
                            <p>Only the best phones make it to the store.</p>
                        </div>
                    </BentoCard>

                    {/* Wide: Battery Focus */}
                    <BentoCard 
                        custom={4} initial="hidden" whileInView="visible" viewport={{ once: true }} variants={bentoVariants}
                        className="bento-card glass-card bento-pos-5"
                        style={{ display: 'flex', flexDirection: 'row', alignItems: 'center', gap: '24px' }}
                    >
                        <BatteryCharging size={48} className="bento-icon" style={{ margin: 0 }} />
                        <div className="bento-content">
                            <h3>Battery & Performance Signals</h3>
                            <p>Spot the gaming champions and battery beasts at a glance with our custom tech-signals.</p>
                        </div>
                    </BentoCard>

                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
