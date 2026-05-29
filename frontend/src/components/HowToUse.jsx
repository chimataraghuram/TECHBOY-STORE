import React from 'react';
import { motion } from 'framer-motion';
import { Wallet, Scale, Brain, Flame } from 'lucide-react';

const HowToUse = () => {
    const steps = [
        {
            number: '01',
            title: 'Choose Your Budget',
            description: 'Browse curated price categories, from budget-friendly daily drivers to ultra-premium flagships.',
            icon: <Wallet size={32} />
        },
        {
            number: '02',
            title: 'Compare Top Picks',
            description: 'Select multiple phones and let the comparison view reveal the strongest option for your money.',
            icon: <Scale size={32} />
        },
        {
            number: '03',
            title: 'Check Expert Verdict',
            description: 'Open the quick view for AI-style summaries, spec highlights, price charts, and buying signals.',
            icon: <Brain size={32} />
        },
        {
            number: '04',
            title: 'Grab the Best Deal',
            description: 'Jump straight to store links, save products, and track price drops when your account is connected.',
            icon: <Flame size={32} />
        }
    ];

    const cardVariants = {
        hidden: { opacity: 0, y: 30, rotateX: 10 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            rotateX: 0,
            transition: {
                delay: i * 0.1,
                duration: 0.56,
                ease: [0.16, 1, 0.3, 1]
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
                        viewport={{ once: true }}
                        className="badge analyst-badge"
                    >
                        REDLINE PROCESS
                    </motion.span>
                    <motion.h2
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                        viewport={{ once: true }}
                        className="section-title"
                    >
                        How to Find Your <span className="text-gradient">Perfect Phone</span>
                    </motion.h2>
                    <motion.p
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        transition={{ delay: 0.4 }}
                        viewport={{ once: true }}
                        className="section-subtitle"
                        style={{ margin: '0 auto' }}
                    >
                        Four animated steps from search to checkout.
                    </motion.p>
                </div>

                <div className="steps-grid">
                    {steps.map((step, index) => (
                        <motion.div
                            key={step.number}
                            custom={index}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true, margin: '-50px' }}
                            variants={cardVariants}
                            whileHover={{ y: -8, scale: 1.02, rotateX: 3, rotateY: 3 }}
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
