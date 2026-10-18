import React, { useEffect, useRef, useState, useCallback } from 'react';
import { m, useMotionValue, useSpring, useTransform } from 'framer-motion';
import { TrendingDown, Star, Zap, Shield, ChevronUp } from 'lucide-react';

/* ─── data ─────────────────────────────────────────────────────────── */
const PHONES = [
    {
        brand: 'Apple',
        name: 'iPhone 17 Pro Max',
        tag: '#1 AI Pick',
        tagColor: '#ff1f3d',
        price: '₹1,49,900',
        drop: '−₹15,000',
        rating: 4.9,
        score: 97,
        chip: 'A19 Pro · 6.9″',
        accent: '#ff1f3d',
        bars: [97, 94, 88],
        badge: '🔥 Trending',
        rotate: '-4deg',
        z: 30,
        scale: 1,
        translateX: '0px',
        translateY: '-14px',
    },
    {
        brand: 'Samsung',
        name: 'Galaxy S26 Ultra',
        tag: 'Best Value',
        tagColor: '#818cf8',
        price: '₹1,08,999',
        drop: '−₹8,000',
        rating: 4.8,
        score: 93,
        chip: 'Snapdragon 8 Gen 4',
        accent: '#818cf8',
        bars: [93, 96, 91],
        badge: '💸 Price Drop',
        rotate: '5deg',
        z: 10,
        scale: 0.88,
        translateX: '90px',
        translateY: '20px',
    },
    {
        brand: 'OnePlus',
        name: '14 Pro',
        tag: 'Speed King',
        tagColor: '#34d399',
        price: '₹73,999',
        drop: '−₹5,000',
        rating: 4.7,
        score: 90,
        chip: 'Snapdragon 8 Gen 3',
        accent: '#34d399',
        bars: [90, 85, 95],
        badge: '⚡ Fastest',
        rotate: '-8deg',
        z: 10,
        scale: 0.82,
        translateX: '-85px',
        translateY: '28px',
    },
];

/* ─── animated fill bar ────────────────────────────────────────────── */
const Bar = ({ pct, color, delay = 0 }) => {
    const [w, setW] = useState(0);
    useEffect(() => { const t = setTimeout(() => setW(pct), 800 + delay); return () => clearTimeout(t); }, []);
    return (
        <div className="h-[3px] w-full rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.08)' }}>
            <div className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${w}%`, background: color, boxShadow: `0 0 6px ${color}99` }} />
        </div>
    );
};

/* ─── single product card ──────────────────────────────────────────── */
const PhoneCard = ({ phone, index, mouseX, mouseY }) => {
    const isPrimary = index === 0;

    const rotateX = useTransform(mouseY, [-300, 300], isPrimary ? [6, -6] : [4, -4]);
    const rotateY = useTransform(mouseX, [-300, 300], isPrimary ? [-8, 8] : [-5, 5]);
    const springRotX = useSpring(rotateX, { stiffness: 60, damping: 20 });
    const springRotY = useSpring(rotateY, { stiffness: 60, damping: 20 });

    return (
        <m.div
            className="absolute"
            style={{
                zIndex: phone.z,
                transform: `translateX(${phone.translateX}) translateY(${phone.translateY}) rotate(${phone.rotate}) scale(${phone.scale})`,
            }}
            initial={{ opacity: 0, y: 60, scale: phone.scale * 0.85 }}
            animate={{ opacity: 1, y: 0, scale: phone.scale }}
            transition={{ duration: 0.9, delay: 0.2 + index * 0.15, ease: [0.16, 1, 0.3, 1] }}
        >
            <m.div
                style={{
                    rotateX: springRotX,
                    rotateY: springRotY,
                    perspective: 1000,
                    transformStyle: 'preserve-3d',
                }}
            >
                <m.div
                    className="relative overflow-hidden cursor-pointer"
                    style={{
                        width: isPrimary ? 200 : 172,
                        borderRadius: 24,
                        background: 'linear-gradient(145deg, rgba(18,18,30,0.98) 0%, rgba(8,8,16,0.99) 100%)',
                        border: `1px solid ${phone.accent}33`,
                        boxShadow: [
                            `0 0 0 1px ${phone.accent}11`,
                            `0 ${isPrimary ? 50 : 30}px ${isPrimary ? 100 : 60}px rgba(0,0,0,0.8)`,
                            `0 0 ${isPrimary ? 60 : 35}px ${phone.accent}22`,
                        ].join(','),
                    }}
                    whileHover={{ scale: 1.04 }}
                    transition={{ duration: 0.25 }}
                    animate={isPrimary ? { y: [-6, 6, -6] } : {}}
                    {...(isPrimary ? { transition2: { duration: 5.5, repeat: Infinity, ease: 'easeInOut' } } : {})}
                >
                    {/* top shimmer line */}
                    <div className="absolute inset-x-0 top-0 h-px"
                        style={{ background: `linear-gradient(90deg, transparent, ${phone.accent}88, transparent)` }} />

                    {/* gloss overlay */}
                    <div className="absolute inset-0 pointer-events-none"
                        style={{
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, transparent 50%)',
                            borderRadius: 24,
                        }} />

                    <div className={`p-${isPrimary ? '4' : '3.5'} flex flex-col gap-${isPrimary ? '3' : '2.5'}`}
                        style={{ padding: isPrimary ? '16px' : '14px' }}>

                        {/* header */}
                        <div className="flex items-start justify-between">
                            <div>
                                <div className="flex items-center gap-1.5 mb-1">
                                    <span className="px-2 py-0.5 rounded-full text-[8px] font-black uppercase tracking-wider"
                                        style={{ background: `${phone.tagColor}18`, color: phone.tagColor, border: `1px solid ${phone.tagColor}30` }}>
                                        {phone.tag}
                                    </span>
                                </div>
                                <p className="text-[9px] text-gray-500 font-semibold">{phone.brand}</p>
                                <p className="text-white font-black leading-tight"
                                    style={{ fontSize: isPrimary ? 13 : 11 }}>{phone.name}</p>
                                <p className="text-gray-500 text-[8px] mt-0.5">{phone.chip}</p>
                            </div>
                            {/* AI score circle */}
                            <div className="relative flex items-center justify-center shrink-0"
                                style={{ width: isPrimary ? 42 : 36, height: isPrimary ? 42 : 36 }}>
                                <svg width={isPrimary ? 42 : 36} height={isPrimary ? 42 : 36}
                                    viewBox="0 0 42 42" className="-rotate-90 absolute inset-0">
                                    <circle cx="21" cy="21" r="17" fill="none"
                                        stroke="rgba(255,255,255,0.07)" strokeWidth="3.5" />
                                    <m.circle cx="21" cy="21" r="17" fill="none"
                                        stroke={phone.accent} strokeWidth="3.5"
                                        strokeLinecap="round"
                                        strokeDasharray={2 * Math.PI * 17}
                                        initial={{ strokeDashoffset: 2 * Math.PI * 17 }}
                                        animate={{ strokeDashoffset: 2 * Math.PI * 17 * (1 - phone.score / 100) }}
                                        transition={{ duration: 1.4, delay: 0.6 + index * 0.2, ease: 'easeOut' }}
                                        style={{ filter: `drop-shadow(0 0 4px ${phone.accent})` }}
                                    />
                                </svg>
                                <div className="absolute flex flex-col items-center">
                                    <span className="text-white font-black" style={{ fontSize: isPrimary ? 11 : 9, lineHeight: 1 }}>{phone.score}</span>
                                    <span className="text-[6px] font-bold" style={{ color: phone.accent }}>AI</span>
                                </div>
                            </div>
                        </div>

                        {/* price row */}
                        <div className="flex items-end justify-between">
                            <div>
                                <p className="text-white font-black" style={{ fontSize: isPrimary ? 18 : 14 }}>{phone.price}</p>
                                <div className="flex items-center gap-1 mt-0.5">
                                    <TrendingDown size={8} style={{ color: '#34d399' }} />
                                    <span className="text-[8px] font-bold text-emerald-400">{phone.drop}</span>
                                </div>
                            </div>
                            <div className="flex flex-col items-end gap-1">
                                <div className="flex items-center gap-0.5 px-1.5 py-0.5 rounded-full"
                                    style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.2)' }}>
                                    <Star size={7} className="fill-amber-400 text-amber-400" />
                                    <span className="text-[8px] font-black text-amber-400">{phone.rating}</span>
                                </div>
                                <span className="text-[8px] font-bold rounded-full px-1.5 py-0.5"
                                    style={{ background: `${phone.accent}15`, color: phone.accent, border: `1px solid ${phone.accent}25` }}>
                                    {phone.badge}
                                </span>
                            </div>
                        </div>

                        {/* score bars */}
                        <div className="space-y-1.5">
                            {['Perf', 'Cam', 'Batt'].map((label, i) => (
                                <div key={label}>
                                    <div className="flex justify-between mb-0.5">
                                        <span className="text-[7.5px] text-gray-500 font-semibold">{label}</span>
                                        <span className="text-[7.5px] font-black" style={{ color: phone.accent }}>{phone.bars[i]}</span>
                                    </div>
                                    <Bar pct={phone.bars[i]} color={phone.accent} delay={index * 100 + i * 150} />
                                </div>
                            ))}
                        </div>

                        {/* CTA */}
                        <div className="flex items-center justify-between pt-1">
                            <div className="flex -space-x-1">
                                {[...Array(3)].map((_, i) => (
                                    <div key={i} className="w-4 h-4 rounded-full border border-black/50 flex items-center justify-center text-[6px]"
                                        style={{ background: `hsl(${200 + i * 40},70%,60%)` }}>
                                        {['😊', '🙌', '✨'][i]}
                                    </div>
                                ))}
                                <span className="text-[7px] text-gray-500 ml-2 self-center">+2.4k</span>
                            </div>
                            <div className="flex items-center gap-1 text-[8px] font-bold rounded-full px-2.5 py-1"
                                style={{ background: phone.accent, color: '#fff', boxShadow: `0 4px 14px ${phone.accent}55` }}>
                                View <ChevronUp size={8} className="rotate-90" />
                            </div>
                        </div>
                    </div>
                </m.div>
            </m.div>
        </m.div>
    );
};

/* ─── neon grid lines ──────────────────────────────────────────────── */
const NeonGrid = () => (
    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.07]" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <pattern id="grid" width="48" height="48" patternUnits="userSpaceOnUse">
                <path d="M 48 0 L 0 0 0 48" fill="none" stroke="#ff1f3d" strokeWidth="0.5" />
            </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#grid)" />
    </svg>
);

/* ─── main export ──────────────────────────────────────────────────── */
const HeroVisual = () => {
    const containerRef = useRef(null);
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    const handleMouseMove = useCallback((e) => {
        const rect = containerRef.current?.getBoundingClientRect();
        if (!rect) return;
        mouseX.set(e.clientX - rect.left - rect.width / 2);
        mouseY.set(e.clientY - rect.top - rect.height / 2);
    }, []);

    const handleMouseLeave = useCallback(() => {
        mouseX.set(0); mouseY.set(0);
    }, []);

    return (
        <div
            ref={containerRef}
            className="relative w-full h-full flex items-center justify-center select-none overflow-visible"
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
            style={{ perspective: 1200 }}
        >
            {/* neon grid */}
            <NeonGrid />

            {/* radial glow */}
            <div className="absolute inset-0 pointer-events-none"
                style={{ background: 'radial-gradient(ellipse 60% 55% at 55% 50%, rgba(255,31,61,0.13) 0%, transparent 70%)' }} />

            {/* floating dot pulse */}
            {[260, 340, 420].map((s, i) => (
                <div key={s} className="absolute rounded-full border border-red-500/[0.08] pointer-events-none"
                    style={{
                        width: s, height: s,
                        animation: `tb-pulse-ring ${8 + i * 3}s ease-in-out infinite`,
                        animationDelay: `${i * 1.2}s`,
                    }} />
            ))}
            <div className="absolute w-[300px] h-[300px] rounded-full border border-red-500/20 pointer-events-none"
                style={{ animation: 'tb-spin-slow 20s linear infinite' }}>
                <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-red-500"
                    style={{ boxShadow: '0 0 14px rgba(255,31,61,1)' }} />
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-400/50" />
            </div>

            {/* ── 3 stacked cards ── */}
            <div className="relative flex items-center justify-center" style={{ width: 240, height: 360 }}>
                {PHONES.map((phone, i) => (
                    <PhoneCard key={phone.name} phone={phone} index={i} mouseX={mouseX} mouseY={mouseY} />
                ))}
            </div>

            {/* ── corner data tags ── */}
            <m.div className="absolute top-4 left-4 flex flex-col gap-1 pointer-events-none"
                initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.8 }}>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                    <Shield size={9} className="text-emerald-400" />
                    <span className="text-[9px] text-gray-300 font-semibold">Verified Prices</span>
                </div>
            </m.div>

            <m.div className="absolute bottom-4 right-4 flex flex-col gap-1 items-end pointer-events-none"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 1 }}>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                    <Zap size={9} className="text-violet-400" />
                    <span className="text-[9px] text-gray-300 font-semibold">Real-time Updates</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-[9px] text-gray-300 font-semibold">500+ phones live</span>
                </div>
            </m.div>
        </div>
    );
};

export default HeroVisual;
