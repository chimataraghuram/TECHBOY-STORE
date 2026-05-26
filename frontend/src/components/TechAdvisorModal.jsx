import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Cpu, Camera, Battery, Activity, Gamepad2, ChevronRight, Zap, Target } from 'lucide-react';
import localPhonesData from '../data/phones.json';
import './TechAdvisorModal.css';

const resolveProductImage = (src) => {
    if (!src) return '';
    if (src.startsWith('/')) return `${import.meta.env.BASE_URL}${src.replace(/^\//, '')}`;
    return src;
};

const TechAdvisorModal = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState([]);
    
    // Preferences
    const [budget, setBudget] = useState(30000);
    const [usage, setUsage] = useState(''); // gaming, camera, battery, daily, performance
    const [brand, setBrand] = useState(''); // optional

    const USAGE_PROFILES = [
        { id: 'gaming', label: 'Hardcore Gaming', icon: <Gamepad2 size={24} />, desc: 'High FPS, top-tier cooling, best chipsets.' },
        { id: 'camera', label: 'Photography', icon: <Camera size={24} />, desc: 'OIS, telephoto lenses, advanced AI ISP.' },
        { id: 'battery', label: 'Battery Endurance', icon: <Battery size={24} />, desc: 'Massive capacity, 100W+ fast charging.' },
        { id: 'daily', label: 'Daily Driver', icon: <Activity size={24} />, desc: 'Smooth UI, good updates, reliable all-rounder.' },
        { id: 'performance', label: 'Max Performance', icon: <Cpu size={24} />, desc: 'Best benchmarks, fastest RAM/Storage.' },
    ];

    const BRANDS = ['Apple', 'Samsung', 'OnePlus', 'iQOO', 'vivo', 'Realme', 'POCO', 'Google', 'Nothing', 'Xiaomi', 'Redmi', 'Tecno', 'Infinix'];

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setTimeout(() => {
            const matches = runRecommendationEngine();
            setResults(matches);
            setIsAnalyzing(false);
            setStep(4);
        }, 2000);
    };

    const runRecommendationEngine = () => {
        let scoredPhones = localPhonesData.map(phone => {
            let score = 0;
            let reason = '';
            
            // 1. Budget check
            if (phone.price <= budget) {
                score += 50; // Heavily weight being in budget
            } else if (phone.price <= budget * 1.1) {
                score += 20; // Slightly over budget
            } else {
                score -= 100; // Too expensive
            }

            // 2. Brand check
            if (brand && phone.name.toLowerCase().includes(brand.toLowerCase())) {
                score += 30;
            }

            // 3. Usage check (via tags and descriptions)
            const desc = phone.description.toLowerCase();
            const tag = phone.tag ? phone.tag.toLowerCase() : '';
            
            if (usage === 'gaming') {
                if (tag.includes('gaming')) score += 40;
                if (desc.includes('cooling') || desc.includes('vapor') || desc.includes('fps')) score += 20;
                reason = 'Top-tier graphics performance and cooling in your budget.';
            } else if (usage === 'camera') {
                if (tag.includes('camera')) score += 40;
                if (desc.includes('ois') || desc.includes('telephoto') || desc.includes('zeiss') || desc.includes('hasselblad')) score += 20;
                reason = 'Exceptional optical performance and AI photography.';
            } else if (usage === 'battery') {
                if (desc.includes('6000mah') || desc.includes('6500mah')) score += 40;
                if (desc.includes('100w') || desc.includes('120w')) score += 20;
                reason = 'Incredible screen-on time and rapid charging capabilities.';
            } else if (usage === 'performance') {
                if (desc.includes('snapdragon 8') || desc.includes('dimensity 9')) score += 40;
                if (desc.includes('lpddr5x')) score += 10;
                reason = 'Raw processing power for heavy multitasking.';
            } else if (usage === 'daily') {
                if (tag.includes('all-round') || tag.includes('value') || tag.includes('ui')) score += 40;
                if (desc.includes('updates') || desc.includes('os')) score += 20;
                reason = 'A perfectly balanced phone for everyday reliability.';
            }

            return { ...phone, score, matchReason: reason };
        });

        // Filter out highly negative scores and sort
        scoredPhones = scoredPhones.filter(p => p.score > 0).sort((a, b) => b.score - a.score);
        return scoredPhones.slice(0, 3);
    };

    return (
        <div className="advisor-overlay">
            <motion.div 
                className="advisor-modal glass-card"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
                <button className="close-advisor" onClick={onClose}><X size={24} /></button>
                
                <div className="advisor-header">
                    <div className="advisor-badge"><Zap size={16} /> AI TECH ADVISOR</div>
                    <h2>Find Your Perfect Match</h2>
                </div>

                <div className="advisor-content">
                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <motion.div key="step1" className="advisor-step" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}}>
                                <h3>What is your maximum budget?</h3>
                                <div className="budget-slider-container">
                                    <h1 className="budget-display">₹{budget.toLocaleString()}</h1>
                                    <input 
                                        type="range" 
                                        min="10000" 
                                        max="150000" 
                                        step="1000" 
                                        value={budget} 
                                        onChange={(e) => setBudget(parseInt(e.target.value))}
                                        className="advisor-range-slider"
                                    />
                                    <div className="budget-presets">
                                        <button onClick={() => setBudget(15000)}>15K</button>
                                        <button onClick={() => setBudget(30000)}>30K</button>
                                        <button onClick={() => setBudget(50000)}>50K</button>
                                        <button onClick={() => setBudget(80000)}>80K</button>
                                        <button onClick={() => setBudget(150000)}>Max</button>
                                    </div>
                                </div>
                                <button className="advisor-next-btn primary-btn" onClick={() => setStep(2)}>Next Step <ChevronRight size={18} /></button>
                            </motion.div>
                        )}

                        {step === 2 && (
                            <motion.div key="step2" className="advisor-step" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}}>
                                <h3>What matters most to you?</h3>
                                <div className="usage-grid">
                                    {USAGE_PROFILES.map(profile => (
                                        <div 
                                            key={profile.id}
                                            className={`usage-card ${usage === profile.id ? 'active' : ''}`}
                                            onClick={() => setUsage(profile.id)}
                                        >
                                            <div className="usage-icon">{profile.icon}</div>
                                            <h4>{profile.label}</h4>
                                            <p>{profile.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="advisor-actions">
                                    <button className="advisor-back-btn" onClick={() => setStep(1)}>Back</button>
                                    <button className="advisor-next-btn primary-btn" disabled={!usage} onClick={() => setStep(3)}>Next Step <ChevronRight size={18} /></button>
                                </div>
                            </motion.div>
                        )}

                        {step === 3 && (
                            <motion.div key="step3" className="advisor-step" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}}>
                                <h3>Any brand preference? <span className="optional-tag">(Optional)</span></h3>
                                <div className="brand-chip-grid">
                                    {BRANDS.map(b => (
                                        <button 
                                            key={b} 
                                            className={`brand-chip ${brand === b ? 'active' : ''}`}
                                            onClick={() => setBrand(brand === b ? '' : b)}
                                        >
                                            {b}
                                        </button>
                                    ))}
                                </div>
                                <div className="advisor-actions">
                                    <button className="advisor-back-btn" onClick={() => setStep(2)}>Back</button>
                                    <button className="advisor-next-btn primary-btn recommend-btn" onClick={handleAnalyze}>
                                        <Target size={18} /> Analyze & Recommend
                                    </button>
                                </div>
                            </motion.div>
                        )}

                        {isAnalyzing && (
                            <motion.div key="analyzing" className="advisor-step analyzing-step" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                                <div className="scanner"></div>
                                <h3>AI is matching your profile...</h3>
                                <p>Scanning 50+ devices for the ultimate {usage} experience under ₹{budget.toLocaleString()}.</p>
                            </motion.div>
                        )}

                        {step === 4 && !isAnalyzing && (
                            <motion.div key="results" className="advisor-step results-step" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
                                <h3>Your Top Recommendations</h3>
                                <div className="results-grid">
                                    {results.length > 0 ? results.map((phone, index) => (
                                        <div key={phone.id} className="result-card glass-card">
                                            {index === 0 && <div className="top-match-badge">#1 Best Match</div>}
                                            <img src={resolveProductImage(phone.image)} alt={phone.name} className="result-img" />
                                            <div className="result-info">
                                                <h4>{phone.name}</h4>
                                                <div className="result-price">₹{phone.price.toLocaleString()}</div>
                                                <div className="result-reason">
                                                    <Zap size={14} className="reason-icon" />
                                                    <p>{phone.matchReason || 'Highly rated in this price segment.'}</p>
                                                </div>
                                            </div>
                                            <div className="result-actions">
                                                {phone.amazonLink && <a href={phone.amazonLink} target="_blank" rel="noreferrer" className="buy-link amazon">Amazon</a>}
                                                {phone.flipkartLink && <a href={phone.flipkartLink} target="_blank" rel="noreferrer" className="buy-link flipkart">Flipkart</a>}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="no-results">
                                            <p>No perfect matches found for this exact criteria. Try adjusting your budget or brand preference.</p>
                                            <button className="primary-btn" onClick={() => setStep(1)}>Start Over</button>
                                        </div>
                                    )}
                                </div>
                                {results.length > 0 && (
                                    <div className="advisor-actions">
                                        <button className="advisor-back-btn" onClick={() => setStep(1)}>Start Over</button>
                                        <button className="primary-btn" onClick={onClose}>Close</button>
                                    </div>
                                )}
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </motion.div>
        </div>
    );
};

export default TechAdvisorModal;
