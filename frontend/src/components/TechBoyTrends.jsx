import React, { useState } from 'react';
import { m, AnimatePresence } from 'framer-motion';
import { TrendingDown, Flame, Rocket, Star, GitCompare, Bell, ArrowRight, TrendingUp, Activity, Clock } from 'lucide-react';
import PriceAlertModal from './PriceAlertModal';
import QuickViewModal from './QuickViewModal';
import { PREDEFINED_NOTIFICATIONS } from './NotificationSystemData';
import { parseSpecs } from '../utils/specsParser';
import { resolveProductImage } from '../utils/imageResolver';

const CATEGORIES = [
    { id: 'all', label: 'All Trends', icon: Activity },
    { id: 'price_drop', label: 'Price Drops', icon: TrendingDown },
    { id: 'trending', label: 'Trending', icon: Flame },
    { id: 'launch', label: 'New Launches', icon: Rocket },
    { id: 'pick', label: 'Analyst Picks', icon: Star },
    { id: 'comparison', label: 'Comparisons', icon: GitCompare }
];

const getCategoryIcon = (type) => {
    switch (type) {
        case 'price_drop': return <TrendingDown size={12} className="text-green-500" />;
        case 'launch': return <Rocket size={12} className="text-blue-500" />;
        case 'trending': return <Flame size={12} className="text-orange-500" />;
        case 'pick': return <Star size={12} className="text-purple-500" />;
        case 'comparison': return <GitCompare size={12} className="text-yellow-500" />;
        default: return <Bell size={12} className="text-red-500" />;
    }
};

const getCategoryStyle = (type) => {
    switch (type) {
        case 'price_drop': return 'bg-green-500/10 text-green-500 border-green-500/20';
        case 'launch': return 'bg-blue-500/10 text-blue-500 border-blue-500/20';
        case 'trending': return 'bg-orange-500/10 text-orange-500 border-orange-500/20';
        case 'pick': return 'bg-purple-500/10 text-purple-500 border-purple-500/20';
        case 'comparison': return 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20';
        default: return 'bg-gray-500/10 text-gray-400 border-gray-500/20';
    }
};

const getTrendLabel = (type) => {
    const labels = {
        price_drop: 'PRICE DROP',
        trending: 'TRENDING',
        launch: 'NEW LAUNCH',
        pick: 'TOP PICK',
        comparison: 'COMPARE'
    };
    return labels[type] || 'TRENDING';
};

const getTrendColor = (type) => {
    const colors = {
        price_drop: 'bg-green-500/20 text-green-500 border-green-500/30',
        trending: 'bg-orange-500/20 text-orange-500 border-orange-500/30',
        launch: 'bg-blue-500/20 text-blue-500 border-blue-500/30',
        pick: 'bg-purple-500/20 text-purple-500 border-purple-500/30',
        comparison: 'bg-yellow-500/20 text-yellow-500 border-yellow-500/30'
    };
    return colors[type] || 'bg-red-500/20 text-red-500 border-red-500/30';
};

const generateChartData = (alert) => {
    const isPriceDrop = alert.type === 'price_drop' && alert.savings > 0;
    const isTrending = alert.type === 'trending';
    const numPoints = 16;
    const points = [];
    const seed = (alert.id * 9301 + 49297) % 233280;
    
    for (let i = 0; i < numPoints; i++) {
        const x = (i / (numPoints - 1)) * 200;
        const progress = i / (numPoints - 1);
        const r = (((seed + i * 37) % 100) / 100) - 0.5; // -0.5 to 0.5
        
        let y;
        if (isPriceDrop) {
            // High price in the past, steep drop towards today
            const base = progress < 0.6 ? 12 : 12 + (progress - 0.6) * 55;
            y = Math.min(34, Math.max(8, base + r * 5));
        } else if (isTrending) {
            // Rising demand momentum upward
            const base = 32 - progress * 20;
            y = Math.min(34, Math.max(8, base + r * 5));
        } else {
            // Stable / slight fluctuations
            const base = 20;
            y = Math.min(32, Math.max(10, base + r * 6));
        }
        points.push({ x: Math.round(x), y: Math.round(y) });
    }

    const linePath = `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}`;
    const areaPath = `${linePath} L 200 40 L 0 40 Z`;
    const lastPoint = points[points.length - 1];

    let color = '#3b82f6'; // blue default
    if (isPriceDrop) color = '#10b981'; // emerald green
    else if (isTrending) color = '#f97316'; // orange flame
    else if (alert.type === 'pick') color = '#a855f7'; // purple
    else if (alert.type === 'comparison') color = '#eab308'; // yellow
    else color = '#ff1f3d'; // cyber red

    return { linePath, areaPath, lastPoint, color, isPriceDrop, isTrending };
};

const TechBoyTrends = () => {
    const [activeCategory, setActiveCategory] = useState('all');
    const [priceAlertProduct, setPriceAlertProduct] = useState(null);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [displayCount, setDisplayCount] = useState(8);

    const alerts = PREDEFINED_NOTIFICATIONS.map((item, index) => {
        if (index === 5 || index === 15 || index === 25) {
            return { ...item, type: 'comparison', title: 'Versus', desc: `${item.name} vs Competitor` };
        }
        return item;
    });

    const filteredAlerts = activeCategory === 'all'
        ? alerts
        : alerts.filter(a => a.type === activeCategory);

    return (
        <section id="trends" className="py-12 md:py-16 lg:py-20 bg-[#050505] relative overflow-hidden">
            <div className="absolute top-0 right-0 w-[400px] h-[400px] bg-[radial-gradient(circle,rgba(255,31,61,0.06),transparent_60%)] blur-[80px] pointer-events-none" />

            <div className="mx-auto max-w-[1560px] px-5 sm:px-8 lg:px-12 relative z-10">

                {/* Section Header */}
                <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4 mb-5 sm:mb-6">
                    <div className="relative pl-3.5 sm:pl-4 border-l-2 border-red-500">
                        <div className="absolute -left-[2px] top-0 bottom-0 w-[2px] bg-red-500 shadow-[0_0_10px_rgba(255,31,61,0.8)]" />
                        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
                            TechBoy <span className="bg-gradient-to-r from-[#ff3350] via-[#ff1f3d] to-[#ff6b81] bg-clip-text text-transparent drop-shadow-[0_0_24px_rgba(255,31,61,0.35)]">Trends</span>
                        </h2>
                        <p className="text-neutral-400 text-xs sm:text-sm font-normal mt-1 leading-relaxed">
                            Live smartphone intelligence, price drops, and analyst alerts.
                        </p>
                    </div>
                    <button className="flex items-center gap-1.5 text-xs font-semibold text-gray-200 hover:text-white px-3.5 py-1.5 rounded-xl bg-white/[0.04] hover:bg-red-500/15 border border-white/10 hover:border-red-500/40 transition-all whitespace-nowrap self-start sm:self-end shadow-sm hover:shadow-[0_0_15px_rgba(255,31,61,0.2)]">
                        View All Trends <ArrowRight size={13} className="transition-transform group-hover:translate-x-0.5" />
                    </button>
                </div>

                {/* Category Icon Filters */}
                <div className="flex flex-wrap gap-2 sm:gap-2.5 md:gap-3 items-center justify-start overflow-x-auto pb-1 mb-6 sm:mb-8 hide-scrollbar">
                    {CATEGORIES.map(cat => {
                        const isActive = activeCategory === cat.id;
                        const Icon = cat.icon;
                        return (
                            <m.button
                                key={cat.id}
                                onClick={() => { setActiveCategory(cat.id); setDisplayCount(8); }}
                                className={`group relative flex flex-col items-center gap-1.5 px-3 py-2.5 sm:px-4 sm:py-3 min-w-[76px] sm:min-w-[88px] rounded-xl sm:rounded-2xl border transition-all duration-300 select-none shrink-0 ${
                                    isActive
                                        ? 'bg-gradient-to-br from-red-600/30 to-red-600/10 border-red-500/50 shadow-[0_0_24px_rgba(255,31,61,0.25),0_4px_16px_rgba(255,31,61,0.15)]'
                                        : 'bg-white/[0.02] border-white/10 hover:border-red-500/30 hover:bg-white/[0.05] hover:shadow-[0_0_16px_rgba(255,31,61,0.1)]'
                                }`}
                                whileHover={{ y: -2 }}
                                whileTap={{ scale: 0.96 }}
                            >
                                <span className={`flex items-center justify-center w-8 h-8 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl transition-all duration-300 ${
                                    isActive
                                        ? 'bg-white/15 border border-white/20 text-white'
                                        : 'bg-white/[0.05] border border-white/10 text-gray-400 group-hover:border-red-500/40 group-hover:text-white'
                                }`}>
                                    <Icon size={18} strokeWidth={2.4} />
                                </span>
                                <span className={`text-[10px] sm:text-[11px] font-semibold tracking-wide uppercase transition-colors ${
                                    isActive ? 'text-white' : 'text-gray-400 group-hover:text-gray-200'
                                }`}>
                                    {cat.label}
                                </span>
                                {isActive && (
                                    <span className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-red-500 shadow-[0_0_8px_rgba(255,31,61,0.9)]" />
                                )}
                            </m.button>
                        );
                    })}
                </div>

                {/* Compact Trend Cards Grid - Native 2-column mobile experience & fluid responsive breakpoints */}
                <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-2.5 sm:gap-4 md:gap-5 lg:gap-6">
                    <AnimatePresence mode="popLayout">
                        {filteredAlerts.slice(0, displayCount).map((alert, idx) => {
                            const chart = generateChartData(alert);
                            const imageSrc = resolveProductImage(alert.image, alert.name);

                            return (
                                <m.div
                                    key={alert.id}
                                    id={`trend-alert-${alert.id}`}
                                    layout
                                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                                    animate={{ opacity: 1, scale: 1, y: 0 }}
                                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                                    transition={{ duration: 0.25 }}
                                    whileHover={{ y: -6, scale: 1.01 }}
                                    className="group relative bg-[#0a0a0f] border border-red-500/20 hover:border-red-500/50 rounded-2xl overflow-hidden hover:shadow-[0_15px_45px_rgba(230,0,35,0.18)] shadow-[0_0_25px_rgba(255,31,61,0.06)] transition-all duration-300 p-2.5 sm:p-3 flex flex-col h-full max-w-[340px] min-[500px]:max-w-none mx-auto w-full"
                                >
                                    {/* ── Image Stage ── */}
                                    <div className="relative rounded-xl overflow-hidden bg-gradient-to-b from-[#0e0e16] to-[#07070b] flex items-center justify-center h-[185px] sm:h-[195px] md:h-[205px] border border-white/[0.04]">
                                        {/* Ambient radial glows */}
                                        <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
                                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,31,61,0.13),transparent_72%)]" />
                                            <div className="absolute bottom-0 left-0 right-0 h-16 bg-[radial-gradient(ellipse_at_bottom,rgba(255,31,61,0.22),transparent_75%)]" />
                                        </div>

                                        {/* Trend Category Badge — Floating Top Left */}
                                        <span className={`absolute top-2.5 left-2.5 z-20 inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-extrabold uppercase tracking-wider backdrop-blur-md border ${getTrendColor(alert.type)}`}>
                                            {getCategoryIcon(alert.type)}
                                            {getTrendLabel(alert.type)}
                                        </span>

                                        {/* Live Timestamp Pill — Floating Top Right */}
                                        <span className="absolute top-2.5 right-2.5 z-20 flex items-center gap-1 px-2 py-0.5 rounded-full bg-black/60 border border-white/15 text-gray-400 text-[10px] font-medium backdrop-blur-md">
                                            <Clock size={10} className="text-gray-400" />
                                            {alert.time}
                                        </span>

                                        {/* Phone Cutout Image */}
                                        <img
                                            src={imageSrc}
                                            alt={alert.name}
                                            className="relative z-10 max-h-[90%] w-auto max-w-[92%] object-contain p-1.5 transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-1"
                                            style={{ filter: 'drop-shadow(0 14px 22px rgba(0,0,0,0.85))' }}
                                            onError={(e) => { e.target.src = '/images/phones/apple-iphone-17-pro-max.png'; }}
                                        />
                                    </div>

                                    {/* ── Content ── */}
                                    <div className="px-1 pt-2.5 pb-1 flex flex-col flex-1">
                                        <h3 className="text-white font-bold text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-red-400 transition-colors mb-1">
                                            {alert.name}
                                        </h3>
                                        <p className="text-gray-400 text-xs mb-3 line-clamp-1 leading-relaxed">
                                            {alert.desc}
                                        </p>

                                        {/* ── Mini Price & Market Graph Stage ── */}
                                        <div className="mb-3 p-2.5 rounded-xl bg-white/[0.02] border border-white/[0.08] hover:border-white/15 transition-all">
                                            {/* Price Header & Trajectory Pill */}
                                            <div className="flex items-center justify-between gap-1 mb-1">
                                                <div>
                                                    <span className="text-[9px] text-gray-500 uppercase font-bold tracking-wider block">
                                                        {chart.isPriceDrop ? 'Price Drop Record' : chart.isTrending ? 'Demand Surge' : '30-Day Trend'}
                                                    </span>
                                                    <div className="flex items-baseline gap-1.5 flex-wrap">
                                                        <span className={`font-extrabold text-base sm:text-lg leading-tight ${chart.isPriceDrop ? 'text-emerald-400' : 'text-white'}`}>
                                                            ₹{alert.current?.toLocaleString('en-IN')}
                                                        </span>
                                                        {alert.prev && alert.prev > alert.current && (
                                                            <span className="text-gray-500 line-through text-xs font-semibold">
                                                                ₹{alert.prev?.toLocaleString('en-IN')}
                                                            </span>
                                                        )}
                                                    </div>
                                                </div>

                                                {/* Status Pill Badge */}
                                                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-extrabold border shrink-0 ${
                                                    chart.isPriceDrop
                                                        ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-[0_0_10px_rgba(16,185,129,0.2)]'
                                                        : chart.isTrending
                                                        ? 'bg-orange-500/15 text-orange-400 border-orange-500/30 shadow-[0_0_10px_rgba(249,115,22,0.2)]'
                                                        : 'bg-red-500/15 text-red-400 border-red-500/30'
                                                }`}>
                                                    {chart.isPriceDrop ? (
                                                        <>
                                                            <TrendingDown size={11} className="stroke-[2.5]" />
                                                            <span>-{alert.pct}% Drop</span>
                                                        </>
                                                    ) : chart.isTrending ? (
                                                        <>
                                                            <TrendingUp size={11} className="stroke-[2.5]" />
                                                            <span>+Demand</span>
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Activity size={11} className="stroke-[2.5]" />
                                                            <span>Best Value</span>
                                                        </>
                                                    )}
                                                </div>
                                            </div>

                                            {/* High-Tech Area Sparkline Chart */}
                                            <div className="relative h-10 w-full pt-1">
                                                <svg className="w-full h-full overflow-visible" viewBox="0 0 200 40" preserveAspectRatio="none">
                                                    <defs>
                                                        <linearGradient id={`grad-${alert.id}`} x1="0" y1="0" x2="0" y2="1">
                                                            <stop offset="0%" stopColor={chart.color} stopOpacity="0.35" />
                                                            <stop offset="100%" stopColor={chart.color} stopOpacity="0.0" />
                                                        </linearGradient>
                                                    </defs>
                                                    {/* Area Gradient Fill */}
                                                    <path d={chart.areaPath} fill={`url(#grad-${alert.id})`} />
                                                    {/* Glowing Stroke Path */}
                                                    <path d={chart.linePath} fill="none" stroke={chart.color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" />
                                                    {/* Pulsing Live Marker Dot */}
                                                    <circle cx={chart.lastPoint.x} cy={chart.lastPoint.y} r="3" fill={chart.color} />
                                                    <circle cx={chart.lastPoint.x} cy={chart.lastPoint.y} r="6" fill={chart.color} opacity="0.45" className="animate-ping" />
                                                </svg>
                                            </div>

                                            {/* Micro-Ticks Timeline */}
                                            <div className="flex items-center justify-between text-[9px] text-gray-500 font-semibold mt-1 px-0.5">
                                                <span>30d ago</span>
                                                <span className="flex items-center gap-1 text-gray-400">
                                                    <span className="w-1.5 h-1.5 rounded-full inline-block animate-pulse" style={{ backgroundColor: chart.color }} />
                                                    {chart.isPriceDrop ? `Save ₹${alert.savings?.toLocaleString('en-IN')}` : 'Live Tracker'}
                                                </span>
                                                <span>Today</span>
                                            </div>
                                        </div>

                                        {/* ── Modern Action Bar ── */}
                                        <div className="pt-2 mt-auto flex items-center gap-2">
                                            {/* View Details / Deal — Modern Specular Pill */}
                                            <button
                                                onClick={() => setSelectedProduct({ ...alert, price: alert.current, image: imageSrc })}
                                                className="relative group/btn overflow-hidden flex-1 h-[36px] rounded-xl bg-gradient-to-r from-[#ff1f3d] via-[#e60023] to-[#c7001e] hover:from-[#ff3350] hover:to-[#d6001c] text-white text-[11px] font-bold tracking-wide flex items-center justify-center gap-1.5 shadow-[0_4px_16px_rgba(230,0,35,0.35)] hover:shadow-[0_6px_24px_rgba(255,31,61,0.55)] transition-all active:scale-[0.97] border border-white/20"
                                            >
                                                <span className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700 pointer-events-none" />
                                                <span className="relative z-10 font-bold">View Deal</span>
                                                <span className="relative z-10 flex items-center justify-center w-4.5 h-4.5 rounded-full bg-white/15 transition-transform duration-300 group-hover/btn:translate-x-0.5">
                                                    <ArrowRight size={10} className="stroke-[2.5]" />
                                                </span>
                                            </button>

                                            {/* Track Price — Frosted Icon Button */}
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setPriceAlertProduct({ product: { ...alert, price: alert.current, image: imageSrc }, rect: e.currentTarget.getBoundingClientRect() });
                                                }}
                                                className="group/track relative h-[36px] w-[36px] rounded-xl bg-white/[0.04] hover:bg-red-500/15 border border-white/10 hover:border-red-500/40 text-gray-300 hover:text-red-400 flex items-center justify-center transition-all duration-200 shrink-0 hover:shadow-[0_0_14px_rgba(255,31,61,0.25)] active:scale-[0.95]"
                                                title="Track Price"
                                                aria-label="Track Price"
                                            >
                                                <Bell size={14} className="transition-transform duration-200 group-hover/track:scale-110" />
                                            </button>
                                        </div>
                                    </div>
                                </m.div>
                            );
                        })}
                    </AnimatePresence>
                </div>

                {filteredAlerts.length > displayCount && (
                    <div className="mt-10 flex justify-center">
                        <button
                            onClick={() => setDisplayCount(prev => prev + 8)}
                            className="bg-white/[0.03] hover:bg-white/[0.07] text-white border border-white/10 px-6 py-2.5 rounded-full text-xs font-semibold transition-all shadow-sm hover:shadow-[0_0_20px_rgba(255,31,61,0.2)]"
                        >
                            Load More
                        </button>
                    </div>
                )}

            </div>

            <PriceAlertModal
                isOpen={!!priceAlertProduct}
                onClose={() => setPriceAlertProduct(null)}
                product={priceAlertProduct ? priceAlertProduct.product : null}
                triggerRect={priceAlertProduct ? priceAlertProduct.rect : null}
                user={null}
            />

            <AnimatePresence>
                {selectedProduct && (
                    <QuickViewModal product={selectedProduct} onClose={() => setSelectedProduct(null)} />
                )}
            </AnimatePresence>
        </section>
    );
};

export default TechBoyTrends;