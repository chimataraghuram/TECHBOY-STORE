import React from 'react';
import { m } from 'framer-motion';
import logo from '../../images/logos/new-logo.jpg';
import { 
    Search, Flame, Bookmark, ArrowUpRight, 
    Globe, Send, BookOpen, User, Sparkles,
    Cpu, Activity, Swords, Zap, Layers
} from 'lucide-react';

const GithubIcon = ({ size = 15, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
);

const LinkedinIcon = ({ size = 15, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

const LeetcodeIcon = ({ size = 15, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
        <path d="M16.102 17.93l-2.697 2.607c-.466.467-1.111.662-1.823.662s-1.357-.195-1.824-.662l-4.332-4.363c-.467-.467-.702-1.15-.702-1.863s.235-1.357.702-1.824l4.319-4.38c.467-.467 1.125-.645 1.837-.645s1.357.195 1.823.662l2.697 2.606c.514.515 1.365.497 1.9-.038.535-.536.553-1.387.039-1.901l-2.609-2.636a5.074 5.074 0 0 0-3.85-1.572 5.074 5.074 0 0 0-3.864 1.572l-4.332 4.364C2.334 11.233 2 12.115 2 13.067s.334 1.834 1.389 2.889l4.332 4.364c1.028 1.028 2.378 1.572 3.864 1.572s2.836-.544 3.85-1.572l2.609-2.636c.514-.514.496-1.365-.039-1.901-.535-.535-1.386-.553-1.9-.038z"/>
        <path d="M20.811 13.01H10.666c-.704 0-1.274.57-1.274 1.274 0 .704.57 1.274 1.274 1.274h10.145c.704 0 1.274-.57 1.274-1.274 0-.704-.57-1.274-1.274-1.274z"/>
    </svg>
);

const Footer = ({ setCurrentView, onSearch }) => {
    const scrollTo = (id) => {
        if (setCurrentView) setCurrentView('home');
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60);
    };

    const handleQuickSearch = (term) => {
        if (onSearch) onSearch(term);
        if (setCurrentView) setCurrentView('home');
        setTimeout(() => {
            const el = document.getElementById('products');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 60);
    };

    return (
        <footer id="about" className="relative bg-[#050508] border-t border-white/[0.08] overflow-hidden text-gray-300">
            {/* Top red specular line */}
            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/60 to-transparent pointer-events-none" />

            {/* Ambient Red Studio Backlight */}
            <div className="absolute inset-0 pointer-events-none overflow-hidden" aria-hidden="true">
                <div className="absolute -top-40 left-1/4 w-[600px] h-[350px] bg-[radial-gradient(ellipse,rgba(255,31,61,0.12),transparent_70%)] blur-[70px]" />
                <div className="absolute bottom-0 right-10 w-[500px] h-[300px] bg-[radial-gradient(ellipse,rgba(255,31,61,0.07),transparent_70%)] blur-[80px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-[1540px] px-5 sm:px-8 lg:px-12 pt-16 pb-10">
                
                {/* ── TOP COMMAND CENTER ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                    
                    {/* LEFT 8-COLUMN COMMAND CENTER (SECTIONS 1 & 2 + INTELLIGENCE ARCHITECTURE CARD) */}
                    <div className="lg:col-span-8 flex flex-col justify-between">
                        
                        {/* TOP ROW: SECTION 1 (BRAND & ABOUT) + SECTION 2 (HOW TO USE) */}
                        <div className="grid grid-cols-1 md:grid-cols-8 gap-8 lg:gap-10 items-start">
                            
                            {/* SECTION 1: BRAND & ABOUT THE PLATFORM (5 of 8 cols) */}
                            <div className="md:col-span-5 flex flex-col justify-start">
                                {/* Logo + Header */}
                                <div className="flex items-center gap-3.5 mb-5">
                                    <div className="relative group">
                                        <img 
                                            src={logo} 
                                            alt="TECHBOY STORE" 
                                            className="h-12 w-12 rounded-2xl border-2 border-red-500/60 object-cover shadow-[0_0_20px_rgba(255,31,61,0.45)] transition-transform duration-300 group-hover:scale-105" 
                                        />
                                        <span className="absolute inset-0 rounded-2xl ring-1 ring-white/10 pointer-events-none" />
                                    </div>
                                    <div>
                                        <h3 className="text-white font-black tracking-wider text-[22px] flex items-center gap-1.5 leading-none">
                                            TECHBOY <span className="text-red-500 drop-shadow-[0_0_12px_rgba(255,31,61,0.65)]">STORE</span>
                                        </h3>
                                        <p className="text-[10px] text-red-400 font-black tracking-[0.25em] uppercase mt-1.5 flex items-center gap-1.5">
                                            <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                                            NEXT-GEN SMARTPHONE INTELLIGENCE
                                        </p>
                                    </div>
                                </div>

                                {/* Section Label */}
                                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.03] border border-white/[0.08] w-fit mb-4">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_6px_rgba(255,31,61,0.9)]" />
                                    <span className="text-[10px] font-black text-gray-300 tracking-[0.18em] uppercase">
                                        ABOUT THE PLATFORM
                                    </span>
                                </div>

                                {/* Description */}
                                <p className="text-gray-300 text-xs sm:text-[13.5px] leading-relaxed mb-3">
                                    <strong className="text-white font-bold">TechBoy Store</strong> is an AI-driven smartphone intelligence platform built for modern tech buyers. It brings together live price tracking across Amazon and Flipkart, predictive price drop radar, 3D interactive phone inspection, automated WhatsApp/Email alerts, and head-to-head AI Battle Arena hardware scoring.
                                </p>
                                <div className="text-gray-400 text-xs sm:text-[13px] leading-relaxed mb-6">
                                    Browse the <button type="button" onClick={() => scrollTo('products')} className="text-red-400 font-bold hover:underline transition-all inline cursor-pointer">Smartphone Catalog</button> for verified specs &amp; deal ratings, explore <button type="button" onClick={() => scrollTo('trends')} className="text-red-400 font-bold hover:underline transition-all inline cursor-pointer">TechBoy Trends</button> for 30-day price drops, or pit flagships against each other in the <button type="button" onClick={() => { if (setCurrentView) setCurrentView('battle'); }} className="text-red-400 font-bold hover:underline transition-all inline cursor-pointer">AI Battle Arena</button>.
                                </div>

                                {/* 3 Quick Highlight Tiles */}
                                <div className="grid grid-cols-3 gap-2.5 mb-6">
                                    <button 
                                        onClick={() => scrollTo('products')} 
                                        className="group p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(255,31,61,0.2)] text-left transition-all duration-300"
                                    >
                                        <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400 mb-2 group-hover:scale-110 group-hover:bg-red-500/20 transition-all">
                                            <Search size={13} />
                                        </div>
                                        <div className="text-[11px] font-black text-white uppercase tracking-tight">FIND PHONES</div>
                                        <div className="text-[9px] text-gray-400 leading-tight mt-0.5">Multi-brand search</div>
                                    </button>

                                    <button 
                                        onClick={() => scrollTo('trends')} 
                                        className="group p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-amber-500/50 hover:shadow-[0_0_15px_rgba(251,191,36,0.2)] text-left transition-all duration-300"
                                    >
                                        <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-2 group-hover:scale-110 group-hover:bg-amber-500/20 transition-all">
                                            <Flame size={13} />
                                        </div>
                                        <div className="text-[11px] font-black text-white uppercase tracking-tight">TRENDING</div>
                                        <div className="text-[9px] text-gray-400 leading-tight mt-0.5">Price drops &amp; picks</div>
                                    </button>

                                    <button 
                                        onClick={() => { if (setCurrentView) setCurrentView('trackhub'); }} 
                                        className="group p-3 rounded-2xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/[0.08] hover:border-red-500/50 hover:shadow-[0_0_15px_rgba(255,31,61,0.2)] text-left transition-all duration-300"
                                    >
                                        <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400 mb-2 group-hover:scale-110 group-hover:bg-red-500/20 transition-all">
                                            <Bookmark size={13} />
                                        </div>
                                        <div className="text-[11px] font-black text-white uppercase tracking-tight">TRACKHUB</div>
                                        <div className="text-[9px] text-gray-400 leading-tight mt-0.5">Alerts &amp; watchlist</div>
                                    </button>
                                </div>

                                {/* Explore Catalog Capsule Button */}
                                <m.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => scrollTo('products')}
                                    className="w-fit flex items-center gap-2 px-4 py-2.5 rounded-full bg-white/[0.04] hover:bg-white/[0.08] border border-white/15 hover:border-red-500/50 text-white text-xs font-black tracking-wider transition-all shadow-[0_4px_16px_rgba(0,0,0,0.4)] hover:shadow-[0_0_18px_rgba(255,31,61,0.25)] group"
                                >
                                    <Sparkles size={13} className="text-red-400 group-hover:rotate-12 transition-transform" />
                                    <span>EXPLORE SMARTPHONE CATALOG</span>
                                    <ArrowUpRight size={13} className="text-gray-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                                </m.button>
                            </div>

                            {/* SECTION 2: HOW TO USE THIS PLATFORM (3 of 8 cols) */}
                            <div className="md:col-span-3 flex flex-col justify-start">
                                {/* Section Header */}
                                <div className="flex items-center gap-2.5 mb-6">
                                    <div className="w-9 h-9 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-red-400 shadow-sm">
                                        <BookOpen size={16} />
                                    </div>
                                    <h4 className="text-white font-black text-sm tracking-wide uppercase leading-tight">
                                        HOW TO USE THIS STORE
                                    </h4>
                                </div>

                                {/* Steps List (1, 2, 3) */}
                                <div className="space-y-4">
                                    {/* Step 1 */}
                                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors flex items-start gap-3.5 group">
                                        <div className="w-7 h-7 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-xs font-black shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                                            1
                                        </div>
                                        <div>
                                            <h5 className="text-white text-xs font-black tracking-wide uppercase">
                                                1. SEARCH &amp; FILTER
                                            </h5>
                                            <p className="text-gray-400 text-[11px] leading-relaxed mt-1">
                                                Pick your preferred brand, price budget, or specs. Live results update instantly without page reloads.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step 2 */}
                                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors flex items-start gap-3.5 group">
                                        <div className="w-7 h-7 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-xs font-black shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                                            2
                                        </div>
                                        <div>
                                            <h5 className="text-white text-xs font-black tracking-wide uppercase">
                                                2. COMPARE &amp; BATTLE ARENA
                                            </h5>
                                            <p className="text-gray-400 text-[11px] leading-relaxed mt-1">
                                                Compare up to 3 phones side-by-side in 3D, or run deep-learning benchmark showdowns with our interactive 5-axis Spec Radar.
                                            </p>
                                        </div>
                                    </div>

                                    {/* Step 3 */}
                                    <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/[0.06] hover:border-white/[0.12] transition-colors flex items-start gap-3.5 group">
                                        <div className="w-7 h-7 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400 text-xs font-black shrink-0 mt-0.5 group-hover:scale-105 transition-transform">
                                            3
                                        </div>
                                        <div>
                                            <h5 className="text-white text-xs font-black tracking-wide uppercase">
                                                3. AI RADAR &amp; TRACKHUB
                                            </h5>
                                            <p className="text-gray-400 text-[11px] leading-relaxed mt-1">
                                                Monitor 30-day price trends, get AI Buy/Wait recommendations, and set target price drop alerts delivered to your inbox.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* ── UPDATED SPANNING CARD DIRECTLY UNDER THE TWO SECTIONS ── */}
                        <div className="mt-8 p-5 sm:p-6 rounded-3xl bg-[#0b0b12]/95 border border-white/[0.08] relative overflow-hidden backdrop-blur-xl shadow-[0_15px_40px_rgba(0,0,0,0.6)]">
                            {/* Inner subtle top red specular gradient line */}
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent pointer-events-none" />

                            {/* Section Header */}
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5 pb-3.5 border-b border-white/[0.06]">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-8 h-8 rounded-xl bg-red-500/10 border border-red-500/30 flex items-center justify-center text-red-400">
                                        <Cpu size={16} />
                                    </div>
                                    <div>
                                        <h4 className="text-white font-black text-xs sm:text-sm tracking-wide uppercase leading-tight flex items-center gap-2">
                                            INTELLIGENCE ENGINE &amp; ARCHITECTURE
                                        </h4>
                                        <p className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase mt-0.5">
                                            HIGH-PERFORMANCE SMARTPHONE ANALYTICS PIPELINE
                                        </p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-2">
                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/25 text-emerald-400 text-[10px] font-bold">
                                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                                        SYSTEM ONLINE
                                    </span>
                                    <span className="text-[10px] text-gray-500 font-mono">v2.4.0</span>
                                </div>
                            </div>

                            {/* 4 Feature Telemetry Tiles */}
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3 mb-4">
                                {/* Tile 1: Real-time Price Radar */}
                                <button
                                    type="button"
                                    onClick={() => { if (setCurrentView) setCurrentView('trackhub'); }}
                                    className="group/tile p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-red-500/40 text-left transition-all duration-300 cursor-pointer"
                                >
                                    <div className="w-7 h-7 rounded-lg bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400 mb-2 group-hover/tile:scale-110 transition-transform">
                                        <Activity size={13} />
                                    </div>
                                    <div className="text-[11px] font-black text-white uppercase tracking-tight">AUTONOMOUS RADAR</div>
                                    <div className="text-[9.5px] text-gray-400 leading-tight mt-0.5">Live price drop detection</div>
                                </button>

                                {/* Tile 2: AI Battle Benchmark */}
                                <button
                                    type="button"
                                    onClick={() => { if (setCurrentView) setCurrentView('battle'); }}
                                    className="group/tile p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-amber-500/40 text-left transition-all duration-300 cursor-pointer"
                                >
                                    <div className="w-7 h-7 rounded-lg bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-400 mb-2 group-hover/tile:scale-110 transition-transform">
                                        <Swords size={13} />
                                    </div>
                                    <div className="text-[11px] font-black text-white uppercase tracking-tight">SPEC RADAR AI</div>
                                    <div className="text-[9.5px] text-gray-400 leading-tight mt-0.5">5-axis benchmark showdown</div>
                                </button>

                                {/* Tile 3: Instant Search & Filter */}
                                <button
                                    type="button"
                                    onClick={() => scrollTo('products')}
                                    className="group/tile p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-cyan-500/40 text-left transition-all duration-300 cursor-pointer"
                                >
                                    <div className="w-7 h-7 rounded-lg bg-cyan-500/10 border border-cyan-500/25 flex items-center justify-center text-cyan-400 mb-2 group-hover/tile:scale-110 transition-transform">
                                        <Zap size={13} />
                                    </div>
                                    <div className="text-[11px] font-black text-white uppercase tracking-tight">SUB-50MS QUERY</div>
                                    <div className="text-[9.5px] text-gray-400 leading-tight mt-0.5">Fuzzy client-side matching</div>
                                </button>

                                {/* Tile 4: 3D WebGL Inspection */}
                                <button
                                    type="button"
                                    onClick={() => scrollTo('products')}
                                    className="group/tile p-3 rounded-2xl bg-white/[0.02] hover:bg-white/[0.06] border border-white/[0.06] hover:border-purple-500/40 text-left transition-all duration-300 cursor-pointer"
                                >
                                    <div className="w-7 h-7 rounded-lg bg-purple-500/10 border border-purple-500/25 flex items-center justify-center text-purple-400 mb-2 group-hover/tile:scale-110 transition-transform">
                                        <Layers size={13} />
                                    </div>
                                    <div className="text-[11px] font-black text-white uppercase tracking-tight">3D WEBGL STAGE</div>
                                    <div className="text-[9.5px] text-gray-400 leading-tight mt-0.5">360° rotational phone lab</div>
                                </button>
                            </div>

                            {/* Quick Discovery Tags Row */}
                            <div className="pt-3 border-t border-white/[0.06] flex flex-wrap items-center justify-between gap-2.5">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-[10px] font-black uppercase tracking-wider text-gray-400 mr-1 flex items-center gap-1.5">
                                        <Sparkles size={11} className="text-red-400" />
                                        POPULAR FILTERS:
                                    </span>
                                    {[
                                        { label: '5G Phones', query: '5G' },
                                        { label: 'Snapdragon 8', query: 'Snapdragon' },
                                        { label: 'Under ₹20K', query: '20000' },
                                        { label: '120Hz AMOLED', query: '120Hz' },
                                        { label: 'Flagships', query: 'Pro' }
                                    ].map(item => (
                                        <button
                                            key={item.label}
                                            type="button"
                                            onClick={() => handleQuickSearch(item.query)}
                                            className="px-2.5 py-1 rounded-full bg-white/[0.03] hover:bg-red-500/15 border border-white/[0.08] hover:border-red-500/40 text-[10.5px] font-bold text-gray-300 hover:text-white transition-all active:scale-95 cursor-pointer"
                                        >
                                            {item.label}
                                        </button>
                                    ))}
                                </div>

                                {/* Architecture Pill Badges */}
                                <div className="flex items-center gap-1.5 text-[9.5px] text-gray-400 font-mono">
                                    <span>React 19</span>
                                    <span>•</span>
                                    <span>Django 5</span>
                                    <span>•</span>
                                    <span>Three.js</span>
                                    <span>•</span>
                                    <span>Tailwind</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* COLUMN 3: DEVELOPER PROFILE CARD (4 cols) */}
                    <div className="lg:col-span-4 flex flex-col justify-start">
                        {/* Section Header */}
                        <div className="flex items-center gap-2.5 mb-6">
                            <div className="w-9 h-9 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-red-400 shadow-sm">
                                <User size={16} />
                            </div>
                            <h4 className="text-white font-black text-sm tracking-wide uppercase leading-tight">
                                LEAD ARCHITECT &amp; ENGINEERING
                            </h4>
                        </div>

                        {/* Developer Card */}
                        <div className="relative rounded-3xl bg-[#0b0b12]/95 border border-white/[0.12] p-6 shadow-[0_20px_50px_rgba(0,0,0,0.7),0_0_20px_rgba(255,31,61,0.1)] mb-4 overflow-hidden">
                            {/* Inner top glow */}
                            <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-red-500/50 to-transparent pointer-events-none" />

                            <div className="flex items-center justify-between mb-4">
                                <div>
                                    <h4 className="text-white font-black text-xl tracking-tight leading-none">
                                        Chimata Raghuram
                                    </h4>
                                    <p className="text-[10px] text-amber-400 font-black tracking-[0.22em] uppercase mt-1.5 flex items-center gap-1.5">
                                        <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                                        FULL STACK AI &amp; PRODUCT ARCHITECT
                                    </p>
                                </div>
                            </div>

                            <p className="text-gray-400 text-xs leading-relaxed mb-4">
                                Architect of TechBoy Store's RAG neural search, 3D interactive stage, and real-time smartphone price prediction pipeline.
                            </p>

                            <div className="space-y-2.5">
                                <m.a
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    href="https://github.com/chimataraghuram"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-white hover:bg-gray-100 text-[#09090e] font-black text-xs tracking-wider transition-all shadow-[0_4px_16px_rgba(255,255,255,0.2)] active:scale-[0.98]"
                                >
                                    <span>VISIT GITHUB</span>
                                    <GithubIcon size={14} className="stroke-[2.5]" />
                                </m.a>

                                <m.a
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    href="https://www.linkedin.com/in/chimataraghuram"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#ff1f3d] via-[#e60023] to-[#c7001e] hover:from-[#ff3856] hover:to-[#ff1030] text-white font-black text-xs tracking-wider transition-all shadow-[0_6px_22px_rgba(230,0,35,0.45)] border border-white/20 active:scale-[0.98]"
                                >
                                    <span>VISIT LINKEDIN</span>
                                    <LinkedinIcon size={14} className="stroke-[2.5]" />
                                </m.a>

                                <m.a
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.98 }}
                                    href="https://leetcode.com/u/chimataraghuram/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-gradient-to-r from-[#FFA116] via-[#F89C15] to-[#E2850A] hover:from-[#FFB033] hover:to-[#FFA116] text-[#09090e] font-black text-xs tracking-wider transition-all shadow-[0_6px_22px_rgba(255,161,22,0.35)] border border-white/20 active:scale-[0.98]"
                                >
                                    <span>VISIT LEETCODE</span>
                                    <LeetcodeIcon size={15} className="fill-current" />
                                </m.a>
                            </div>
                        </div>

                        {/* Portfolio Card */}
                        <m.a
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.98 }}
                            href="https://chimataraghuram.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between p-4 rounded-2xl bg-[#0b0b12]/95 border border-white/[0.1] hover:border-red-500/50 hover:shadow-[0_10px_30px_rgba(255,31,61,0.2)] transition-all shadow-md"
                        >
                            <div className="flex items-center gap-3.5">
                                <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/25 flex items-center justify-center text-red-400 group-hover:scale-105 group-hover:bg-red-500/20 transition-all">
                                    <Globe size={18} />
                                </div>
                                <div>
                                    <div className="text-white font-black text-xs uppercase tracking-wider">PORTFOLIO</div>
                                    <div className="text-[10px] text-gray-400 font-bold tracking-wider uppercase mt-0.5">PERSONAL SITE</div>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-red-600/15 border border-red-500/30 text-red-400 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                                <ArrowUpRight size={15} />
                            </div>
                        </m.a>

                        {/* Engineering Contributors Card */}
                        <div className="mt-3.5 p-3.5 rounded-2xl bg-[#0b0b12]/95 border border-white/[0.08]">
                            <div className="flex items-center justify-between mb-2.5">
                                <span className="text-[10px] font-black tracking-widest text-gray-400 uppercase flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                                    ENGINEERING CONTRIBUTORS
                                </span>
                                <span className="text-[10px] text-gray-400 font-bold">5 CONTRIBUTORS</span>
                            </div>
                            <div className="grid grid-cols-2 gap-2 text-[11px]">
                                {/* chimataraghuram (Lead) */}
                                <a
                                    href="https://github.com/chimataraghuram"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="col-span-2 flex items-center justify-between px-3 py-1.5 rounded-xl bg-red-500/10 hover:bg-red-500/20 border border-red-500/30 text-white transition-all group"
                                    title="chimataraghuram (Lead Architect)"
                                >
                                    <div className="flex items-center gap-2">
                                        <GithubIcon size={12} className="text-red-400 group-hover:scale-110 transition-transform shrink-0" />
                                        <span className="font-bold text-[11px]">chimataraghuram</span>
                                    </div>
                                    <span className="text-[9px] font-black uppercase tracking-wider text-red-400 bg-red-500/20 px-2 py-0.5 rounded-md border border-red-500/30">
                                        Lead
                                    </span>
                                </a>

                                {/* Co-Contributors */}
                                <a
                                    href="https://github.com/bchakradharreddy"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-cyan-500/30 text-gray-300 hover:text-white transition-all group"
                                    title="bchakradharreddy"
                                >
                                    <GithubIcon size={11} className="text-gray-400 group-hover:text-cyan-400 shrink-0" />
                                    <span className="truncate font-semibold text-[10.5px]">bchakradharreddy</span>
                                </a>
                                <a
                                    href="https://github.com/Ramesh7075"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-cyan-500/30 text-gray-300 hover:text-white transition-all group"
                                    title="Ramesh7075"
                                >
                                    <GithubIcon size={11} className="text-gray-400 group-hover:text-cyan-400 shrink-0" />
                                    <span className="truncate font-semibold text-[10.5px]">Ramesh7075</span>
                                </a>
                                <a
                                    href="https://github.com/shalemshalem250-bot"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-cyan-500/30 text-gray-300 hover:text-white transition-all group"
                                    title="shalemshalem250-bot"
                                >
                                    <GithubIcon size={11} className="text-gray-400 group-hover:text-cyan-400 shrink-0" />
                                    <span className="truncate font-semibold text-[10.5px]">shalemshalem250-bot</span>
                                </a>
                                <a
                                    href="https://github.com/hari7477"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/5 hover:border-cyan-500/30 text-gray-300 hover:text-white transition-all group"
                                    title="hari7477"
                                >
                                    <GithubIcon size={11} className="text-gray-400 group-hover:text-cyan-400 shrink-0" />
                                    <span className="truncate font-semibold text-[10.5px]">hari7477</span>
                                </a>
                            </div>
                        </div>
                    </div>

                </div>

                {/* ── BOTTOM SOCIAL BAR & COPYRIGHT ── */}
                <div className="mt-14 pt-8 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-5">
                    <p className="text-gray-400 text-xs font-semibold">
                        © {new Date().getFullYear()} <span className="text-white font-bold">TechBoy Store</span> · All rights reserved
                    </p>

                    {/* Social Media Pill Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-2.5">
                        <a
                            href="https://www.linkedin.com/in/chimataraghuram"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-[#0077b5]/20 border border-white/10 hover:border-[#0077b5]/50 text-gray-300 hover:text-[#0077b5] text-xs font-bold transition-all shadow-sm"
                        >
                            <LinkedinIcon size={13} />
                            <span>LINKEDIN</span>
                        </a>

                        <a
                            href="https://github.com/chimataraghuram"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white text-xs font-bold transition-all shadow-sm"
                        >
                            <GithubIcon size={13} />
                            <span>GITHUB</span>
                        </a>

                        <a
                            href="https://chimataraghuram.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-red-500/15 border border-white/10 hover:border-red-500/40 text-gray-300 hover:text-red-400 text-xs font-bold transition-all shadow-sm"
                        >
                            <Globe size={13} />
                            <span>PORTFOLIO</span>
                        </a>

                        <a
                            href="https://t.me/techboyraghu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/[0.04] hover:bg-[#229ED9]/20 border border-white/10 hover:border-[#229ED9]/50 text-gray-300 hover:text-[#229ED9] text-xs font-bold transition-all shadow-sm"
                        >
                            <Send size={13} />
                            <span>TELEGRAM</span>
                        </a>
                    </div>
                </div>

            </div>
        </footer>
    );
};

export default Footer;
