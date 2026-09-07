import React, { Suspense, lazy, useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Smartphone, Bell, Users, ShieldCheck, ArrowRight, Play, X } from 'lucide-react';
import { CountUp } from './AnimationEngine';

const HeroPhone3D = lazy(() => import('./HeroPhone3D'));
const appleIphone = '/images/phones/apple-iphone-16-pro-max.jpg';
import introVideo from '../../images/techboy-intro.mp4';

const STATS = [
    { icon: Smartphone, value: 500, suffix: '+', label: 'Smartphones' },
    { icon: Bell, value: 30, suffix: '', label: 'Daily Alerts' },
    { icon: Users, value: 10, prefix: '', suffix: 'K+', label: 'Happy Users' },
    { icon: ShieldCheck, value: 100, suffix: '%', label: 'Secure & Free' }
];

const Hero = ({ setCurrentView }) => {
    const [videoOpen, setVideoOpen] = useState(false);

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { opacity: 1, transition: { staggerChildren: 0.09, delayChildren: 0.1 } }
    };

    const itemVariants = {
        hidden: { y: 18, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
    };

    const goProducts = () => {
        setCurrentView('home');
        setTimeout(() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }), 60);
    };

    return (
        <section id="home" className="relative pt-28 md:pt-36 lg:pt-40 pb-14 md:pb-20 overflow-hidden bg-[#050505]">
            {/* Ambient cinematic glows */}
            <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
                <div className="absolute -top-40 right-[-10%] w-[640px] h-[640px] bg-[radial-gradient(circle,rgba(255,31,61,0.16),transparent_65%)] blur-[40px]" />
                <div className="absolute top-1/3 left-[-12%] w-[420px] h-[420px] bg-[radial-gradient(circle,rgba(255,31,61,0.07),transparent_65%)] blur-[30px]" />
                <div className="absolute bottom-[-20%] left-1/3 w-[520px] h-[320px] bg-[radial-gradient(ellipse,rgba(255,31,61,0.06),transparent_70%)] blur-[40px]" />
            </div>

            <m.div
                className="max-w-[1560px] mx-auto px-5 sm:px-8 lg:px-12 w-full z-10 relative"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-6 xl:gap-10">

                    {/* ── LEFT: copy ── */}
                    <div className="flex flex-col items-start text-left w-full lg:w-[54%] xl:w-[52%]">
                        <m.div variants={itemVariants} className="flex items-center gap-3 mb-6">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_10px_rgba(255,31,61,0.9)]" />
                            </span>
                            <span className="text-red-500 text-[11px] sm:text-xs md:text-sm font-extrabold tracking-[0.24em] uppercase">
                                Smarter Choices. Better Deals.
                            </span>
                        </m.div>

                        <m.h1 variants={itemVariants} className="text-[42px] leading-[1.04] sm:text-6xl lg:text-[64px] xl:text-[76px] font-extrabold mb-6 tracking-tight text-white">
                            Find Your Perfect<br />
                            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#ff3d55] via-[#ff2038] to-[#d10f2a] drop-shadow-[0_0_28px_rgba(255,31,61,0.45)]">
                                Smartphone
                            </span>
                        </m.h1>

                        <m.p variants={itemVariants} className="text-gray-400 text-[15px] sm:text-lg mb-8 md:mb-10 max-w-xl leading-relaxed">
                            Discover, compare and track the best smartphones with real-time price alerts &amp; smart recommendations — all in one place.
                        </m.p>

                        <m.div variants={itemVariants} className="flex flex-wrap items-center gap-3.5 sm:gap-4 mb-10 md:mb-14">
                            <button
                                className="group flex items-center gap-2.5 bg-gradient-to-r from-[#ff3d55] to-[#e60023] hover:from-[#ff4d64] hover:to-[#ff1030] text-white px-6 sm:px-8 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold transition-all shadow-[0_10px_30px_rgba(230,0,35,0.4)] hover:shadow-[0_14px_40px_rgba(255,31,61,0.6)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98]"
                                onClick={goProducts}
                            >
                                Explore Smartphones
                                <ArrowRight size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
                            </button>
                            <button
                                className="group flex items-center gap-3 bg-white/[0.04] hover:bg-white/[0.09] text-white border border-white/15 hover:border-white/30 px-6 sm:px-7 py-3.5 sm:py-4 rounded-full text-sm sm:text-base font-bold transition-all backdrop-blur-sm"
                                onClick={() => setVideoOpen(true)}
                            >
                                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-white/10 border border-white/20 transition-transform duration-300 group-hover:scale-110">
                                    <Play size={12} className="fill-white ml-0.5" />
                                </span>
                                Watch Video
                            </button>
                        </m.div>

                        {/* Stats */}
                        <m.div variants={itemVariants} className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-10 gap-y-5 w-full max-w-xl">
                            {STATS.map(({ icon: Icon, value, prefix = '', suffix, label }) => (
                                <div key={label} className="flex items-center gap-3">
                                    <span className="flex items-center justify-center w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]">
                                        <Icon className="text-red-500 w-[18px] h-[18px]" />
                                    </span>
                                    <div className="leading-tight">
                                        <div className="text-white font-extrabold text-lg sm:text-xl">
                                            <CountUp end={value} prefix={prefix} suffix={suffix} />
                                        </div>
                                        <div className="text-gray-500 text-[11px] font-semibold whitespace-nowrap">{label}</div>
                                    </div>
                                </div>
                            ))}
                        </m.div>
                    </div>

                    {/* ── RIGHT: phone stage ── */}
                    <m.div
                        className="relative w-full lg:w-[46%] xl:w-[48%] flex justify-center items-center min-h-[380px] sm:min-h-[460px] lg:min-h-[560px]"
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Glow core */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] sm:w-[420px] sm:h-[420px] lg:w-[520px] lg:h-[520px] bg-[radial-gradient(circle,rgba(255,31,61,0.22),transparent_62%)] blur-[30px] pointer-events-none" />

                        {/* Orbit rings */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[290px] h-[290px] sm:w-[380px] sm:h-[380px] lg:w-[470px] lg:h-[470px] rounded-full border border-red-500/15 pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[210px] h-[210px] sm:w-[280px] sm:h-[280px] lg:w-[350px] lg:h-[350px] rounded-full border border-white/[0.06] pointer-events-none" style={{ animation: 'tb-spin-slow 30s linear infinite' }}>
                            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_12px_rgba(255,31,61,0.9)]" />
                        </div>

                        {/* 3D phone (desktop, WebGL-capable) */}
                        <Suspense fallback={null}>
                            <HeroPhone3D className="absolute inset-0 z-10 hidden lg:block" />
                        </Suspense>

                        {/* Static phone — mobile/tablet + WebGL fallback */}
                        <m.img
                            src={appleIphone}
                            alt="Flagship smartphone"
                            className="relative z-10 w-[240px] sm:w-[300px] lg:hidden h-auto object-contain"
                            style={{ filter: 'drop-shadow(0 30px 60px rgba(255,31,61,0.25)) drop-shadow(0 10px 30px rgba(0,0,0,0.8))' }}
                            animate={{ y: [-8, 8, -8] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        />

                        {/* Script tagline */}
                        <div className="absolute left-[2%] top-[16%] lg:left-[4%] lg:top-[22%] z-20 pointer-events-none select-none hidden sm:block">
                            <span className="text-[22px] lg:text-[28px] italic font-bold text-white/85 -rotate-[14deg] inline-block drop-shadow-[0_2px_18px_rgba(255,31,61,0.35)]" style={{ fontFamily: "'Plus Jakarta Sans', cursive" }}>
                                Latest Tech,<br />Better You
                            </span>
                            <span className="block w-16 h-[3px] mt-1 ml-6 rounded-full bg-gradient-to-r from-red-500 to-transparent" />
                        </div>

                        {/* Floating product card */}
                        <m.a
                            href="#products"
                            onClick={(e) => { e.preventDefault(); goProducts(); }}
                            className="absolute right-0 sm:right-[2%] lg:right-[-2%] top-[4%] sm:top-[6%] z-20 w-[178px] sm:w-[210px] rounded-2xl border border-white/12 bg-[#0d0d13]/85 backdrop-blur-xl p-4 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_25px_rgba(255,31,61,0.12)] hover:border-red-500/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_35px_rgba(255,31,61,0.28)] transition-all duration-300 group"
                            animate={{ y: [-6, 6, -6] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                        >
                            <div className="flex items-start justify-between mb-2.5">
                                <svg className="w-6 h-6 text-white fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.98-.2 1.92-.86 3.24-.76 1.66.13 2.85.76 3.62 1.94-3.27 1.96-2.72 6.02.5 7.24-.65 1.7-1.5 3.37-2.44 3.75zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                                </svg>
                                <span className="flex items-center justify-center w-7 h-7 rounded-full bg-red-500/15 border border-red-500/30 text-red-500 transition-all duration-300 group-hover:bg-red-500 group-hover:text-white group-hover:shadow-[0_0_14px_rgba(255,31,61,0.6)]">
                                    <ArrowRight size={13} />
                                </span>
                            </div>
                            <p className="text-white font-bold text-[15px] leading-tight">iPhone 16 Pro</p>
                            <p className="text-gray-400 text-[11px] mt-1 leading-snug">A smarter, more powerful you.</p>
                        </m.a>

                        {/* Floating price chip */}
                        <m.div
                            className="absolute left-0 sm:left-[2%] bottom-[10%] lg:bottom-[14%] z-20 flex items-center gap-2.5 rounded-2xl border border-white/12 bg-[#0d0d13]/85 backdrop-blur-xl px-4 py-3 shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
                            animate={{ y: [5, -5, 5] }}
                            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        >
                            <span className="flex items-center justify-center w-8 h-8 rounded-xl bg-green-500/15 border border-green-500/25">
                                <Bell size={14} className="text-green-400" />
                            </span>
                            <div className="leading-tight">
                                <p className="text-white text-xs font-bold">Price Drop Alert</p>
                                <p className="text-green-400 text-[10px] font-bold mt-0.5">Galaxy S26 · −₹14,000</p>
                            </div>
                        </m.div>
                    </m.div>
                </div>
            </m.div>

            {/* Watch video lightbox */}
            <AnimatePresence>
                {videoOpen && (
                    <m.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[120] flex items-center justify-center p-4 sm:p-8 bg-black/85 backdrop-blur-md"
                        onClick={() => setVideoOpen(false)}
                    >
                        <m.div
                            initial={{ scale: 0.92, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.92, y: 20 }}
                            transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                            className="relative w-full max-w-3xl rounded-2xl overflow-hidden border border-white/15 shadow-[0_0_60px_rgba(255,31,61,0.25)]"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <button
                                onClick={() => setVideoOpen(false)}
                                className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-black/60 border border-white/15 text-white hover:bg-red-600 transition-colors"
                                aria-label="Close video"
                            >
                                <X size={18} />
                            </button>
                            <video src={introVideo} className="w-full aspect-video object-cover" controls autoPlay playsInline />
                        </m.div>
                    </m.div>
                )}
            </AnimatePresence>
        </section>
    );
};

export default Hero;
