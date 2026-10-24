import React from 'react';
import { m } from 'framer-motion';
import { Smartphone, Bell, Users, ShieldCheck, ArrowRight } from 'lucide-react';
import { CountUp } from './AnimationEngine';
import HeroVisual from './HeroVisual';

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
        if (setCurrentView) setCurrentView('home');
        setTimeout(() => {
            const el = document.getElementById('products');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 80);
    };

    const goTrends = () => {
        if (setCurrentView) setCurrentView('home');
        setTimeout(() => {
            const el = document.getElementById('trends');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
        }, 80);
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

                        {/* Heading */}
                        <m.h1 variants={itemVariants} className="text-3xl min-[400px]:text-4xl sm:text-5xl lg:text-[46px] xl:text-[54px] font-black mb-2 sm:mb-4 tracking-tight text-white leading-[1.08]">
                            Find Your Perfect{' '}
                            <span className="inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#ff3d55] via-[#ff2038] to-[#ff6b81] drop-shadow-[0_0_30px_rgba(255,31,61,0.5)]">
                                Smartphone
                            </span>
                        </m.h1>

                        <m.p variants={itemVariants} className="text-gray-400 text-xs sm:text-base md:text-[17px] mb-4 sm:mb-7 max-w-xl leading-relaxed">
                            Discover, compare and track verified smartphones with live price drops &amp; smart AI recommendations.
                        </m.p>

                        {/* ── VISUAL FOR MOBILE (below subtitle) ── */}
                        <div className="lg:hidden w-full my-2 flex justify-center items-center">
                            <div className="relative w-full max-w-[360px] h-[300px]">
                                <HeroVisual />
                            </div>
                        </div>

                        {/* CTA Buttons */}
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

                            <button
                                onClick={goTrends}
                                className="group flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-white/[0.04] hover:bg-white/[0.08] border border-white/10 hover:border-red-500/40 text-xs text-gray-300 transition-all backdrop-blur-xl"
                            >
                                <span className="text-sm">🔥</span>
                                <span className="font-semibold text-gray-200">Price Drop Deals</span>
                            </button>
                        </m.div>

                        {/* Stats Strip */}
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

                    {/* ── DESKTOP ONLY: right visual stage ── */}
                    <m.div
                        className="hidden lg:flex relative w-full lg:w-[46%] xl:w-[48%] justify-center items-center h-[520px] xl:h-[560px] -mt-10 xl:-mt-16"
                        initial={{ opacity: 0, scale: 0.94 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.9, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
                    >
                        <HeroVisual />
                    </m.div>
                </div>
            </m.div>
        </section>
    );
};

export default Hero;
