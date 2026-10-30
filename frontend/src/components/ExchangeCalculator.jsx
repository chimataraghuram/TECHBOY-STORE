import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { m, AnimatePresence } from 'framer-motion';
import { X, Calculator, Sparkles, CheckCircle2, AlertCircle, ArrowRight, RotateCcw, ExternalLink } from 'lucide-react';

const BRANDS = ['Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'Vivo', 'OPPO', 'Google', 'Nothing', 'Motorola', 'Other'];
const YEARS = ['2025', '2024', '2023', '2022', '2021', '2020 or earlier'];

const CONDITIONS = [
    {
        id: 'like-new',
        title: 'Like New (Flawless)',
        desc: 'No scratches or dents, 100% screen & battery health, all original accessories available.',
        multiplier: 0.88,
        badge: 'Top Tier'
    },
    {
        id: 'good',
        title: 'Good (Minor Wear)',
        desc: 'Minor hairline scratches on body/bezel, screen intact, fully functional with zero issues.',
        multiplier: 0.72,
        badge: 'Popular'
    },
    {
        id: 'fair',
        title: 'Fair (Noticeable Wear)',
        desc: 'Visible scratches or minor paint chips, battery health > 75%, all hardware buttons working.',
        multiplier: 0.50,
        badge: 'Decent'
    },
    {
        id: 'heavy',
        title: 'Heavily Used / Cracked',
        desc: 'Cracked screen or back panel, noticeable dents, or depleted battery capacity.',
        multiplier: 0.28,
        badge: 'Refurb Base'
    }
];

const ExchangeCalculator = ({ isOpen, onClose }) => {
    const [step, setStep] = useState(1);
    const [brand, setBrand] = useState('Apple');
    const [modelName, setModelName] = useState('');
    const [year, setYear] = useState('2024');
    const [originalPrice, setOriginalPrice] = useState('');
    const [selectedCondition, setSelectedCondition] = useState('good');
    const [displayVal, setDisplayVal] = useState(0);

    // Escape listener
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === 'Escape') onClose?.();
        };
        if (isOpen) {
            document.addEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'hidden';
        }
        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.overflow = 'unset';
        };
    }, [isOpen, onClose]);

    const calculateResult = () => {
        const orig = parseFloat(originalPrice) || 50000;
        const currentYear = 2026;
        const parsedYear = parseInt(year, 10) || 2023;
        const ageYears = Math.max(0, currentYear - parsedYear);

        // Age factor
        let ageFactor = 1.0;
        if (ageYears === 0) ageFactor = 0.85;
        else if (ageYears === 1) ageFactor = 0.70;
        else if (ageYears === 2) ageFactor = 0.52;
        else if (ageYears === 3) ageFactor = 0.38;
        else if (ageYears === 4) ageFactor = 0.25;
        else ageFactor = 0.16;

        // Brand retention factor
        let brandBonus = 1.0;
        if (brand === 'Apple') brandBonus = 1.15;
        else if (brand === 'Samsung' || brand === 'Google') brandBonus = 1.08;
        else if (brand === 'OnePlus') brandBonus = 1.04;

        // Condition factor
        const condObj = CONDITIONS.find(c => c.id === selectedCondition) || CONDITIONS[1];
        const condFactor = condObj.multiplier;

        const finalValue = Math.round((orig * ageFactor * condFactor * brandBonus) / 100) * 100;
        return {
            finalValue: Math.max(1500, finalValue),
            orig,
            ageFactor,
            brandBonus,
            condFactor
        };
    };

    const res = calculateResult();

    // Count-up animation
    useEffect(() => {
        if (step === 3 && isOpen) {
            let start = 0;
            const end = res.finalValue;
            const stepDuration = 16;
            const steps = 30;
            const increment = end / steps;
            const timer = setInterval(() => {
                start += increment;
                if (start >= end) {
                    setDisplayVal(end);
                    clearInterval(timer);
                } else {
                    setDisplayVal(Math.round(start));
                }
            }, stepDuration);
            return () => clearInterval(timer);
        }
    }, [step, isOpen, res.finalValue]);

    const resetCalc = () => {
        setStep(1);
        setModelName('');
        setOriginalPrice('');
        setSelectedCondition('good');
    };

    if (!isOpen) return null;

    return createPortal(
        <AnimatePresence>
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                {/* Backdrop */}
                <m.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="fixed inset-0 bg-black/80 backdrop-blur-md"
                />

                {/* Dialog Container */}
                <m.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="relative w-full max-w-xl bg-zinc-950 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.8)] z-10 overflow-hidden"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/10 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-orange-500 flex items-center justify-center text-white shadow-lg">
                                <Calculator size={20} />
                            </div>
                            <div>
                                <h3 className="text-lg font-black text-white">Smart Exchange Calculator</h3>
                                <p className="text-xs text-gray-400">Instant AI market appraisal for your old smartphone</p>
                            </div>
                        </div>
                        <button
                            onClick={onClose}
                            className="w-9 h-9 rounded-full bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition-all cursor-pointer"
                        >
                            <X size={18} />
                        </button>
                    </div>

                    {/* Stepper Progress */}
                    <div className="flex items-center gap-2 mb-6">
                        <div className={`h-1.5 flex-1 rounded-full ${step >= 1 ? 'bg-red-500' : 'bg-white/10'}`} />
                        <div className={`h-1.5 flex-1 rounded-full ${step >= 2 ? 'bg-red-500' : 'bg-white/10'}`} />
                        <div className={`h-1.5 flex-1 rounded-full ${step >= 3 ? 'bg-red-500' : 'bg-white/10'}`} />
                    </div>

                    {/* Step 1: Device Specs */}
                    {step === 1 && (
                        <div className="space-y-4">
                            <div>
                                <label className="text-xs font-semibold text-gray-300 block mb-1.5">Select Brand</label>
                                <select
                                    value={brand}
                                    onChange={(e) => setBrand(e.target.value)}
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-red-500 outline-none cursor-pointer"
                                >
                                    {BRANDS.map(b => <option key={b} value={b} className="bg-zinc-900">{b}</option>)}
                                </select>
                            </div>

                            <div>
                                <label className="text-xs font-semibold text-gray-300 block mb-1.5">Model Name (e.g. iPhone 14 Pro, Galaxy S23)</label>
                                <input
                                    type="text"
                                    value={modelName}
                                    onChange={(e) => setModelName(e.target.value)}
                                    placeholder="Enter smartphone model..."
                                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-red-500 outline-none"
                                />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-xs font-semibold text-gray-300 block mb-1.5">Purchase Year</label>
                                    <select
                                        value={year}
                                        onChange={(e) => setYear(e.target.value)}
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-red-500 outline-none cursor-pointer"
                                    >
                                        {YEARS.map(y => <option key={y} value={y} className="bg-zinc-900">{y}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-xs font-semibold text-gray-300 block mb-1.5">Original Price (₹)</label>
                                    <input
                                        type="number"
                                        value={originalPrice}
                                        onChange={(e) => setOriginalPrice(e.target.value)}
                                        placeholder="e.g. 69999"
                                        className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-white text-sm focus:border-red-500 outline-none"
                                    />
                                </div>
                            </div>

                            <button
                                onClick={() => setStep(2)}
                                className="w-full mt-4 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/20"
                            >
                                Continue to Condition Check <ArrowRight size={16} />
                            </button>
                        </div>
                    )}

                    {/* Step 2: Condition */}
                    {step === 2 && (
                        <div className="space-y-4">
                            <label className="text-xs font-semibold text-gray-300 block mb-1">Select Physical Condition</label>
                            <div className="space-y-2.5 max-h-[300px] overflow-y-auto pr-1">
                                {CONDITIONS.map(cond => (
                                    <div
                                        key={cond.id}
                                        onClick={() => setSelectedCondition(cond.id)}
                                        className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-start gap-3 ${
                                            selectedCondition === cond.id
                                                ? 'bg-red-500/10 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.15)]'
                                                : 'bg-white/[0.03] border-white/5 hover:border-white/20'
                                        }`}
                                    >
                                        <div className={`mt-0.5 w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                                            selectedCondition === cond.id ? 'border-red-500 bg-red-500 text-white' : 'border-gray-500'
                                        }`}>
                                            {selectedCondition === cond.id && <CheckCircle2 size={13} />}
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex items-center justify-between mb-0.5">
                                                <h4 className="text-sm font-bold text-white">{cond.title}</h4>
                                                <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white/10 text-gray-300">
                                                    {cond.badge}
                                                </span>
                                            </div>
                                            <p className="text-xs text-gray-400 leading-relaxed">{cond.desc}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>

                            <div className="flex items-center gap-3 pt-2">
                                <button
                                    onClick={() => setStep(1)}
                                    className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 text-xs font-semibold hover:bg-white/5"
                                >
                                    Back
                                </button>
                                <button
                                    onClick={() => setStep(3)}
                                    className="flex-1 py-3 bg-gradient-to-r from-red-600 to-orange-600 hover:from-red-500 hover:to-orange-500 text-white font-bold text-sm rounded-xl flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-red-600/20"
                                >
                                    Calculate Estimated Value <Sparkles size={16} />
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Step 3: Appraisal Result */}
                    {step === 3 && (
                        <div className="text-center py-2 space-y-5">
                            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold uppercase tracking-wider">
                                <Sparkles size={14} /> Estimated Exchange Value
                            </div>

                            <div>
                                <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
                                    ₹{displayVal.toLocaleString('en-IN')}
                                </div>
                                <p className="text-xs text-gray-400 mt-1">
                                    Applicable for {brand} {modelName || 'Device'} ({year})
                                </p>
                            </div>

                            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10 text-left space-y-2 text-xs">
                                <div className="flex justify-between text-gray-400">
                                    <span>Brand Value Retention ({brand})</span>
                                    <span className="text-white font-semibold">{brand === 'Apple' ? '+15% Premium' : brand === 'Samsung' ? '+8% Premium' : 'Standard'}</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Condition Multiplier</span>
                                    <span className="text-white font-semibold">{Math.round(res.condFactor * 100)}% of residual</span>
                                </div>
                                <div className="flex justify-between text-gray-400">
                                    <span>Trade-In Partner Bonus</span>
                                    <span className="text-emerald-400 font-bold">+ ₹1,000 Extra Cash Coupon</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <button
                                    onClick={resetCalc}
                                    className="px-4 py-2.5 rounded-xl border border-white/10 text-gray-300 text-xs font-semibold hover:bg-white/5 flex items-center gap-1.5 cursor-pointer"
                                >
                                    <RotateCcw size={14} /> Recalculate
                                </button>
                                <button
                                    onClick={onClose}
                                    className="flex-1 py-3 bg-red-600 hover:bg-red-500 text-white font-bold text-sm rounded-xl cursor-pointer transition-all shadow-lg"
                                >
                                    Browse Upgrades with Exchange
                                </button>
                            </div>
                        </div>
                    )}
                </m.div>
            </div>
        </AnimatePresence>,
        document.body
    );
};

export default ExchangeCalculator;
