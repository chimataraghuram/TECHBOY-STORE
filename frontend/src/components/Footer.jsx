import React from 'react';
import { m } from 'framer-motion';
import logo from '../../images/logos/new-logo.jpg';
import { 
    Search, Flame, Bookmark, ArrowUpRight, 
    Globe, Send, BookOpen, User, Sparkles
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

const Footer = ({ setCurrentView }) => {
    const scrollTo = (id) => {
        if (setCurrentView) setCurrentView('home');
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 60);
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
                
                {/* ── TOP 3-COLUMN COMMAND CENTER (SAME LAYOUT) ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-start">
                    
                    {/* COLUMN 1: BRAND & ABOUT THE PLATFORM (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-start">
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
                            <strong className="text-white font-bold">TechBoy Store</strong> is an AI-powered smartphone intelligence workspace built for tech enthusiasts. It combines real-time price tracking, automated drop alerts, live market trends, 3D interactive phone inspection, and intelligent side-by-side spec comparisons in one seamless hub.
                        </p>
                        <p className="text-gray-400 text-xs sm:text-[13px] leading-relaxed mb-6">
                            Use <button onClick={() => scrollTo('products')} className="text-red-400 font-bold hover:underline transition-all">Smartphone Catalog</button> to filter devices across top brands and price brackets, or visit <button onClick={() => scrollTo('trends')} className="text-red-400 font-bold hover:underline transition-all">TechBoy Trends</button> for verified market movements and analyst picks.
                        </p>

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

                    {/* COLUMN 2: HOW TO USE THIS PLATFORM (3 cols) */}
                    <div className="lg:col-span-3 flex flex-col justify-start">
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
                                        2. COMPARE &amp; INSPECT 3D
                                    </h5>
                                    <p className="text-gray-400 text-[11px] leading-relaxed mt-1">
                                        Select up to 3 phones to view direct spec verdicts, or launch Quick View to interact with full 3D phone models.
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
                                        3. TRACK &amp; SAVE DEALS
                                    </h5>
                                    <p className="text-gray-400 text-[11px] leading-relaxed mt-1">
                                        Set automated price drop alerts, save items to your personal wishlist, and consult the TechBoy AI assistant anytime.
                                    </p>
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
                                DEVELOPER
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
                                        FULL STACK AI DEVELOPER
                                    </p>
                                </div>
                            </div>

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
