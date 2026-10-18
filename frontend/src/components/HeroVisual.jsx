import React from 'react';
import { m } from 'framer-motion';

/* ─── phone silhouette ──────────────────────────────────────────── */
const Phone = ({ color, screen1, screen2, w = 84, h = 170, isHero = false }) => (
    <div style={{
        width: w, height: h,
        borderRadius: isHero ? 30 : 22,
        background: `linear-gradient(160deg,#18181f,#08080f)`,
        border: `1.5px solid rgba(255,255,255,${isHero ? 0.16 : 0.1})`,
        boxShadow: [
            `0 ${isHero ? 50 : 25}px ${isHero ? 100 : 55}px rgba(0,0,0,0.9)`,
            `0 0 ${isHero ? 55 : 28}px ${color}44`,
            `inset 0 1px 0 rgba(255,255,255,0.1)`,
        ].join(','),
        position: 'relative', overflow: 'hidden', flexShrink: 0,
    }}>
        {/* gloss */}
        <div style={{ position:'absolute', inset:0, borderRadius:'inherit',
            background:'linear-gradient(135deg,rgba(255,255,255,0.07) 0%,transparent 55%)' }} />
        {/* screen */}
        <div style={{
            position:'absolute',
            top: isHero ? 9 : 6, left: isHero ? 7 : 5,
            right: isHero ? 7 : 5, bottom: isHero ? 11 : 7,
            borderRadius: isHero ? 23 : 17,
            background: `linear-gradient(160deg,${screen1},${screen2})`,
            overflow:'hidden',
        }}>
            {/* dynamic island */}
            <div style={{
                position:'absolute', top: isHero ? 6 : 4, left:'50%',
                transform:'translateX(-50%)',
                width: isHero ? 34 : 22, height: isHero ? 9 : 6,
                borderRadius:10, background:'#000',
            }} />
            {/* screen inner glow */}
            <div style={{
                position:'absolute', bottom:0, left:0, right:0, height:'55%',
                background:`radial-gradient(ellipse at 50% 100%,${color}55 0%,transparent 70%)`,
            }} />
            {/* screen top tint */}
            <div style={{
                position:'absolute', top:0, left:0, right:0, height:'40%',
                background:`linear-gradient(180deg,${color}22,transparent)`,
            }} />
        </div>
        {/* right button */}
        <div style={{ position:'absolute', right:-2, top:'28%', width:2.5, height:24, borderRadius:2, background:'rgba(255,255,255,0.18)' }} />
        {/* left buttons */}
        <div style={{ position:'absolute', left:-2, top:'24%', width:2.5, height:16, borderRadius:2, background:'rgba(255,255,255,0.13)' }} />
        <div style={{ position:'absolute', left:-2, top:'36%', width:2.5, height:16, borderRadius:2, background:'rgba(255,255,255,0.13)' }} />
    </div>
);

/* ─── brand pill ─────────────────────────────────────────────────── */
const Pill = ({ brand, logo, color, style, delay = 0 }) => (
    <m.div
        className="absolute z-40 flex items-center gap-1.5"
        style={{
            ...style,
            padding:'5px 11px 5px 6px', borderRadius:20,
            background:'rgba(8,8,16,0.9)',
            border:'1px solid rgba(255,255,255,0.11)',
            boxShadow:'0 8px 30px rgba(0,0,0,0.75), 0 0 14px rgba(255,31,61,0.08)',
            backdropFilter:'blur(18px)', WebkitBackdropFilter:'blur(18px)',
            whiteSpace:'nowrap',
        }}
        initial={{ opacity:0, scale:0.75, y:8 }}
        animate={{ opacity:1, scale:1, y:0 }}
        transition={{ delay, duration:0.5, ease:[0.16,1,0.3,1] }}
    >
        <span style={{
            width:22, height:22, borderRadius:'50%',
            background:`${color}22`, border:`1px solid ${color}55`,
            display:'flex', alignItems:'center', justifyContent:'center',
            fontSize:9, fontWeight:900, color, flexShrink:0,
        }}>{logo}</span>
        <span style={{ fontSize:11, fontWeight:700, color:'#fff' }}>{brand}</span>
    </m.div>
);

/* ─── phone entry (positioned + rotated) ────────────────────────── */
const PhoneEntry = ({ top, left, rotate, scale, z, color, screen1, screen2, delay, animY = null, w, h, isHero }) => (
    <m.div
        className="absolute"
        style={{ top, left, zIndex:z, transform:`translate(-50%,-50%) rotate(${rotate}deg) scale(${scale})` }}
        initial={{ opacity:0, y:40 }}
        animate={{ opacity:1, y:0 }}
        transition={{ delay, duration:0.85, ease:[0.16,1,0.3,1] }}
    >
        {animY ? (
            <m.div animate={{ y: animY }} transition={{ duration:5.5, repeat:Infinity, ease:'easeInOut' }}>
                <Phone color={color} screen1={screen1} screen2={screen2} w={w} h={h} isHero={isHero} />
            </m.div>
        ) : (
            <Phone color={color} screen1={screen1} screen2={screen2} w={w} h={h} isHero={isHero} />
        )}
    </m.div>
);

/* ─── main ───────────────────────────────────────────────────────── */
const HeroVisual = () => (
    <div className="relative w-full h-full flex items-center justify-center select-none overflow-visible">

        {/* ── background ambient glow ── */}
        <div className="absolute inset-0 pointer-events-none" style={{
            background:'radial-gradient(ellipse 70% 65% at 55% 45%, rgba(255,31,61,0.22) 0%, transparent 70%)',
        }} />

        {/* ── outer decorative rings ── */}
        <div className="absolute pointer-events-none" style={{
            width:480, height:480, top:'50%', left:'50%',
            transform:'translate(-50%,-50%)',
            borderRadius:'50%',
            border:'1px solid rgba(255,31,61,0.09)',
            animation:'tb-pulse-ring 8s ease-in-out infinite',
        }} />
        <div className="absolute pointer-events-none" style={{
            width:370, height:370, top:'50%', left:'50%',
            transform:'translate(-50%,-50%)',
            borderRadius:'50%',
            border:'1px solid rgba(255,31,61,0.06)',
            animation:'tb-pulse-ring 11s ease-in-out infinite',
            animationDelay:'2s',
        }} />

        {/* ── 3D orbital ellipse rings (the "platform" rings) ── */}
        <div className="absolute pointer-events-none" style={{
            width:420, height:420, top:'50%', left:'50%',
            transform:'translate(-50%,-50%) perspective(500px) rotateX(76deg)',
            borderRadius:'50%',
            border:'2px solid rgba(255,31,61,0.55)',
            boxShadow:'0 0 28px rgba(255,31,61,0.4), inset 0 0 28px rgba(255,31,61,0.08)',
            animation:'tb-spin-slow 18s linear infinite',
        }}>
            <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3 h-3 rounded-full"
                style={{ background:'#ff1f3d', boxShadow:'0 0 14px 4px rgba(255,31,61,0.9)' }} />
            <span className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 w-2 h-2 rounded-full"
                style={{ background:'rgba(255,31,61,0.5)', boxShadow:'0 0 8px rgba(255,31,61,0.7)' }} />
        </div>
        <div className="absolute pointer-events-none" style={{
            width:310, height:310, top:'50%', left:'50%',
            transform:'translate(-50%,-50%) perspective(500px) rotateX(76deg)',
            borderRadius:'50%',
            border:'1.5px solid rgba(255,31,61,0.35)',
            boxShadow:'0 0 18px rgba(255,31,61,0.25)',
            animation:'tb-spin-slow 26s linear infinite reverse',
        }} />

        {/* ── glowing red platform stage at bottom ── */}
        <div className="absolute pointer-events-none" style={{
            width:220, height:40, bottom:'10%', left:'50%',
            transform:'translateX(-50%)',
            borderRadius:'50%',
            background:'radial-gradient(ellipse, rgba(255,31,61,0.55) 0%, rgba(255,31,61,0.2) 40%, transparent 70%)',
            filter:'blur(8px)',
        }} />
        <div className="absolute pointer-events-none" style={{
            width:160, height:22, bottom:'11%', left:'50%',
            transform:'translateX(-50%)',
            borderRadius:'50%',
            background:'radial-gradient(ellipse, rgba(255,31,61,0.7) 0%, transparent 70%)',
            filter:'blur(5px)',
        }} />

        {/* ══════════ PHONES ══════════ */}

        {/* Extra dark phone — far left */}
        <PhoneEntry
            top="55%" left="8%" rotate={-32} scale={0.62} z={8}
            color="#444" screen1="#0a0a12" screen2="#141420"
            w={80} h={162} delay={0.5}
        />

        {/* Samsung — upper left */}
        <PhoneEntry
            top="33%" left="23%" rotate={-22} scale={0.78} z={18}
            color="#1a4fff" screen1="#020210" screen2="#061840"
            w={82} h={165} delay={0.3}
        />

        {/* Xiaomi — lower left */}
        <PhoneEntry
            top="67%" left="22%" rotate={-18} scale={0.72} z={14}
            color="#ff6900" screen1="#100400" screen2="#2a0e00"
            w={80} h={160} delay={0.45}
        />

        {/* ── HERO iPhone — center ── */}
        <PhoneEntry
            top="46%" left="50%" rotate={0} scale={1.12} z={30}
            color="#ff1f3d" screen1="#1a0008" screen2="#3d0012"
            w={102} h={206} delay={0.1}
            animY={[-8, 8, -8]}
            isHero
        />

        {/* OnePlus — upper right */}
        <PhoneEntry
            top="24%" left="72%" rotate={20} scale={0.76} z={18}
            color="#f50514" screen1="#100000" screen2="#2d0000"
            w={80} h={162} delay={0.35}
        />

        {/* realme — right side */}
        <PhoneEntry
            top="60%" left="80%" rotate={26} scale={0.71} z={14}
            color="#ffd700" screen1="#0e0c00" screen2="#262000"
            w={78} h={158} delay={0.55}
        />

        {/* vivo — bottom right */}
        <PhoneEntry
            top="80%" left="60%" rotate={10} scale={0.66} z={10}
            color="#415fff" screen1="#00020e" screen2="#060c28"
            w={76} h={152} delay={0.65}
        />

        {/* ══════════ BRAND PILLS ══════════ */}

        <Pill brand="iPhone"  logo="🍎" color="#ff1f3d"
            style={{ top:'5%', left:'50%', transform:'translateX(-50%)' }} delay={0.7} />
        <Pill brand="Samsung" logo="S"   color="#4a7aff"
            style={{ top:'18%', left:'2%' }} delay={0.8} />
        <Pill brand="OnePlus" logo="1+"  color="#f50514"
            style={{ top:'8%', right:'2%' }} delay={0.9} />
        <Pill brand="Xiaomi"  logo="mi"  color="#ff6900"
            style={{ bottom:'24%', left:'2%' }} delay={1.0} />
        <Pill brand="realme"  logo="R"   color="#ffd700"
            style={{ bottom:'32%', right:'0%' }} delay={1.1} />
        <Pill brand="vivo"    logo="V"   color="#415fff"
            style={{ bottom:'8%', right:'8%' }} delay={1.2} />
    </div>
);

export default HeroVisual;
