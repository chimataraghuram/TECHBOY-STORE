import React, { useState, useMemo } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { Swords, Trophy, Crown, Sparkles, RefreshCw, ChevronDown, Check, Zap, Camera, Battery, Monitor, DollarSign, Sliders, Cpu, HardDrive, Gauge, Eye, Flame } from 'lucide-react';
import localPhonesData from '../data/phones.json';
import { resolveProductImage } from '../utils/imageResolver';
import { parseSpecs } from '../utils/specsParser';
import logo from '../../images/logos/new-logo.jpg';

const phones = Array.isArray(localPhonesData) ? localPhonesData : (localPhonesData?.phones || []);

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
    if (!phoneA || !phoneB) return null;
    const diff = scoresA.overall - scoresB.overall;
    const winner = diff >= 0 ? phoneA : phoneB;
    const loser = diff >= 0 ? phoneB : phoneA;
    const wS = diff >= 0 ? scoresA : scoresB;
    const lS = diff >= 0 ? scoresB : scoresA;

    const specsA = parseSpecs(phoneA.description || '');
    const specsB = parseSpecs(phoneB.description || '');
    const wSpecs = diff >= 0 ? specsA : specsB;
    const lSpecs = diff >= 0 ? specsB : specsA;

    const keyReasons = [];
    if (wS.perf > lS.perf) {
        keyReasons.push(`⚡ Higher performance score (${wS.perf} vs ${lS.perf}) powered by ${wSpecs.chip !== '—' ? wSpecs.chip : 'superior silicon'}`);
    }
    if (wS.cam > lS.cam) {
        keyReasons.push(`📸 Superior camera optics (${wS.cam} vs ${lS.cam}) with ${wSpecs.camera !== '—' ? wSpecs.camera : 'enhanced sensor tuning'}`);
    }
    if (wS.bat > lS.bat) {
        keyReasons.push(`🔋 Longer battery & charge speed (${wS.bat} vs ${lS.bat}) featuring ${wSpecs.battery !== '—' ? wSpecs.battery : 'higher capacity'}`);
    }
    if (wS.disp > lS.disp) {
        keyReasons.push(`🖥️ Sharper, smoother display (${wS.disp} vs ${lS.disp}) with ${wSpecs.display !== '—' ? wSpecs.display : 'fluid refresh rate'}`);
    }
    if (wS.val > lS.val) {
        keyReasons.push(`💰 Better value-for-money score (${wS.val} vs ${lS.val}) at ₹${Number(winner.price).toLocaleString('en-IN')}`);
    }

    if (keyReasons.length === 0) {
        keyReasons.push(`🔥 Balanced hardware architecture and stable software ecosystem across everyday tasks`);
    }

    const isTie = Math.abs(diff) <= 2;
    return {
        isTie,
        winner,
        loser,
        winnerScore: wS.overall,
        loserScore: lS.overall,
        headline: isTie 
            ? `⚖️ Deadlock Tie: Both ${phoneA.name} and ${phoneB.name} deliver matching benchmark power.` 
            : `🏆 ${winner.name} wins by +${Math.abs(diff)} Benchmark Points (${wS.overall}/100 vs ${lS.overall}/100)`,
        summary: isTie
            ? `Our deep benchmark algorithms rate both contenders virtually neck-and-neck. If camera output is your highest priority, choose ${scoresA.cam >= scoresB.cam ? phoneA.name : phoneB.name}. If you want max value per Rupee, go with ${scoresA.val >= scoresB.val ? phoneA.name : phoneB.name}.`
            : `TechBoy AI analyzed silicon throughput, optical sensor dynamic range, display refresh stability, thermal endurance, and pricing. ${winner.name} takes the victory with more well-rounded hardware and fewer compromises.`,
        keyReasons,
        recommendedFor: {
            phoneA: `Best for users seeking ${scoresA.cam > scoresB.cam ? 'camera versatility & portraits' : scoresA.perf > scoresB.perf ? 'raw gaming framerates' : 'everyday reliable balance'}.`,
            phoneB: `Best for users seeking ${scoresB.cam > scoresA.cam ? 'sharp optics & video captures' : scoresB.val > scoresA.val ? 'smart budget savings' : 'endurance & battery life'}.`
        }
    };
};

const BattleArena = () => {
    const [activeTab, setActiveTab] = useState('radar'); // 'radar' | 'specs'

    const [phoneAId, setPhoneAId] = useState(phones[0]?.id || 1);
    const [phoneBId, setPhoneBId] = useState(phones[1]?.id || (phones[phones.length - 1]?.id || 2));

    const phoneA = useMemo(() => phones.find(p => p.id === Number(phoneAId)) || phones[0], [phones, phoneAId]);
    const phoneB = useMemo(() => phones.find(p => p.id === Number(phoneBId)) || phones[1], [phones, phoneBId]);

    const specsA = useMemo(() => parseSpecs(phoneA?.description || ''), [phoneA]);
    const specsB = useMemo(() => parseSpecs(phoneB?.description || ''), [phoneB]);

    const detailedSpecsList = [
        { label: 'Processor / Silicon', icon: Cpu, valA: specsA.chip, valB: specsB.chip, key: 'perf' },
        { label: 'Main Optics / Video', icon: Camera, valA: specsA.camera, valB: specsB.camera, key: 'cam' },
        { label: 'Display & Refresh Rate', icon: Monitor, valA: specsA.display, valB: specsB.display, key: 'disp' },
        { label: 'Battery Capacity', icon: Battery, valA: specsA.battery, valB: specsB.battery, key: 'bat' },
        { label: 'Fast Charging Wattage', icon: Zap, valA: specsA.charging, valB: specsB.charging, key: 'bat' },
        { label: 'RAM Memory', icon: Gauge, valA: specsA.ram, valB: specsB.ram, key: 'perf' },
        { label: 'Internal Storage', icon: HardDrive, valA: specsA.storage, valB: specsB.storage, key: 'perf' },
        { label: 'Official Store Price', icon: DollarSign, valA: `₹${Number(phoneA?.price).toLocaleString('en-IN')}`, valB: `₹${Number(phoneB?.price).toLocaleString('en-IN')}`, key: 'val' }
    ];

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

            {/* Score Comparison Bars, Interactive Radar Chart, or Detailed Specs Matrix */}
            <div className="p-5 sm:p-8 rounded-3xl bg-white/[0.02] border border-white/[0.08] backdrop-blur-xl mb-10">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6 pb-4 border-b border-white/[0.08]">
                    <div>
                        <h3 className="text-lg font-bold text-white flex items-center gap-2">
                            <Trophy size={18} className="text-amber-400" /> Deep Comparative Analytics
                        </h3>
                        <p className="text-gray-400 text-xs mt-1">Switch between multi-axis radar benchmarks and spec-by-spec deep hardware comparison.</p>
                    </div>

                    {/* View Switcher Pills */}
                    <div className="flex items-center gap-2 p-1 rounded-2xl bg-white/[0.04] border border-white/[0.08]">
                        <button
                            type="button"
                            onClick={() => setActiveTab('radar')}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                activeTab === 'radar'
                                    ? 'bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_15px_rgba(255,31,61,0.4)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                            }`}
                        >
                            <Sliders size={13} />
                            <span>Radar & Scores</span>
                        </button>
                        <button
                            type="button"
                            onClick={() => setActiveTab('specs')}
                            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${
                                activeTab === 'specs'
                                    ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white shadow-[0_0_15px_rgba(6,182,212,0.4)]'
                                    : 'text-gray-400 hover:text-white hover:bg-white/[0.04]'
                            }`}
                        >
                            <Cpu size={13} />
                            <span>Detailed Specs</span>
                        </button>
                    </div>
                </div>

                <AnimatePresence mode="wait">
                    {activeTab === 'radar' ? (
                        <m.div
                            key="radar-tab"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                        >
                            <div className="flex items-center justify-end gap-4 text-xs font-semibold mb-4">
                                <span className="flex items-center gap-1.5 text-red-400">
                                    <span className="w-2.5 h-2.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(255,31,61,0.8)]" />
                                    {phoneA?.name?.split(' ')[0] || 'Contender A'}
                                </span>
                                <span className="flex items-center gap-1.5 text-cyan-400">
                                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(6,182,212,0.8)]" />
                                    {phoneB?.name?.split(' ')[0] || 'Contender B'}
                                </span>
                            </div>

                            {/* 5-Axis Dual Cyberpunk Radar Chart */}
                            <div className="flex justify-center mb-8 py-2">
                                <svg viewBox="0 0 280 280" className="w-56 h-56 sm:w-64 sm:h-64 overflow-visible select-none">
                                    <defs>
                                        <radialGradient id="radarGlowA" cx="50%" cy="50%" r="50%">
                                            <stop offset="0%" stopColor="#ff1f3d" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#ff1f3d" stopOpacity="0.05" />
                                        </radialGradient>
                                        <radialGradient id="radarGlowB" cx="50%" cy="50%" r="50%">
                                            <stop offset="0%" stopColor="#06b6d4" stopOpacity="0.4" />
                                            <stop offset="100%" stopColor="#06b6d4" stopOpacity="0.05" />
                                        </radialGradient>
                                    </defs>
                                    {/* Background Web Polygons */}
                                    {[0.25, 0.5, 0.75, 1].map((scale, sIdx) => {
                                        const r = 95 * scale;
                                        const pts = [0, 1, 2, 3, 4].map(i => {
                                            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                                            return `${140 + r * Math.cos(angle)},${140 + r * Math.sin(angle)}`;
                                        }).join(' ');
                                        return (
                                            <polygon
                                                key={sIdx}
                                                points={pts}
                                                fill="none"
                                                stroke="rgba(255, 255, 255, 0.08)"
                                                strokeWidth="1"
                                                strokeDasharray={scale === 1 ? 'none' : '2 2'}
                                            />
                                        );
                                    })}
                                    {/* Spokes & Axis Labels */}
                                    {[0, 1, 2, 3, 4].map(i => {
                                        const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                                        const x2 = 140 + 95 * Math.cos(angle);
                                        const y2 = 140 + 95 * Math.sin(angle);
                                        const lx = 140 + 118 * Math.cos(angle);
                                        const ly = 140 + 118 * Math.sin(angle);
                                        const labels = ['Gaming', 'Camera', 'Battery', 'Display', 'Value'];
                                        return (
                                            <g key={i}>
                                                <line x1="140" y1="140" x2={x2} y2={y2} stroke="rgba(255, 255, 255, 0.12)" strokeWidth="1" />
                                                <text
                                                    x={lx}
                                                    y={ly}
                                                    fill="#9aa0ab"
                                                    fontSize="9.5"
                                                    fontWeight="700"
                                                    textAnchor="middle"
                                                    dominantBaseline="central"
                                                >
                                                    {labels[i]}
                                                </text>
                                            </g>
                                        );
                                    })}
                                    {/* Polygon Phone B (Cyan) */}
                                    {(() => {
                                        const bKeys = ['perf', 'cam', 'bat', 'disp', 'val'];
                                        const pts = bKeys.map((k, i) => {
                                            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                                            const r = (scoresB[k] / 100) * 95;
                                            return `${140 + r * Math.cos(angle)},${140 + r * Math.sin(angle)}`;
                                        }).join(' ');
                                        return (
                                            <polygon
                                                points={pts}
                                                fill="url(#radarGlowB)"
                                                stroke="#06b6d4"
                                                strokeWidth="2"
                                                strokeLinejoin="round"
                                            />
                                        );
                                    })()}
                                    {/* Polygon Phone A (Red) */}
                                    {(() => {
                                        const aKeys = ['perf', 'cam', 'bat', 'disp', 'val'];
                                        const pts = aKeys.map((k, i) => {
                                            const angle = (Math.PI * 2 * i) / 5 - Math.PI / 2;
                                            const r = (scoresA[k] / 100) * 95;
                                            return `${140 + r * Math.cos(angle)},${140 + r * Math.sin(angle)}`;
                                        }).join(' ');
                                        return (
                                            <polygon
                                                points={pts}
                                                fill="url(#radarGlowA)"
                                                stroke="#ff1f3d"
                                                strokeWidth="2"
                                                strokeLinejoin="round"
                                            />
                                        );
                                    })()}
                                </svg>
                            </div>

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
                        </m.div>
                    ) : (
                        <m.div
                            key="specs-tab"
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className="overflow-x-auto hide-scrollbar"
                        >
                            <table className="w-full text-left border-collapse min-w-[540px]">
                                <thead>
                                    <tr className="border-b border-white/10 text-xs uppercase tracking-wider text-gray-400">
                                        <th className="py-3 px-4 w-[36%] font-extrabold text-red-400">
                                            {phoneA?.name}
                                        </th>
                                        <th className="py-3 px-4 w-[28%] text-center font-bold text-gray-300">
                                            Hardware Parameter
                                        </th>
                                        <th className="py-3 px-4 w-[36%] text-right font-extrabold text-cyan-400">
                                            {phoneB?.name}
                                        </th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-white/5 text-xs sm:text-sm">
                                    {detailedSpecsList.map((spec, sIdx) => {
                                        const Icon = spec.icon;
                                        const scoreDiff = scoresA[spec.key] - scoresB[spec.key];
                                        const aBetter = scoreDiff > 0;
                                        const bBetter = scoreDiff < 0;

                                        return (
                                            <tr key={sIdx} className="hover:bg-white/[0.02] transition-colors">
                                                <td className="py-3.5 px-4 font-semibold text-white">
                                                    <div className="flex items-center gap-2">
                                                        {aBetter && <span className="text-amber-400 text-xs">👑</span>}
                                                        <span className={aBetter ? 'text-red-400 font-bold' : 'text-gray-200'}>
                                                            {spec.valA}
                                                        </span>
                                                    </div>
                                                </td>
                                                <td className="py-3.5 px-4 text-center">
                                                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/[0.03] border border-white/10 text-gray-300 font-bold text-[11px] sm:text-xs">
                                                        <Icon size={12} className="text-amber-400" />
                                                        {spec.label}
                                                    </span>
                                                </td>
                                                <td className="py-3.5 px-4 text-right font-semibold text-white">
                                                    <div className="flex items-center justify-end gap-2">
                                                        <span className={bBetter ? 'text-cyan-400 font-bold' : 'text-gray-200'}>
                                                            {spec.valB}
                                                        </span>
                                                        {bBetter && <span className="text-amber-400 text-xs">👑</span>}
                                                    </div>
                                                </td>
                                            </tr>
                                        );
                                    })}
                                </tbody>
                            </table>
                        </m.div>
                    )}
                </AnimatePresence>
            </div>

            {/* TechBoy AI Deep Intelligence Verdict Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-red-950/40 via-[#0c0c14] to-zinc-950 border border-red-500/30 relative overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.8),0_0_30px_rgba(255,31,61,0.15)]">
                <div className="absolute top-0 right-0 w-80 h-80 bg-red-600/10 rounded-full blur-[80px] pointer-events-none" />
                
                <div className="relative z-10 flex flex-col md:flex-row items-start gap-5">
                    {/* Official TechBoy AI Logo Thumbnail */}
                    <div className="relative shrink-0">
                        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl overflow-hidden border-2 border-red-500/80 shadow-[0_0_25px_rgba(255,31,61,0.5)] bg-black flex items-center justify-center">
                            <img src={logo} alt="TechBoy AI" className="w-full h-full object-cover" />
                        </div>
                        <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gradient-to-tr from-red-500 to-amber-400 flex items-center justify-center text-[10px] text-white shadow-md">
                            ⚡
                        </span>
                    </div>

                    <div className="flex-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2 mb-2">
                            <h4 className="text-lg sm:text-xl font-black text-white tracking-wide">
                                TechBoy AI Deep Intelligence Verdict
                            </h4>
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase tracking-wider bg-red-500/20 text-red-400 border border-red-500/40 shadow-sm">
                                Trained v2.4 Spec Engine
                            </span>
                        </div>

                        {/* Benchmark Headline & Scores */}
                        <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/10 mb-4">
                            <p className="text-sm sm:text-base font-extrabold text-white">
                                {verdict?.headline}
                            </p>
                            <p className="text-xs sm:text-sm text-gray-300 mt-1.5 leading-relaxed">
                                {verdict?.summary}
                            </p>
                        </div>

                        {/* Key Decisive Factors */}
                        <div className="mb-4">
                            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block mb-2">
                                Decisive Benchmark Advantages
                            </span>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                {verdict?.keyReasons?.map((reason, rIdx) => (
                                    <div key={rIdx} className="flex items-center gap-2 p-2.5 rounded-xl bg-black/40 border border-white/5 text-xs text-gray-200">
                                        <Check size={14} className="text-red-400 shrink-0" />
                                        <span>{reason}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Tailored Audience Recommendations */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 border-t border-white/10 text-xs">
                            <div className="p-3 rounded-xl bg-red-500/5 border border-red-500/20">
                                <span className="font-extrabold text-red-400 block mb-1">
                                    Why choose {phoneA?.name}?
                                </span>
                                <p className="text-gray-300 leading-relaxed">
                                    {verdict?.recommendedFor?.phoneA}
                                </p>
                            </div>
                            <div className="p-3 rounded-xl bg-cyan-500/5 border border-cyan-500/20">
                                <span className="font-extrabold text-cyan-400 block mb-1">
                                    Why choose {phoneB?.name}?
                                </span>
                                <p className="text-gray-300 leading-relaxed">
                                    {verdict?.recommendedFor?.phoneB}
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default BattleArena;
