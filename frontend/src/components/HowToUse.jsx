import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Scale, Brain, Flame } from 'lucide-react';

const HowToUse = () => {
    const steps = [
        {
            number: "01",
            title: "Choose Your Budget",
            description: "Browse through our curated price categories—from budget-friendly to ultra-premium flagships.",
            icon: <Wallet size={32} />
        },
        {
            number: "02",
            title: "Compare Top Picks",
            description: "Select multiple phones to use our Winning-Specs tool. It highlights the best performance for your money.",
            icon: <Scale size={32} />
        },
        {
            number: "03",
            title: "Check Expert Verdict",
            description: "Read our AI-driven 'DNA Analytics' and expert reasons to see why a phone is truly worth it.",
            icon: <Brain size={32} />
        },
        {
            number: "04",
            title: "Grab the Best Deal",
            description: "We find the lowest live price across all major stores. Click 'Get Deal' to save instantly.",
            icon: <Flame size={32} />
        }
    ];

    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.5,
                ease: "easeOut"
            }
        })
    };

    return (
        <section id="how-it-works" className="how-to-section">
            <div className="container">
                <div className="section-header text-center">
                    <motion.span 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="badge analyst-badge"
                    >TECHBOY PROCESS</motion.span>
                    <motion.h2 
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        className="premium-title"
                    >How to Find Your <span className="text-gradient">Perfect Phone</span></motion.h2>
                    <motion.p 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        className="premium-subtitle" 
                        style={{ margin: '0 auto' }}
                    >Four simple steps to absolute tech clarity.</motion.p>
                </div>

                <div className="steps-grid">
                    {steps.map((step, index) => (
                        <motion.div 
                            key={index}
                            custom={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: "-50px" }}
                            variants={cardVariants}
                            whileHover={{ y: -5, scale: 1.02 }}
                            className="step-card glass-card"
                        >
                            <div className="step-number">{step.number}</div>
                            <div className="step-icon">{step.icon}</div>
                            <h3 className="step-title">{step.title}</h3>
                            <p className="step-desc">{step.description}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
};

export default HowToUse;
