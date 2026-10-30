import React, { useState, useMemo } from 'react';
import { m } from 'framer-motion';
import { Swords, Trophy, Crown, Sparkles, RefreshCw, ChevronDown, Check, Zap, Camera, Battery, Monitor, DollarSign } from 'lucide-react';
import localPhonesData from '../data/phones.json';
import { resolveProductImage } from '../utils/imageResolver';

const scorePhone = (phone) => {
    if (!phone) return { perf: 50, cam: 50, bat: 50, disp: 50, val: 50, overall: 50 };
    const desc = (phone.description || '').toLowerCase();
    const specs = phone.specs || {};
    
    // Performance: chip tier
    let perf = 50;
    if (desc.includes('a19') || desc.includes('a18') || desc.includes('snapdragon 8 elite') || desc.includes('snapdragon 8 gen 3')) perf = 98;
    else if (desc.includes('snapdragon 8') || desc.includes('dimensity 9300') || desc.includes('dimensity 9400')) perf = 92;
    else if (desc.includes('snapdragon 7') || desc.includes('dimensity 8300') || desc.includes('tensor g4')) perf = 82;
    else if (desc.includes('dimensity 7') || desc.includes('dimensity 6') || desc.includes('snapdragon 6')) perf = 68;
    else if (desc.includes('helio g99') || desc.includes('helio g96')) perf = 58;
    else if (desc.includes('helio g88') || desc.includes('helio g85')) perf = 50;

    // Camera
    const camMatch = desc.match(/(\d+)mp/);
    const mp = camMatch ? parseInt(camMatch[1], 10) : 50;
    let cam = Math.min(99, Math.round(45 + (mp / 200) * 50));
    if (desc.includes('periscope') || desc.includes('telephoto') || desc.includes('zeiss') || desc.includes('leica') || desc.includes('hasselblad')) {
        cam = Math.min(99, cam + 10);
    }

    // Battery & Charging
    const batMatch = desc.match(/(\d{4})mah/);
    const mah = batMatch ? parseInt(batMatch[1], 10) : 5000;
    const bat = Math.min(98, Math.round(40 + ((mah - 3500) / 3000) * 55));

    // Display
    const hzMatch = desc.match(/(\d+)hz/);
    const hz = hzMatch ? parseInt(hzMatch[1], 10) : 120;
    let disp = hz >= 165 ? 98 : hz >= 144 ? 94 : hz >= 120 ? 88 : hz >= 90 ? 74 : 60;
    if (desc.includes('ltpo') || desc.includes('amoled') || desc.includes('xdr')) {
        disp = Math.min(99, disp + 5);
    }

    // Value for money (normalized price vs tier)
    const price = typeof phone.price === 'number' ? phone.price : parseInt(String(phone.price).replace(/\D/g, ''), 10) || 30000;
    let val = 80;
    if (price < 15000) val = 95;
    else if (price < 30000) val = 90;
    else if (price < 50000) val = 84;
    else if (price < 80000) val = 76;
    else val = 70;

    const overall = Math.round(perf * 0.3 + cam * 0.25 + bat * 0.15 + disp * 0.15 + val * 0.15);
    return { perf, cam, bat, disp, val, overall };
};

const generateVerdict = (phoneA, phoneB, scoresA, scoresB) => {
    if (!phoneA || !phoneB) return '';
    const diff = scoresA.overall - scoresB.overall;
    const winner = diff >= 0 ? phoneA : phoneB;
    const loser = diff >= 0 ? phoneB : phoneA;
    const wS = diff >= 0 ? scoresA : scoresB;
    const lS = diff >= 0 ? scoresB : scoresA;

    const edges = [];
    if (wS.perf > lS.perf + 3) edges.push('raw processing power');
    if (wS.cam > lS.cam + 3) edges.push('camera hardware');
    if (wS.bat > lS.bat + 3) edges.push('battery endurance');
    if (wS.disp > lS.disp + 3) edges.push('screen quality');
    if (wS.val > lS.val + 3) edges.push('price-to-performance ratio');

    const edgeText = edges.length > 0 ? edges.slice(0, 2).join(' and ') : 'consistent all-around performance';

    if (Math.abs(diff) <= 2) {
        return `⚖️ It's a neck-and-neck tie! Both ${phoneA.name} (${scoresA.overall}/100) and ${phoneB.name} (${scoresB.overall}/100) deliver top-tier value. Choose ${scoresA.cam > scoresB.cam ? phoneA.name : phoneB.name} if you prioritize cameras, or ${scoresA.val > scoresB.val ? phoneA.name : phoneB.name} for maximum savings.`;
    }

    return `🏆 ${winner.name} takes the crown (${wS.overall}/100 vs ${lS.overall}/100) driven by superior ${edgeText}. While ${loser.name} is a competitive alternative, ${winner.name} provides the more complete flagship experience.`;
};

const BattleArena = () => {
    const phones = localPhonesData || [];
    const [phoneAId, setPhoneAId] = useState(phones[0]?.id || 1);
    const [phoneBId, setPhoneBId] = useState(phones[1]?.id || (phones[phones.length - 1]?.id || 2));

    const phoneA = useMemo(() => phones.find(p => p.id === Number(phoneAId)) || phones[0], [phones, phoneAId]);
    const phoneB = useMemo(() => phones.find(p => p.id === Number(phoneBId)) || phones[1], [phones, phoneBId]);

    const scoresA = useMemo(() => scorePhone(phoneA), [phoneA]);
    const scoresB = useMemo(() => scorePhone(phoneB), [phoneB]);
    const verdict = useMemo(() => generateVerdict(phoneA, phoneB, scoresA, scoresB), [phoneA, phoneB, scoresA, scoresB]);

    const winnerKey = scoresA.overall > scoresB.overall ? 'A' : scoresB.overall > scoresA.overall ? 'B' : 'TIE';

    const categories = [
        { key: 'perf', label: 'Processing & Gaming', icon: Zap },
        { key: 'cam', label: 'Camera & Video', icon: Camera },
        { key: 'bat', label: 'Battery & Endurance', icon: Battery },
        { key: 'disp', label: 'Display & Refresh Rate', icon: Monitor },
        { key: 'val', label: 'Value for Money', icon: DollarSign },
    ];

    const randomizeMatchup = () => {
        if (phones.length < 2) return;
        const idxA = Math.floor(Math.random() * phones.length);
        let idxB = Math.floor(Math.random() * phones.length);
        while (idxB === idxA && phones.length > 1) {
            idxB = Math.floor(Math.random() * phones.length);
        }
        setPhoneAId(phones[idxA].id);
        setPhoneBId(phones[idxB].id);
    };

    return (
        <section className="min-h-screen pt-28 pb-20 px-4 max-w-7xl mx-auto relative z-10">
            {/* Header */}
            <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-semibold uppercase tracking-wider mb-3">
                    <Swords size={14} className="animate-pulse" /> AI Battle Arena
                </div>
                <h1 className="text-3xl sm:text-5xl font-black text-white tracking-tight uppercase">
                    Flagship <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 via-orange-400 to-amber-300">Showdown</span>
                </h1>
                <p className="text-gray-400 text-sm sm:text-base max-w-2xl mx-auto mt-2">
                    Pick any two smartphones. Real-time benchmarks, spec parsing, and deep-learning comparative scoring reveal the undisputed champion.
                </p>

                <button
                    onClick={randomizeMatchup}
                    className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-xs font-medium text-gray-200 transition-all cursor-pointer hover:border-red-500/40"
                >
                    <RefreshCw size={13} /> Random Matchup
                </button>
            </div>

            {/* Battle Heads */}
            <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-6 items-stretch mb-10">
                {/* Fighter A */}
                <div className={`p-6 rounded-3xl bg-white/[0.03] border transition-all duration-300 relative overflow-hidden backdrop-blur-xl ${
                    winnerKey === 'A' ? 'border-red-500/60 shadow-[0_0_30px_rgba(239,68,68,0.2)]' : 'border-white/[0.08]'
                }`}>
                    {winnerKey === 'A' && (
                        <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-red-500 text-black font-extrabold text-xs shadow-lg">
                            <Crown size={14} /> WINNER
                        </div>
                    )}
                    <label className="text-[11px] uppercase tracking-wider font-bold text-red-400 mb-2 block">Challenger 1</label>
                    <div className="relative mb-4">
                        <select
                            value={phoneAId}
                            onChange={(e) => setPhoneAId(e.target.value)}
                            className="w-full appearance-none bg-black/60 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-red-500 cursor-pointer"
                        >
                            {phones.map(p => (
                                <option key={p.id} value={p.id} className="bg-zinc-900 text-white">
                                    {p.name} ({p.brand}) - ₹{Number(p.price).toLocaleString('en-IN')}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-black/40 border border-white/5 p-2 flex items-center justify-center shrink-0">
                            <img
                                src={resolveProductImage(phoneA?.image, phoneA?.name)}
                                alt={phoneA?.name}
                                className="max-w-full max-h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                            />
                        </div>
                        <div className="text-center sm:text-left flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-white truncate">{phoneA?.name}</h3>
                            <p className="text-xs text-red-400 font-semibold">{phoneA?.brand} • {phoneA?.category}</p>
                            <div className="mt-2 text-2xl font-black text-white">
                                ₹{Number(phoneA?.price).toLocaleString('en-IN')}
                            </div>
                            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs font-bold">
                                Score: {scoresA.overall} / 100
                            </div>
                        </div>
                    </div>
                </div>

                {/* VS Badge */}
                <div className="flex flex-col items-center justify-center py-2">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-red-600 via-red-500 to-orange-500 flex items-center justify-center text-white font-black text-xl shadow-[0_0_25px_rgba(239,68,68,0.5)] border-2 border-white/20">
                        VS
                    </div>
                </div>

                {/* Fighter B */}
                <div className={`p-6 rounded-3xl bg-white/[0.03] border transition-all duration-300 relative overflow-hidden backdrop-blur-xl ${
                    winnerKey === 'B' ? 'border-cyan-500/60 shadow-[0_0_30px_rgba(6,182,212,0.2)]' : 'border-white/[0.08]'
                }`}>
                    {winnerKey === 'B' && (
                        <div className="absolute top-4 right-4 flex items-center gap-1 px-3 py-1 rounded-full bg-gradient-to-r from-amber-500 to-cyan-400 text-black font-extrabold text-xs shadow-lg">
                            <Crown size={14} /> WINNER
                        </div>
                    )}
                    <label className="text-[11px] uppercase tracking-wider font-bold text-cyan-400 mb-2 block">Challenger 2</label>
                    <div className="relative mb-4">
                        <select
                            value={phoneBId}
                            onChange={(e) => setPhoneBId(e.target.value)}
                            className="w-full appearance-none bg-black/60 border border-white/10 rounded-2xl px-4 py-3 text-white text-sm font-semibold outline-none focus:border-cyan-500 cursor-pointer"
                        >
                            {phones.map(p => (
                                <option key={p.id} value={p.id} className="bg-zinc-900 text-white">
                                    {p.name} ({p.brand}) - ₹{Number(p.price).toLocaleString('en-IN')}
                                </option>
                            ))}
                        </select>
                        <ChevronDown size={16} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-6">
                        <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-2xl bg-black/40 border border-white/5 p-2 flex items-center justify-center shrink-0">
                            <img
                                src={resolveProductImage(phoneB?.image, phoneB?.name)}
                                alt={phoneB?.name}
                                className="max-w-full max-h-full object-contain drop-shadow-[0_10px_20px_rgba(0,0,0,0.5)]"
                            />
                        </div>
                        <div className="text-center sm:text-left flex-1 min-w-0">
                            <h3 className="text-xl font-bold text-white truncate">{phoneB?.name}</h3>
                            <p className="text-xs text-cyan-400 font-semibold">{phoneB?.brand} • {phoneB?.category}</p>
                            <div className="mt-2 text-2xl font-black text-white">
                                ₹{Number(phoneB?.price).toLocaleString('en-IN')}
                            </div>
                            <div className="mt-2 inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-bold">
                                Score: {scoresB.overall} / 100
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Score Comparison Bars */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl mb-10">
                <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
                    <Trophy size={18} className="text-amber-400" /> Category Breakdown
                </h3>

                <div className="space-y-6">
                    {categories.map((cat) => {
                        const Icon = cat.icon;
                        const sA = scoresA[cat.key];
                        const sB = scoresB[cat.key];
                        const aWins = sA > sB;
                        const bWins = sB > sA;

                        return (
                            <div key={cat.key} className="space-y-2">
                                <div className="flex items-center justify-between text-xs sm:text-sm font-semibold">
                                    <span className={`flex items-center gap-1.5 ${aWins ? 'text-red-400 font-bold' : 'text-gray-400'}`}>
                                        {sA} pts {aWins && '👑'}
                                    </span>
                                    <span className="text-gray-300 flex items-center gap-1.5 uppercase tracking-wider text-[11px] font-bold">
                                        <Icon size={14} className="text-amber-400" /> {cat.label}
                                    </span>
                                    <span className={`flex items-center gap-1.5 ${bWins ? 'text-cyan-400 font-bold' : 'text-gray-400'}`}>
                                        {bWins && '👑'} {sB} pts
                                    </span>
                                </div>

                                <div className="grid grid-cols-2 gap-2 h-3.5 bg-black/50 rounded-full p-0.5 border border-white/5 overflow-hidden">
                                    {/* Left bar (A) growing from right to left */}
                                    <div className="flex justify-end h-full">
                                        <m.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${sA}%` }}
                                            transition={{ duration: 0.6, ease: 'easeOut' }}
                                            className="h-full bg-gradient-to-l from-red-500 to-orange-500 rounded-full"
                                        />
                                    </div>
                                    {/* Right bar (B) growing from left to right */}
                                    <div className="flex justify-start h-full">
                                        <m.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${sB}%` }}
                                            transition={{ duration: 0.6, ease: 'easeOut' }}
                                            className="h-full bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full"
                                        />
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* AI Verdict Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-red-950/30 via-black to-zinc-950 border border-red-500/30 relative overflow-hidden">
                <div className="flex items-start gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-red-500/20 border border-red-500/40 flex items-center justify-center text-red-400 shrink-0">
                        <Sparkles size={22} />
                    </div>
                    <div>
                        <h4 className="text-base font-bold text-white flex items-center gap-2">
                            TechBoy AI Benchmark Verdict
                        </h4>
                        <p className="text-gray-300 text-sm sm:text-base leading-relaxed mt-2">
                            {verdict}
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BattleArena;
