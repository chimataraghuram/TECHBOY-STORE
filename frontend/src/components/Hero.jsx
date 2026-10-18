import React, { Suspense, lazy, useState, useEffect } from 'react';
import { m } from 'framer-motion';
import { Smartphone, Bell, Users, ShieldCheck, ArrowRight, TrendingDown, Star } from 'lucide-react';
import { CountUp } from './AnimationEngine';
import { feedback } from '../utils/haptics';

const HeroPhone3D = lazy(() => import('./HeroPhone3D'));

const STATS = [
    { icon: Smartphone, value: 500, suffix: '+', label: 'Smartphones' },
    { icon: Bell, value: 30, suffix: '', label: 'Daily Alerts' },
    { icon: Users, value: 10, prefix: '', suffix: 'K+', label: 'Happy Users' },
    { icon: ShieldCheck, value: 100, suffix: '%', label: 'Secure & Free' }
];

const Hero = ({ setCurrentView }) => {
    // Lazy defer heavy WebGL 3D canvas so initial paint is instantaneous
    const [load3D, setLoad3D] = useState(false);

    useEffect(() => {
        if ('requestIdleCallback' in window) {
            const handle = window.requestIdleCallback(() => setLoad3D(true), { timeout: 1500 });
            return () => window.cancelIdleCallback(handle);
        } else {
            const timer = setTimeout(() => setLoad3D(true), 800);
            return () => clearTimeout(timer);
        }
    }, []);

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
        <section id="home" className="scroll-mt-24 relative pt-20 sm:pt-28 lg:pt-32 pb-4 sm:pb-10 lg:pb-12 overflow-hidden bg-[#050505]">
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
                        {/* Live Status Pill */}
                        <m.div variants={itemVariants} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-gradient-to-r from-red-500/20 via-red-500/10 to-transparent border border-red-500/40 backdrop-blur-md mb-3 sm:mb-4 shadow-[0_0_15px_rgba(255,31,61,0.15)]">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500 shadow-[0_0_8px_rgba(255,31,61,1)]" />
                            </span>
                            <span className="text-white text-[11px] sm:text-xs font-black tracking-widest uppercase">
                                PREMIUM TECH DESTINATION
                            </span>
                        </m.div>

                        {/* Modern High-Impact Heading */}
                        <m.h1 variants={itemVariants} className="text-3xl min-[400px]:text-4xl sm:text-5xl lg:text-[46px] xl:text-[54px] font-black mb-2 sm:mb-4 tracking-tight text-white leading-[1.08]">
                            Find Your Perfect{' '}
                            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#ff3d55] via-[#ff2038] to-[#ff6b81] drop-shadow-[0_0_30px_rgba(255,31,61,0.5)]">
                                Smartphone
                            </span>
                        </m.h1>

                        <m.p variants={itemVariants} className="text-gray-400 text-xs sm:text-base md:text-[17px] mb-4 sm:mb-7 max-w-xl leading-relaxed">
                            Discover, compare and track verified smartphones with live price drops &amp; smart AI recommendations.
                        </m.p>

                        {/* ── PHONE STAGE FOR MOBILE (Appears right under heading & subtitle) ── */}
                        <div className="lg:hidden w-full my-4 flex justify-center items-center">
                            <m.div
                                className="relative w-full max-w-[340px] h-[260px] flex justify-center items-center"
                                initial={{ opacity: 0, scale: 0.94 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.8, delay: 0.1 }}
                            >
                                {/* Glow core */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] bg-[radial-gradient(circle,rgba(255,31,61,0.25),transparent_65%)] blur-[25px] pointer-events-none" />

                                {/* Orbit rings */}
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[220px] h-[220px] rounded-full border border-red-500/20 pointer-events-none" />
                                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[160px] h-[160px] rounded-full border border-white/[0.08] pointer-events-none" style={{ animation: 'tb-spin-slow 30s linear infinite' }}>
                                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_10px_rgba(255,31,61,0.9)]" />
                                </div>

                                {/* Interactive 3D phone. Keep the initial state empty so a
                                    static image never flashes and then disappears while
                                    the WebGL module is loading. */}
                                {load3D ? (
                                    <Suspense fallback={null}>
                                        <HeroPhone3D className="absolute inset-0 z-10 w-full h-full" />
                                    </Suspense>
                                ) : null}

                                {/* Floating product card — Mobile */}
                                <m.a
                                    href="#products"
                                    onClick={(e) => { e.preventDefault(); goProducts(); }}
                                    className="group absolute -right-2 top-2 z-20 w-[158px] overflow-hidden rounded-2xl border border-white/12 bg-[#0c0c12]/85 shadow-[0_12px_35px_rgba(0,0,0,0.7),0_0_20px_rgba(255,31,61,0.15)] backdrop-blur-xl"
                                    animate={{ y: [-4, 4, -4] }}
                                    transition={{ duration: 4.5, repeat: Infinity, ease: 'easeInOut' }}
                                >
                                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff1f3d]/70 to-transparent" />
                                    <div className="p-2.5">
                                        <div className="flex items-center justify-between">
                                            <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                                                <svg className="h-3.5 w-3.5 fill-current text-white" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.98-.2 1.92-.86 3.24-.76 1.66.13 2.85.76 3.62 1.94-3.27 1.96-2.72 6.02.5 7.24-.65 1.7-1.5 3.37-2.44 3.75zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                                                </svg>
                                            </span>
                                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#ff1f3d]/15 text-[#ff4d63] ring-1 ring-[#ff1f3d]/30 transition-all duration-300 group-hover:bg-[#ff1f3d] group-hover:text-white group-hover:shadow-[0_0_12px_rgba(255,31,61,0.6)]">
                                                <ArrowRight size={10} />
                                            </span>
                                        </div>
                                        <p className="mt-1.5 text-[11.5px] font-bold leading-tight text-white">iPhone 17 Pro Max</p>
                                        <p className="mt-0.5 text-[9px] leading-snug text-gray-400">A19 Pro · 6.9″ · 256GB</p>
                                        <div className="mt-1.5 flex items-center gap-1.5">
                                            <span className="text-[11px] font-black leading-none text-white">₹1,49,900</span>
                                            <span className="text-[8.5px] text-gray-500 line-through">₹1,64,900</span>
                                            <span className="ml-auto rounded-full bg-[#ff1f3d]/15 px-1.5 py-0.5 text-[8px] font-bold text-[#ff5f74] ring-1 ring-[#ff1f3d]/25">-9%</span>
                                        </div>
                                    </div>
                                </m.a>

                                {/* Floating price chip — Mobile */}
                                <m.div
                                    className="absolute -left-2 bottom-2 z-20 flex items-center gap-2 rounded-xl border border-white/12 bg-[#0c0c12]/85 px-2.5 py-2 shadow-[0_12px_30px_rgba(0,0,0,0.7)] backdrop-blur-xl"
                                    animate={{ y: [4, -4, 4] }}
                                    transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
                                >
                                    <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-gradient-to-br from-emerald-500/25 to-emerald-500/5 ring-1 ring-emerald-500/30">
                                        <Bell size={12} className="text-emerald-400" />
                                    </span>
                                    <div className="leading-tight">
                                        <p className="text-white text-[10px] font-bold">Price Drop Alert</p>
                                        <p className="text-gray-400 text-[8.5px]">Galaxy S26 Ultra</p>
                                    </div>
                                    <span className="ml-0.5 flex items-center gap-0.5 rounded-full bg-emerald-500/10 px-1.5 py-0.5 text-[9px] font-black text-emerald-400 ring-1 ring-emerald-500/20">
                                        <TrendingDown size={9} /> ₹18,000
                                    </span>
                                </m.div>
                            </m.div>
                        </div>

                        {/* Sleek Modern Actions */}
                        <m.div variants={itemVariants} className="flex flex-col min-[420px]:flex-row items-stretch min-[420px]:items-center gap-2.5 sm:gap-3.5 mb-5 sm:mb-8 w-full sm:w-auto">
                            <m.button
                                whileHover={{ scale: 1.02, y: -2 }}
                                whileTap={{ scale: 0.98 }}
                                className="relative overflow-hidden group flex items-center justify-center gap-2 bg-gradient-to-r from-[#ff1f3d] via-[#e60023] to-[#c7001e] hover:from-[#ff3856] hover:to-[#ff1030] text-white px-6 py-3.5 sm:py-4 rounded-2xl text-xs sm:text-sm font-extrabold tracking-wide transition-all shadow-[0_8px_25px_rgba(230,0,35,0.45)] border border-white/20 active:scale-95"
                                onClick={goProducts}
                            >
                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                                <span className="relative z-10">Explore Smartphones</span>
                                <ArrowRight size={16} className="relative z-10 transition-transform duration-300 group-hover:translate-x-1 stroke-[2.5]" />
                            </m.button>

                            {/* Trending Pill for Mobile / Desktop */}
                            <button
                                onClick={goProducts}
                                className="group flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-red-500/40 text-xs text-gray-300 transition-all backdrop-blur-xl"
                            >
                                <span className="text-sm">🔥</span>
                                <span className="font-semibold text-gray-200">Price Drop Deals</span>
                            </button>
                        </m.div>

                        {/* Modern Glass Stats Strip */}
                        <m.div variants={itemVariants} className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 w-full max-w-xl">
                            {STATS.map(({ icon: Icon, value, prefix = '', suffix, label }) => (
                                <div
                                    key={label}
                                    className="flex items-center gap-2.5 p-2 sm:p-2.5 rounded-xl bg-white/[0.03] border border-white/10 hover:border-white/20 transition-all backdrop-blur-md"
                                >
                                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/25 text-red-400 shrink-0">
                                        <Icon size={15} className="stroke-[2.2]" />
                                    </div>
                                    <div className="min-w-0">
                                        <div className="text-white font-black text-sm sm:text-base leading-tight">
                                            <CountUp end={value} prefix={prefix} suffix={suffix} />
                                        </div>
                                        <div className="text-gray-400 text-[9px] sm:text-[10px] font-semibold truncate leading-tight mt-0.5">{label}</div>
                                    </div>
                                </div>
                            ))}
                        </m.div>
                    </div>

                    {/* ── DESKTOP ONLY: right phone stage ── */}
                    <m.div
                        className="hidden lg:flex relative w-full lg:w-[46%] xl:w-[48%] justify-center items-center h-[460px] xl:h-[500px]"
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    >
                        {/* Glow core */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[420px] h-[420px] bg-[radial-gradient(circle,rgba(255,31,61,0.22),transparent_62%)] blur-[30px] pointer-events-none" />

                        {/* Orbit rings */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full border border-red-500/15 pointer-events-none" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] rounded-full border border-white/[0.06] pointer-events-none" style={{ animation: 'tb-spin-slow 30s linear infinite' }}>
                            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500 shadow-[0_0_12px_rgba(255,31,61,0.9)]" />
                        </div>

                        {/* 3D phone (WebGL-capable) */}
                        {load3D ? (
                            <Suspense fallback={null}>
                                <HeroPhone3D className="absolute inset-0 z-10" />
                            </Suspense>
                        ) : null}

                        {/* Script tagline */}
                        <div className="absolute left-[4%] top-[18%] z-20 pointer-events-none select-none">
                            <span className="text-[24px] italic font-bold text-white/85 -rotate-[14deg] inline-block drop-shadow-[0_2px_18px_rgba(255,31,61,0.35)]" style={{ fontFamily: "'Plus Jakarta Sans', cursive" }}>
                                Latest Tech,<br />Better You
                            </span>
                            <span className="block w-14 h-[3px] mt-1 ml-5 rounded-full bg-gradient-to-r from-red-500 to-transparent" />
                        </div>

                        {/* Floating product card */}
                        <m.a
                            href="#products"
                            onClick={(e) => { e.preventDefault(); goProducts(); }}
                            className="group absolute right-[-1%] top-[4%] z-20 w-[236px] overflow-hidden rounded-[20px] border border-white/10 bg-[#0c0c12]/80 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-2xl transition-all duration-300 hover:border-red-500/40 hover:shadow-[0_20px_60px_rgba(0,0,0,0.7),0_0_35px_rgba(255,31,61,0.28)]"
                            animate={{ y: [-6, 6, -6] }}
                            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.6 }}
                        >
                            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[#ff1f3d]/70 to-transparent" />
                            <div className="p-3.5">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-white/10 ring-1 ring-white/15">
                                            <svg className="h-4 w-4 fill-current text-white" viewBox="0 0 24 24" aria-hidden="true">
                                                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8.98-.2 1.92-.86 3.24-.76 1.66.13 2.85.76 3.62 1.94-3.27 1.96-2.72 6.02.5 7.24-.65 1.7-1.5 3.37-2.44 3.75zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
                                            </svg>
                                        </span>
                                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wide text-emerald-400 ring-1 ring-emerald-500/20">
                                            <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> In stock
                                        </span>
                                    </div>
                                    <span className="flex h-7 w-7 items-center justify-center rounded-full bg-[#ff1f3d]/15 text-[#ff4d63] ring-1 ring-[#ff1f3d]/30 transition-all duration-300 group-hover:bg-[#ff1f3d] group-hover:text-white group-hover:shadow-[0_0_14px_rgba(255,31,61,0.6)]">
                                        <ArrowRight size={13} />
                                    </span>
                                </div>
                                <p className="mt-2.5 text-[14px] font-bold leading-tight text-white">iPhone 17 Pro Max</p>
                                <p className="mt-0.5 text-[11px] leading-snug text-gray-400">A19 Pro · 6.9″ · 256GB</p>
                                <div className="mt-2.5 flex items-end justify-between">
                                    <div>
                                        <p className="text-[15px] font-black leading-none text-white">₹1,49,900</p>
                                        <p className="mt-0.5 text-[10px] text-gray-500 line-through">₹1,64,900</p>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <span className="inline-flex items-center gap-0.5 rounded-full bg-amber-500/10 px-1.5 py-0.5 text-[9px] font-bold text-amber-400 ring-1 ring-amber-500/20">
                                            <Star size={9} className="fill-amber-400" /> 4.8
                                        </span>
                                        <span className="rounded-full bg-[#ff1f3d]/15 px-1.5 py-0.5 text-[9px] font-bold text-[#ff5f74] ring-1 ring-[#ff1f3d]/25">-9%</span>
                                    </div>
                                </div>
                            </div>
                        </m.a>

                        {/* Floating price chip */}
                        <m.div
                            className="absolute left-[2%] bottom-[8%] z-20 flex items-center gap-3 rounded-2xl border border-white/12 bg-[#0c0c12]/80 px-3.5 py-2.5 shadow-[0_16px_40px_rgba(0,0,0,0.6)] backdrop-blur-2xl"
                            animate={{ y: [5, -5, 5] }}
                            transition={{ duration: 5.5, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
                        >
                            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-500/25 to-emerald-500/5 ring-1 ring-emerald-500/30">
                                <Bell size={13} className="text-emerald-400" />
                            </span>
                            <div className="leading-tight">
                                <p className="text-white text-[11px] font-bold">Price Drop Alert</p>
                                <p className="text-gray-400 text-[9.5px] mt-0.5">Galaxy S26 Ultra</p>
                            </div>
                            <span className="ml-1 flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-1 text-[11px] font-black text-emerald-400 ring-1 ring-emerald-500/20">
                                <TrendingDown size={11} /> ₹18,000
                            </span>
                        </m.div>
                    </m.div>
                </div>
            </m.div>
        </section>
    );
};

export default Hero;
