import React, { useEffect, useRef, useState } from 'react';
import { m } from 'framer-motion';
import { Cpu, Zap, Shield, TrendingDown, Star, Wifi } from 'lucide-react';

/* ─── tiny animated bar ──────────────────────────────────────────────── */
const Bar = ({ pct, color = '#ff1f3d', delay = 0 }) => {
    const [w, setW] = useState(0);
    useEffect(() => {
        const t = setTimeout(() => setW(pct), 300 + delay);
        return () => clearTimeout(t);
    }, [pct, delay]);
    return (
        <div className="h-1 w-full rounded-full bg-white/10 overflow-hidden">
            <div
                className="h-full rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${w}%`, background: color, boxShadow: `0 0 8px ${color}99` }}
            />
        </div>
    );
};

/* ─── floating spec card ─────────────────────────────────────────────── */
const SpecCard = ({ icon: Icon, label, value, sub, color, animY, delay }) => (
    <m.div
        className="absolute z-20 flex items-center gap-3 rounded-2xl border border-white/10 bg-[#0a0a10]/80 px-3.5 py-2.5 backdrop-blur-2xl shadow-[0_16px_40px_rgba(0,0,0,0.55)]"
        style={{ boxShadow: `0 16px 40px rgba(0,0,0,0.55), 0 0 20px ${color}22` }}
        animate={{ y: animY }}
        transition={{ duration: 5 + delay, repeat: Infinity, ease: 'easeInOut', delay }}
    >
        <div className="absolute inset-x-0 top-0 h-px rounded-full"
            style={{ background: `linear-gradient(90deg,transparent,${color}99,transparent)` }} />
        <span className="flex h-8 w-8 items-center justify-center rounded-xl shrink-0"
            style={{ background: `${color}1a`, boxShadow: `0 0 12px ${color}44`, border: `1px solid ${color}33` }}>
            <Icon size={14} style={{ color }} />
        </span>
        <div className="leading-tight min-w-0">
            <p className="text-[10px] text-gray-400 font-semibold uppercase tracking-wider">{label}</p>
            <p className="text-white text-[13px] font-black leading-none mt-0.5">{value}</p>
            {sub && <p className="text-[9px] text-gray-500 mt-0.5">{sub}</p>}
        </div>
    </m.div>
);

/* ─── main visual ────────────────────────────────────────────────────── */
const HeroVisual = () => {
    const canvasRef = useRef(null);

    /* particle canvas */
    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        let raf;
        const W = canvas.width = canvas.offsetWidth;
        const H = canvas.height = canvas.offsetHeight;

        const dots = Array.from({ length: 55 }, () => ({
            x: Math.random() * W, y: Math.random() * H,
            vx: (Math.random() - 0.5) * 0.35,
            vy: (Math.random() - 0.5) * 0.35,
            r: Math.random() * 1.5 + 0.4,
            a: Math.random() * 0.6 + 0.15,
        }));

        const draw = () => {
            ctx.clearRect(0, 0, W, H);
            dots.forEach(d => {
                d.x += d.vx; d.y += d.vy;
                if (d.x < 0) d.x = W; if (d.x > W) d.x = 0;
                if (d.y < 0) d.y = H; if (d.y > H) d.y = 0;
                ctx.beginPath();
                ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255,31,61,${d.a})`;
                ctx.fill();
            });
            // connect nearby dots
            for (let i = 0; i < dots.length; i++) {
                for (let j = i + 1; j < dots.length; j++) {
                    const dx = dots[i].x - dots[j].x, dy = dots[i].y - dots[j].y;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    if (dist < 90) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255,31,61,${0.18 * (1 - dist / 90)})`;
                        ctx.lineWidth = 0.6;
                        ctx.moveTo(dots[i].x, dots[i].y);
                        ctx.lineTo(dots[j].x, dots[j].y);
                        ctx.stroke();
                    }
                }
            }
            raf = requestAnimationFrame(draw);
        };
        draw();
        return () => cancelAnimationFrame(raf);
    }, []);

    return (
        <div className="relative w-full h-full flex items-center justify-center select-none">
            {/* particle network bg */}
            <canvas
                ref={canvasRef}
                className="absolute inset-0 w-full h-full pointer-events-none opacity-60"
            />

            {/* Central holographic orb */}
            <div className="relative z-10 flex items-center justify-center">
                {/* outer pulse rings */}
                {[380, 300, 220].map((s, i) => (
                    <div key={s} className="absolute rounded-full border border-red-500/10 pointer-events-none"
                        style={{
                            width: s, height: s,
                            animation: `tb-pulse-ring ${6 + i * 2}s ease-in-out infinite`,
                            animationDelay: `${i * 0.8}s`,
                        }} />
                ))}
                {/* spinning orbit ring */}
                <div className="absolute rounded-full border border-red-500/25 pointer-events-none"
                    style={{ width: 260, height: 260, animation: 'tb-spin-slow 18s linear infinite' }}>
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_14px_rgba(255,31,61,1)]" />
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-400/60 shadow-[0_0_8px_rgba(255,31,61,0.7)]" />
                </div>
                {/* counter-spin ring */}
                <div className="absolute rounded-full border border-white/[0.07] pointer-events-none"
                    style={{ width: 190, height: 190, animation: 'tb-spin-slow 28s linear infinite reverse' }}>
                    <span className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-white/40" />
                </div>

                {/* Core glass panel — the "holographic device" */}
                <m.div
                    className="relative z-20 w-[148px] h-[248px] rounded-[30px] border border-white/15 overflow-hidden"
                    style={{
                        background: 'linear-gradient(145deg,rgba(255,31,61,0.12) 0%,rgba(12,12,20,0.92) 40%,rgba(6,6,14,0.97) 100%)',
                        boxShadow: '0 0 60px rgba(255,31,61,0.22), 0 30px 80px rgba(0,0,0,0.7), inset 0 1px 0 rgba(255,255,255,0.08)',
                        transform: 'perspective(900px) rotateY(-8deg) rotateX(4deg)',
                    }}
                    animate={{ rotateY: [-8, -4, -8], y: [-4, 4, -4] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                >
                    {/* top shimmer */}
                    <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-red-500/70 to-transparent" />
                    {/* left edge highlight */}
                    <div className="absolute inset-y-0 left-0 w-px bg-gradient-to-b from-red-500/40 via-white/10 to-transparent" />

                    {/* notch */}
                    <div className="absolute top-3 left-1/2 -translate-x-1/2 w-10 h-1.5 rounded-full bg-black/80 border border-white/10" />

                    {/* screen content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-3 pt-8">
                        {/* AI Score ring */}
                        <div className="relative flex items-center justify-center">
                            <svg width="72" height="72" viewBox="0 0 72 72" className="rotate-[-90deg]">
                                <circle cx="36" cy="36" r="30" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="5" />
                                <m.circle
                                    cx="36" cy="36" r="30" fill="none"
                                    stroke="url(#sg)" strokeWidth="5"
                                    strokeLinecap="round"
                                    strokeDasharray={2 * Math.PI * 30}
                                    initial={{ strokeDashoffset: 2 * Math.PI * 30 }}
                                    animate={{ strokeDashoffset: 2 * Math.PI * 30 * 0.09 }}
                                    transition={{ duration: 2, delay: 0.5, ease: 'easeOut' }}
                                />
                                <defs>
                                    <linearGradient id="sg" x1="0%" y1="0%" x2="100%" y2="0%">
                                        <stop offset="0%" stopColor="#ff1f3d" />
                                        <stop offset="100%" stopColor="#ff6b81" />
                                    </linearGradient>
                                </defs>
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-white font-black text-lg leading-none">91</span>
                                <span className="text-[8px] text-red-400 font-bold uppercase tracking-wider">AI Score</span>
                            </div>
                        </div>

                        {/* mini stat bars */}
                        <div className="w-full space-y-2">
                            {[
                                { label: 'Perf', pct: 94, color: '#ff1f3d' },
                                { label: 'Cam', pct: 88, color: '#a78bfa' },
                                { label: 'Batt', pct: 76, color: '#34d399' },
                            ].map(({ label, pct, color }, i) => (
                                <div key={label}>
                                    <div className="flex justify-between text-[8.5px] mb-0.5">
                                        <span className="text-gray-400 font-semibold">{label}</span>
                                        <span className="font-black" style={{ color }}>{pct}</span>
                                    </div>
                                    <Bar pct={pct} color={color} delay={i * 180} />
                                </div>
                            ))}
                        </div>

                        {/* price chip */}
                        <div className="w-full mt-1 rounded-xl bg-red-500/10 border border-red-500/20 px-2.5 py-1.5 text-center">
                            <p className="text-[9px] text-gray-400 font-semibold">Best Price Today</p>
                            <p className="text-white text-[13px] font-black leading-tight">₹1,19,900</p>
                            <p className="text-red-400 text-[8px] font-bold">↓ ₹8,000 dropped</p>
                        </div>
                    </div>

                    {/* home bar */}
                    <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-10 h-1 rounded-full bg-white/25" />
                </m.div>
            </div>

            {/* ── floating spec cards ── */}
            <SpecCard
                icon={Cpu} label="Processor" value="A18 Pro" sub="6-core Neural Engine"
                color="#ff1f3d"
                animY={[-6, 6, -6]} delay={0}
                style={{ top: '8%', right: '-2%' }}
            />
            {/* override position with a wrapping div since SpecCard uses absolute */}
            <div className="absolute top-[8%] right-[-2%] z-30 pointer-events-none">
                <SpecCard icon={Cpu} label="Processor" value="A18 Pro" sub="6-core Neural Engine"
                    color="#ff1f3d" animY={[-6, 6, -6]} delay={0} />
            </div>
            <div className="absolute bottom-[12%] left-[-4%] z-30 pointer-events-none">
                <SpecCard icon={TrendingDown} label="Price Drop" value="₹8,000" sub="Galaxy S26 Ultra"
                    color="#34d399" animY={[5, -5, 5]} delay={0.7} />
            </div>
            <div className="absolute top-[38%] right-[-6%] z-30 pointer-events-none">
                <SpecCard icon={Star} label="Rating" value="4.8 / 5.0" sub="12,480 reviews"
                    color="#f59e0b" animY={[-4, 4, -4]} delay={1.2} />
            </div>
            <div className="absolute top-[68%] right-[4%] z-30 pointer-events-none">
                <SpecCard icon={Zap} label="Fast Charge" value="65W" sub="0→100% in 35 min"
                    color="#818cf8" animY={[3, -3, 3]} delay={0.4} />
            </div>
            <div className="absolute top-[16%] left-[-2%] z-30 pointer-events-none">
                <SpecCard icon={Wifi} label="Connectivity" value="5G + Wi-Fi 7" sub="Ultra-fast speeds"
                    color="#22d3ee" animY={[-5, 3, -5]} delay={1.8} />
            </div>
        </div>
    );
};

export default HeroVisual;
