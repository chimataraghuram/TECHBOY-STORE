import React, { Suspense, lazy } from 'react';
import { m } from 'framer-motion';
import { Smartphone, Bell, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { CountUp } from './AnimationEngine';

const HeroPhone3D = lazy(() => import('./HeroPhone3D'));
const appleIphone = '/images/phones/apple-iphone-16-pro-max.jpg';

const STATS = [
    { icon: Smartphone, value: 500, suffix: '+', label: 'Smartphones' },
    { icon: Bell, value: 30, suffix: '', label: 'Daily Alerts' },
    { icon: Users, value: 10, prefix: '', suffix: 'K+', label: 'Happy Users' },
    { icon: ShieldCheck, value: 100, suffix: '%', label: 'Secure & Free' }
];

const Hero = ({ setCurrentView }) => {

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
        <section id="home" className="relative pt-20 sm:pt-28 lg:pt-32 pb-4 sm:pb-10 lg:pb-12 overflow-hidden bg-[#050505]">
            {/* Ambient cinematic glows */}
            <div className="absolute inset-0 z-0 pointer-events-none" aria-hidden="true">
                <div className="absolute -top-40 right-[-10%] w-[640px] h-[640px] bg-[radial-gradient(circle,rgba(255,31,61,0.16),transparent_65%)] blur-[40px]" />
                <div className="absolute top-1/3 left-[-12%] w-[420px] h-[420px] bg-[radial-gradient(circle,rgba(255,31,61,0.07),transparent_65%)] blur-[30px]" />
                <div className="absolute bottom-[-20%] left-1/3 w-[520px] h-[320px] bg-[radial-gradient(ellipse,rgba(255,31,61,0.06),transparent_70%)] blur-[40px]" />
            </div>

            <m.div
                className="max-w-[1560px] mx-auto px-4 sm:px-8 lg:px-12 w-full z-10 relative"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                <div className="flex flex-col lg:flex-row items-center gap-5 sm:gap-8 lg:gap-6 xl:gap-8">

                    {/* ── LEFT: copy ── */}
                    <div className="flex flex-col items-start text-left w-full lg:w-[54%] xl:w-[52%]">
                        <m.div variants={itemVariants} className="flex items-center gap-2.5 sm:gap-3 mb-2.5 sm:mb-4">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-500 opacity-60" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_10px_rgba(255,31,61,0.9)]" />
                            </span>
                            <span className="text-red-500 text-[10.5px] sm:text-xs md:text-sm font-extrabold tracking-[0.2em] sm:tracking-[0.24em] uppercase">
                                Smarter Choices. Better Deals.
                            </span>
                        </m.div>

                        <m.h1 variants={itemVariants} className="text-[28px] min-[400px]:text-[34px] sm:text-5xl lg:text-[46px] xl:text-[54px] font-extrabold mb-2 sm:mb-4 tracking-tight text-white leading-[1.12]">
                            Find Your Perfect<br />
                            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#ff3d55] via-[#ff2038] to-[#d10f2a] drop-shadow-[0_0_28px_rgba(255,31,61,0.45)]">
                                Smartphone
                            </span>
                        </m.h1>

                        <m.p variants={itemVariants} className="text-gray-400 text-xs sm:text-base md:text-[17px] mb-4 sm:mb-8 max-w-xl leading-relaxed">
                            Discover, compare and track the best smartphones with real-time price alerts &amp; smart recommendations.
                        </m.p>

                        {/* CTA and Quick Mobile Badges */}
                        <m.div variants={itemVariants} className="flex flex-col sm:flex-row sm:items-center gap-2.5 sm:gap-4 mb-4 sm:mb-9 w-full sm:w-auto">
                            <m.button
                                whileHover={{ scale: 1.03, y: -2 }}
                                whileTap={{ scale: 0.97 }}
                                className="relative overflow-hidden group flex items-center justify-center gap-2.5 bg-gradient-to-r from-[#ff3d55] via-[#e60023] to-[#c7001e] hover:from-[#ff4d64] hover:to-[#ff1030] text-white px-5 sm:px-8 py-3 sm:py-4 rounded-full text-xs min-[400px]:text-sm sm:text-base font-bold transition-all shadow-[0_10px_35px_rgba(230,0,35,0.45)] active:translate-y-0 border border-white/20 w-full sm:w-auto"
                                onClick={goProducts}
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                                <span className="relative z-10 font-bold">Explore Smartphones</span>
                                <ArrowRight size={16} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1" />
                            </m.button>

                            {/* Mobile Quick Deals Pill — visible on mobile */}
                            <button
                                onClick={goProducts}
                                className="sm:hidden flex items-center justify-center gap-2 py-2 px-3 rounded-full bg-white/[0.04] border border-white/10 text-gray-300 text-[11px] font-semibold hover:border-red-500/40"
                            >
                                <span>🔥 Trending Drops</span>
                                <span className="text-red-400 font-bold">Save up to 35%</span>
                            </button>
                        </m.div>

                        {/* Stats */}
                        <m.div variants={itemVariants} className="grid grid-cols-2 sm:flex sm:flex-wrap items-center gap-x-4 sm:gap-x-10 gap-y-2 sm:gap-y-4 w-full max-w-xl">
                            {STATS.map(({ icon: Icon, value, prefix = '', suffix, label }) => (
                                <m.div
                                    key={label}
                                    whileHover={{ y: -3, scale: 1.04 }}
                                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                                    className="flex items-center gap-2 sm:gap-3 p-1 rounded-xl cursor-default transition-colors hover:bg-white/[0.03]"
                                >
                                    <span className="flex items-center justify-center w-7 h-7 sm:w-10 sm:h-10 rounded-lg sm:rounded-xl bg-red-500/10 border border-red-500/20 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] transition-all">
                                        <Icon className="text-red-500 w-3.5 h-3.5 sm:w-[18px] sm:h-[18px]" />
                                    </span>
                                    <div className="leading-tight">
                                        <div className="text-white font-extrabold text-sm sm:text-lg">
                                            <CountUp end={value} prefix={prefix} suffix={suffix} />
                                        </div>
                                        <div className="text-gray-500 text-[9.5px] sm:text-[11px] font-semibold whitespace-nowrap">{label}</div>
                                    </div>
                                </m.div>
                            ))}
                        </m.div>
                    </div>

                    {/* ── RIGHT: phone stage ── */}
                    <m.div
                        className="relative w-full lg:w-[46%] xl:w-[48%] flex justify-center items-center h-[260px] min-[400px]:h-[300px] sm:h-[400px] lg:h-[460px] xl:h-[500px]"
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Glow core */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] sm:w-[340px] sm:h-[340px] lg:w-[420px] lg:h-[420px] bg-[radial-gradient(circle,rgba(255,31,61,0.22),transparent_62%)] blur-[30px] pointer-events-none" />

                        {/* Orbit rings */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] sm:w-[320px] sm:h-[320px] lg:w-[400px] lg:h-[400px] rounded-full border border-red-500/15 pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[190px] h-[190px] sm:w-[240px] sm:h-[240px] lg:w-[300px] lg:h-[300px] rounded-full border border-white/[0.06] pointer-events-none" style={{ animation: 'tb-spin-slow 30s linear infinite' }}>
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
                            className="relative z-10 w-[210px] sm:w-[260px] lg:hidden h-auto object-contain"
                            style={{ filter: 'drop-shadow(0 30px 60px rgba(255,31,61,0.25)) drop-shadow(0 10px 30px rgba(0,0,0,0.8))' }}
                            animate={{ y: [-8, 8, -8] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        />

                        {/* Script tagline */}
                        <div className="absolute left-[2%] top-[14%] lg:left-[4%] lg:top-[18%] z-20 pointer-events-none select-none hidden sm:block">
                            <span className="text-[20px] lg:text-[24px] italic font-bold text-white/85 -rotate-[14deg] inline-block drop-shadow-[0_2px_18px_rgba(255,31,61,0.35)]" style={{ fontFamily: "'Plus Jakarta Sans', cursive" }}>
                                Latest Tech,<br />Better You
                            </span>
                            <span className="block w-14 h-[3px] mt-1 ml-5 rounded-full bg-gradient-to-r from-red-500 to-transparent" />
                        </div>

                        {/* Floating product card */}
                        <m.a
                            href="#products"
                            onClick={(e) => { e.preventDefault(); goProducts(); }}
                            className="absolute right-0 sm:right-[1%] lg:right-[-1%] top-[3%] sm:top-[4%] z-20 w-[145px] min-[400px]:w-[165px] sm:w-[195px] rounded-2xl border border-white/12 bg-[#0d0d13]/85 backdrop-blur-xl p-2.5 sm:p-3.5 shadow-[0_20px_50px_rgba(0,0,0,0.6),0_0_25px_rgba(255,31,61,0.12)] hover:border-red-500/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_35px_rgba(255,31,61,0.28)] transition-all duration-300 group"
                            animate={{ y: [-6, 6, -6] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                        >
                            <div className="flex items-start justify-between mb-1.5 sm:mb-2">
                                <svg className="w-5 h-5 sm:w-6 sm:h-6 text-white fill-current" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.98-.2 1.92-.86 3.24-.76 1.66.13 2.85.76 3.62 1.94-3.27 1.96-2.72 6.02.5 7.24-.65 1.7-1.5 3.37-2.44 3.75zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                                </svg>
                                <span className="flex items-center justify-center w-6 h-6 sm:w-7 sm:h-7 rounded-full bg-red-500/15 border border-red-500/30 text-red-500 transition-all duration-300 group-hover:bg-red-500 group-hover:text-white group-hover:shadow-[0_0_14px_rgba(255,31,61,0.6)]">
                                    <ArrowRight size={12} className="sm:w-[13px] sm:h-[13px]" />
                                </span>
                            </div>
                            <p className="text-white font-bold text-xs min-[400px]:text-[13px] sm:text-[14px] leading-tight">iPhone 16 Pro</p>
                            <p className="text-gray-400 text-[10px] min-[400px]:text-[11px] mt-0.5 leading-snug">A smarter, more powerful you.</p>
                        </m.a>

                        {/* Floating price chip */}
                        <m.div
                            className="absolute left-0 sm:left-[2%] bottom-[6%] lg:bottom-[8%] z-20 flex items-center gap-2 sm:gap-2.5 rounded-xl sm:rounded-2xl border border-white/12 bg-[#0d0d13]/85 backdrop-blur-xl px-3 py-2 sm:px-3.5 sm:py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.6)]"
                            animate={{ y: [5, -5, 5] }}
                            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        >
                            <span className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-xl bg-green-500/15 border border-green-500/25">
                                <Bell size={13} className="text-green-400" />
                            </span>
                            <div className="leading-tight">
                                <p className="text-white text-[11px] sm:text-xs font-bold">Price Drop Alert</p>
                                <p className="text-green-400 text-[9.5px] sm:text-[10px] font-bold mt-0.5">Galaxy S26 · −₹14,000</p>
                            </div>
                        </m.div>
                    </m.div>
                </div>
            </m.div>
        </section>
    );
};

export default Hero;
