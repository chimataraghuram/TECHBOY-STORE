import React from 'react';
import { m } from 'framer-motion';

/* ─── realistic phone frame ──────────────────────────────────────── */
const Phone = ({ color, screenTop, screenBot, w = 86, h = 172, isHero = false }) => {
    const br = isHero ? 34 : 26;
    const brInner = isHero ? 27 : 20;
    const pad = isHero ? 8 : 6;
    const nipW = isHero ? 38 : 26;
    const nipH = isHero ? 10 : 7;

    return (
        <div style={{
            width: w, height: h,
            borderRadius: br,
            position: 'relative',
            /* layered shadows = frame depth */
            boxShadow: [
                `0 0 0 1.5px rgba(255,255,255,0.1)`,
                `0 0 0 3px rgba(0,0,0,0.95)`,
                `0 35px 80px rgba(0,0,0,0.95)`,
                `0 0 ${isHero ? 90 : 50}px ${color}55`,
                `0 0 ${isHero ? 180 : 90}px ${color}1a`,
                `inset 0 1px 0 rgba(255,255,255,0.13)`,
            ].join(','),
            background: 'linear-gradient(145deg, #1d1d26 0%, #0e0e18 50%, #070710 100%)',
        }}>
            {/* left edge shimmer */}
            <div style={{
                position: 'absolute', top: '12%', bottom: '12%', left: 0, width: 2,
                background: 'linear-gradient(to bottom,transparent,rgba(255,255,255,0.1),transparent)',
                borderRadius: br,
            }} />

            {/* screen */}
            <div style={{
                position: 'absolute',
                top: pad, left: pad, right: pad, bottom: pad + 2,
                borderRadius: brInner,
                overflow: 'hidden',
                background: screenTop,
            }}>
                {/* main gradient */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: `linear-gradient(175deg, ${screenTop} 0%, ${screenTop} 25%, ${screenBot} 65%, ${color}cc 100%)`,
                }} />
                {/* bottom radial bloom */}
                <div style={{
                    position: 'absolute', bottom: -15, left: '50%',
                    transform: 'translateX(-50%)',
                    width: '140%', height: '65%',
                    background: `radial-gradient(ellipse at 50% 100%, ${color}bb 0%, ${color}44 35%, transparent 70%)`,
                    filter: 'blur(6px)',
                }} />
                {/* top soft reflection */}
                <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: '40%',
                    background: 'linear-gradient(180deg,rgba(255,255,255,0.05) 0%,transparent 100%)',
                }} />
                {/* gloss diagonal */}
                <div style={{
                    position: 'absolute', inset: 0,
                    background: 'linear-gradient(128deg,rgba(255,255,255,0.07) 0%,transparent 45%)',
                }} />
                {/* dynamic island */}
                <div style={{
                    position: 'absolute', top: nipH - 3, left: '50%',
                    transform: 'translateX(-50%)',
                    width: nipW, height: nipH,
                    borderRadius: 12,
                    background: 'rgba(0,0,0,0.95)',
                    boxShadow: 'inset 0 1px 2px rgba(255,255,255,0.04)',
                }} />
            </div>

            {/* side buttons */}
            <div style={{ position:'absolute', right:-2.5, top:'27%', width:3, height:26, borderRadius:2, background:'linear-gradient(to bottom,#252530,#18181f,#252530)' }} />
            <div style={{ position:'absolute', left:-2.5, top:'23%', width:3, height:17, borderRadius:2, background:'linear-gradient(to bottom,#252530,#18181f,#252530)' }} />
            <div style={{ position:'absolute', left:-2.5, top:'33%', width:3, height:17, borderRadius:2, background:'linear-gradient(to bottom,#252530,#18181f,#252530)' }} />

            {/* body gloss */}
            <div style={{
                position:'absolute', inset:0, borderRadius:br, pointerEvents:'none',
                background:'linear-gradient(135deg,rgba(255,255,255,0.05) 0%,transparent 50%)',
            }} />
        </div>
    );
};

/* ─── brand pill ─────────────────────────────────────────────────── */
const Pill = ({ brand, logo, color, style, delay = 0 }) => (
    <m.div
        className="absolute z-40 flex items-center gap-1.5"
        style={{
            ...style,
            padding: '5px 12px 5px 5px', borderRadius: 24,
            background: 'rgba(6,6,14,0.92)',
            border: '1px solid rgba(255,255,255,0.1)',
            boxShadow: '0 8px 32px rgba(0,0,0,0.8), 0 0 16px rgba(255,31,61,0.07)',
            backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
            whiteSpace: 'nowrap',
        }}
        initial={{ opacity:0, scale:0.7, y:6 }}
        animate={{ opacity:1, scale:1, y:0 }}
        transition={{ delay, duration:0.5, ease:[0.16,1,0.3,1] }}
    >
        <span style={{
            width:22, height:22, borderRadius:'50%', flexShrink:0,
            background:`${color}1e`, border:`1px solid ${color}55`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:9, fontWeight:900, color,
            fontFamily:'monospace',
        }}>{logo}</span>
        <span style={{ fontSize:11, fontWeight:700, color:'#fff', letterSpacing:0.2 }}>{brand}</span>
    </m.div>
);

/* ─── positioned phone wrapper ───────────────────────────────────── */
const P = ({ top, left, rotate, scale, z, delay, children, float }) => (
    <m.div
        className="absolute"
        style={{ top, left, zIndex:z, transform:`translate(-50%,-50%) rotate(${rotate}deg) scale(${scale})` }}
        initial={{ opacity:0, y:50, scale: scale * 0.8 }}
        animate={{ opacity:1, y:0, scale }}
        transition={{ delay, duration:0.95, ease:[0.16,1,0.3,1] }}
    >
        {float ? (
            <m.div animate={{ y:[-8,8,-8] }} transition={{ duration:5.5, repeat:Infinity, ease:'easeInOut' }}>
                {children}
            </m.div>
        ) : children}
    </m.div>
);

/* ─── main ───────────────────────────────────────────────────────── */
const HeroVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-visible">

        {/* bg red radial */}
        <div className="absolute inset-0 pointer-events-none" style={{
            background:'radial-gradient(ellipse 70% 60% at 55% 45%, rgba(255,31,61,0.18) 0%, transparent 70%)',
        }} />

        {/* ── orbital ellipse rings (3D tilt) ── */}
        {/* outer big ring */}
        <div className="absolute pointer-events-none" style={{
            width:460, height:460,
            top:'44%', left:'52%',
            transform:'translate(-50%,-50%) perspective(600px) rotateX(74deg)',
            borderRadius:'50%',
            border:'1.5px solid rgba(255,31,61,0.5)',
            boxShadow:'0 0 22px rgba(255,31,61,0.35), inset 0 0 22px rgba(255,31,61,0.06)',
            animation:'tb-spin-slow 20s linear infinite',
        }}>
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                style={{ background:'#ff1f3d', boxShadow:'0 0 16px 5px rgba(255,31,61,0.95)' }} />
            <span className="absolute bottom-0 right-[25%] translate-y-1/2 w-1.5 h-1.5 rounded-full"
                style={{ background:'rgba(255,100,100,0.6)', boxShadow:'0 0 8px rgba(255,31,61,0.7)' }} />
        </div>
        {/* inner ring */}
        <div className="absolute pointer-events-none" style={{
            width:320, height:320,
            top:'46%', left:'50%',
            transform:'translate(-50%,-50%) perspective(600px) rotateX(74deg)',
            borderRadius:'50%',
            border:'1px solid rgba(255,31,61,0.28)',
            boxShadow:'0 0 14px rgba(255,31,61,0.2)',
            animation:'tb-spin-slow 30s linear infinite reverse',
        }} />

        {/* ── red stage platform glow ── */}
        <div className="absolute pointer-events-none" style={{
            width:200, height:35, bottom:'14%', left:'50%',
            transform:'translateX(-50%)',
            borderRadius:'50%',
            background:'radial-gradient(ellipse, rgba(255,31,61,0.65) 0%, rgba(255,31,61,0.2) 45%, transparent 70%)',
            filter:'blur(10px)',
        }} />
        <div className="absolute pointer-events-none" style={{
            width:130, height:18, bottom:'15%', left:'50%',
            transform:'translateX(-50%)',
            borderRadius:'50%',
            background:'rgba(255,31,61,0.75)',
            filter:'blur(6px)',
        }} />

        {/* ══ PHONES — match reference layout ══ */}

        {/* Dark phone — far left */}
        <P top="46%" left="9%" rotate={-8} scale={0.7} z={8} delay={0.5}>
            <Phone color="#333" screenTop="#060608" screenBot="#111118" w={82} h={168} />
        </P>

        {/* Samsung — upper left */}
        <P top="30%" left="26%" rotate={-4} scale={0.82} z={18} delay={0.3}>
            <Phone color="#2244dd" screenTop="#02020e" screenBot="#040e38" w={84} h={172} />
        </P>

        {/* Xiaomi / Orange — lower left */}
        <P top="62%" left="24%" rotate={-6} scale={0.78} z={14} delay={0.45}>
            <Phone color="#e05000" screenTop="#0e0400" screenBot="#280e00" w={82} h={166} />
        </P>

        {/* ── Hero iPhone — center ── */}
        <P top="41%" left="50%" rotate={0} scale={1.1} z={30} delay={0.1} float>
            <Phone color="#ff1f3d" screenTop="#110006" screenBot="#2e000e" w={106} h={210} isHero />
        </P>

        {/* OnePlus — upper right */}
        <P top="21%" left="70%" rotate={5} scale={0.82} z={20} delay={0.3}>
            <Phone color="#cc0000" screenTop="#0e0000" screenBot="#280000" w={84} h={172} />
        </P>

        {/* realme — right */}
        <P top="52%" left="78%" rotate={8} scale={0.76} z={16} delay={0.4}>
            <Phone color="#b8a000" screenTop="#0a0900" screenBot="#221e00" w={82} h={166} />
        </P>

        {/* vivo — bottom center-right */}
        <P top="72%" left="58%" rotate={5} scale={0.72} z={12} delay={0.55}>
            <Phone color="#2244ff" screenTop="#00020d" screenBot="#060a28" w={80} h={162} />
        </P>

        {/* ══ BRAND PILLS ══ */}
        <Pill brand="iPhone"  logo="🍎" color="#ff1f3d"
            style={{ top:'12%', left:'50%', transform:'translateX(-50%)' }} delay={0.75} />
        <Pill brand="Samsung" logo="S"   color="#4466ff"
            style={{ top:'16%', left:'14%' }} delay={0.85} />
        <Pill brand="OnePlus" logo="1+"  color="#ff2222"
            style={{ top:'12%', right:'14%' }} delay={0.9} />
        <Pill brand="Xiaomi"  logo="mi"  color="#ff6900"
            style={{ top:'58%', left:'3%' }} delay={1.0} />
        <Pill brand="realme"  logo="R"   color="#ccaa00"
            style={{ top:'42%', right:'4%' }} delay={1.05} />
        <Pill brand="vivo"    logo="V"   color="#4455ff"
            style={{ bottom:'14%', right:'12%' }} delay={1.1} />
    </div>
);

export default HeroVisual;
