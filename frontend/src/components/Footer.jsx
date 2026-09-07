import React from 'react';
import { m } from 'framer-motion';
import logo from '../../images/logos/new-logo.jpg';
import { ArrowUp } from 'lucide-react';

const quickLinks = [
    { label: 'Home', href: '#home' },
    { label: 'Products', href: '#products' },
    { label: 'Trends', href: '#trends' },
    { label: 'TrackHub', href: '#trackhub' }
];

const helpLinks = [
    { label: 'FAQs', href: '#' },
    { label: 'Shipping Info', href: '#' },
    { label: 'Returns & Refunds', href: '#' },
    { label: 'Contact Us', href: '#' },
    { label: 'Track Order', href: '#' }
];

const legalLinks = [
    { label: 'Privacy Policy', href: '#' },
    { label: 'Terms of Service', href: '#' },
    { label: 'Refund Policy', href: '#' },
    { label: 'Cookie Policy', href: '#' }
];

const LinkColumn = ({ title, links, onNavigate }) => (
    <div>
        <h4 className="text-white font-extrabold text-[13px] md:text-sm tracking-[0.18em] mb-5 flex items-center gap-2.5">
            <span className="w-1 h-4 rounded-full bg-gradient-to-b from-[#ff3d55] to-[#c4001f] shadow-[0_0_10px_rgba(255,31,61,0.7)]" />
            {title}
        </h4>
        <nav className="space-y-1">
            {links.map(link => (
                <a
                    key={link.label}
                    href={link.href}
                    onClick={onNavigate ? (e) => { e.preventDefault(); onNavigate(link.href.replace('#', '')); } : undefined}
                    className="group flex items-center gap-2.5 py-1.5 text-gray-500 hover:text-white transition-all duration-300 text-[13px] md:text-sm font-medium w-fit"
                >
                    <span className="w-1 h-1 rounded-full bg-white/20 group-hover:bg-red-500 group-hover:shadow-[0_0_8px_rgba(255,31,61,0.9)] group-hover:scale-125 transition-all duration-300" />
                    <span className="group-hover:translate-x-1 transition-transform duration-300">{link.label}</span>
                </a>
            ))}
        </nav>
    </div>
);

const Footer = ({ setCurrentView }) => {
    const scrollTo = (id) => {
        setCurrentView('home');
        setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 50);
    };

    return (
        <footer id="about" className="relative bg-[#040405] overflow-hidden">
            {/* Gradient hairline + ambient glow */}
            <div className="h-px w-full bg-gradient-to-r from-transparent via-red-500/60 to-transparent" aria-hidden="true" />
            <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-[radial-gradient(ellipse,rgba(255,31,61,0.09),transparent_65%)] blur-[50px]" />
            </div>
            {/* Giant watermark */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 select-none pointer-events-none whitespace-nowrap text-[18vw] lg:text-[11rem] font-black leading-none tracking-tight text-transparent [-webkit-text-stroke:1px_rgba(255,255,255,0.05)]" aria-hidden="true">
                TECHBOY
            </div>

            <div className="relative z-10 mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-12 pt-14 md:pt-16 pb-8">
                <m.div
                    className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-12 gap-8 md:gap-10 mb-12"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.7, staggerChildren: 0.08 }}
                >
                    {/* BRAND — logo + title only */}
                    <div className="col-span-2 md:col-span-4 lg:col-span-5 flex flex-col justify-start">
                        <a href="#home" onClick={(e) => { e.preventDefault(); scrollTo('home'); }} className="flex items-center gap-3.5 w-fit group">
                            <span className="relative shrink-0">
                                <img src={logo} alt="TECHBOY STORE" className="h-12 w-12 rounded-2xl border border-red-500/50 object-cover shadow-[0_0_18px_rgba(255,31,61,0.35)] transition-all duration-500 group-hover:shadow-[0_0_26px_rgba(255,31,61,0.6)] group-hover:scale-105" />
                            </span>
                            <span className="leading-tight">
                                <span className="text-white font-black tracking-wider text-lg md:text-xl block">
                                    TECHBOY <span className="bg-gradient-to-r from-[#ff3d55] to-[#ff2038] bg-clip-text text-transparent">STORE</span>
                                </span>
                                <span className="text-[9px] text-red-500/90 font-bold tracking-[0.3em]">SMARTER CHOICES. BETTER DEALS.</span>
                            </span>
                        </a>
                    </div>

                    {/* LINK COLUMNS */}
                    <div className="lg:col-span-2 md:col-span-1">
                        <LinkColumn title="QUICK LINKS" links={quickLinks} onNavigate={scrollTo} />
                    </div>
                    <div className="lg:col-span-2 md:col-span-1">
                        <LinkColumn title="HELP" links={helpLinks} />
                    </div>
                    <div className="lg:col-span-3 md:col-span-2">
                        <LinkColumn title="LEGAL" links={legalLinks} />
                        <button
                            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                            className="mt-6 group flex items-center gap-2.5 text-[12px] font-bold tracking-widest text-gray-500 hover:text-white transition-colors"
                        >
                            <span className="flex items-center justify-center w-9 h-9 rounded-full border border-white/10 bg-white/[0.03] group-hover:border-red-500/50 group-hover:bg-red-500/10 group-hover:shadow-[0_0_14px_rgba(255,31,61,0.35)] transition-all">
                                <ArrowUp size={15} className="transition-transform duration-300 group-hover:-translate-y-0.5" />
                            </span>
                            BACK TO TOP
                        </button>
                    </div>
                </m.div>

                {/* Bottom bar */}
                <div className="pt-6 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-xs font-medium flex items-center gap-1.5 order-2 sm:order-1">
                        Built with <span className="text-red-500 animate-pulse">♥</span> by <span className="text-gray-300 font-bold">Raghu</span>
                    </p>
                    <p className="text-gray-600 text-[11px] font-semibold tracking-[0.2em] uppercase flex items-center gap-2 order-1 sm:order-2">
                        <span className="relative flex h-1.5 w-1.5">
                            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-60" />
                            <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500" />
                        </span>
                        © {new Date().getFullYear()} TechBoy Store · All rights reserved
                    </p>
                </div>
            </div>
        </footer>
    );
};

export default Footer;