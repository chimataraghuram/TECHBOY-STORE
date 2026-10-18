import React, { useEffect, useRef, useState } from 'react';
import { m, useAnimationFrame } from 'framer-motion';
import { TrendingDown, Star, Zap, Cpu } from 'lucide-react';

/* ── animated stat bar ────────────────────────────────────────────── */
const Bar = ({ pct, color, delay = 0 }) => {
    const [w, setW] = useState(0);
    useEffect(() => { const t = setTimeout(() => setW(pct), 600 + delay); return () => clearTimeout(t); }, []);
    return (
        <div className="h-[3px] w-full rounded-full bg-white/10 overflow-hidden">
            <div className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${w}%`, background: color, boxShadow: `0 0 6px ${color}bb` }} />
        </div>
    );
};

/* ── floating badge ───────────────────────────────────────────────── */
const Badge = ({ children, className = '', animY, delay = 0 }) => (
    <m.div
        className={`absolute z-30 flex items-center gap-2.5 rounded-2xl border border-white/[0.09]
            bg-[#08080f]/85 backdrop-blur-2xl px-3 py-2
            shadow-[0_12px_35px_rgba(0,0,0,0.6)] ${className}`}
        animate={{ y: animY }}
        transition={{ duration: 5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    >
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/20 to-transparent rounded-t-2xl" />
        {children}
    </m.div>
);

/* ── main ─────────────────────────────────────────────────────────── */
const HeroVisual = () => {
    const canvasRef = useRef(null);
    const dotsRef = useRef([]);
    const rafRef = useRef();

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let W = canvas.width = canvas.offsetWidth;
        let H = canvas.height = canvas.offsetHeight;
        dotsRef.current = Array.from({ length: 40 }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.28, vy: (Math.random() - 0.5) * 0.28,
            r: Math.random() * 1.2 + 0.3,
        }));
        const tick = () => {
            ctx.clearRect(0, 0, W, H);
            dotsRef.current.forEach(d => {
                d.x = (d.x + d.vx + W) % W;
                d.y = (d.y + d.vy + H) % H;
                ctx.beginPath(); ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fillStyle = 'rgba(255,31,61,0.35)'; ctx.fill();
            });
            for (let i = 0; i < dotsRef.current.length; i++)
                for (let j = i + 1; j < dotsRef.current.length; j++) {
                    const { x: ax, y: ay } = dotsRef.current[i];
                    const { x: bx, y: by } = dotsRef.current[j];
                    const d = Math.hypot(ax - bx, ay - by);
                    if (d < 100) {
                        ctx.strokeStyle = `rgba(255,31,61,${0.12 * (1 - d / 100)})`;
                        ctx.lineWidth = 0.5;
                        ctx.beginPath(); ctx.moveTo(ax, ay); ctx.lineTo(bx, by); ctx.stroke();
                    }
                }
            rafRef.current = requestAnimationFrame(tick);
        };
        tick();
        return () => cancelAnimationFrame(rafRef.current);
    }, []);

    return (
        <div className="relative w-full h-full flex items-center justify-center select-none">

            {/* Particle network bg */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none opacity-50" />

            {/* Deep ambient glow behind phone */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                w-[320px] h-[420px] pointer-events-none"
                style={{ background: 'radial-gradient(ellipse at center, rgba(255,31,61,0.28) 0%, transparent 70%)', filter: 'blur(40px)' }} />

            {/* Outer orbit decorations */}
            {[380, 310].map((s, i) => (
                <div key={s} className="absolute rounded-full border border-red-500/10 pointer-events-none"
                    style={{
                        width: s, height: s,
                        animation: i === 0 ? 'tb-spin-slow 22s linear infinite' : 'tb-spin-slow 16s linear infinite reverse',
                    }}>
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2
                        rounded-full bg-red-500"
                        style={{ width: i === 0 ? 8 : 5, height: i === 0 ? 8 : 5, boxShadow: '0 0 12px rgba(255,31,61,0.9)' }} />
                </div>
            ))}

            {/* ════ THE PHONE ════ */}
            <m.div
                className="relative z-20"
                style={{ perspective: 1200 }}
                animate={{ y: [-8, 8, -8] }}
                transition={{ duration: 7, repeat: Infinity, ease: 'easeInOut' }}
            >
                <m.div
                    style={{
                        width: 160,
                        height: 320,
                        borderRadius: 36,
                        background: 'linear-gradient(160deg, #1a1a28 0%, #0d0d18 50%, #060610 100%)',
                        border: '1.5px solid rgba(255,255,255,0.14)',
                        boxShadow: [
                            '0 0 0 1px rgba(0,0,0,0.8)',
                            '0 40px 100px rgba(0,0,0,0.85)',
                            '0 0 50px rgba(255,31,61,0.3)',
                            '0 0 100px rgba(255,31,61,0.12)',
                            'inset 0 1px 0 rgba(255,255,255,0.12)',
                            'inset 0 -1px 0 rgba(255,255,255,0.04)',
                            'inset 1px 0 0 rgba(255,255,255,0.06)',
                        ].join(','),
                        rotateY: -12,
                        rotateX: 6,
                        transform: 'perspective(1200px) rotateY(-12deg) rotateX(6deg)',
                    }}
                >
                    {/* Side buttons */}
                    <div className="absolute -right-[3px] top-[70px] w-[3px] h-8 rounded-r-sm"
                        style={{ background: 'linear-gradient(to bottom, #1e1e2e, #2a2a3e, #1e1e2e)' }} />
                    <div className="absolute -left-[3px] top-[60px] w-[3px] h-6 rounded-l-sm"
                        style={{ background: 'linear-gradient(to bottom, #1e1e2e, #2a2a3e, #1e1e2e)' }} />
                    <div className="absolute -left-[3px] top-[96px] w-[3px] h-6 rounded-l-sm"
                        style={{ background: 'linear-gradient(to bottom, #1e1e2e, #2a2a3e, #1e1e2e)' }} />

                    {/* Gloss highlight on phone body */}
                    <div className="absolute inset-0 pointer-events-none overflow-hidden"
                        style={{ borderRadius: 36 }}>
                        <div style={{
                            position: 'absolute', top: 0, left: 0, right: '30%', height: '55%',
                            background: 'linear-gradient(135deg, rgba(255,255,255,0.06) 0%, transparent 60%)',
                            borderRadius: 36,
                        }} />
                    </div>

                    {/* Dynamic Island */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2
                        h-5 rounded-full bg-black border border-white/[0.08]"
                        style={{ width: 68 }}>
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full bg-[#111] border border-white/10" />
                    </div>

                    {/* ── SCREEN CONTENT ── */}
                    <div className="absolute top-[26px] left-[6px] right-[6px] bottom-[16px] overflow-hidden"
                        style={{ borderRadius: 30, background: '#050508' }}>

                        {/* Screen gradient overlay */}
                        <div className="absolute inset-0 pointer-events-none"
                            style={{ background: 'linear-gradient(180deg, rgba(255,31,61,0.08) 0%, transparent 30%, rgba(255,31,61,0.04) 100%)' }} />

                        {/* Status bar */}
                        <div className="flex justify-between items-center px-4 pt-2 pb-1">
                            <span className="text-white text-[8px] font-bold">9:41</span>
                            <div className="flex items-center gap-1">
                                <svg width="11" height="7" viewBox="0 0 11 7" fill="none">
                                    <rect x="0" y="2" width="2" height="5" rx="0.5" fill="white" fillOpacity="0.4"/>
                                    <rect x="3" y="1.5" width="2" height="5.5" rx="0.5" fill="white" fillOpacity="0.6"/>
                                    <rect x="6" y="0.5" width="2" height="6.5" rx="0.5" fill="white" fillOpacity="0.8"/>
                                    <rect x="9" y="0" width="2" height="7" rx="0.5" fill="white"/>
                                </svg>
                                <svg width="12" height="8" viewBox="0 0 12 8" fill="white" fillOpacity="0.85">
                                    <path d="M6 1.5C7.93 1.5 9.67 2.27 10.95 3.5L12 2.46C10.44 0.93 8.33 0 6 0C3.67 0 1.56.93 0 2.46L1.05 3.5C2.33 2.27 4.07 1.5 6 1.5Z"/>
                                    <path d="M6 4.5C7.1 4.5 8.1 4.94 8.83 5.66L9.88 4.62C8.87 3.62 7.51 3 6 3C4.49 3 3.13 3.62 2.12 4.62L3.17 5.66C3.9 4.94 4.9 4.5 6 4.5Z"/>
                                    <circle cx="6" cy="7" r="1"/>
                                </svg>
                                <div className="flex items-center gap-0.5">
                                    <div className="w-4 h-2 rounded-[2px] border border-white/40 flex items-center px-[1px]">
                                        <div className="h-full rounded-[1px] bg-white" style={{ width: '75%' }} />
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* App header */}
                        <div className="px-3 pt-1 pb-2 flex items-center justify-between">
                            <div>
                                <p className="text-[7px] text-gray-500 font-semibold uppercase tracking-wider">TechBoy Store</p>
                                <p className="text-white text-[11px] font-black leading-tight">AI Picks 🔥</p>
                            </div>
                            <div className="w-6 h-6 rounded-full bg-red-500/20 border border-red-500/30 flex items-center justify-center">
                                <span className="text-[8px]">🔔</span>
                            </div>
                        </div>

                        {/* Featured product card */}
                        <div className="mx-2.5 rounded-2xl overflow-hidden mb-2"
                            style={{
                                background: 'linear-gradient(135deg, rgba(255,31,61,0.15) 0%, rgba(20,20,35,0.95) 100%)',
                                border: '1px solid rgba(255,31,61,0.2)',
                            }}>
                            <div className="p-2.5">
                                <div className="flex items-center justify-between mb-1.5">
                                    <span className="text-[7px] text-red-400 font-bold uppercase tracking-wider bg-red-500/10 px-1.5 py-0.5 rounded-full border border-red-500/20">
                                        #1 AI Pick
                                    </span>
                                    <div className="flex items-center gap-0.5">
                                        <Star size={7} className="fill-amber-400 text-amber-400" />
                                        <span className="text-[7px] text-amber-400 font-bold">4.9</span>
                                    </div>
                                </div>
                                <p className="text-white text-[10px] font-black leading-tight">iPhone 17 Pro Max</p>
                                <p className="text-gray-400 text-[7px] mt-0.5">A19 Pro · 6.9″ ProMotion · 256GB</p>
                                <div className="flex items-end justify-between mt-2">
                                    <div>
                                        <p className="text-white text-[12px] font-black leading-none">₹1,49,900</p>
                                        <p className="text-gray-500 text-[7px] line-through mt-0.5">₹1,64,900</p>
                                    </div>
                                    <div className="flex items-center gap-0.5 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-1.5 py-0.5">
                                        <TrendingDown size={7} className="text-emerald-400" />
                                        <span className="text-[7px] font-black text-emerald-400">−9%</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Mini AI score bars */}
                        <div className="mx-2.5 p-2 rounded-xl mb-2"
                            style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                            <p className="text-[7px] text-gray-400 font-bold uppercase tracking-wider mb-1.5">AI Analysis</p>
                            {[
                                { label: 'Performance', val: 97, color: '#ff1f3d' },
                                { label: 'Camera', val: 94, color: '#a78bfa' },
                                { label: 'Battery', val: 81, color: '#34d399' },
                            ].map(({ label, val, color }, i) => (
                                <div key={label} className="mb-1.5 last:mb-0">
                                    <div className="flex justify-between mb-0.5">
                                        <span className="text-[7px] text-gray-500">{label}</span>
                                        <span className="text-[7px] font-black" style={{ color }}>{val}</span>
                                    </div>
                                    <Bar pct={val} color={color} delay={i * 200} />
                                </div>
                            ))}
                        </div>

                        {/* Bottom nav pills */}
                        <div className="mx-2.5 flex gap-1.5">
                            {['Home', 'Compare', 'Deals'].map((tab, i) => (
                                <div key={tab} className="flex-1 rounded-xl py-1.5 flex items-center justify-center"
                                    style={{
                                        background: i === 0 ? 'rgba(255,31,61,0.2)' : 'rgba(255,255,255,0.04)',
                                        border: i === 0 ? '1px solid rgba(255,31,61,0.3)' : '1px solid rgba(255,255,255,0.06)',
                                    }}>
                                    <span className="text-[7px] font-bold" style={{ color: i === 0 ? '#ff4d6a' : '#6b7280' }}>{tab}</span>
                                </div>
                            ))}
                        </div>

                        {/* Home indicator */}
                        <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 w-8 h-[3px] rounded-full bg-white/25" />
                    </div>
                </m.div>
            </m.div>

            {/* ── Floating badges ── */}
            <Badge
                className="top-[10%] right-[3%]"
                animY={[-7, 5, -7]} delay={0}
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-red-500/15 border border-red-500/25 shrink-0">
                    <Cpu size={12} className="text-red-400" />
                </span>
                <div className="leading-tight">
                    <p className="text-[9px] text-gray-400 font-semibold">Processor</p>
                    <p className="text-white text-[11px] font-black">A18 Pro</p>
                </div>
            </Badge>

            <Badge
                className="bottom-[14%] left-[2%]"
                animY={[6, -6, 6]} delay={0.8}
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-emerald-500/15 border border-emerald-500/25 shrink-0">
                    <TrendingDown size={12} className="text-emerald-400" />
                </span>
                <div className="leading-tight">
                    <p className="text-[9px] text-gray-400 font-semibold">Price Drop</p>
                    <p className="text-emerald-400 text-[11px] font-black">₹8,000</p>
                </div>
            </Badge>

            <Badge
                className="top-[42%] right-[0%]"
                animY={[-4, 4, -4]} delay={1.4}
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-amber-500/15 border border-amber-500/25 shrink-0">
                    <Star size={11} className="text-amber-400 fill-amber-400" />
                </span>
                <div className="leading-tight">
                    <p className="text-[9px] text-gray-400 font-semibold">Rating</p>
                    <p className="text-white text-[11px] font-black">4.9 / 5</p>
                </div>
            </Badge>

            <Badge
                className="top-[16%] left-[2%]"
                animY={[-5, 3, -5]} delay={2}
            >
                <span className="flex h-7 w-7 items-center justify-center rounded-xl bg-violet-500/15 border border-violet-500/25 shrink-0">
                    <Zap size={12} className="text-violet-400" />
                </span>
                <div className="leading-tight">
                    <p className="text-[9px] text-gray-400 font-semibold">Fast Charge</p>
                    <p className="text-white text-[11px] font-black">65W</p>
                </div>
            </Badge>
        </div>
    );
};

export default HeroVisual;
