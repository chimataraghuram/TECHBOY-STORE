import React from 'react';
import { motion } from 'framer-motion';

const Features = () => {
    const cardVariants = {
        hidden: { opacity: 0, y: 30 },
        visible: (i) => ({
            opacity: 1,
            y: 0,
            transition: {
                delay: i * 0.15,
                duration: 0.6,
                ease: "easeOut"
            }
        })
    };

    const features = [
        { icon: '🛡️', title: 'Verified Reviews', text: 'We only list devices after thorough testing and community feedback.' },
        { icon: '⚡', title: 'Live 5G Tests', text: 'Real-world 5G speed results for every phone in our directory.' },
        { icon: '🔋', title: 'Endurance Ratings', text: 'Detailed battery drain tests for gamers and heavy users.' }
    ];

    return (
        <section id="features" className="features-section">
            <div className="container">
                <div className="section-header">
                    <motion.h2 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        viewport={{ once: true }}
                        className="section-title"
                    >Why Choose <span className="text-gradient">TECHBOY</span></motion.h2>
                    <motion.p 
                        initial={{ opacity: 0, x: -20 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6, delay: 0.2 }}
                        viewport={{ once: true }}
                        className="section-subtitle"
                    >Specially curated smartphones with unbeatable reliability.</motion.p>
                </div>

                <div className="features-grid">
                    {features.map((f, i) => (
                        <motion.div 
                            key={i}
                            custom={i}
                            initial="hidden"
                            whileInView="visible"
                            viewport={{ once: true }}
                            variants={cardVariants}
                            whileHover={{ y: -10, transition: { duration: 0.2 } }}
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
