import React from 'react';
import { m } from 'framer-motion';
import { Smartphone, Bell, Users, ShieldCheck, ArrowRight } from 'lucide-react';
const appleIphone = '/images/phones/apple-iphone-16-pro-max.jpg';

const Hero = ({ setCurrentView }) => {
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { y: 15, opacity: 0 },
        visible: {
            y: 0,
            opacity: 1,
            transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] }
        }
    };

    return (
        <section id="home" className="relative pt-24 pb-12 overflow-hidden bg-[#080808]">
            {/* Ambient red glow - subtle */}
            <div className="absolute inset-0 z-0 pointer-events-none">
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/8 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-0 left-1/4 w-[300px] h-[300px] bg-red-600/5 rounded-full blur-[100px]"></div>
            </div>

            <m.div
                className="max-w-7xl mx-auto px-4 md:px-8 w-full z-10 relative"
                variants={containerVariants}
                initial="hidden"
                animate="visible"
            >
                {/* Two-column hero */}
                <div className="flex flex-col lg:flex-row items-center gap-8 lg:gap-12 mb-12">
                    {/* LEFT */}
                    <div className="flex flex-col items-start text-left lg:w-[55%]">
                        <m.div variants={itemVariants} className="flex items-center gap-3 mb-5">
                            <div className="w-1 h-5 bg-red-500 rounded-full"></div>
                            <span className="text-red-500 text-[11px] font-bold tracking-[0.15em] uppercase">Smarter Choices. Better Deals.</span>
                        </m.div>

                        <m.h1 variants={itemVariants} className="text-4xl md:text-5xl lg:text-[3.5rem] font-bold leading-[1.15] mb-5 tracking-tight text-white">
                            Find Your Perfect<br />
                            <span className="text-red-500">Smartphone</span>
                        </m.h1>

                        <m.p variants={itemVariants} className="text-gray-400 text-sm md:text-base mb-8 max-w-lg leading-relaxed">
                            Discover, compare and track the best smartphones with real-time price alerts & smart recommendations.
                        </m.p>

                        <m.div variants={itemVariants} className="flex flex-wrap gap-3 mb-0">
                            <button
                                className="bg-red-600 hover:bg-red-500 text-white px-6 py-2.5 rounded-full text-sm font-semibold transition-all flex items-center gap-2"
                                onClick={() => document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Explore Smartphones <ArrowRight size={16} />
                            </button>
                            <button
                                className="bg-transparent text-white border border-white/15 hover:border-white/30 px-6 py-2.5 rounded-full text-sm font-semibold transition-all"
                                onClick={() => document.getElementById('trends')?.scrollIntoView({ behavior: 'smooth' })}
                            >
                                Explore Trends
                            </button>
                        </m.div>
                    </div>

                    {/* RIGHT - Phone image */}
                    <m.div
                        className="relative flex justify-center items-center lg:w-[45%]"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.8, delay: 0.2 }}
                    >
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] md:w-[280px] md:h-[280px] bg-red-600/10 blur-[60px] rounded-full"></div>
                        <m.img
                            src={appleIphone}
                            alt="Flagship Smartphone"
                            className="relative z-10 w-[200px] md:w-[260px] lg:w-[300px] h-auto object-contain drop-shadow-2xl"
                            animate={{ y: [-6, 6, -6] }}
                            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                        />
                    </m.div>
                </div>

                {/* Stats row */}
                <m.div variants={itemVariants} className="flex flex-wrap items-center gap-8 md:gap-12 pt-8 border-t border-white/5">
                    <div className="flex items-center gap-3">
                        <Smartphone className="text-red-500 w-5 h-5" />
                        <div>
                            <div className="text-white font-bold text-lg">500+</div>
                            <div className="text-gray-500 text-[11px] font-medium">Smartphones</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Bell className="text-red-500 w-5 h-5" />
                        <div>
                            <div className="text-white font-bold text-lg">30</div>
                            <div className="text-gray-500 text-[11px] font-medium">Daily Alerts</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <Users className="text-red-500 w-5 h-5" />
                        <div>
                            <div className="text-white font-bold text-lg">10K+</div>
                            <div className="text-gray-500 text-[11px] font-medium">Happy Users</div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <ShieldCheck className="text-red-500 w-5 h-5" />
                        <div>
                            <div className="text-white font-bold text-lg">100%</div>
                            <div className="text-gray-500 text-[11px] font-medium">Secure & Free</div>
                        </div>
                    </div>
                </m.div>
            </m.div>
        </section>
    );
};

export default Hero;
