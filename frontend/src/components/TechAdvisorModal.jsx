import React, { useState, useEffect } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { X, Cpu, Camera, Battery, Activity, Gamepad2, ChevronRight, Zap, Target, Sliders, ChevronLeft } from 'lucide-react';
import localPhonesData from '../data/phones.json';
import { runRecommendationEngine } from '../utils/recommendationEngine';
import './TechAdvisorModal.css';

import { resolveProductImage } from '../utils/imageResolver';

const API_BASE_URL = (import.meta.env.VITE_BACKEND_URL || 'http://127.0.0.1:8000/api');

const TechAdvisorModal = ({ onClose }) => {
    const [step, setStep] = useState(1);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [results, setResults] = useState([]);
    const [phones, setPhones] = useState(localPhonesData);
    
    // Preferences
    const [budget, setBudget] = useState(30000);
    const [mainUsage, setMainUsage] = useState('daily'); // gaming, camera, battery, daily, performance
    const [gamingPriority, setGamingPriority] = useState(2); // 1: Low, 2: Med, 3: High, 4: Ultra
    const [cameraPriority, setCameraPriority] = useState(2);
    const [batteryPriority, setBatteryPriority] = useState(2);
    const [brand, setBrand] = useState(''); // optional

    const USAGE_PROFILES = [
        { id: 'gaming', label: 'Hardcore Gaming', icon: <Gamepad2 size={24} />, desc: 'High FPS, top-tier cooling, best chipsets.' },
        { id: 'camera', label: 'Photography', icon: <Camera size={24} />, desc: 'OIS, telephoto lenses, advanced AI ISP.' },
        { id: 'battery', label: 'Battery Endurance', icon: <Battery size={24} />, desc: 'Massive capacity, 100W+ fast charging.' },
        { id: 'daily', label: 'Daily Driver', icon: <Activity size={24} />, desc: 'Smooth UI, good updates, reliable all-rounder.' },
        { id: 'performance', label: 'Max Performance', icon: <Cpu size={24} />, desc: 'Best benchmarks, fastest RAM/Storage.' },
    ];

    const BRANDS = ['Apple', 'Samsung', 'OnePlus', 'iQOO', 'vivo', 'Realme', 'POCO', 'Google', 'Nothing', 'Xiaomi', 'Redmi', 'Tecno', 'Infinix'];

    const PRIORITY_LEVELS = [
        { value: 1, label: 'Low' },
        { value: 2, label: 'Medium' },
        { value: 3, label: 'High' },
        { value: 4, label: 'Ultra' }
    ];

    // Try to fetch latest products from DB, fallback to local file
    useEffect(() => {
        let mounted = true;
        const fetchPhones = async () => {
            try {
                const res = await fetch(`${API_BASE_URL}/products/`);
                if (res.ok) {
                    const data = await res.json();
                    const list = data.results || data;
                    if (mounted && list && list.length > 0) {
                        setPhones(list);
                    }
                }
            } catch (err) {
                console.warn('Advisor using local JSON fallback database', err);
            }
        };
        fetchPhones();
        return () => { mounted = false; };
    }, []);

    const handleAnalyze = () => {
        setIsAnalyzing(true);
        setStep(5);
        setTimeout(() => {
            const matches = runRecommendationEngine(phones, {
                budget,
                mainUsage,
                gamingPriority,
                cameraPriority,
                batteryPriority,
                brand
            });
            setResults(matches);
            setIsAnalyzing(false);
        }, 2200);
    };

    return (
        <div className="advisor-overlay">
            <m.div 
                className="advisor-modal glass-card"
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
            >
                <button className="close-advisor" onClick={onClose} aria-label="Close Advisor"><X size={22} /></button>
                
                <div className="advisor-header">
                    <div className="advisor-badge"><Zap size={14} /> AI TECH ADVISOR</div>
                    <h2>Find Your Perfect Match</h2>
                </div>

                <div className="advisor-content">
                    {/* Step Indicators */}
                    <div className="advisor-progress-bar">
                        {[1, 2, 3, 4, 5].map((s) => (
                            <div 
                                key={s} 
                                className={`progress-step ${step >= s ? 'active' : ''} ${step === s ? 'current' : ''}`}
                            >
                                <span className="step-num">{s}</span>
                            </div>
                        ))}
                    </div>

                    <AnimatePresence mode="wait">
                        {step === 1 && (
                            <m.div key="step1" className="advisor-step" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}}>
                                <h3>What is your maximum budget?</h3>
                                <div className="budget-slider-container">
                                    <div className="budget-input-wrapper-modal">
                                        <span className="currency-prefix">₹</span>
                                        <input 
                                            type="number"
                                            value={budget}
                                            onChange={(e) => {
                                                const val = parseInt(e.target.value) || 0;
                                                setBudget(val);
                                            }}
                                            className="budget-number-input"
                                            min="8000"
                                            max="200000"
                                        />
                                    </div>
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
                                        <button className={`preset-btn ${budget === 15000 ? 'active' : ''}`} onClick={() => setBudget(15000)}>₹15K</button>
                                        <button className={`preset-btn ${budget === 25000 ? 'active' : ''}`} onClick={() => setBudget(25000)}>₹25K</button>
                                        <button className={`preset-btn ${budget === 40000 ? 'active' : ''}`} onClick={() => setBudget(40000)}>₹40K</button>
                                        <button className={`preset-btn ${budget === 80000 ? 'active' : ''}`} onClick={() => setBudget(80000)}>₹80K</button>
                                        <button className={`preset-btn ${budget === 150000 ? 'active' : ''}`} onClick={() => setBudget(150000)}>Flagship (150K)</button>
                                    </div>
                                </div>
                                <button className="advisor-next-btn primary-btn" onClick={() => setStep(2)}>
                                    Next Step <ChevronRight size={18} />
                                </button>
                            </m.div>
                        )}

                        {step === 2 && (
                            <m.div key="step2" className="advisor-step" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}}>
                                <h3>What is your primary phone usage?</h3>
                                <div className="usage-grid">
                                    {USAGE_PROFILES.map(profile => (
                                        <div 
                                            key={profile.id}
                                            className={`usage-card ${mainUsage === profile.id ? 'active' : ''}`}
                                            onClick={() => setMainUsage(profile.id)}
                                        >
                                            <div className="usage-icon">{profile.icon}</div>
                                            <h4>{profile.label}</h4>
                                            <p>{profile.desc}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="advisor-actions">
                                    <button className="advisor-back-btn" onClick={() => setStep(1)}><ChevronLeft size={18} /> Back</button>
                                    <button className="advisor-next-btn primary-btn" onClick={() => setStep(3)}>Next Step <ChevronRight size={18} /></button>
                                </div>
                            </m.div>
                        )}

                        {step === 3 && (
                            <m.div key="step3" className="advisor-step" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}}>
                                <h3>Tune your priority requirements</h3>
                                <div className="priority-section-wrapper">
                                    <div className="priority-selector-row">
                                        <div className="priority-info">
                                            <Gamepad2 size={20} className="gaming-icon-color" />
                                            <div>
                                                <h4>Gaming Priority</h4>
                                                <p>GPU speed, high frame rate display, cooling capability</p>
                                            </div>
                                        </div>
                                        <div className="discrete-chips">
                                            {PRIORITY_LEVELS.map(lvl => (
                                                <button 
                                                    key={lvl.value}
                                                    className={`discrete-chip ${gamingPriority === lvl.value ? 'active' : ''}`}
                                                    onClick={() => setGamingPriority(lvl.value)}
                                                >
                                                    {lvl.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="priority-selector-row">
                                        <div className="priority-info">
                                            <Camera size={20} className="camera-icon-color" />
                                            <div>
                                                <h4>Camera Preference</h4>
                                                <p>OIS stability, optical zoom, megapixels, low-light sensors</p>
                                            </div>
                                        </div>
                                        <div className="discrete-chips">
                                            {PRIORITY_LEVELS.map(lvl => (
                                                <button 
                                                    key={lvl.value}
                                                    className={`discrete-chip ${cameraPriority === lvl.value ? 'active' : ''}`}
                                                    onClick={() => setCameraPriority(lvl.value)}
                                                >
                                                    {lvl.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="priority-selector-row">
                                        <div className="priority-info">
                                            <Battery size={20} className="battery-icon-color" />
                                            <div>
                                                <h4>Battery & Fast Charging</h4>
                                                <p>Large capacity (mAh), fast charger wattage (W)</p>
                                            </div>
                                        </div>
                                        <div className="discrete-chips">
                                            {PRIORITY_LEVELS.map(lvl => (
                                                <button 
                                                    key={lvl.value}
                                                    className={`discrete-chip ${batteryPriority === lvl.value ? 'active' : ''}`}
                                                    onClick={() => setBatteryPriority(lvl.value)}
                                                >
                                                    {lvl.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className="advisor-actions">
                                    <button className="advisor-back-btn" onClick={() => setStep(2)}><ChevronLeft size={18} /> Back</button>
                                    <button className="advisor-next-btn primary-btn" onClick={() => setStep(4)}>Next Step <ChevronRight size={18} /></button>
                                </div>
                            </m.div>
                        )}

                        {step === 4 && (
                            <m.div key="step4" className="advisor-step" initial={{opacity:0, x:-20}} animate={{opacity:1, x:0}} exit={{opacity:0, x:20}}>
                                <h3>Select brand preferences <span className="optional-tag">(Optional)</span></h3>
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
                                    <button className="advisor-back-btn" onClick={() => setStep(3)}><ChevronLeft size={18} /> Back</button>
                                    <button className="advisor-next-btn primary-btn recommend-btn" onClick={handleAnalyze}>
                                        <Target size={18} /> Match & Recommend
                                    </button>
                                </div>
                            </m.div>
                        )}

                        {step === 5 && isAnalyzing && (
                            <m.div key="analyzing" className="advisor-step analyzing-step" initial={{opacity:0}} animate={{opacity:1}} exit={{opacity:0}}>
                                <div className="scanner-container">
                                    <div className="scanner-circle"></div>
                                    <div className="scanner-line"></div>
                                </div>
                                <h3>AI Matching Algorithm Running...</h3>
                                <p className="scanning-txt">Analyzing 50+ devices for your personalized profile under ₹{budget.toLocaleString('en-IN')}.</p>
                            </m.div>
                        )}

                        {step === 5 && !isAnalyzing && (
                            <m.div key="results" className="advisor-step results-step" initial={{opacity:0, y:20}} animate={{opacity:1, y:0}}>
                                <h3>Your Tailored AI Recommendations</h3>
                                <div className="results-grid">
                                    {results.length > 0 ? results.map((phone, index) => (
                                        <div key={phone.id} className={`result-card glass-card ${index === 0 ? 'top-match' : ''}`}>
                                            {index === 0 && <div className="top-match-badge">🥇 Recommended #1</div>}
                                            {index === 1 && <div className="match-badge">🥈 Option #2</div>}
                                            {index === 2 && <div className="match-badge">🥉 Option #3</div>}
                                            <div className="result-img-container">
                                                <img src={resolveProductImage(phone.image, phone.name)} alt={phone.name} className="result-img" />
                                            </div>
                                            <div className="result-info">
                                                <h4>{phone.name}</h4>
                                                <div className="result-price-row">
                                                    <span className="price-label">Best Deal</span>
                                                    <span className="price-val">₹{phone.price.toLocaleString('en-IN')}</span>
                                                </div>
                                                
                                                <div className="value-score-display-advisor">
                                                    <span>Value Score:</span>
                                                    <strong>{parseFloat(phone.valueScore).toFixed(1)}/10</strong>
                                                </div>

                                                <div className="result-reason">
                                                    <Zap size={14} className="reason-icon" />
                                                    <div>
                                                        <h5>Why Recommended:</h5>
                                                        <p>{phone.matchReason}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="result-actions">
                                                {phone.amazonLink && (
                                                    <a href={phone.amazonLink} target="_blank" rel="noreferrer" className="buy-link amazon">Amazon</a>
                                                )}
                                                {phone.flipkartLink && (
                                                    <a href={phone.flipkartLink} target="_blank" rel="noreferrer" className="buy-link flipkart">Flipkart</a>
                                                )}
                                            </div>
                                        </div>
                                    )) : (
                                        <div className="no-results">
                                            <p>No perfect matches found for your criteria. Try increasing your budget or removing the brand filter.</p>
                                            <button className="primary-btn" onClick={() => setStep(1)}>Start Over</button>
                                        </div>
                                    )}
                                </div>
                                {results.length > 0 && (
                                    <div className="advisor-actions">
                                        <button className="advisor-back-btn" onClick={() => setStep(1)}>Start Over</button>
                                        <button className="primary-btn" onClick={onClose}>Finish</button>
                                    </div>
                                )}
                            </m.div>
                        )}
                    </AnimatePresence>
                </div>
            </m.div>
        </div>
    );
};

export default TechAdvisorModal;
