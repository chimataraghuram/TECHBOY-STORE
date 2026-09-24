import React from 'react';
import { m } from 'framer-motion';
import logo from '../../images/logos/new-logo.jpg';
import { 
    Search, Flame, Bookmark, ArrowUpRight, 
    Globe, Send, BookOpen, User, Sparkles
} from 'lucide-react';

const GithubIcon = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
        <path d="M9 18c-4.51 2-5-2-7-2" />
    </svg>
);

const LinkedinIcon = ({ size = 16, className = "" }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
        <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
        <rect width="4" height="12" x="2" y="9" />
        <circle cx="4" cy="4" r="2" />
    </svg>
);

const Footer = ({ setCurrentView }) => {
    const scrollTo = (id) => {
        if (setCurrentView) setCurrentView('home');
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50);
    };

    return (
        <footer id="about" className="relative bg-[#06060a] border-t border-red-500/20 overflow-hidden text-gray-300">
            {/* Ambient Red Studio Backlight */}
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute -top-32 left-1/4 w-[500px] h-[300px] bg-[radial-gradient(ellipse,rgba(255,31,61,0.12),transparent_70%)] blur-[60px]" />
                <div className="absolute top-1/2 right-10 w-[450px] h-[260px] bg-[radial-gradient(ellipse,rgba(255,31,61,0.08),transparent_70%)] blur-[70px]" />
            </div>

            <div className="relative z-10 mx-auto max-w-[1520px] px-5 sm:px-8 lg:px-12 pt-14 pb-8">
                
                {/* ── TOP 3-COLUMN COMMAND CENTER ── */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
                    
                    {/* COLUMN 1: BRAND & ABOUT THE PLATFORM (5 cols) */}
                    <div className="lg:col-span-5 flex flex-col justify-start">
                        {/* Logo + Header */}
                        <div className="flex items-center gap-3.5 mb-6">
                            <img 
                                src={logo} 
                                alt="TECHBOY STORE" 
                                className="h-11 w-11 rounded-xl border border-red-500/50 object-cover shadow-[0_0_20px_rgba(255,31,61,0.4)]" 
                            />
                            <div>
                                <h3 className="text-white font-black tracking-tight text-xl flex items-center gap-1.5 leading-none">
                                    TECHBOY <span className="bg-gradient-to-r from-[#ff3856] to-[#e60023] bg-clip-text text-transparent">STORE</span>
                                </h3>
                                <p className="text-[9.5px] text-red-500 font-extrabold tracking-[0.25em] uppercase mt-1">
                                    NEXT-GEN SMARTPHONE INTELLIGENCE
                                </p>
                            </div>
                        </div>

                        {/* Orange / Red Bar & Section Label */}
                        <div className="flex items-center gap-2 mb-3">
                            <span className="w-1 h-3.5 rounded-full bg-gradient-to-b from-[#ff3856] to-[#e60023]" />
                            <span className="text-[11px] font-extrabold text-gray-400 tracking-[0.16em] uppercase">
                                ABOUT THE PLATFORM
                            </span>
                        </div>

                        {/* Description */}
                        <p className="text-gray-300 text-xs sm:text-[13px] leading-relaxed mb-3">
                            <strong className="text-white font-bold">TechBoy Store</strong> is an AI-powered smartphone intelligence workspace built for Indian tech enthusiasts. It combines real-time price tracking, automated drop alerts, live market trends, 3D interactive phone inspection, and intelligent side-by-side spec comparisons in one seamless hub.
                        </p>
                        <p className="text-gray-400 text-xs sm:text-[13px] leading-relaxed mb-6">
                            Use <button onClick={() => scrollTo('products')} className="text-white font-bold underline hover:text-red-400 transition-colors">Smartphone Catalog</button> to filter devices across top brands and price brackets, or visit <button onClick={() => scrollTo('trends')} className="text-white font-bold underline hover:text-red-400 transition-colors">TechBoy Trends</button> for verified market movements and analyst picks.
                        </p>

                        {/* 3 Quick Highlight Tiles */}
                        <div className="grid grid-cols-3 gap-2.5 mb-6">
                            <button 
                                onClick={() => scrollTo('products')} 
                                className="group p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-red-500/40 text-left transition-all"
                            >
                                <Search size={14} className="text-red-400 mb-1.5 group-hover:scale-110 transition-transform" />
                                <div className="text-[10.5px] font-bold text-white uppercase tracking-tight">FIND PHONES</div>
                                <div className="text-[9px] text-gray-400 leading-tight">Multi-brand search.</div>
                            </button>

                            <button 
                                onClick={() => scrollTo('trends')} 
                                className="group p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-red-500/40 text-left transition-all"
                            >
                                <Flame size={14} className="text-amber-400 mb-1.5 group-hover:scale-110 transition-transform" />
                                <div className="text-[10.5px] font-bold text-white uppercase tracking-tight">TRENDING</div>
                                <div className="text-[9px] text-gray-400 leading-tight">Price drops & picks.</div>
                            </button>

                            <button 
                                onClick={() => { if (setCurrentView) setCurrentView('trackhub'); }} 
                                className="group p-2.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.07] border border-white/10 hover:border-red-500/40 text-left transition-all"
                            >
                                <Bookmark size={14} className="text-red-400 mb-1.5 group-hover:scale-110 transition-transform" />
                                <div className="text-[10.5px] font-bold text-white uppercase tracking-tight">TRACKHUB</div>
                                <div className="text-[9px] text-gray-400 leading-tight">Alerts & watchlist.</div>
                            </button>
                        </div>

                        {/* Explore Catalog Capsule Button */}
                        <m.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.97 }}
                            onClick={() => scrollTo('products')}
                            className="w-fit flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/15 text-white text-xs font-bold transition-all shadow-sm"
                        >
                            <Sparkles size={14} className="text-red-400" />
                            <span>EXPLORE SMARTPHONE CATALOG</span>
                            <ArrowUpRight size={13} className="text-gray-400" />
                        </m.button>
                    </div>

                    {/* COLUMN 2: HOW TO USE THIS PLATFORM (3 cols) */}
                    <div className="lg:col-span-3 flex flex-col justify-start">
                        {/* Section Header */}
                        <div className="flex items-center gap-2.5 mb-6">
                            <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-red-400">
                                <BookOpen size={16} />
                            </div>
                            <h4 className="text-white font-extrabold text-sm sm:text-base tracking-wide uppercase leading-tight">
                                HOW TO USE THIS STORE
                            </h4>
                        </div>

                        {/* Steps List (1, 2, 3) */}
                        <div className="space-y-5">
                            {/* Step 1 */}
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/15 flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5 shadow-sm">
                                    1
                                </div>
                                <div>
                                    <h5 className="text-white text-xs font-extrabold tracking-wide uppercase">
                                        1. SEARCH & FILTER
                                    </h5>
                                    <p className="text-gray-400 text-[11px] sm:text-xs leading-relaxed mt-0.5">
                                        Pick your preferred brand, price budget, or specs. Live results update instantly without reloading the catalog.
                                    </p>
                                </div>
                            </div>

                            {/* Step 2 */}
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/15 flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5 shadow-sm">
                                    2
                                </div>
                                <div>
                                    <h5 className="text-white text-xs font-extrabold tracking-wide uppercase">
                                        2. COMPARE & INSPECT 3D
                                    </h5>
                                    <p className="text-gray-400 text-[11px] sm:text-xs leading-relaxed mt-0.5">
                                        Select up to 3 phones to view direct spec verdicts, or launch Quick View to interact with full 3D phone models.
                                    </p>
                                </div>
                            </div>

                            {/* Step 3 */}
                            <div className="flex items-start gap-3">
                                <div className="w-7 h-7 rounded-full bg-white/[0.04] border border-white/15 flex items-center justify-center text-white text-xs font-black shrink-0 mt-0.5 shadow-sm">
                                    3
                                </div>
                                <div>
                                    <h5 className="text-white text-xs font-extrabold tracking-wide uppercase">
                                        3. TRACK & SAVE DEALS
                                    </h5>
                                    <p className="text-gray-400 text-[11px] sm:text-xs leading-relaxed mt-0.5">
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
                            <div className="w-8 h-8 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-red-400">
                                <User size={16} />
                            </div>
                            <h4 className="text-white font-extrabold text-sm sm:text-base tracking-wide uppercase leading-tight">
                                DEVELOPER
                            </h4>
                        </div>

                        {/* Developer Card */}
                        <div className="rounded-2xl bg-[#0c0d14]/90 border border-white/10 p-5 shadow-[0_15px_40px_rgba(0,0,0,0.6)] mb-3.5">
                            <h4 className="text-white font-black text-xl tracking-tight leading-none">
                                Chimata Raghuram
                            </h4>
                            <p className="text-[10px] text-amber-500 font-extrabold tracking-[0.2em] uppercase mt-1 mb-4">
                                FULL STACK AI DEVELOPER
                            </p>

                            <div className="space-y-2.5">
                                <m.a
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    href="https://github.com/raghuram14"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-white hover:bg-gray-100 text-[#09090e] font-black text-xs tracking-wider transition-all shadow-[0_4px_14px_rgba(255,255,255,0.15)] active:scale-[0.98]"
                                >
                                    <span>VISIT GITHUB</span>
                                    <GithubIcon size={14} className="stroke-[2.5]" />
                                </m.a>

                                <m.a
                                    whileHover={{ scale: 1.02, y: -2 }}
                                    whileTap={{ scale: 0.97 }}
                                    href="https://www.linkedin.com/in/chimata-raghuram-b23547285/"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl bg-gradient-to-r from-[#ff1f3d] via-[#e60023] to-[#c7001e] hover:from-[#ff3856] hover:to-[#d9001f] text-white font-black text-xs tracking-wider transition-all shadow-[0_4px_18px_rgba(230,0,35,0.45)] border border-white/20 active:scale-[0.98]"
                                >
                                    <span>VISIT LINKEDIN</span>
                                    <LinkedinIcon size={14} className="stroke-[2.5]" />
                                </m.a>
                            </div>
                        </div>

                        {/* Portfolio Card */}
                        <m.a
                            whileHover={{ scale: 1.02, y: -2 }}
                            whileTap={{ scale: 0.97 }}
                            href="https://raghuramchimata.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="group flex items-center justify-between p-3.5 rounded-2xl bg-[#0c0d14]/90 border border-white/10 hover:border-red-500/40 hover:shadow-[0_8px_25px_rgba(255,31,61,0.15)] transition-all shadow-md"
                        >
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-xl bg-white/[0.04] border border-white/10 flex items-center justify-center text-red-400 group-hover:scale-105 transition-transform">
                                    <Globe size={18} />
                                </div>
                                <div>
                                    <div className="text-white font-black text-xs uppercase tracking-wider">PORTFOLIO</div>
                                    <div className="text-[10px] text-gray-400 font-semibold tracking-wider uppercase">PERSONAL SITE</div>
                                </div>
                            </div>
                            <div className="w-8 h-8 rounded-xl bg-red-600/20 border border-red-500/40 text-red-400 flex items-center justify-center group-hover:bg-red-600 group-hover:text-white transition-all">
                                <ArrowUpRight size={15} />
                            </div>
                        </m.a>
                    </div>

                </div>

                {/* ── BOTTOM SOCIAL BAR & COPYRIGHT ── */}
                <div className="mt-12 pt-6 border-t border-white/[0.08] flex flex-col md:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-xs font-semibold">
                        © {new Date().getFullYear()} <span className="text-white font-bold">TechBoy Store</span> · All rights reserved
                    </p>

                    {/* Social Media Pill Badges */}
                    <div className="flex flex-wrap items-center justify-center gap-2">
                        <a
                            href="https://www.linkedin.com/in/chimata-raghuram-b23547285/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-[#0077b5]/20 border border-white/10 hover:border-[#0077b5]/50 text-gray-300 hover:text-[#0077b5] text-xs font-bold transition-all"
                        >
                            <LinkedinIcon size={13} />
                            <span>LINKEDIN</span>
                        </a>

                        <a
                            href="https://github.com/raghuram14"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-white/10 border border-white/10 hover:border-white/30 text-gray-300 hover:text-white text-xs font-bold transition-all"
                        >
                            <GithubIcon size={13} />
                            <span>GITHUB</span>
                        </a>

                        <a
                            href="https://raghuramchimata.vercel.app/"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-red-500/15 border border-white/10 hover:border-red-500/40 text-gray-300 hover:text-red-400 text-xs font-bold transition-all"
                        >
                            <Globe size={13} />
                            <span>PORTFOLIO</span>
                        </a>

                        <a
                            href="https://t.me/techboyraghu"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/[0.04] hover:bg-[#229ED9]/20 border border-white/10 hover:border-[#229ED9]/50 text-gray-300 hover:text-[#229ED9] text-xs font-bold transition-all"
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